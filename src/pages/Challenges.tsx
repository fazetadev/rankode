import { useMemo, useState } from 'react';
import { CHALLENGES } from '../data/challenges';
import { getDailyChallengeId } from '../lib/xp';
import { useAppStore } from '../store/useAppStore';
import type { Category, Difficulty, Language } from '../types';
import { ChallengeCard } from '../components/features/ChallengeCard';
import { ChallengeFilters, type StatusFilter } from '../components/features/ChallengeFilters';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export default function Challenges() {
  const selectedLanguage = useAppStore((s) => s.selectedLanguage);
  const solvedChallengeIds = useAppStore((s) => s.solvedChallengeIds);

  const [search, setSearch] = useState('');
  const [language, setLanguage] = useState<Language | 'all'>(selectedLanguage);
  const [difficulty, setDifficulty] = useState<Difficulty | 'all'>('all');
  const [category, setCategory] = useState<Category | 'all'>('all');
  const [status, setStatus] = useState<StatusFilter>('all');

  const dailyId = useMemo(() => getDailyChallengeId(CHALLENGES.map((c) => c.id)), []);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return CHALLENGES.filter((ch) => {
      if (language !== 'all' && !ch.languages.includes(language)) return false;
      if (difficulty !== 'all' && ch.difficulty !== difficulty) return false;
      if (category !== 'all' && ch.category !== category) return false;

      const isSolved = solvedChallengeIds.includes(ch.id);
      if (status === 'solved' && !isSolved) return false;
      if (status === 'pending' && isSolved) return false;

      if (query) {
        const hay = `${ch.title} ${ch.description} ${ch.tags.join(' ')}`.toLowerCase();
        if (!hay.includes(query)) return false;
      }
      return true;
    });
  }, [search, language, difficulty, category, status, solvedChallengeIds]);

  const hasActiveFilters =
    search.trim() !== '' ||
    language !== 'all' ||
    difficulty !== 'all' ||
    category !== 'all' ||
    status !== 'all';

  const handleReset = () => {
    setSearch('');
    setLanguage('all');
    setDifficulty('all');
    setCategory('all');
    setStatus('all');
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
          Mostrando {filtered.length} de {CHALLENGES.length} desafíos
        </p>
      </header>

      <ChallengeFilters
        search={search}
        onSearchChange={setSearch}
        language={language}
        onLanguageChange={setLanguage}
        difficulty={difficulty}
        onDifficultyChange={setDifficulty}
        category={category}
        onCategoryChange={setCategory}
        status={status}
        onStatusChange={setStatus}
        onReset={handleReset}
        hasActiveFilters={hasActiveFilters}
      />

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              solved={solvedChallengeIds.includes(challenge.id)}
              isDaily={challenge.id === dailyId}
            />
          ))}
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
