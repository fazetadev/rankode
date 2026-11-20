import { WORKER_TIMEOUT_MS } from '../config';
import type { Challenge, ExecutionResult, Language, Runner, TestCase, TestCaseResult } from '../types';
import {
  buildErrorResult,
  executeCustomJavaScriptTest,
  executeJavaScript,
  executePerformanceTest,
  type PerfInputPayload,
} from './jsRunner';

export { deepEqual, executePerformanceTest } from './jsRunner';
export const executeJavaScriptDirect = executeJavaScript;

const SIMULATOR_NOTE =
  'El juez simulado no ejecuta Python, Java ni C++ de verdad: compara la estructura de tu código ' +
  'con la solución esperada. Si estás seguro de que tu solución es correcta, pruébala en JavaScript, ' +
  'que sí se ejecuta realmente.';

function isExecutionResult(value: unknown): value is ExecutionResult {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Partial<ExecutionResult>;
  return typeof candidate.passed === 'boolean' && Array.isArray(candidate.results);
}

function runWorkerPayload(
  payload: Record<string, unknown>,
  fallbackTests: TestCase[],
  markHidden = false
): Promise<ExecutionResult> {
  return new Promise<ExecutionResult>((resolve) => {
    let worker: Worker;
    try {
      worker = new Worker(new URL('./runner.worker.ts', import.meta.url), {
        type: 'module',
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      resolve(
        buildErrorResult(
          fallbackTests,
          'Error',
          `No se pudo iniciar el ejecutor de código (Web Worker): ${message}`,
          markHidden
        )
      );
      return;
    }

    let settled = false;
    let timeoutId: number | undefined;

    const finish = (result: ExecutionResult) => {
      if (settled) return;
      settled = true;
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
      worker.terminate();
      resolve(result);
    };

    timeoutId = window.setTimeout(() => {
      const timeoutMsg = `Tiempo límite excedido (${WORKER_TIMEOUT_MS / 1000}s). Revisa posibles bucles infinitos o complejidad demasiado alta.`;
      finish(buildErrorResult(fallbackTests, 'Timeout', timeoutMsg, markHidden, [], WORKER_TIMEOUT_MS));
    }, WORKER_TIMEOUT_MS);

    worker.onmessage = (event: MessageEvent<unknown>) => {
      if (isExecutionResult(event.data)) {
        finish(event.data);
      } else {
        finish(
          buildErrorResult(
            fallbackTests,
            'Error',
            'El ejecutor de código devolvió una respuesta no válida.',
            markHidden
          )
        );
      }
    };

    worker.onmessageerror = () => {
      finish(
        buildErrorResult(
          fallbackTests,
          'Error',
          'No se pudo leer el resultado enviado por el ejecutor de código.',
          markHidden
        )
      );
    };

    worker.onerror = (event: ErrorEvent) => {
      event.preventDefault();
      finish(
        buildErrorResult(
          fallbackTests,
          'Error',
          event.message ||
            'No se pudo cargar el ejecutor de código (Web Worker). Recarga la página con Ctrl+Shift+R o reinicia "npm run dev".',
          markHidden
        )
      );
    };

    try {
      worker.postMessage(payload);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      finish(
        buildErrorResult(
          fallbackTests,
          'Error',
          `No se pudo enviar el código al ejecutor: ${message}`,
          markHidden
        )
      );
    }
  });
}

function runJavaScriptInWorker(
  code: string,
  entryPoint: string,
  tests: TestCase[],
  markHidden = false,
  perf?: PerfInputPayload
): Promise<ExecutionResult> {
  if (typeof Worker === 'undefined') {
    const res = executeJavaScript(code, entryPoint, tests, markHidden);
    if (res.passed && perf) {
      const perfOutcome = executePerformanceTest(code, entryPoint, perf);
      res.perfPassed = perfOutcome.passed;
      res.perfDurationMs = perfOutcome.durationMs;
      if (!perfOutcome.passed) {
        res.passed = false;
        res.error = perfOutcome.error;
      }
    }
    return Promise.resolve(res);
  }

  return runWorkerPayload({ mode: 'tests', code, entryPoint, tests, markHidden, perf }, tests, markHidden);
}

export function runCustomJavaScriptInWorker(
  code: string,
  entryPoint: string,
  args: unknown[],
  hasExpected: boolean,
  expected: unknown,
  inputDisplay: string
): Promise<ExecutionResult> {
  const customTestCase: TestCase[] = [
    {
      id: 'custom-1',
      input: args,
      expected,
      inputDisplay,
      expectedDisplay: hasExpected ? JSON.stringify(expected) : '(libre)',
    },
  ];

  if (typeof Worker === 'undefined') {
    return Promise.resolve(
      executeCustomJavaScriptTest(code, entryPoint, args, hasExpected, expected, inputDisplay)
    );
  }

  return runWorkerPayload(
    {
      mode: 'custom',
      code,
      entryPoint,
      tests: customTestCase,
      custom: { args, hasExpected, expected, inputDisplay },
    },
    customTestCase,
    false
  );
}

function normalizeWhitespace(input: string, language: Language): string {
  const withoutComments =
    language === 'python'
      ? input.replace(/#.*$/gm, '')
      : input.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
  return withoutComments.replace(/\s+/g, ' ').trim();
}

function compact(input: string): string {
  return input.replace(/\s+/g, '');
}

export function checkBasicSyntax(code: string, language: Language): string | null {
  const stack: { char: string; line: number }[] = [];
  const pairs: Record<string, string> = { '(': ')', '[': ']', '{': '}' };
  const closing = new Set([')', ']', '}']);

  let inSingle = false;
  let inDouble = false;
  let inLineComment = false;
  let inBlockComment = false;
  let line = 1;

  for (let i = 0; i < code.length; i += 1) {
    const ch = code[i];
    const next = code[i + 1];
    const prev = code[i - 1];

    if (ch === '\n') {
      line += 1;
      inLineComment = false;
      continue;
    }

    if (inLineComment) continue;

    if (inBlockComment) {
      if (ch === '*' && next === '/') {
        inBlockComment = false;
        i += 1;
      }
      continue;
    }

    if (!inSingle && !inDouble) {
      if (language === 'python' && ch === '#') {
        inLineComment = true;
        continue;
      }
      if ((language === 'java' || language === 'cpp' || language === 'javascript') && ch === '/' && next === '/') {
        inLineComment = true;
        i += 1;
        continue;
      }
      if ((language === 'java' || language === 'cpp' || language === 'javascript') && ch === '/' && next === '*') {
        inBlockComment = true;
        i += 1;
        continue;
      }
    }

    if (ch === "'" && !inDouble && prev !== '\\') {
      inSingle = !inSingle;
      continue;
    }

    if (ch === '"' && !inSingle && prev !== '\\') {
      inDouble = !inDouble;
      continue;
    }

    if (inSingle || inDouble) continue;

    if (pairs[ch]) {
      stack.push({ char: pairs[ch], line });
    } else if (closing.has(ch)) {
      const expected = stack.pop();
      if (!expected || expected.char !== ch) {
        return `Error de sintaxis en la línea ${line}: símbolo "${ch}" inesperado o sin apertura.`;
      }
    }
  }

  if (inSingle || inDouble) {
    return 'Error de sintaxis: cadena de texto sin cerrar.';
  }
  if (inBlockComment) {
    return 'Error de sintaxis: comentario de bloque sin cerrar.';
  }
  if (stack.length > 0) {
    const unclosed = stack[stack.length - 1];
    return `Error de sintaxis en la línea ${unclosed.line}: falta "${unclosed.char}" de cierre.`;
  }

  if (language === 'python') {
    if (!/\bdef\s+[a-zA-Z_]\w*\s*\(/.test(code)) {
      return 'Error de sintaxis en Python: no se encontró ninguna definición de función "def".';
    }
  } else if (language === 'java') {
    if (!/\bclass\s+\w+/.test(code)) {
      return 'Error de compilación en Java: falta la declaración de clase.';
    }
  }

  return null;
}

function extractIdentifiers(code: string): Set<string> {
  const tokens = code.match(/[a-zA-Z_]\w*/g) ?? [];
  return new Set(tokens);
}

export function evaluateSimulatedCode(
  code: string,
  language: Language,
  tests: TestCase[],
  challenge: Challenge,
  markHidden = false
): ExecutionResult {
  const trimmed = code.trim();
  const starter = challenge.starterCode[language];
  const reference = challenge.referenceSolution[language];

  if (!trimmed) {
    const msg = 'El editor está vacío. Escribe una solución antes de ejecutar.';
    return {
      passed: false,
      totalCount: tests.length,
      passedCount: 0,
      results: tests.map((t) => ({
        id: t.id,
        passed: false,
        inputDisplay: t.inputDisplay,
        expectedDisplay: t.expectedDisplay,
        actualDisplay: 'Sin código',
        durationMs: 0,
        error: msg,
        hidden: markHidden,
      })),
      logs: [],
      runtimeMs: 4,
      error: msg,
      simulated: true,
    };
  }

  const syntaxError = checkBasicSyntax(code, language);
  if (syntaxError) {
    return {
      passed: false,
      totalCount: tests.length,
      passedCount: 0,
      results: tests.map((t) => ({
        id: t.id,
        passed: false,
        inputDisplay: t.inputDisplay,
        expectedDisplay: t.expectedDisplay,
        actualDisplay: 'Error de sintaxis',
        durationMs: 0,
        error: syntaxError,
        hidden: markHidden,
      })),
      logs: [],
      runtimeMs: 6,
      error: syntaxError,
      simulated: true,
    };
  }

  const normalizedUser = normalizeWhitespace(code, language);
  const normalizedStarter = normalizeWhitespace(starter, language);
  const normalizedRef = normalizeWhitespace(reference, language);

  if (normalizedUser === normalizedStarter) {
    const msg =
      challenge.category === 'debugging'
        ? 'El código aún contiene el bug inicial sin corregir.'
        : 'El código inicial no implementa la solución solicitada.';
    return {
      passed: false,
      totalCount: tests.length,
      passedCount: 0,
      results: tests.map((t) => ({
        id: t.id,
        passed: false,
        inputDisplay: t.inputDisplay,
        expectedDisplay: t.expectedDisplay,
        actualDisplay: challenge.category === 'debugging' ? 'Salida incorrecta (bug activo)' : 'None / null',
        durationMs: 8,
        error: msg,
        hidden: markHidden,
      })),
      logs: ['[simulador] Código sin modificar respecto a la plantilla inicial.'],
      runtimeMs: 12,
      error: msg,
      simulated: true,
    };
  }

  if (!code.includes(challenge.entryPoint)) {
    const msg = `No se encontró el método/función "${challenge.entryPoint}".`;
    return {
      passed: false,
      totalCount: tests.length,
      passedCount: 0,
      results: tests.map((t) => ({
        id: t.id,
        passed: false,
        inputDisplay: t.inputDisplay,
        expectedDisplay: t.expectedDisplay,
        actualDisplay: 'Símbolo no encontrado',
        durationMs: 5,
        error: msg,
        hidden: markHidden,
      })),
      logs: [],
      runtimeMs: 8,
      error: msg,
      simulated: true,
    };
  }

  const forbidden = challenge.validationHints?.forbiddenSubstrings?.[language] ?? [];
  for (const bad of forbidden) {
    if (normalizedUser.includes(bad)) {
      const msg = `La solución aún incluye un patrón incompatible con los requisitos (${bad}).`;
      return {
        passed: false,
        totalCount: tests.length,
        passedCount: 0,
        results: tests.map((t, index) => ({
          id: t.id,
          passed: index === 0 && challenge.category === 'debugging',
          inputDisplay: t.inputDisplay,
          expectedDisplay: t.expectedDisplay,
          actualDisplay: index === 0 && challenge.category === 'debugging' ? t.expectedDisplay : 'Resultado incorrecto',
          durationMs: 11 + index * 3,
          error: index === 0 && challenge.category === 'debugging' ? undefined : msg,
          hidden: markHidden,
        })),
        logs: [`[simulador] Detectado patrón problemático: ${bad}`],
        runtimeMs: 18,
        error: msg,
        simulated: true,
      };
    }
  }

  const hasReturn = /\breturn\b/.test(code);
  if (!hasReturn) {
    const msg = 'La función no devuelve ningún resultado (falta "return").';
    return {
      passed: false,
      totalCount: tests.length,
      passedCount: 0,
      results: tests.map((t) => ({
        id: t.id,
        passed: false,
        inputDisplay: t.inputDisplay,
        expectedDisplay: t.expectedDisplay,
        actualDisplay: 'void / None',
        durationMs: 7,
        error: msg,
        hidden: markHidden,
      })),
      logs: [],
      runtimeMs: 10,
      error: msg,
      simulated: true,
    };
  }

  const requiredTokens = challenge.validationHints?.requiredTokens?.[language] ?? [];
  const missingTokens = requiredTokens.filter((tok) => !normalizedUser.includes(tok));

  const refTokens = extractIdentifiers(normalizedRef);
  const userTokens = extractIdentifiers(normalizedUser);
  let overlap = 0;
  refTokens.forEach((tok) => {
    if (userTokens.has(tok)) overlap += 1;
  });
  const similarity = refTokens.size > 0 ? overlap / refTokens.size : 0;

  const hasControlOrLogic =
    /\b(for|while|if|switch|map|filter|reduce|sort|Set|Map|dict|set|unordered_map|HashMap|vector|Arrays|Math|len|size|length|split|join|append|push)\b/.test(
      code
    ) || normalizedUser === normalizedRef;

  const acceptedIdioms = challenge.validationHints?.acceptedIdioms?.[language] ?? [];
  const compactUser = compact(normalizedUser);
  const idiomMatch = acceptedIdioms.some((idiom) => compactUser.includes(compact(idiom)));

  const isExactOrStrongMatch =
    normalizedUser === normalizedRef ||
    (missingTokens.length === 0 && (idiomMatch || (hasControlOrLogic && similarity >= 0.42)));

  if (!isExactOrStrongMatch) {
    const passPartial = hasControlOrLogic && similarity >= 0.25 ? 1 : 0;
    const detail =
      missingTokens.length > 0
        ? `Parece faltar un elemento clave en tu solución ("${missingTokens[0]}"). `
        : '';
    return {
      passed: false,
      passedCount: passPartial,
      totalCount: tests.length,
      results: tests.map((t, index) => {
        const ok = index < passPartial;
        return {
          id: t.id,
          passed: ok,
          inputDisplay: t.inputDisplay,
          expectedDisplay: t.expectedDisplay,
          actualDisplay: ok ? t.expectedDisplay : 'Sin confirmar',
          durationMs: 9 + index * 4,
          error: ok
            ? undefined
            : missingTokens.length > 0
              ? `Lógica incompleta: revisa el manejo de casos límite (${missingTokens[0]}).`
              : 'El juez simulado no pudo confirmar este caso.',
          hidden: markHidden,
        };
      }),
      logs: ['[simulador] Validación estructural ejecutada: no se pudo confirmar la solución.'],
      runtimeMs: 16,
      error: `${detail}${SIMULATOR_NOTE}`,
      simulated: true,
    };
  }

  const results: TestCaseResult[] = tests.map((t, index) => ({
    id: t.id,
    passed: true,
    inputDisplay: t.inputDisplay,
    expectedDisplay: t.expectedDisplay,
    actualDisplay: t.expectedDisplay,
    durationMs: 6 + ((index * 5) % 14),
    hidden: markHidden,
  }));

  return {
    passed: true,
    totalCount: tests.length,
    passedCount: tests.length,
    results,
    logs: ['[simulador] Validación estructural y de casos completada correctamente.'],
    runtimeMs: results.reduce((acc, item) => acc + item.durationMs, 0),
    simulated: true,
  };
}

export const judgeRunner: Runner = {
  async run(code, language, tests, challenge, markHidden = false): Promise<ExecutionResult> {
    try {
      if (language === 'javascript') {
        const perfPayload: PerfInputPayload | undefined =
          markHidden && challenge.perf
            ? {
                sizeLabel: challenge.perf.sizeLabel,
                args: challenge.perf.build(),
                referenceCode: challenge.referenceSolution.javascript,
                maxMs: challenge.perf.maxMs,
              }
            : undefined;
        return await runJavaScriptInWorker(code, challenge.entryPoint, tests, markHidden, perfPayload);
      }
      await new Promise((resolve) => setTimeout(resolve, 120));
      return evaluateSimulatedCode(code, language, tests, challenge, markHidden);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return {
        ...buildErrorResult(
          tests,
          'Error interno',
          `Error interno del validador: ${message}`,
          markHidden
        ),
        simulated: language !== 'javascript',
      };
    }
  },
};
