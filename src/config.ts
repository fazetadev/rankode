import type { Category, Difficulty, Language } from './types';

/**
 * Nombre provisional de la plataforma.
 * Cambia esta única constante para renombrar toda la aplicación.
 */
export const APP_NAME = 'Arena';

export const STORAGE_KEY = 'arena_platform_state_v1';
export const STORAGE_VERSION = 1;

export const SUPPORTED_LANGUAGES: { id: Language; label: string; short: string; ext: string }[] = [
  { id: 'javascript', label: 'JavaScript', short: 'JS', ext: 'js' },
  { id: 'python', label: 'Python', short: 'PY', ext: 'py' },
  { id: 'java', label: 'Java', short: 'JAVA', ext: 'java' },
  { id: 'cpp', label: 'C++', short: 'C++', ext: 'cpp' },
];

export const DIFFICULTY_META: Record<
  Difficulty,
  { label: string; colorClass: string; dotColor: string; order: number }
> = {
  easy: {
    label: 'Fácil',
    colorClass: 'text-emerald-400',
    dotColor: '#34D399',
    order: 1,
  },
  medium: {
    label: 'Media',
    colorClass: 'text-amber-400',
    dotColor: '#FBBF24',
    order: 2,
  },
  hard: {
    label: 'Difícil',
    colorClass: 'text-orange-400',
    dotColor: '#FB923C',
    order: 3,
  },
  expert: {
    label: 'Experto',
    colorClass: 'text-rose-400',
    dotColor: '#FB7185',
    order: 4,
  },
};

export const CATEGORY_META: Record<Category, { label: string; description: string }> = {
  logic: {
    label: 'Lógica',
    description: 'Cadenas, estructuras básicas y razonamiento deductivo.',
  },
  debugging: {
    label: 'Debugging',
    description: 'Localiza y corrige errores sutiles en código existente.',
  },
  'problem-solving': {
    label: 'Resolución de problemas',
    description: 'Algoritmos clásicos, grafos, programación dinámica e intervalos.',
  },
  optimization: {
    label: 'Optimización',
    description: 'Mejora la complejidad temporal y espacial de O(n²) a O(n).',
  },
};

export const WORKER_TIMEOUT_MS = 3000;
