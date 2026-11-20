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

/**
 * Resultado de error uniforme: marca todos los casos como fallidos y muestra el mensaje
 * en el panel de resultados. Sirve para cualquier fallo (sintaxis, timeout, worker caído...).
 */
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

/**
 * Permite pegar código escrito como módulo ES (`export function ...`, `export default ...`,
 * `export { ... }`): quita la palabra `export` para que el código sea ejecutable.
 */
export function prepareUserCode(code: string): string {
  return code
    .replace(/^[ \t]*export\s+default\s+/gm, '')
    .replace(/^[ \t]*export\s+(?=(?:async\s+)?(?:function|class|const|let|var)\b)/gm, '')
    .replace(/^[ \t]*export\s*\{[^}]*\}\s*(?:from\s*['"][^'"]+['"])?\s*;?[ \t]*$/gm, '');
}

/** Nombres de funciones declaradas por el usuario (para sugerir el nombre correcto). */
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

/**
 * Ejecuta JavaScript en memoria contra una lista de casos de prueba.
 * Nunca lanza: cualquier fallo se devuelve como ExecutionResult con el mensaje de error.
 */
export function executeJavaScript(
  code: string,
  entryPoint: string,
  tests: TestCase[],
  markHidden = false
): ExecutionResult {
  const logs: string[] = [];
  const startTotal = performance.now();

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

  // Compatibilidad con `module.exports = ...` / `exports.x = ...` (estilo Node.js).
  const sandboxModule: { exports: Record<string, unknown> } = { exports: {} };

  let targetFn: ((...args: unknown[]) => unknown) | undefined;

  try {
    // El código del usuario va en una función interna para que pueda declarar sus propias
    // variables `module`, `exports` o `console` sin chocar con los parámetros externos.
    const factory = new Function(
      'console',
      'module',
      'exports',
      `return (function () {\n'use strict';\n${prepareUserCode(code)}\n;return typeof ${entryPoint} === 'function' ? ${entryPoint} : undefined;\n})();`
    );
    targetFn = factory(sandboxConsole, sandboxModule, sandboxModule.exports) as
      | ((...args: unknown[]) => unknown)
      | undefined;
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error al compilar o ejecutar el código.';
    const kind = err instanceof SyntaxError ? 'Error de sintaxis' : 'Error al ejecutar el código';
    return buildErrorResult(
      tests,
      kind,
      `${kind}: ${message}`,
      markHidden,
      logs,
      performance.now() - startTotal
    );
  }

  if (typeof targetFn !== 'function') {
    return buildErrorResult(
      tests,
      'Función no definida',
      missingFunctionMessage(code, entryPoint),
      markHidden,
      logs,
      performance.now() - startTotal
    );
  }

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
