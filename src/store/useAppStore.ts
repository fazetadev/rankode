import { create } from 'zustand';
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware';
import { STORAGE_KEY, STORAGE_VERSION } from '../config';
import { CHALLENGES } from '../data/challenges';
import { createInitialSeedState, type SeedState } from '../data/seed';
import { calculateChallengeXp, getRankForXp } from '../lib/xp';
import type {
  Challenge,
  ExecutionResult,
  Language,
  RankDefinition,
  Submission,
  ToastMessage,
  XpBreakdown,
} from '../types';

function createSafeLocalStorage(): StateStorage {
  return {
    getItem: (name: string): string | null => {
      try {
        if (typeof window === 'undefined' || !window.localStorage) return null;
        return window.localStorage.getItem(name);
      } catch {
        return null;
      }
    },
    setItem: (name: string, value: string): void => {
      try {
        if (typeof window === 'undefined' || !window.localStorage) return;
        window.localStorage.setItem(name, value);
      } catch {
        // Ignorar errores de cuota o modo privado
      }
    },
    removeItem: (name: string): void => {
      try {
        if (typeof window === 'undefined' || !window.localStorage) return;
        window.localStorage.removeItem(name);
      } catch {
        // Ignorar errores de almacenamiento
      }
    },
  };
}

export interface SubmissionOutcome {
  xpBreakdown: XpBreakdown;
  rankUpFrom: RankDefinition | null;
  rankUpTo: RankDefinition | null;
}

interface AppStoreState extends SeedState {
  toasts: ToastMessage[];
  setLanguage: (language: Language) => void;
  updateUsername: (username: string) => void;
  setDraft: (challengeId: string, language: Language, code: string) => void;
  resetDraft: (challengeId: string, language: Language) => void;
  unlockHint: (challengeId: string, hintIndex: number) => void;
  recordSubmission: (params: {
    challenge: Challenge;
    language: Language;
    result: ExecutionResult;
    isDailyChallenge: boolean;
  }) => SubmissionOutcome;
  resetDemoData: () => void;
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
}

export function getDraftKey(challengeId: string, language: Language): string {
  return `${challengeId}::${language}`;
}

