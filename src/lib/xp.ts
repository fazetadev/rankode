import type { Difficulty, RankDefinition, XpBreakdown } from '../types';

/**
 * Definición ordenada de los 8 rangos competitivos y su XP acumulado mínimo.
 * Ajusta los umbrales aquí sin afectar al resto de componentes.
 */
export const RANKS: RankDefinition[] = [
  {
    id: 'rookie',
    name: 'Rookie',
    minXp: 0,
    color: '#A1A1AA',
    description: 'Inicio del recorrido. Domina los fundamentos de lógica y sintaxis.',
  },
  {
    id: 'bronze',
    name: 'Bronze',
    minXp: 500,
    color: '#D97706',
    description: 'Resolución consistente de desafíos básicos y detección de bugs.',
  },
  {
    id: 'silver',
    name: 'Silver',
    minXp: 1500,
    color: '#94A3B8',
    description: 'Manejo fluido de estructuras lineales, hash maps y dos punteros.',
  },
  {
    id: 'gold',
    name: 'Gold',
    minXp: 3500,
    color: '#EAB308',
    description: 'Optimización de complejidad y dominio de algoritmos intermedios.',
  },
  {
    id: 'platinum',
    name: 'Platinum',
    minXp: 7000,
    color: '#2DD4BF',
    description: 'Resolución sólida de grafos, programación dinámica y casos límite.',
  },
  {
    id: 'diamond',
    name: 'Diamond',
    minXp: 12000,
    color: '#38BDF8',
    description: 'Precisión competitiva sostenida bajo restricciones exigentes.',
  },
  {
    id: 'master',
    name: 'Master',
    minXp: 20000,
    color: '#A78BFA',
    description: 'Élite técnica en optimización algorítmica y arquitectura de código.',
  },
  {
    id: 'legend',
    name: 'Legend',
    minXp: 35000,
    color: '#F43F5E',
    description: 'Nivel máximo de la plataforma. Referente en todas las categorías.',
  },
];

/**
 * XP base otorgado al resolver un desafío según su dificultad.
 */
export const BASE_XP_BY_DIFFICULTY: Record<Difficulty, number> = {
  easy: 50,
  medium: 100,
  hard: 200,
  expert: 350,
};

export const FIRST_TRY_BONUS_RATE = 0.1; // +10%
export const DAILY_CHALLENGE_MULTIPLIER = 1.5; // x1.5 (+50%)
export const HINT_PENALTY_RATE = 0.1; // -10% por cada pista usada
export const STREAK_BONUS_PER_DAY = 0.05; // +5% por día consecutivo
export const STREAK_BONUS_MAX = 0.25; // Máximo +25% (5 días)

/**
 * Devuelve el rango actual correspondiente al XP acumulado.
 */
export function getRankForXp(xp: number): RankDefinition {
  const normalizedXp = Math.max(0, Math.floor(xp));
  let current = RANKS[0];
  for (const rank of RANKS) {
    if (normalizedXp >= rank.minXp) {
      current = rank;
    } else {
      break;
    }
  }
  return current;
}

/**
 * Devuelve el siguiente rango o null si el usuario alcanzó Legend.
 */
export function getNextRank(xp: number): RankDefinition | null {
  const current = getRankForXp(xp);
  const idx = RANKS.findIndex((r) => r.id === current.id);
  if (idx === -1 || idx >= RANKS.length - 1) return null;
  return RANKS[idx + 1];
}

/**
 * Calcula métricas de progreso hacia el siguiente rango.
 */
export function getRankProgress(xp: number): {
  currentRank: RankDefinition;
  nextRank: RankDefinition | null;
  xpInCurrentRank: number;
  xpForNextRank: number;
  xpRemaining: number;
  percentage: number;
} {
  const normalizedXp = Math.max(0, Math.floor(xp));
  const currentRank = getRankForXp(normalizedXp);
  const nextRank = getNextRank(normalizedXp);

  if (!nextRank) {
    return {
      currentRank,
      nextRank: null,
      xpInCurrentRank: normalizedXp - currentRank.minXp,
      xpForNextRank: 0,
      xpRemaining: 0,
      percentage: 100,
    };
  }

  const span = Math.max(1, nextRank.minXp - currentRank.minXp);
  const xpInCurrentRank = normalizedXp - currentRank.minXp;
  const xpRemaining = Math.max(0, nextRank.minXp - normalizedXp);
  const percentage = Math.min(100, Math.max(0, Math.round((xpInCurrentRank / span) * 100)));

  return {
    currentRank,
    nextRank,
    xpInCurrentRank,
    xpForNextRank: span,
    xpRemaining,
    percentage,
  };
}

/**
 * Calcula la bonificación porcentual por racha diaria (+5%/día, tope +25%).
 */
export function calculateStreakBonusRate(streakDays: number): number {
  const safeDays = Math.max(0, Math.floor(streakDays));
  return Number(Math.min(safeDays * STREAK_BONUS_PER_DAY, STREAK_BONUS_MAX).toFixed(2));
}

export interface CalculateXpParams {
  difficulty: Difficulty;
  alreadySolved: boolean;
  isFirstTryWithoutFails: boolean;
  isDailyChallenge: boolean;
  hintsUsedCount: number;
  streakDays: number;
}

/**
 * Calcula el desglose completo de XP ganado al resolver un desafío.
 * Repetir un desafío ya resuelto devuelve 0 XP.
 */
export function calculateChallengeXp(params: CalculateXpParams): XpBreakdown {
  if (params.alreadySolved) {
    return {
      baseXp: 0,
      dailyBonus: 0,
      firstTryBonus: 0,
      streakBonus: 0,
      hintPenalty: 0,
      total: 0,
      alreadySolved: true,
    };
  }

  const baseXp = BASE_XP_BY_DIFFICULTY[params.difficulty];
  const dailyBonus = params.isDailyChallenge
    ? Math.round(baseXp * (DAILY_CHALLENGE_MULTIPLIER - 1))
    : 0;
  const firstTryBonus = params.isFirstTryWithoutFails
    ? Math.round(baseXp * FIRST_TRY_BONUS_RATE)
    : 0;
  const streakRate = calculateStreakBonusRate(params.streakDays);
  const streakBonus = Math.round(baseXp * streakRate);
  const clampedHints = Math.max(0, Math.min(3, Math.floor(params.hintsUsedCount)));
  const hintPenalty = Math.round(baseXp * clampedHints * HINT_PENALTY_RATE);

  const total = Math.max(0, baseXp + dailyBonus + firstTryBonus + streakBonus - hintPenalty);

  return {
    baseXp,
    dailyBonus,
    firstTryBonus,
    streakBonus,
    hintPenalty,
    total,
    alreadySolved: false,
  };
}

/**
 * Selecciona de forma determinista el desafío diario del día actual.
 */
export function getDailyChallengeId(challengeIds: string[], date: Date = new Date()): string {
  if (challengeIds.length === 0) return '';
  const dayKey = `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}-${date.getUTCDate()}`;
  let hash = 0;
  for (let i = 0; i < dayKey.length; i += 1) {
    hash = (hash * 31 + dayKey.charCodeAt(i)) >>> 0;
  }
  return challengeIds[hash % challengeIds.length];
}
