import { CheckCircle2 } from 'lucide-react';
import { formatNumber } from '../lib/format';
import { RANKS, getRankProgress } from '../lib/xp';
import { useAppStore } from '../store/useAppStore';
import { Card } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { RankBadge } from '../components/features/RankBadge';
import { XpBar } from '../components/features/XpBar';

export default function Ranks() {
  const xp = useAppStore((s) => s.xp);
  const { currentRank } = getRankProgress(xp);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-xl font-semibold tracking-tight text-[#FAFAFA]">Sistema de rangos</h1>
        <p className="mt-1 text-sm text-[#A1A1AA]">
          Escala competitiva de 8 niveles según el XP total acumulado al resolver desafíos.
        </p>
      </header>

      <Card padding="lg">
        <XpBar xp={xp} />
      </Card>

      <div className="space-y-3">
        {RANKS.map((rank, index) => {
          const next = RANKS[index + 1];
          const isCurrent = rank.id === currentRank.id;
          const isUnlocked = xp >= rank.minXp;

          let progressInTier = 0;
          if (xp >= (next?.minXp ?? Infinity)) {
            progressInTier = 100;
          } else if (isCurrent && next) {
            progressInTier = Math.round(((xp - rank.minXp) / (next.minXp - rank.minXp)) * 100);
          } else if (isCurrent && !next) {
            progressInTier = 100;
          }

          return (
            <Card
              key={rank.id}
              padding="md"
              className={
                isCurrent ? 'border-[#8B5CF6]/60 bg-[#141418]' : ''
              }
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <RankBadge rank={rank} size="md" />
                    {isCurrent && (
                      <span className="font-mono text-xs font-medium text-[#8B5CF6]">
                        Rango actual
                      </span>
                    )}
                    {isUnlocked && !isCurrent && (
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-400">
                        <CheckCircle2 aria-hidden="true" className="h-3.5 w-3.5" />
                        Desbloqueado
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#A1A1AA]">{rank.description}</p>
                </div>

                <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:gap-1">
                  <span className="font-mono text-sm font-semibold tabular-nums text-[#FAFAFA]">
                    {formatNumber(rank.minXp)} XP
                  </span>
                  <span className="font-mono text-[11px] tabular-nums text-[#71717A]">
                    {next ? `Hasta ${formatNumber(next.minXp - 1)} XP` : 'Nivel máximo'}
                  </span>
                </div>
              </div>

              {isCurrent && (
                <div className="mt-3 pt-2 border-t border-[#27272A]">
                  <ProgressBar
                    value={progressInTier}
                    max={100}
                    heightClass="h-1.5"
                    color={rank.color}
                    ariaLabel={`Progreso dentro de ${rank.name}`}
                  />
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
