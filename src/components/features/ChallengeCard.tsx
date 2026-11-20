import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Star, Bookmark } from 'lucide-react';
import { CATEGORY_META, DIFFICULTY_META, SUPPORTED_LANGUAGES } from '../../config';
import { stripMarkdown } from '../../lib/format';
import { useAppStore } from '../../store/useAppStore';
import { useT } from '../../i18n/useT';
import type { Challenge } from '../../types';

interface ChallengeCardProps {
  challenge: Challenge;
  solved: boolean;
  isDaily?: boolean;
  layout?: 'grid' | 'list';
}

export function ChallengeCard({
  challenge,
  solved,
  isDaily = false,
  layout = 'grid',
}: ChallengeCardProps) {
  const t = useT();
  const favorites = useAppStore((s) => s.favorites);
  const reviewLater = useAppStore((s) => s.reviewLater);
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);
  const toggleReviewLater = useAppStore((s) => s.toggleReviewLater);

  const isFavorite = favorites.includes(challenge.id);
  const isReviewLater = reviewLater.includes(challenge.id);

  const diff = DIFFICULTY_META[challenge.difficulty];
  const cat = CATEGORY_META[challenge.category];
  const langsLabel = challenge.languages
    .map((l) => SUPPORTED_LANGUAGES.find((s) => s.id === l)?.short ?? l)
    .join(' / ');

  const actionButtons = (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleFavorite(challenge.id);
        }}
        aria-label={isFavorite ? t('challenge.favoriteRemove') : t('challenge.favoriteAdd')}
        aria-pressed={isFavorite}
        title={isFavorite ? t('challenge.favoriteRemove') : t('challenge.favoriteAdd')}
        className={`rounded p-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6] ${
          isFavorite
            ? 'text-amber-400 hover:bg-[#18181B]'
            : 'text-[#71717A] hover:bg-[#18181B] hover:text-[#FAFAFA]'
        }`}
      >
        <Star aria-hidden="true" className={`h-3.5 w-3.5 ${isFavorite ? 'fill-amber-400' : ''}`} />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleReviewLater(challenge.id);
        }}
        aria-label={isReviewLater ? t('challenge.reviewRemove') : t('challenge.reviewAdd')}
        aria-pressed={isReviewLater}
        title={isReviewLater ? t('challenge.reviewRemove') : t('challenge.reviewAdd')}
        className={`rounded p-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6] ${
          isReviewLater
            ? 'text-[#8B5CF6] hover:bg-[#18181B]'
            : 'text-[#71717A] hover:bg-[#18181B] hover:text-[#FAFAFA]'
        }`}
      >
        <Bookmark
          aria-hidden="true"
          className={`h-3.5 w-3.5 ${isReviewLater ? 'fill-[#8B5CF6]' : ''}`}
        />
      </button>
    </div>
  );

  if (layout === 'list') {
    return (
      <Link
        to={`/challenges/${challenge.id}`}
        className="group flex flex-col gap-3 rounded-lg border border-[#27272A] bg-[#111113] p-4 transition-colors duration-150 hover:border-[#3F3F46] hover:bg-[#141417] sm:flex-row sm:items-center sm:justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]"
      >
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-[#FAFAFA] group-hover:text-white">
              {challenge.title}
            </h3>
            {solved ? (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400">
                <CheckCircle2 aria-hidden="true" className="h-3.5 w-3.5" />
                <span>Resuelto</span>
              </span>
            ) : isDaily ? (
              <span className="font-mono text-xs font-medium text-[#8B5CF6]">Diario x1.5</span>
            ) : null}
          </div>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#A1A1AA]">
            <span>{cat.label}</span>
            <span aria-hidden="true">·</span>
            <span className={diff.colorClass}>{diff.label}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums text-[#FAFAFA]">+{challenge.xp} XP</span>
            {challenge.acceptanceRate !== undefined && (
              <>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums text-[#71717A]">
                  {challenge.acceptanceRate}% acierto
                </span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 sm:justify-end">
          {actionButtons}
          <span className="inline-flex items-center gap-1 text-xs font-medium text-[#A1A1AA] transition-colors group-hover:text-[#8B5CF6]">
            <span>Resolver</span>
            <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/challenges/${challenge.id}`}
      className="group flex flex-col justify-between rounded-lg border border-[#27272A] bg-[#111113] p-4 transition-colors duration-150 hover:border-[#3F3F46] hover:bg-[#141417] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]"
    >
      <div>
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold text-[#FAFAFA] group-hover:text-white">
            {challenge.title}
          </h3>
          <div className="flex items-center gap-1.5 shrink-0">
            {solved ? (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400">
                <CheckCircle2 aria-hidden="true" className="h-3.5 w-3.5" />
                <span>Resuelto</span>
              </span>
            ) : isDaily ? (
              <span className="font-mono text-xs font-medium text-[#8B5CF6]">
                Diario x1.5
              </span>
            ) : null}
            {actionButtons}
          </div>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#A1A1AA]">
          <span>{cat.label}</span>
          <span aria-hidden="true">·</span>
          <span className={diff.colorClass}>{diff.label}</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono tabular-nums text-[#FAFAFA]">+{challenge.xp} XP</span>
          {challenge.acceptanceRate !== undefined && (
            <>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums text-[#71717A]">
                {challenge.acceptanceRate}%
              </span>
            </>
          )}
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
