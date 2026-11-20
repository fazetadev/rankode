import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { CATEGORY_META, DIFFICULTY_META, SUPPORTED_LANGUAGES } from '../../config';
import { stripMarkdown } from '../../lib/format';
import type { Challenge } from '../../types';

interface ChallengeCardProps {
  challenge: Challenge;
  solved: boolean;
  isDaily?: boolean;
}

export function ChallengeCard({ challenge, solved, isDaily = false }: ChallengeCardProps) {
  const diff = DIFFICULTY_META[challenge.difficulty];
  const cat = CATEGORY_META[challenge.category];
  const langsLabel = challenge.languages
    .map((l) => SUPPORTED_LANGUAGES.find((s) => s.id === l)?.short ?? l)
    .join(' / ');

  return (
    <Link
      to={`/challenges/${challenge.id}`}
      className="group flex flex-col justify-between rounded-lg border border-[#27272A] bg-[#111113] p-4 transition-colors duration-150 hover:border-[#3F3F46] hover:bg-[#141417] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]"
    >
      <div>
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-sm font-semibold text-[#FAFAFA] group-hover:text-white">
            {challenge.title}
          </h3>
          {solved ? (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400 shrink-0">
              <CheckCircle2 aria-hidden="true" className="h-3.5 w-3.5" />
              <span>Resuelto</span>
            </span>
          ) : isDaily ? (
            <span className="font-mono text-xs font-medium text-[#8B5CF6] shrink-0">
              Diario x1.5
            </span>
          ) : null}
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#A1A1AA]">
          <span>{cat.label}</span>
          <span aria-hidden="true">·</span>
          <span className={diff.colorClass}>{diff.label}</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono tabular-nums text-[#FAFAFA]">+{challenge.xp} XP</span>
        </div>

        <p className="mt-2.5 line-clamp-2 text-xs leading-relaxed text-[#A1A1AA]">
          {stripMarkdown(challenge.description)}
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-[#27272A]/80 pt-3 text-xs text-[#71717A]">
        <span className="font-mono">{langsLabel}</span>
        <span className="inline-flex items-center gap-1 font-medium text-[#A1A1AA] transition-colors group-hover:text-[#8B5CF6]">
          <span>Resolver</span>
          <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  );
}