export const useAppStore = create<AppStoreState>()(
  persist(
    (set, get) => ({
      ...createInitialSeedState(),
      toasts: [],

      setLanguage: (language) => set({ selectedLanguage: language }),

      updateUsername: (username) => {
        const clean = username.trim().slice(0, 28);
        if (!clean) return;
        set((state) => ({
          profile: {
            ...state.profile,
            username: clean,
          },
        }));
      },

      setDraft: (challengeId, language, code) => {
        const key = getDraftKey(challengeId, language);
        set((state) => ({
          drafts: {
            ...state.drafts,
            [key]: code,
          },
        }));
      },

      resetDraft: (challengeId, language) => {
        const key = getDraftKey(challengeId, language);
        const challenge = CHALLENGES.find((c) => c.id === challengeId);
        const starter = challenge ? challenge.starterCode[language] : '';
        set((state) => ({
          drafts: {
            ...state.drafts,
            [key]: starter,
          },
        }));
      },

      unlockHint: (challengeId, hintIndex) => {
        set((state) => {
          const existing = state.unlockedHints[challengeId] ?? [];
          if (existing.includes(hintIndex)) return state;
          return {
            unlockedHints: {
              ...state.unlockedHints,
              [challengeId]: [...existing, hintIndex].sort((a, b) => a - b),
            },
          };
        });
      },

      recordSubmission: ({ challenge, language, result, isDailyChallenge }) => {
        const state = get();
        const alreadySolved = state.solvedChallengeIds.includes(challenge.id);
        const hasAttemptedBefore = state.attemptedChallengeIds.includes(challenge.id);
        const hintsUsedCount = (state.unlockedHints[challenge.id] ?? []).length;

        const isFirstTryWithoutFails = result.passed && !hasAttemptedBefore;

        const xpBreakdown = result.passed
          ? calculateChallengeXp({
              difficulty: challenge.difficulty,
              alreadySolved,
              isFirstTryWithoutFails,
              isDailyChallenge,
              hintsUsedCount,
              streakDays: state.streakDays,
            })
          : {
              baseXp: 0,
              dailyBonus: 0,
              firstTryBonus: 0,
              streakBonus: 0,
              hintPenalty: 0,
              total: 0,
              alreadySolved,
            };

        const prevRank = getRankForXp(state.xp);
        const nextXp = state.xp + xpBreakdown.total;
        const nextRank = getRankForXp(nextXp);
        const didRankUp = nextRank.id !== prevRank.id;

        const todayKey = new Date().toISOString().slice(0, 10);
        const currentDay = state.activityMap[todayKey] ?? { date: todayKey, count: 0, xp: 0 };

        const newSubmission: Submission = {
          id: `sub-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          challengeId: challenge.id,
          challengeTitle: challenge.title,
          language,
          passed: result.passed,
          passedCount: result.passedCount,
          totalCount: result.totalCount,
          xpEarned: xpBreakdown.total,
          runtimeMs: result.runtimeMs,
          simulated: result.simulated,
          createdAt: new Date().toISOString(),
        };

        const nextSolvedIds =
          result.passed && !alreadySolved
            ? [...state.solvedChallengeIds, challenge.id]
            : state.solvedChallengeIds;

        const nextAttemptedIds = hasAttemptedBefore
          ? state.attemptedChallengeIds
          : [...state.attemptedChallengeIds, challenge.id];

        const hadActivityToday = Boolean(state.activityMap[todayKey]);
        const nextStreak =
          result.passed && !hadActivityToday ? state.streakDays + 1 : state.streakDays;

        set({
          xp: nextXp,
          streakDays: nextStreak,
          solvedChallengeIds: nextSolvedIds,
          attemptedChallengeIds: nextAttemptedIds,
          submissions: [newSubmission, ...state.submissions].slice(0, 150),
          activityMap: {
            ...state.activityMap,
            [todayKey]: {
              date: todayKey,
              count: currentDay.count + 1,
              xp: currentDay.xp + xpBreakdown.total,
            },
          },
        });

        return {
          xpBreakdown,
          rankUpFrom: didRankUp ? prevRank : null,
          rankUpTo: didRankUp ? nextRank : null,
        };
      },

      resetDemoData: () => {
        const fresh = createInitialSeedState();
        set({
          ...fresh,
          toasts: [
            {
              id: `toast-${Date.now()}`,
              title: 'Datos restablecidos',
              description: 'Tu progreso ha vuelto al estado inicial de demostración.',
              variant: 'info',
            },
          ],
        });
      },

      addToast: (toast) => {
        const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
        set((state) => ({
          toasts: [...state.toasts, { ...toast, id }],
        }));
      },

      removeToast: (id) => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      },
    }),
    {
      name: STORAGE_KEY,
      version: STORAGE_VERSION,
      storage: createJSONStorage(createSafeLocalStorage),
      partialize: (state) => ({
        profile: state.profile,
        xp: state.xp,
        streakDays: state.streakDays,
        selectedLanguage: state.selectedLanguage,
        solvedChallengeIds: state.solvedChallengeIds,
        attemptedChallengeIds: state.attemptedChallengeIds,
        unlockedHints: state.unlockedHints,
        drafts: state.drafts,
        submissions: state.submissions,
        activityMap: state.activityMap,
      }),
      migrate: (persistedState, version) => {
        if (version !== STORAGE_VERSION || !persistedState || typeof persistedState !== 'object') {
          return createInitialSeedState();
        }
        return {
          ...createInitialSeedState(),
          ...(persistedState as Partial<SeedState>),
        };
      },
    }
  )
);
