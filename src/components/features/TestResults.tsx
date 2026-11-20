import { CheckCircle2, XCircle, Terminal, Clock, AlertTriangle } from 'lucide-react';
import { formatDurationMs } from '../../lib/format';
import type { ExecutionResult } from '../../types';
import { Badge } from '../ui/Badge';

interface TestResultsProps {
  result: ExecutionResult | null;
  isRunning: boolean;
}

export function TestResults({ result, isRunning }: TestResultsProps) {
  if (isRunning) {
    return (
      <div className="rounded-lg border border-[#27272A] bg-[#111113] p-4">
        <div className="flex items-center gap-2.5 text-sm text-[#A1A1AA]">
          <span
            aria-hidden="true"
            className="h-4 w-4 animate-spin rounded-full border-2 border-[#8B5CF6] border-t-transparent"
          />
          <span>Ejecutando casos de prueba...</span>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="rounded-lg border border-[#27272A] bg-[#111113] p-4 text-xs text-[#A1A1AA]">
        Pulsa <strong className="font-medium text-[#FAFAFA]">Ejecutar</strong> (Ctrl/Cmd+Enter) para
        probar los casos visibles o <strong className="font-medium text-[#FAFAFA]">Enviar</strong>{' '}
        (Ctrl/Cmd+Shift+Enter) para validar la suite completa.
      </div>
    );
  }

  return (
    <div
      data-testid="test-results-panel"
      className="space-y-3 rounded-lg border border-[#27272A] bg-[#111113] p-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#27272A] pb-3">
        <div className="flex items-center gap-2.5">
          {result.passed ? (
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-400">
              <CheckCircle2 aria-hidden="true" className="h-4 w-4" />
              <span>Todos los casos pasaron</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-400">
              <XCircle aria-hidden="true" className="h-4 w-4" />
              <span>
                {result.passedCount}/{result.totalCount} casos aprobados
              </span>
            </span>
          )}
          {result.simulated && (
            <Badge variant="warning">Ejecución simulada</Badge>
          )}
        </div>

        <div className="flex items-center gap-1.5 font-mono text-xs tabular-nums text-[#A1A1AA]">
          <Clock aria-hidden="true" className="h-3.5 w-3.5" />
          <span>{formatDurationMs(result.runtimeMs)}</span>
        </div>
      </div>

      {result.error && (
        <div className="flex items-start gap-2 rounded-md border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
          <AlertTriangle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
          <pre className="whitespace-pre-wrap font-mono">{result.error}</pre>
        </div>
      )}

      <div className="space-y-2">
        {result.results.map((tc, index) => (
          <div
            key={tc.id}
            className="rounded-md border border-[#27272A] bg-[#09090B] p-3 text-xs"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {tc.passed ? (
                  <CheckCircle2 aria-hidden="true" className="h-3.5 w-3.5 text-emerald-400" />
                ) : (
                  <XCircle aria-hidden="true" className="h-3.5 w-3.5 text-red-400" />
                )}
                <span className="font-medium text-[#FAFAFA]">
                  Caso #{index + 1} {tc.hidden ? '(Oculto)' : ''}
                </span>
                <span className={tc.passed ? 'text-emerald-400' : 'text-red-400'}>
                  {tc.passed ? 'Pasó' : 'Falló'}
                </span>
              </div>
              <span className="font-mono tabular-nums text-[#71717A]">
                {formatDurationMs(tc.durationMs)}
              </span>
            </div>

            {!tc.hidden ? (
              <div className="mt-2 grid grid-cols-1 gap-2 font-mono text-[11px] sm:grid-cols-3">
                <div>
                  <span className="block text-[#71717A]">Entrada</span>
                  <code className="break-all text-[#FAFAFA]">{tc.inputDisplay}</code>
                </div>
                <div>
                  <span className="block text-[#71717A]">Esperado</span>
                  <code className="break-all text-emerald-400">{tc.expectedDisplay}</code>
                </div>
                <div>
                  <span className="block text-[#71717A]">Obtenido</span>
                  <code className={`break-all ${tc.passed ? 'text-[#FAFAFA]' : 'text-red-400'}`}>
                    {tc.actualDisplay}
                  </code>
                </div>
              </div>
            ) : (
              <p className="mt-1.5 text-[11px] text-[#71717A]">
                Caso de prueba oculto para validación final.
              </p>
            )}

            {tc.error && (
              <p className="mt-2 font-mono text-[11px] text-red-400">{tc.error}</p>
            )}
          </div>
        ))}
      </div>

      {result.logs.length > 0 && (
        <div className="rounded-md border border-[#27272A] bg-[#09090B] p-3">
          <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-medium text-[#A1A1AA]">
            <Terminal aria-hidden="true" className="h-3.5 w-3.5" />
            <span>Salida de consola</span>
          </div>
          <pre className="max-h-32 overflow-y-auto font-mono text-xs text-[#FAFAFA]">
            {result.logs.join('\n')}
          </pre>
        </div>
      )}
    </div>
  );
}
