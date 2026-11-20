import type {
  ActivityDay,
  AppSettings,
  CustomTestCase,
  Language,
  LocalAccount,
  NotificationItem,
  Submission,
  UserProfile,
} from '../types';

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
  notes: Record<string, string>;
  favorites: string[];
  reviewLater: string[];
  customTests: Record<string, CustomTestCase[]>;
  revealedSolutions: string[];
  splitRatio: number;
  settings: AppSettings;
  notifications: NotificationItem[];
  practiceQuizXp: number;
  isAuthenticated: boolean;
  activeAccountId: string | null;
  accounts: LocalAccount[];
  accountSnapshots: Record<string, AccountProgressSnapshot>;
}

export interface AccountProgressSnapshot {
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
  notes: Record<string, string>;
  favorites: string[];
  reviewLater: string[];
  customTests: Record<string, CustomTestCase[]>;
  revealedSolutions: string[];
  notifications: NotificationItem[];
  practiceQuizXp: number;
}

export const DEFAULT_APP_SETTINGS: AppSettings = {
  locale: 'es',
  editor: {
    fontSize: 13,
    tabSize: 2,
    lineWrapping: false,
    autocompletion: true,
    closeBrackets: true,
    lineNumbers: true,
  },
};

function isoDateDaysAgo(daysAgo: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

/**
 * Estado inicial limpio: todo usuario nuevo comienza completamente desde cero (0 XP, 0 desafíos, racha 0).
 */
export function createInitialSeedState(overrides?: Partial<UserProfile>): SeedState {
  const today = new Date().toISOString();
  return {
    profile: {
      username: overrides?.username ?? 'invitado',
      email: overrides?.email ?? '',
      country: overrides?.country ?? 'ES',
      joinedAt: overrides?.joinedAt ?? today,
    },
    xp: 0,
    streakDays: 0,
    selectedLanguage: 'javascript',
    solvedChallengeIds: [],
    attemptedChallengeIds: [],
    unlockedHints: {},
    drafts: {},
    submissions: [],
    activityMap: {},
    notes: {},
    favorites: [],
    reviewLater: [],
    customTests: {},
    revealedSolutions: [],
    splitRatio: 44,
    settings: DEFAULT_APP_SETTINGS,
    notifications: [],
    practiceQuizXp: 0,
    isAuthenticated: false,
    activeAccountId: null,
    accounts: [],
    accountSnapshots: {},
  };
}

/**
 * Estado opcional con actividad de muestra (útil solo si el usuario elige cargar datos de demo).
 */
export function createDemoSeedState(): SeedState {
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
    ...createInitialSeedState({
      username: 'demo_user',
      country: 'ES',
      joinedAt: isoDateDaysAgo(70),
    }),
    xp: 220,
    streakDays: 3,
    solvedChallengeIds: ['invertir-cadena', 'suma-dos-numeros'],
    attemptedChallengeIds: ['invertir-cadena', 'bug-off-by-one', 'suma-dos-numeros'],
    submissions,
    activityMap,
    isAuthenticated: true,
  };
}
