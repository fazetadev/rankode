import { getRankForXp } from '../../lib/xp';
import type { RankDefinition } from '../../types';

interface RankBadgeProps {
  xp?: number;
  rank?: RankDefinition;
  size?: 'sm' | 'md';
}

export function RankBadge({ xp = 0, rank, size = 'sm' }: RankBadgeProps) {
  const resolved = rank ?? getRankForXp(xp);
  const padding = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border border-[#27272A] bg-[#18181B] font-medium text-[#FAFAFA] whitespace-nowrap shrink-0 ${padding}`}
    >
      <span
        aria-hidden="true"
        className="h-2 w-2 rounded-full shrink-0"
        style={{ backgroundColor: resolved.color }}
      />
      <span>{resolved.name}</span>
    </span>
  );
}
