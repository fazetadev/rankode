import { formatNumber, getLanguageLabel } from '../../lib/format';
import type { Player } from '../../types';
import { RankBadge } from './RankBadge';

export interface RankedPlayer extends Player {
  rankPosition: number;
}

interface LeaderboardTableProps {
  players: RankedPlayer[];
  onSelectPlayer: (player: RankedPlayer) => void;
}

export function LeaderboardTable({ players, onSelectPlayer }: LeaderboardTableProps) {
  if (players.length === 0) {
    return (
      <div className="rounded-lg border border-[#27272A] bg-[#111113] p-8 text-center text-sm text-[#A1A1AA]">
        No se encontraron jugadores con los filtros seleccionados.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-[#27272A] bg-[#111113]">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-[#27272A] bg-[#09090B] text-xs font-medium text-[#A1A1AA]">
              <th className="px-4 py-3 w-16">#</th>
              <th className="px-4 py-3">Jugador</th>
              <th className="px-4 py-3">País</th>
              <th className="px-4 py-3">Rango</th>
              <th className="px-4 py-3">Lenguaje</th>
              <th className="px-4 py-3 text-right">Resueltos</th>
              <th className="px-4 py-3 text-right">Acierto</th>
              <th className="px-4 py-3 text-right">XP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#27272A]">
            {players.map((player) => {
              const isTop3 = player.rankPosition <= 3;
              return (
                <tr
                  key={player.id}
                  onClick={() => onSelectPlayer(player)}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectPlayer(player);
                    }
                  }}
                  className={`cursor-pointer transition-colors hover:bg-[#18181B] focus-visible:outline-none focus-visible:bg-[#18181B] ${
                    player.isCurrentUser ? 'bg-[#8B5CF6]/10 hover:bg-[#8B5CF6]/15' : ''
                  }`}
                >
                  <td className="px-4 py-3 font-mono text-xs tabular-nums">
                    <span
                      className={
                        isTop3
                          ? 'inline-flex h-6 w-6 items-center justify-center rounded border border-[#8B5CF6]/40 bg-[#8B5CF6]/15 font-semibold text-[#C4B5FD]'
                          : 'text-[#A1A1AA]'
                      }
                    >
                      {player.rankPosition}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-[#FAFAFA]">
                    <div className="flex items-center gap-2">
                      <span>{player.username}</span>
                      {player.isCurrentUser && (
                        <span className="font-mono text-[11px] text-[#8B5CF6]">(Tú)</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-[#A1A1AA]">{player.country}</td>
                  <td className="px-4 py-3">
                    <RankBadge xp={player.xp} size="sm" />
                  </td>
                  <td className="px-4 py-3 text-xs text-[#A1A1AA]">
                    {getLanguageLabel(player.favoriteLanguage)}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-xs tabular-nums text-[#FAFAFA]">
                    {player.solvedCount}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-xs tabular-nums text-[#A1A1AA]">
                    {player.accuracy}%
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-xs font-semibold tabular-nums text-[#FAFAFA]">
                    {formatNumber(player.xp)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
