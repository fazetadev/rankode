import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { formatDateShort, formatNumber, getInitials, getLanguageLabel } from '../../lib/format';
import { RankBadge } from './RankBadge';
import { XpBar } from './XpBar';
import type { RankedPlayer } from './LeaderboardTable';

interface PlayerPanelProps {
  player: RankedPlayer | null;
  onClose: () => void;
}

export function PlayerPanel({ player, onClose }: PlayerPanelProps) {
  useEffect(() => {
    if (!player) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [player, onClose]);

  return (
    <AnimatePresence>
      {player && (
        <div
          className="fixed inset-0 z-50 flex justify-end"
          role="dialog"
          aria-modal="true"
          aria-label={`Estadísticas de ${player.username}`}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/65"
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.2 }}
            className="relative z-10 flex h-full w-full max-w-sm flex-col border-l border-[#27272A] bg-[#111113] p-6 overflow-y-auto"
          >
            <div className="flex items-start justify-between gap-4 border-b border-[#27272A] pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#27272A] bg-[#18181B] text-sm font-semibold text-[#FAFAFA]">
                  {getInitials(player.username)}
                </div>
                <div>
                  <h2 className="text-base font-semibold text-[#FAFAFA]">{player.username}</h2>
                  <p className="text-xs text-[#A1A1AA]">
                    Posición #{player.rankPosition} · {player.country}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar panel de jugador"
                className="rounded-md p-1.5 text-[#A1A1AA] hover:bg-[#18181B] hover:text-[#FAFAFA]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 space-y-5">
              <div className="rounded-lg border border-[#27272A] bg-[#09090B] p-4">
                <XpBar xp={player.xp} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-[#27272A] bg-[#09090B] p-3.5">
                  <span className="text-xs text-[#A1A1AA]">XP Total</span>
                  <p className="mt-1 font-mono text-lg font-semibold tabular-nums text-[#FAFAFA]">
                    {formatNumber(player.xp)}
                  </p>
                </div>
                <div className="rounded-lg border border-[#27272A] bg-[#09090B] p-3.5">
                  <span className="text-xs text-[#A1A1AA]">Desafíos resueltos</span>
                  <p className="mt-1 font-mono text-lg font-semibold tabular-nums text-[#FAFAFA]">
                    {player.solvedCount}
                  </p>
                </div>
                <div className="rounded-lg border border-[#27272A] bg-[#09090B] p-3.5">
                  <span className="text-xs text-[#A1A1AA]">Tasa de acierto</span>
                  <p className="mt-1 font-mono text-lg font-semibold tabular-nums text-[#FAFAFA]">
                    {player.accuracy}%
                  </p>
                </div>
                <div className="rounded-lg border border-[#27272A] bg-[#09090B] p-3.5">
                  <span className="text-xs text-[#A1A1AA]">Racha actual</span>
                  <p className="mt-1 font-mono text-lg font-semibold tabular-nums text-[#FAFAFA]">
                    {player.streakDays} d
                  </p>
                </div>
              </div>

              <dl className="space-y-3 border-t border-[#27272A] pt-4 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-[#A1A1AA]">Rango</dt>
                  <dd>
                    <RankBadge xp={player.xp} />
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-[#A1A1AA]">Lenguaje principal</dt>
                  <dd className="font-medium text-[#FAFAFA]">
                    {getLanguageLabel(player.favoriteLanguage)}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-[#A1A1AA]">Miembro desde</dt>
                  <dd className="font-mono text-xs tabular-nums text-[#FAFAFA]">
                    {formatDateShort(player.joinedAt)}
                  </dd>
                </div>
              </dl>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
