import type { ExecutionResult, TestCase, TestCaseResult } from '../types';
import { safeSerialize } from './format';

/**
 * Ejecutor de JavaScript compartido por el Web Worker y por el modo directo (tests / fallback).
 * Es código puro: no depende del DOM, así que funciona igual dentro de un Worker.
 */

export function deepEqual(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return true;
  if (typeof a === 'number' && typeof b === 'number') {
    if (a === 0 && b === 0) return true;
    return Number.isNaN(a) && Number.isNaN(b);
  }
  if (a === null || b === null || typeof a !== 'object' || typeof b !== 'object') {
    return false;
  }
  if (Array.isArray(a) !== Array.isArray(b)) return false;

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i += 1) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }

  const objA = a as Record<string, unknown>;
  const objB = b as Record<string, unknown>;
  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);
  if (keysA.length !== keysB.length) return false;
  for (const key of keysA) {
    if (!Object.prototype.hasOwnProperty.call(objB, key)) return false;
    if (!deepEqual(objA[key], objB[key])) return false;
  }
  return true;
}

function cloneValue(value: unknown): unknown {
  if (value === null || typeof value !== 'object') return value;
  if (Array.isArray(value)) return value.map((item) => cloneValue(item));
  const out: Record<string, unknown> = {};
  for (const key of Object.keys(value)) {
    out[key] = cloneValue((value as Record<string, unknown>)[key]);
  }
  return out;
}

function cloneArgs(args: unknown[]): unknown[] {
  return args.map((item) => cloneValue(item));
}

export function buildErrorResult(
  tests: TestCase[],
  actualDisplay: string,
  message: string,
  markHidden = false,
  logs: string[] = [],
  durationMs = 0
): ExecutionResult {
  return {
    passed: false,
    totalCount: tests.length,
    passedCount: 0,
    results: tests.map((t) => ({
      id: t.id,
      passed: false,
      inputDisplay: t.inputDisplay,
      expectedDisplay: t.expectedDisplay,
      actualDisplay,
      durationMs,
      error: message,
      hidden: markHidden,
    })),
    logs,
    runtimeMs: Math.round(durationMs),
    error: message,
    simulated: false,
  };
}

export function prepareUserCode(code: string): string {
  return code
    .replace(/^[ \t]*export\s+default\s+/gm, '')
    .replace(/^[ \t]*export\s+(?=(?:async\s+)?(?:function|class|const|let|var)\b)/gm, '')
    .replace(/^[ \t]*export\s*\{[^}]*\}\s*(?:from\s*['"][^'"]+['"])?\s*;?[ \t]*$/gm, '');
}

function listDeclaredFunctions(code: string): string[] {
  const names = new Set<string>();
  for (const match of code.matchAll(/\bfunction\s+([A-Za-z_$][\w$]*)/g)) {
    names.add(match[1]);
  }
  for (const match of code.matchAll(
    /\b(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s*)?(?:function\b|\([^)]*\)\s*=>|[A-Za-z_$][\w$]*\s*=>)/g
  )) {
    names.add(match[1]);
  }
  return Array.from(names);
}

function missingFunctionMessage(code: string, entryPoint: string): string {
  const declared = listDeclaredFunctions(code);
  if (declared.length > 0) {
    return (
      `No se encontró la función "${entryPoint}". Tu código define: ${declared.join(', ')}. ` +
      `Renombra tu función a "${entryPoint}" para que los casos de prueba puedan llamarla.`
    );
  }
  return (
    `No se encontró la función "${entryPoint}". Define una función con ese nombre ` +
    `(por ejemplo: function ${entryPoint}(...) { ... }) y mantén su firma original.`
  );
}

