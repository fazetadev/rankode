import type { ExecutionResult, TestCase } from '../types';
import {
  buildErrorResult,
  executeCustomJavaScriptTest,
  executeJavaScript,
  executePerformanceTest,
  type PerfInputPayload,
} from './jsRunner';

interface WorkerInput {
  mode?: 'tests' | 'perf' | 'custom';
  code: string;
  entryPoint: string;
  tests?: TestCase[];
  markHidden?: boolean;
  perf?: PerfInputPayload;
  custom?: {
    args: unknown[];
    hasExpected: boolean;
    expected: unknown;
    inputDisplay: string;
  };
}

/**
 * Worker de ejecución de JavaScript. Siempre responde con un ExecutionResult:
 * cualquier excepción inesperada se convierte en un resultado de error visible,
 * de modo que la interfaz nunca se quede esperando sin feedback.
 */
self.onmessage = (event: MessageEvent<WorkerInput>) => {
  const input = event.data;
  const tests: TestCase[] = Array.isArray(input?.tests) ? input.tests : [];
  const markHidden = Boolean(input?.markHidden);
  const code = String(input?.code ?? '');
  const entryPoint = String(input?.entryPoint ?? '');

  let result: ExecutionResult;
  try {
    if (input?.mode === 'custom' && input.custom) {
      result = executeCustomJavaScriptTest(
        code,
        entryPoint,
        input.custom.args,
        input.custom.hasExpected,
        input.custom.expected,
        input.custom.inputDisplay
      );
    } else if (input?.mode === 'perf' && input.perf) {
      const perfOutcome = executePerformanceTest(code, entryPoint, input.perf);
      result = {
        passed: perfOutcome.passed,
        totalCount: 1,
        passedCount: perfOutcome.passed ? 1 : 0,
        results: [
          {
            id: 'perf-check',
            passed: perfOutcome.passed,
            inputDisplay: `Escala ${input.perf.sizeLabel}`,
            expectedDisplay: `<= ${input.perf.maxMs} ms`,
            actualDisplay: `${perfOutcome.durationMs} ms`,
            durationMs: perfOutcome.durationMs,
            error: perfOutcome.error,
            hidden: true,
          },
        ],
        logs: [],
        runtimeMs: perfOutcome.durationMs,
        error: perfOutcome.error,
        simulated: false,
        perfPassed: perfOutcome.passed,
        perfDurationMs: perfOutcome.durationMs,
      };
    } else {
      result = executeJavaScript(code, entryPoint, tests, markHidden);
      if (result.passed && input?.perf) {
        const perfOutcome = executePerformanceTest(code, entryPoint, input.perf);
        result.perfPassed = perfOutcome.passed;
        result.perfDurationMs = perfOutcome.durationMs;
        if (!perfOutcome.passed) {
          result.passed = false;
          result.error = perfOutcome.error;
        }
      }
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    result = buildErrorResult(
      tests,
      'Error interno',
      `Error interno del ejecutor: ${message}`,
      markHidden
    );
  }

  try {
    self.postMessage(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    self.postMessage(
      buildErrorResult(
        tests,
        'Error interno',
        `No se pudo enviar el resultado desde el ejecutor: ${message}`,
        markHidden
      )
    );
  }
};
