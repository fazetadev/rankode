import { formatNumber } from '../../lib/format';
import { getRankProgress } from '../../lib/xp';
import { ProgressBar } from '../ui/ProgressBar';
import { RankBadge } from './RankBadge';

interface XpBarProps {
  xp: number;
  compact?: boolean;
}

export function XpBar({ xp, compact = false }: XpBarProps) {
  const { currentRank, nextRank, xpRemaining, percentage } = getRankProgress(xp);

  if (compact) {
    return (
      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-2 text-xs">
          <RankBadge rank={currentRank} size="sm" />
          <span className="font-mono tabular-nums text-[#A1A1AA]">{formatNumber(xp)} XP</span>
        </div>
        <ProgressBar
          value={percentage}
          max={100}
          heightClass="h-1.5"
          ariaLabel={`Progreso de rango ${currentRank.name}`}
        />
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <RankBadge rank={currentRank} size="md" />
          <span className="font-mono text-sm font-semibold tabular-nums text-[#FAFAFA]">
            {formatNumber(xp)} XP
          </span>
        </div>
        <div className="text-xs text-[#A1A1AA] tabular-nums">
          {nextRank ? (
            <>
              Faltan <span className="font-mono font-medium text-[#FAFAFA]">{formatNumber(xpRemaining)} XP</span> para{' '}
              <span className="font-medium text-[#FAFAFA]">{nextRank.name}</span>
            </>
          ) : (
            <span className="font-medium text-[#FAFAFA]">Rango máximo alcanzado</span>
          )}
        </div>
      </div>
      <ProgressBar
        value={percentage}
        max={100}
        heightClass="h-2"
        ariaLabel={`Progreso hacia ${nextRank?.name ?? 'rango máximo'}`}
      />
    </div>
  );
}
