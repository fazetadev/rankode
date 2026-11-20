import type { ActivityDay, Language, Submission, UserProfile } from '../types';

export interface SeedState {
  profile: UserProfile;
  xp: number;
  streakDays: number;
  selectedLanguage: Language;
  solvedChallengeIds: string[];
  attemptedChallengeIds: string[];
  unlockedHints: Record<string, number[]>;
  drafts: Record<string, string>;
  submissions: Submission[];
  activityMap: Record<string, ActivityDay>;
}

function isoDateDaysAgo(daysAgo: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

/**
 * Estado inicial de demostración: el usuario comienza en Rookie con historial básico
 * para que las métricas, el mapa de actividad y la gráfica de XP sean legibles desde el primer segundo.
 */
export function createInitialSeedState(): SeedState {
  const today = isoDateDaysAgo(0);
  const yesterday = isoDateDaysAgo(1);
  const twoDaysAgo = isoDateDaysAgo(2);
  const fourDaysAgo = isoDateDaysAgo(4);
  const sixDaysAgo = isoDateDaysAgo(6);

  const activityMap: Record<string, ActivityDay> = {
    [isoDateDaysAgo(68)]: { date: isoDateDaysAgo(68), count: 1, xp: 50 },
    [isoDateDaysAgo(52)]: { date: isoDateDaysAgo(52), count: 2, xp: 100 },
    [isoDateDaysAgo(41)]: { date: isoDateDaysAgo(41), count: 1, xp: 50 },
    [isoDateDaysAgo(29)]: { date: isoDateDaysAgo(29), count: 2, xp: 100 },
    [isoDateDaysAgo(18)]: { date: isoDateDaysAgo(18), count: 1, xp: 50 },
    [isoDateDaysAgo(11)]: { date: isoDateDaysAgo(11), count: 1, xp: 50 },
    [sixDaysAgo]: { date: sixDaysAgo, count: 1, xp: 55 },
    [fourDaysAgo]: { date: fourDaysAgo, count: 1, xp: 50 },
    [twoDaysAgo]: { date: twoDaysAgo, count: 1, xp: 60 },
    [yesterday]: { date: yesterday, count: 2, xp: 110 },
    [today]: { date: today, count: 1, xp: 55 },
  };

  const submissions: Submission[] = [
    {
      id: 'seed-sub-1',
      challengeId: 'invertir-cadena',
      challengeTitle: 'Invertir cadena',
      language: 'javascript',
      passed: true,
      passedCount: 4,
      totalCount: 4,
      xpEarned: 55,
      runtimeMs: 4,
      simulated: false,
      createdAt: `${twoDaysAgo}T16:20:00.000Z`,
    },
    {
      id: 'seed-sub-2',
      challengeId: 'bug-off-by-one',
      challengeTitle: 'Bug: Bucle fuera de rango',
      language: 'python',
      passed: false,
      passedCount: 1,
      totalCount: 4,
      xpEarned: 0,
      runtimeMs: 14,
      simulated: true,
      createdAt: `${yesterday}T11:05:00.000Z`,
    },
    {
      id: 'seed-sub-3',
      challengeId: 'suma-dos-numeros',
      challengeTitle: 'Suma de dos números (Two Sum)',
      language: 'javascript',
      passed: true,
      passedCount: 4,
      totalCount: 4,
      xpEarned: 165,
      runtimeMs: 6,
      simulated: false,
      createdAt: `${yesterday}T18:40:00.000Z`,
    },
  ];

  return {
    profile: {
      username: 'tu_usuario',
      country: 'ES',
      joinedAt: isoDateDaysAgo(70),
    },
    xp: 220, // Rookie (umbral Bronze = 500)
    streakDays: 3,
    selectedLanguage: 'javascript',
    solvedChallengeIds: ['invertir-cadena', 'suma-dos-numeros'],
    attemptedChallengeIds: ['invertir-cadena', 'bug-off-by-one', 'suma-dos-numeros'],
    unlockedHints: {},
    drafts: {},
    submissions,
    activityMap,
  };
}
