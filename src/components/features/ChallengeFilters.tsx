import { Search, RotateCcw, Shuffle, LayoutGrid, List } from 'lucide-react';
import { CATEGORY_META, DIFFICULTY_META, SUPPORTED_LANGUAGES } from '../../config';
import type { Category, Difficulty, Language } from '../../types';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';

export type StatusFilter = 'all' | 'pending' | 'solved' | 'favorites' | 'reviewLater';
export type SortOption = 'default' | 'difficulty' | 'xp' | 'acceptanceRate' | 'title';
export type ViewMode = 'grid' | 'list';

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
  sortBy: SortOption;
  onSortChange: (val: SortOption) => void;
  viewMode: ViewMode;
  onViewModeChange: (val: ViewMode) => void;
  availableTags: string[];
  selectedTags: string[];
  onToggleTag: (tag: string) => void;
  onRandomChallenge: () => void;
  onReset: () => void;
  hasActiveFilters: boolean;
  searchInputRef?: React.RefObject<HTMLInputElement | null>;
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
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  availableTags,
  selectedTags,
  onToggleTag,
  onRandomChallenge,
  onReset,
  hasActiveFilters,
  searchInputRef,
}: ChallengeFiltersProps) {
  return (
    <div className="space-y-3 rounded-lg border border-[#27272A] bg-[#111113] p-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-4">
          <Input
            ref={searchInputRef}
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

        <Select
          aria-label="Filtrar por estado"
          value={status}
          onChange={(e) => onStatusChange(e.target.value as StatusFilter)}
          options={[
            { value: 'all', label: 'Todos los estados' },
            { value: 'pending', label: 'Pendientes' },
            { value: 'solved', label: 'Resueltos' },
            { value: 'favorites', label: 'Favoritos' },
            { value: 'reviewLater', label: 'Repasar luego' },
          ]}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#27272A]/80 pt-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {availableTags.map((tag) => {
            const active = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => onToggleTag(tag)}
                aria-pressed={active}
                className={`rounded-md border px-2 py-1 text-[11px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6] ${
                  active
                    ? 'border-[#8B5CF6] bg-[#8B5CF6]/15 text-[#FAFAFA]'
                    : 'border-[#27272A] bg-[#09090B] text-[#A1A1AA] hover:border-[#3F3F46] hover:text-[#FAFAFA]'
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select
            aria-label="Ordenar desafíos"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="w-48"
            options={[
              { value: 'default', label: 'Orden por defecto' },
              { value: 'difficulty', label: 'Dificultad' },
              { value: 'xp', label: 'Mayor XP' },
              { value: 'acceptanceRate', label: 'Mayor acierto %' },
              { value: 'title', label: 'Título (A-Z)' },
            ]}
          />

          <div className="flex items-center rounded-md border border-[#27272A] bg-[#09090B] p-0.5">
            <button
              type="button"
              onClick={() => onViewModeChange('grid')}
              aria-label="Vista en cuadrícula"
              aria-pressed={viewMode === 'grid'}
              className={`rounded p-1.5 transition-colors ${
                viewMode === 'grid'
                  ? 'bg-[#18181B] text-[#FAFAFA]'
                  : 'text-[#71717A] hover:text-[#FAFAFA]'
              }`}
            >
              <LayoutGrid aria-hidden="true" className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('list')}
              aria-label="Vista en lista"
              aria-pressed={viewMode === 'list'}
              className={`rounded p-1.5 transition-colors ${
                viewMode === 'list'
                  ? 'bg-[#18181B] text-[#FAFAFA]'
                  : 'text-[#71717A] hover:text-[#FAFAFA]'
              }`}
            >
              <List aria-hidden="true" className="h-3.5 w-3.5" />
            </button>
          </div>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onRandomChallenge}
            title="Abrir un desafío aleatorio según filtros"
          >
            <Shuffle aria-hidden="true" className="h-3.5 w-3.5" />
            <span>Aleatorio</span>
          </Button>

          {hasActiveFilters && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onReset}
              aria-label="Limpiar filtros"
            >
              <RotateCcw aria-hidden="true" className="h-3.5 w-3.5" />
              <span>Limpiar</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
