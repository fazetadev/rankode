import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../config';
import { SEEDED_PLAYERS } from '../data/players';
import { formatNumber } from '../lib/format';
import { useAppStore } from '../store/useAppStore';
import type { Language } from '../types';
import { Card } from '../components/ui/Card';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { RankBadge } from '../components/features/RankBadge';
import { LeaderboardTable, type RankedPlayer } from '../components/features/LeaderboardTable';
import { PlayerPanel } from '../components/features/PlayerPanel';

const PAGE_SIZE = 15;

export default function Ranking() {
  const profile = useAppStore((s) => s.profile);
  const xp = useAppStore((s) => s.xp);
  const streakDays = useAppStore((s) => s.streakDays);
  const selectedLanguage = useAppStore((s) => s.selectedLanguage);
  const solvedChallengeIds = useAppStore((s) => s.solvedChallengeIds);
  const submissions = useAppStore((s) => s.submissions);

  const [languageFilter, setLanguageFilter] = useState<Language | 'all'>('all');
  const [countryFilter, setCountryFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [selectedPlayer, setSelectedPlayer] = useState<RankedPlayer | null>(null);

  const userAccuracy = useMemo(() => {
    if (submissions.length === 0) return 0;
    return Math.round((submissions.filter((s) => s.passed).length / submissions.length) * 100);
  }, [submissions]);

  const allSortedPlayers = useMemo<RankedPlayer[]>(() => {
    const currentUser = {
      id: 'current-user',
      username: profile.username,
      country: profile.country,
      xp,
      solvedCount: solvedChallengeIds.length,
      accuracy: userAccuracy,
      favoriteLanguage: selectedLanguage,
      streakDays,
      joinedAt: profile.joinedAt,
      isCurrentUser: true,
    };

    return [...SEEDED_PLAYERS, currentUser]
      .sort((a, b) => b.xp - a.xp)
      .map((player, idx) => ({
        ...player,
        rankPosition: idx + 1,
      }));
  }, [profile, xp, solvedChallengeIds.length, userAccuracy, selectedLanguage, streakDays]);

  const currentUserRanked = useMemo(
    () => allSortedPlayers.find((p) => p.isCurrentUser)!,
    [allSortedPlayers]
  );

  const countries = useMemo(() => {
    const set = new Set(allSortedPlayers.map((p) => p.country));
    return Array.from(set).sort();
  }, [allSortedPlayers]);

  const filteredPlayers = useMemo(() => {
    return allSortedPlayers.filter((p) => {
      if (languageFilter !== 'all' && p.favoriteLanguage !== languageFilter) return false;
      if (countryFilter !== 'all' && p.country !== countryFilter) return false;
      return true;
    });
  }, [allSortedPlayers, languageFilter, countryFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredPlayers.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pagePlayers = filteredPlayers.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-[#FAFAFA]">Ranking global</h1>
          <p className="mt-1 text-sm text-[#A1A1AA]">
            Clasificación competitiva de {allSortedPlayers.length} participantes. Haz clic en cualquier jugador para ver sus estadísticas.
          </p>
        </div>
      </header>

      {/* Tarjeta fija Tu posición */}
      <Card elevated padding="md" className="sticky top-3 z-20 border-[#8B5CF6]/40">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-lg font-semibold tabular-nums text-[#8B5CF6]">
              #{currentUserRanked.rankPosition}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-[#FAFAFA]">
                  {currentUserRanked.username}
                </span>
                <span className="text-xs text-[#A1A1AA]">Tu posición actual</span>
              </div>
              <div className="mt-1 flex items-center gap-2 text-xs text-[#A1A1AA] tabular-nums">
                <span>{currentUserRanked.solvedCount} resueltos</span>
                <span aria-hidden="true">·</span>
                <span>{currentUserRanked.accuracy}% acierto</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <RankBadge xp={currentUserRanked.xp} />
            <span className="font-mono text-sm font-semibold tabular-nums text-[#FAFAFA]">
              {formatNumber(currentUserRanked.xp)} XP
            </span>
          </div>
        </div>
      </Card>

      {/* Filtros */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#27272A] bg-[#111113] p-3">
        <div className="flex flex-wrap items-center gap-3">
          <Select
            aria-label="Filtrar ranking por lenguaje"
            value={languageFilter}
            onChange={(e) => {
              setLanguageFilter(e.target.value as Language | 'all');
              setPage(1);
            }}
            className="w-44"
            options={[
              { value: 'all', label: 'Todos los lenguajes' },
              ...SUPPORTED_LANGUAGES.map((l) => ({ value: l.id, label: l.label })),
            ]}
          />
          <Select
            aria-label="Filtrar ranking por país"
            value={countryFilter}
            onChange={(e) => {
              setCountryFilter(e.target.value);
              setPage(1);
            }}
            className="w-36"
            options={[
              { value: 'all', label: 'Todos los países' },
              ...countries.map((c) => ({ value: c, label: c })),
            ]}
          />
        </div>

        <span className="font-mono text-xs tabular-nums text-[#A1A1AA]">
          {filteredPlayers.length} resultados
        </span>
      </div>

      <LeaderboardTable players={pagePlayers} onSelectPlayer={setSelectedPlayer} />

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-[#27272A] pt-4 text-xs text-[#A1A1AA]">
          <span className="font-mono tabular-nums">
            Página {safePage} de {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={safePage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft aria-hidden="true" className="h-4 w-4" />
              <span>Anterior</span>
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={safePage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              <span>Siguiente</span>
              <ChevronRight aria-hidden="true" className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <PlayerPanel player={selectedPlayer} onClose={() => setSelectedPlayer(null)} />
    </div>
  );
}
