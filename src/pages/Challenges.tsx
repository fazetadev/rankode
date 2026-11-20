import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CATEGORY_META, DIFFICULTY_META } from '../config';
import { CHALLENGES } from '../data/challenges';
import { getDailyChallengeId } from '../lib/xp';
import { useAppStore } from '../store/useAppStore';
import type { Category, Difficulty, Language } from '../types';
import { ChallengeCard } from '../components/features/ChallengeCard';
import {
  ChallengeFilters,
  type SortOption,
  type StatusFilter,
  type ViewMode,
} from '../components/features/ChallengeFilters';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

const PAGE_SIZE = 12;

export default function Challenges() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedLanguage = useAppStore((s) => s.selectedLanguage);
  const solvedChallengeIds = useAppStore((s) => s.solvedChallengeIds);
  const favorites = useAppStore((s) => s.favorites);
  const reviewLater = useAppStore((s) => s.reviewLater);

  const search = searchParams.get('q') ?? '';
  const language = (searchParams.get('lang') as Language | 'all' | null) ?? selectedLanguage;
  const difficulty = (searchParams.get('diff') as Difficulty | 'all' | null) ?? 'all';
  const category = (searchParams.get('cat') as Category | 'all' | null) ?? 'all';
  const status = (searchParams.get('status') as StatusFilter | null) ?? 'all';
  const sortBy = (searchParams.get('sort') as SortOption | null) ?? 'default';
  const viewMode = (searchParams.get('view') as ViewMode | null) ?? 'grid';
  const selectedTags = useMemo(() => {
    const raw = searchParams.get('tags');
    return raw ? raw.split(',').filter(Boolean) : [];
  }, [searchParams]);

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    if (searchParams.get('focusSearch') === '1') {
      searchInputRef.current?.focus();
      const next = new URLSearchParams(searchParams);
      next.delete('focusSearch');
      setSearchParams(next, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const updateParam = (key: string, value: string, defaultValue = 'all') => {
    const next = new URLSearchParams(searchParams);
    if (!value || value === defaultValue) {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    setSearchParams(next, { replace: true });
    setVisibleCount(PAGE_SIZE);
  };

  const dailyId = useMemo(() => getDailyChallengeId(CHALLENGES.map((c) => c.id)), []);

  const topTags = useMemo(() => {
    const counts = new Map<string, number>();
    for (const ch of CHALLENGES) {
      for (const tag of ch.tags) {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
      }
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([tag]) => tag);
  }, []);

  const weakestCategory = useMemo<Category>(() => {
    const cats: Category[] = ['logic', 'debugging', 'problem-solving', 'optimization'];
    let weakest: Category = 'logic';
    let lowestRatio = 2;
    for (const cat of cats) {
      const catItems = CHALLENGES.filter((c) => c.category === cat);
      const solved = catItems.filter((c) => solvedChallengeIds.includes(c.id)).length;
      const ratio = catItems.length > 0 ? solved / catItems.length : 1;
      if (ratio < lowestRatio) {
        lowestRatio = ratio;
        weakest = cat;
      }
    }
    return weakest;
  }, [solvedChallengeIds]);

  const suggestedForYou = useMemo(() => {
    return CHALLENGES.filter(
      (c) =>
        c.category === weakestCategory &&
        !solvedChallengeIds.includes(c.id) &&
        (language === 'all' || c.languages.includes(language))
    ).slice(0, 3);
  }, [weakestCategory, solvedChallengeIds, language]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    const list = CHALLENGES.filter((ch) => {
      if (language !== 'all' && !ch.languages.includes(language)) return false;
      if (difficulty !== 'all' && ch.difficulty !== difficulty) return false;
      if (category !== 'all' && ch.category !== category) return false;

      const isSolved = solvedChallengeIds.includes(ch.id);
      if (status === 'solved' && !isSolved) return false;
      if (status === 'pending' && isSolved) return false;
      if (status === 'favorites' && !favorites.includes(ch.id)) return false;
      if (status === 'reviewLater' && !reviewLater.includes(ch.id)) return false;

      if (selectedTags.length > 0 && !selectedTags.every((t) => ch.tags.includes(t))) {
        return false;
      }

      if (query) {
        const hay = `${ch.title} ${ch.description} ${ch.tags.join(' ')}`.toLowerCase();
        if (!hay.includes(query)) return false;
      }
      return true;
    });

    if (sortBy === 'difficulty') {
      return [...list].sort(
        (a, b) => DIFFICULTY_META[a.difficulty].order - DIFFICULTY_META[b.difficulty].order
      );
    }
    if (sortBy === 'xp') {
      return [...list].sort((a, b) => b.xp - a.xp);
    }
    if (sortBy === 'acceptanceRate') {
      return [...list].sort((a, b) => (b.acceptanceRate ?? 0) - (a.acceptanceRate ?? 0));
    }
    if (sortBy === 'title') {
      return [...list].sort((a, b) => a.title.localeCompare(b.title, 'es'));
    }
    return list;
  }, [
    search,
    language,
    difficulty,
    category,
    status,
    selectedTags,
    sortBy,
    solvedChallengeIds,
    favorites,
    reviewLater,
  ]);

  const visibleChallenges = filtered.slice(0, visibleCount);
  const remainingCount = Math.max(0, filtered.length - visibleChallenges.length);

  const hasExtraFilters =
    search.trim() !== '' ||
    difficulty !== 'all' ||
    category !== 'all' ||
    status !== 'all' ||
    selectedTags.length > 0 ||
    sortBy !== 'default';

  const hasActiveFilters = hasExtraFilters || language !== 'all';

  const handleReset = () => {
    setSearchParams({ lang: 'all' }, { replace: true });
    setVisibleCount(PAGE_SIZE);
  };

  const handleToggleTag = (tag: string) => {
    const nextTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    updateParam('tags', nextTags.join(','), '');
  };

  const handleRandom = () => {
    const pool = filtered.length > 0 ? filtered : CHALLENGES;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    if (pick) navigate(`/challenges/${pick.id}`);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-[#FAFAFA]">Desafíos</h1>
          <p className="mt-1 text-sm text-[#A1A1AA]">
            Practica lógica, debugging, algoritmos y optimización en 4 lenguajes.
          </p>
        </div>
        <p className="font-mono text-xs tabular-nums text-[#A1A1AA]">
          Mostrando {visibleChallenges.length} de {filtered.length} ({CHALLENGES.length} totales)
        </p>
      </header>

      {!hasExtraFilters && suggestedForYou.length > 0 && (
        <section aria-label="Sugeridos para ti" className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#A1A1AA]">
              Sugeridos para ti · {CATEGORY_META[weakestCategory].label}
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {suggestedForYou.map((ch) => (
              <ChallengeCard
                key={`sug-${ch.id}`}
                challenge={ch}
                solved={solvedChallengeIds.includes(ch.id)}
                isDaily={ch.id === dailyId}
              />
            ))}
          </div>
        </section>
      )}

      <ChallengeFilters
        search={search}
        onSearchChange={(val) => updateParam('q', val, '')}
        language={language}
        onLanguageChange={(val) => updateParam('lang', val, 'none')}
        difficulty={difficulty}
        onDifficultyChange={(val) => updateParam('diff', val, 'all')}
        category={category}
        onCategoryChange={(val) => updateParam('cat', val, 'all')}
        status={status}
        onStatusChange={(val) => updateParam('status', val, 'all')}
        sortBy={sortBy}
        onSortChange={(val) => updateParam('sort', val, 'default')}
        viewMode={viewMode}
        onViewModeChange={(val) => updateParam('view', val, 'grid')}
        availableTags={topTags}
        selectedTags={selectedTags}
        onToggleTag={handleToggleTag}
        onRandomChallenge={handleRandom}
        onReset={handleReset}
        hasActiveFilters={hasActiveFilters}
        searchInputRef={searchInputRef}
      />

      {filtered.length > 0 ? (
        <div className="space-y-5">
          <div
            className={
              viewMode === 'list'
                ? 'space-y-2.5'
                : 'grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'
            }
          >
            {visibleChallenges.map((challenge) => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                solved={solvedChallengeIds.includes(challenge.id)}
                isDaily={challenge.id === dailyId}
                layout={viewMode}
              />
            ))}
          </div>

          {remainingCount > 0 && (
            <div className="flex justify-center">
              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
              >
                Mostrar más ({remainingCount} restantes)
              </Button>
            </div>
          )}
        </div>
      ) : (
        <Card padding="lg" className="py-12 text-center">
          <p className="text-sm font-medium text-[#FAFAFA]">
            No hay desafíos que coincidan con tu búsqueda.
          </p>
          <p className="mt-1 text-xs text-[#A1A1AA]">
            Prueba limpiando algún filtro o cambiando el término de búsqueda.
          </p>
          <div className="mt-4">
            <Button variant="secondary" size="sm" onClick={handleReset}>
              Restablecer filtros
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
