import { Search, RotateCcw } from 'lucide-react';
import { CATEGORY_META, DIFFICULTY_META, SUPPORTED_LANGUAGES } from '../../config';
import type { Category, Difficulty, Language } from '../../types';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';

export type StatusFilter = 'all' | 'pending' | 'solved';

interface ChallengeFiltersProps {
  search: string;
  onSearchChange: (val: string) => void;
  language: Language | 'all';
  onLanguageChange: (val: Language | 'all') => void;
  difficulty: Difficulty | 'all';
  onDifficultyChange: (val: Difficulty | 'all') => void;
  category: Category | 'all';
  onCategoryChange: (val: Category | 'all') => void;
  status: StatusFilter;
  onStatusChange: (val: StatusFilter) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
}

export function ChallengeFilters({
  search,
  onSearchChange,
  language,
  onLanguageChange,
  difficulty,
  onDifficultyChange,
  category,
  onCategoryChange,
  status,
  onStatusChange,
  onReset,
  hasActiveFilters,
}: ChallengeFiltersProps) {
  return (
    <div className="rounded-lg border border-[#27272A] bg-[#111113] p-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <div className="sm:col-span-2 lg:col-span-1">
          <Input
            aria-label="Buscar desafío"
            placeholder="Buscar por título o etiqueta..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            icon={<Search className="h-4 w-4" />}
          />
        </div>

        <Select
          aria-label="Filtrar por lenguaje"
          value={language}
          onChange={(e) => onLanguageChange(e.target.value as Language | 'all')}
          options={[
            { value: 'all', label: 'Todos los lenguajes' },
            ...SUPPORTED_LANGUAGES.map((l) => ({ value: l.id, label: l.label })),
          ]}
        />

        <Select
          aria-label="Filtrar por dificultad"
          value={difficulty}
          onChange={(e) => onDifficultyChange(e.target.value as Difficulty | 'all')}
          options={[
            { value: 'all', label: 'Todas las dificultades' },
            ...(['easy', 'medium', 'hard', 'expert'] as Difficulty[]).map((d) => ({
              value: d,
              label: DIFFICULTY_META[d].label,
            })),
          ]}
        />

        <Select
          aria-label="Filtrar por categoría"
          value={category}
          onChange={(e) => onCategoryChange(e.target.value as Category | 'all')}
          options={[
            { value: 'all', label: 'Todas las categorías' },
            ...(['logic', 'debugging', 'problem-solving', 'optimization'] as Category[]).map((c) => ({
              value: c,
              label: CATEGORY_META[c].label,
            })),
          ]}
        />

        <div className="flex items-center gap-2">
          <Select
            aria-label="Filtrar por estado"
            value={status}
            onChange={(e) => onStatusChange(e.target.value as StatusFilter)}
            className="flex-1"
            options={[
              { value: 'all', label: 'Todos los estados' },
              { value: 'pending', label: 'Pendientes' },
              { value: 'solved', label: 'Resueltos' },
            ]}
          />
          {hasActiveFilters && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onReset}
              aria-label="Limpiar filtros"
              className="h-9 px-2.5"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
