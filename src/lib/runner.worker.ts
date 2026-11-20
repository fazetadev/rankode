import type { ExecutionResult, TestCase } from '../types';
import { buildErrorResult, executeJavaScript } from './jsRunner';

interface WorkerInput {
  code: string;
  entryPoint: string;
  tests: TestCase[];
  markHidden?: boolean;
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

  let result: ExecutionResult;
  try {
    result = executeJavaScript(
      String(input?.code ?? ''),
      String(input?.entryPoint ?? ''),
      tests,
      markHidden
    );
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