function compileUserFunction(
  code: string,
  entryPoint: string,
  logs: string[]
): { fn?: (...args: unknown[]) => unknown; errorKind?: string; errorMessage?: string } {
  const captureLog = (prefix: string, args: unknown[]) => {
    if (logs.length >= 100) return;
    const text = args
      .map((item) => (typeof item === 'string' ? item : safeSerialize(item)))
      .join(' ');
    logs.push(prefix ? `${prefix} ${text}` : text);
  };

  const sandboxConsole = {
    log: (...args: unknown[]) => captureLog('', args),
    info: (...args: unknown[]) => captureLog('[info]', args),
    warn: (...args: unknown[]) => captureLog('[warn]', args),
    error: (...args: unknown[]) => captureLog('[error]', args),
  };

  const sandboxModule: { exports: Record<string, unknown> } = { exports: {} };

  try {
    const factory = new Function(
      'console',
      'module',
      'exports',
      `return (function () {\n'use strict';\n${prepareUserCode(code)}\n;return typeof ${entryPoint} === 'function' ? ${entryPoint} : undefined;\n})();`
    );
    const fn = factory(sandboxConsole, sandboxModule, sandboxModule.exports) as
      | ((...args: unknown[]) => unknown)
      | undefined;

    if (typeof fn !== 'function') {
      return {
        errorKind: 'Función no definida',
        errorMessage: missingFunctionMessage(code, entryPoint),
      };
    }

    return { fn };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error al compilar o ejecutar el código.';
    const kind = err instanceof SyntaxError ? 'Error de sintaxis' : 'Error al ejecutar el código';
    return {
      errorKind: kind,
      errorMessage: `${kind}: ${message}`,
    };
  }
}

/**
 * Ejecuta JavaScript en memoria contra una lista de casos de prueba.
 */
export function executeJavaScript(
  code: string,
  entryPoint: string,
  tests: TestCase[],
  markHidden = false
): ExecutionResult {
  const logs: string[] = [];
  const startTotal = performance.now();

  const compiled = compileUserFunction(code, entryPoint, logs);
  if (!compiled.fn) {
    return buildErrorResult(
      tests,
      compiled.errorKind ?? 'Error',
      compiled.errorMessage ?? 'No se pudo compilar el código.',
      markHidden,
      logs,
      performance.now() - startTotal
    );
  }

  const targetFn = compiled.fn;
  const results: TestCaseResult[] = [];
  let passedCount = 0;

  for (const testCase of tests) {
    const caseStart = performance.now();
    try {
      const args = cloneArgs(testCase.input);
      const actual = targetFn(...args);
      const durationMs = Math.max(0.1, Number((performance.now() - caseStart).toFixed(2)));
      const passed = deepEqual(actual, testCase.expected);
      if (passed) passedCount += 1;

      results.push({
        id: testCase.id,
        passed,
        inputDisplay: testCase.inputDisplay,
        expectedDisplay: testCase.expectedDisplay,
        actualDisplay: safeSerialize(actual),
        durationMs,
        hidden: markHidden,
      });
    } catch (err) {
      const durationMs = Math.max(0.1, Number((performance.now() - caseStart).toFixed(2)));
      const message = err instanceof Error ? err.message : 'Error en tiempo de ejecución';
      results.push({
        id: testCase.id,
        passed: false,
        inputDisplay: testCase.inputDisplay,
        expectedDisplay: testCase.expectedDisplay,
        actualDisplay: 'Excepción',
        durationMs,
        error: message,
        hidden: markHidden,
      });
    }
  }

  return {
    passed: passedCount === tests.length && tests.length > 0,
    totalCount: tests.length,
    passedCount,
    results,
    logs,
    runtimeMs: Math.max(1, Math.round(performance.now() - startTotal)),
    simulated: false,
  };
}

export interface PerfInputPayload {
  sizeLabel: string;
  args: unknown[];
  referenceCode: string;
  maxMs: number;
}

export interface PerfExecutionOutcome {
  passed: boolean;
  durationMs: number;
  error?: string;
}

/**
 * Ejecuta una prueba de rendimiento real comparando la función del usuario frente a la de referencia
 * con una entrada grande. Nunca lanza excepciones.
 */
export function executePerformanceTest(
  userCode: string,
  entryPoint: string,
  perf: PerfInputPayload
): PerfExecutionOutcome {
  try {
    const userLogs: string[] = [];
    const refLogs: string[] = [];
    const userCompiled = compileUserFunction(userCode, entryPoint, userLogs);
    if (!userCompiled.fn) {
      return {
        passed: false,
        durationMs: 0,
        error: userCompiled.errorMessage ?? 'No se encontró la función de usuario.',
      };
    }

    const refCompiled = compileUserFunction(perf.referenceCode, entryPoint, refLogs);
    if (!refCompiled.fn) {
      return {
        passed: false,
        durationMs: 0,
        error: 'Error interno al compilar la referencia de rendimiento.',
      };
    }

    const expected = refCompiled.fn(...cloneArgs(perf.args));
    const start = performance.now();
    const actual = userCompiled.fn(...cloneArgs(perf.args));
    const durationMs = Math.max(1, Math.round(performance.now() - start));

    if (!deepEqual(actual, expected)) {
      return {
        passed: false,
        durationMs,
        error: `Falló en prueba de escala (${perf.sizeLabel}): el resultado no coincide con el esperado.`,
      };
    }

    if (durationMs > perf.maxMs) {
      return {
        passed: false,
        durationMs,
        error: `Rendimiento insuficiente (${perf.sizeLabel}): ${durationMs} ms (máx. ${perf.maxMs} ms). Prueba un enfoque más eficiente.`,
      };
    }

    return {
      passed: true,
      durationMs,
    };
  } catch (err) {
    return {
      passed: false,
      durationMs: 0,
      error: `Error en prueba de rendimiento: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}

/**
 * Ejecuta una prueba personalizada del usuario en JavaScript (con o sin esperado).
 */
export function executeCustomJavaScriptTest(
  code: string,
  entryPoint: string,
  args: unknown[],
  hasExpected: boolean,
  expected: unknown,
  inputDisplay: string
): ExecutionResult {
  const logs: string[] = [];
  const startTotal = performance.now();

  const compiled = compileUserFunction(code, entryPoint, logs);
  if (!compiled.fn) {
    return buildErrorResult(
      [
        {
          id: 'custom-1',
          input: args,
          expected,
          inputDisplay,
          expectedDisplay: hasExpected ? safeSerialize(expected) : '(libre)',
        },
      ],
      compiled.errorKind ?? 'Error',
      compiled.errorMessage ?? 'No se pudo compilar el código.',
      false,
      logs,
      performance.now() - startTotal
    );
  }

  const caseStart = performance.now();
  try {
    const actual = compiled.fn(...cloneArgs(args));
    const durationMs = Math.max(0.1, Number((performance.now() - caseStart).toFixed(2)));
    const passed = hasExpected ? deepEqual(actual, expected) : true;

    return {
      passed,
      totalCount: 1,
      passedCount: passed ? 1 : 0,
      results: [
        {
          id: 'custom-1',
          passed,
          inputDisplay,
          expectedDisplay: hasExpected ? safeSerialize(expected) : '(libre)',
          actualDisplay: safeSerialize(actual),
          durationMs,
          hidden: false,
        },
      ],
      logs,
      runtimeMs: Math.max(1, Math.round(performance.now() - startTotal)),
      simulated: false,
    };
  } catch (err) {
    const durationMs = Math.max(0.1, Number((performance.now() - caseStart).toFixed(2)));
    const message = err instanceof Error ? err.message : 'Error en tiempo de ejecución';
    return {
      passed: false,
      totalCount: 1,
      passedCount: 0,
      results: [
        {
          id: 'custom-1',
          passed: false,
          inputDisplay,
          expectedDisplay: hasExpected ? safeSerialize(expected) : '(libre)',
          actualDisplay: 'Excepción',
          durationMs,
          error: message,
          hidden: false,
        },
      ],
      logs,
      runtimeMs: Math.max(1, Math.round(performance.now() - startTotal)),
      error: message,
      simulated: false,
    };
  }
}
