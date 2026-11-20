import { create } from 'zustand';
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware';
import { LEGACY_STORAGE_KEY, STORAGE_KEY, STORAGE_VERSION } from '../config';
import { CHALLENGES } from '../data/challenges';
import {
  createDemoSeedState,
  createInitialSeedState,
  DEFAULT_APP_SETTINGS,
  type AccountProgressSnapshot,
  type SeedState,
} from '../data/seed';
import { migrateLegacyStatePayload } from '../lib/migration';
import { computeStreak } from '../lib/streak';
import { calculateChallengeXp, getRankForXp } from '../lib/xp';
import type {
  Challenge,
  CustomTestCase,
  EditorSettings,
  ExecutionResult,
  Language,
  LocalAccount,
  Locale,
  NotificationItem,
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
        const current = window.localStorage.getItem(name);
        if (current !== null) return current;

        // Migración única desde arena_platform_state_v1 a rankode_state_v2
        if (name === STORAGE_KEY) {
          const legacyRaw = window.localStorage.getItem(LEGACY_STORAGE_KEY);
          if (legacyRaw) {
            const migrated = migrateLegacyStatePayload(legacyRaw, createInitialSeedState());
            if (migrated) {
              const serialized = JSON.stringify(migrated);
              window.localStorage.setItem(STORAGE_KEY, serialized);
              window.localStorage.removeItem(LEGACY_STORAGE_KEY);
              return serialized;
            }
          }
        }
        return null;
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

function hashLocalPassword(password: string): string {
  let hash = 2166136261;
  for (let i = 0; i < password.length; i += 1) {
    hash ^= password.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return `lh_${(hash >>> 0).toString(16)}`;
}

function extractSnapshot(state: SeedState): AccountProgressSnapshot {
  return {
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
    notes: state.notes,
    favorites: state.favorites,
    reviewLater: state.reviewLater,
    customTests: state.customTests,
    revealedSolutions: state.revealedSolutions,
    notifications: state.notifications,
    practiceQuizXp: state.practiceQuizXp,
  };
}

function emptySnapshotForAccount(acc: LocalAccount): AccountProgressSnapshot {
  const zero = createInitialSeedState({
    username: acc.username,
    email: acc.email,
    country: acc.country,
    joinedAt: acc.createdAt,
  });
  return extractSnapshot(zero);
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
    code?: string;
    durationSec?: number;
    meetsComplexityBonus?: boolean;
  }) => SubmissionOutcome;
  resetDemoData: () => void;
  loadDemoData: () => void;
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;

  // Fase 0/1: Autenticación local (demo)
  registerAccount: (params: {
    username: string;
    email: string;
    password: string;
    country: string;
  }) => { ok: boolean; error?: string };
  loginAccount: (identifier: string, password: string) => { ok: boolean; error?: string };
  switchAccount: (accountId: string) => void;
  continueAsGuest: () => void;
  logoutAccount: () => void;

  // Fase 1: Editorial, notas, favoritos, pruebas personalizadas, editor, práctica
  revealSolution: (challengeId: string) => void;
  setNote: (challengeId: string, content: string) => void;
  toggleFavorite: (challengeId: string) => void;
  toggleReviewLater: (challengeId: string) => void;
  saveCustomTest: (challengeId: string, argsJson: string, expectedJson?: string) => void;
  deleteCustomTest: (challengeId: string, testId: string) => void;
  setSplitRatio: (ratio: number) => void;
  updateEditorSettings: (partial: Partial<EditorSettings>) => void;
  setLocale: (locale: Locale) => void;
  markAllNotificationsRead: () => void;
  recordQuizXp: (xpGained: number) => void;
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
        set((state) => {
          const nextAccounts = state.activeAccountId
            ? state.accounts.map((a) =>
                a.id === state.activeAccountId ? { ...a, username: clean } : a
              )
            : state.accounts;
          return {
            profile: {
              ...state.profile,
              username: clean,
            },
            accounts: nextAccounts,
          };
        });
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

      recordSubmission: ({
        challenge,
        language,
        result,
        isDailyChallenge,
        code,
        durationSec,
        meetsComplexityBonus = false,
      }) => {
        const state = get();
        const alreadySolved = state.solvedChallengeIds.includes(challenge.id);
        const hasAttemptedBefore = state.attemptedChallengeIds.includes(challenge.id);
        const solutionRevealed = state.revealedSolutions.includes(challenge.id);
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
              meetsComplexityBonus,
              solutionRevealed,
            })
          : {
              baseXp: 0,
              dailyBonus: 0,
              firstTryBonus: 0,
              streakBonus: 0,
              complexityBonus: 0,
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

        const nextActivityMap = {
          ...state.activityMap,
          [todayKey]: {
            date: todayKey,
            count: currentDay.count + 1,
            xp: currentDay.xp + xpBreakdown.total,
          },
        };

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
          code,
          durationSec,
        };

        // Mantener máx 20 envíos con código por desafío y hasta 150 globales
        const updatedSubmissions = [newSubmission, ...state.submissions].slice(0, 150);
        const perChallengeCounts = new Map<string, number>();
        const prunedSubmissions = updatedSubmissions.map((sub) => {
          const count = (perChallengeCounts.get(sub.challengeId) ?? 0) + 1;
          perChallengeCounts.set(sub.challengeId, count);
          if (count > 20 && sub.code !== undefined) {
            const { code: _omitted, ...rest } = sub;
            return rest;
          }
          return sub;
        });

        const nextSolvedIds =
          result.passed && !alreadySolved
            ? [...state.solvedChallengeIds, challenge.id]
            : state.solvedChallengeIds;

        const nextAttemptedIds = hasAttemptedBefore
          ? state.attemptedChallengeIds
          : [...state.attemptedChallengeIds, challenge.id];

        const nextStreak = computeStreak(nextActivityMap);

        const nextNotifications: NotificationItem[] = didRankUp
          ? [
              {
                id: `notif-${Date.now()}`,
                title: `Ascenso a ${nextRank.name}`,
                description: `Alcanzaste ${nextXp} XP tras resolver "${challenge.title}".`,
                createdAt: new Date().toISOString(),
                read: false,
              },
              ...state.notifications,
            ].slice(0, 30)
          : state.notifications;

        set({
          xp: nextXp,
          streakDays: nextStreak,
          solvedChallengeIds: nextSolvedIds,
          attemptedChallengeIds: nextAttemptedIds,
          submissions: prunedSubmissions,
          activityMap: nextActivityMap,
          notifications: nextNotifications,
        });

        return {
          xpBreakdown,
          rankUpFrom: didRankUp ? prevRank : null,
          rankUpTo: didRankUp ? nextRank : null,
        };
      },

      resetDemoData: () => {
        const state = get();
        const fresh = createInitialSeedState({
          username: state.profile.username,
          email: state.profile.email,
          country: state.profile.country,
        });
        set({
          ...fresh,
          isAuthenticated: state.isAuthenticated,
          activeAccountId: state.activeAccountId,
          accounts: state.accounts,
          accountSnapshots: state.accountSnapshots,
          settings: state.settings,
          toasts: [
            {
              id: `toast-${Date.now()}`,
              title: 'Datos restablecidos a cero',
              description: 'Tu progreso ha vuelto a 0 XP y 0 desafíos resueltos.',
              variant: 'info',
            },
          ],
        });
      },

      loadDemoData: () => {
        const state = get();
        const demo = createDemoSeedState();
        set({
          ...demo,
          profile: {
            ...demo.profile,
            username: state.profile.username !== 'invitado' ? state.profile.username : 'demo_user',
          },
          isAuthenticated: true,
          activeAccountId: state.activeAccountId,
          accounts: state.accounts,
          accountSnapshots: state.accountSnapshots,
          settings: state.settings,
          toasts: [
            {
              id: `toast-${Date.now()}`,
              title: 'Datos de demostración cargados',
              description: 'Se cargaron envíos e historial de muestra (Demo local).',
              variant: 'info',
            },
          ],
        });
      },

      registerAccount: ({ username, email, password, country }) => {
        const cleanName = username.trim().slice(0, 28);
        const cleanEmail = email.trim().toLowerCase();
        if (!cleanName || !cleanEmail || password.length < 4) {
          return { ok: false, error: 'Completa todos los campos (contraseña mín. 4 caracteres).' };
        }
        const state = get();
        const exists = state.accounts.some(
          (a) =>
            a.username.toLowerCase() === cleanName.toLowerCase() ||
            a.email.toLowerCase() === cleanEmail
        );
        if (exists) {
          return { ok: false, error: 'Ese usuario o correo ya existe en este navegador.' };
        }

        const nextSnapshots = { ...state.accountSnapshots };
        if (state.activeAccountId) {
          nextSnapshots[state.activeAccountId] = extractSnapshot(state);
        }

        const newAccount: LocalAccount = {
          id: `acc-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          username: cleanName,
          email: cleanEmail,
          passwordHash: hashLocalPassword(password),
          country: country || 'ES',
          createdAt: new Date().toISOString(),
        };

        const freshZero = createInitialSeedState({
          username: newAccount.username,
          email: newAccount.email,
          country: newAccount.country,
          joinedAt: newAccount.createdAt,
        });

        set({
          ...freshZero,
          settings: state.settings,
          isAuthenticated: true,
          activeAccountId: newAccount.id,
          accounts: [...state.accounts, newAccount],
          accountSnapshots: nextSnapshots,
          toasts: [
            {
              id: `toast-${Date.now()}`,
              title: `Bienvenido, ${newAccount.username}`,
              description: 'Tu cuenta local comienza desde 0 XP.',
              variant: 'success',
            },
          ],
        });
        return { ok: true };
      },

      loginAccount: (identifier, password) => {
        const cleanId = identifier.trim().toLowerCase();
        if (!cleanId || !password) {
          return { ok: false, error: 'Introduce tu usuario/correo y contraseña.' };
        }
        const state = get();
        const target = state.accounts.find(
          (a) => a.username.toLowerCase() === cleanId || a.email.toLowerCase() === cleanId
        );
        if (!target || target.passwordHash !== hashLocalPassword(password)) {
          return { ok: false, error: 'Usuario/correo o contraseña incorrectos.' };
        }

        const nextSnapshots = { ...state.accountSnapshots };
        if (state.activeAccountId) {
          nextSnapshots[state.activeAccountId] = extractSnapshot(state);
        }

        const targetSnap = nextSnapshots[target.id] ?? emptySnapshotForAccount(target);

        set({
          ...targetSnap,
          streakDays: computeStreak(targetSnap.activityMap),
          isAuthenticated: true,
          activeAccountId: target.id,
          accounts: state.accounts,
          accountSnapshots: nextSnapshots,
          toasts: [
            {
              id: `toast-${Date.now()}`,
              title: `Sesión iniciada como ${target.username}`,
              variant: 'success',
            },
          ],
        });
        return { ok: true };
      },

      switchAccount: (accountId) => {
        const state = get();
        const target = state.accounts.find((a) => a.id === accountId);
        if (!target) return;

        const nextSnapshots = { ...state.accountSnapshots };
        if (state.activeAccountId) {
          nextSnapshots[state.activeAccountId] = extractSnapshot(state);
        }

        const targetSnap = nextSnapshots[target.id] ?? emptySnapshotForAccount(target);
        set({
          ...targetSnap,
          streakDays: computeStreak(targetSnap.activityMap),
          isAuthenticated: true,
          activeAccountId: target.id,
          accounts: state.accounts,
          accountSnapshots: nextSnapshots,
        });
      },

      continueAsGuest: () => {
        const state = get();
        if (state.activeAccountId) {
          const nextSnapshots = {
            ...state.accountSnapshots,
            [state.activeAccountId]: extractSnapshot(state),
          };
          const zero = createInitialSeedState({ username: 'invitado' });
          set({
            ...zero,
            settings: state.settings,
            isAuthenticated: true,
            activeAccountId: null,
            accounts: state.accounts,
            accountSnapshots: nextSnapshots,
          });
          return;
        }
        set({ isAuthenticated: true });
      },

      logoutAccount: () => {
        const state = get();
        const nextSnapshots = { ...state.accountSnapshots };
        if (state.activeAccountId) {
          nextSnapshots[state.activeAccountId] = extractSnapshot(state);
        }
        set({
          isAuthenticated: false,
          accountSnapshots: nextSnapshots,
        });
      },

      revealSolution: (challengeId) => {
        set((state) => {
          if (state.revealedSolutions.includes(challengeId)) return state;
          return {
            revealedSolutions: [...state.revealedSolutions, challengeId],
          };
        });
      },

      setNote: (challengeId, content) => {
        set((state) => ({
          notes: {
            ...state.notes,
            [challengeId]: content,
          },
        }));
      },

      toggleFavorite: (challengeId) => {
        set((state) => {
          const exists = state.favorites.includes(challengeId);
          return {
            favorites: exists
              ? state.favorites.filter((id) => id !== challengeId)
              : [...state.favorites, challengeId],
          };
        });
      },

      toggleReviewLater: (challengeId) => {
        set((state) => {
          const exists = state.reviewLater.includes(challengeId);
          return {
            reviewLater: exists
              ? state.reviewLater.filter((id) => id !== challengeId)
              : [...state.reviewLater, challengeId],
          };
        });
      },

      saveCustomTest: (challengeId, argsJson, expectedJson) => {
        set((state) => {
          const current = state.customTests[challengeId] ?? [];
          const nextItem: CustomTestCase = {
            id: `ct-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
            argsJson,
            expectedJson,
            createdAt: new Date().toISOString(),
          };
          return {
            customTests: {
              ...state.customTests,
              [challengeId]: [nextItem, ...current].slice(0, 10),
            },
          };
        });
      },

      deleteCustomTest: (challengeId, testId) => {
        set((state) => {
          const current = state.customTests[challengeId] ?? [];
          return {
            customTests: {
              ...state.customTests,
              [challengeId]: current.filter((t) => t.id !== testId),
            },
          };
        });
      },

      setSplitRatio: (ratio) => {
        const clamped = Math.max(28, Math.min(68, Math.round(ratio)));
        set({ splitRatio: clamped });
      },

      updateEditorSettings: (partial) => {
        set((state) => ({
          settings: {
            ...state.settings,
            editor: {
              ...state.settings.editor,
              ...partial,
            },
          },
        }));
      },

      setLocale: (locale) => {
        set((state) => ({
          settings: {
            ...state.settings,
            locale,
          },
        }));
      },

      markAllNotificationsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        }));
      },

      recordQuizXp: (xpGained) => {
        if (xpGained <= 0) return;
        set((state) => {
          const todayKey = new Date().toISOString().slice(0, 10);
          const currentDay = state.activityMap[todayKey] ?? { date: todayKey, count: 0, xp: 0 };
          const nextActivityMap = {
            ...state.activityMap,
            [todayKey]: {
              date: todayKey,
              count: currentDay.count + 1,
              xp: currentDay.xp + xpGained,
            },
          };
          return {
            xp: state.xp + xpGained,
            practiceQuizXp: state.practiceQuizXp + xpGained,
            activityMap: nextActivityMap,
            streakDays: computeStreak(nextActivityMap),
          };
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
        notes: state.notes,
        favorites: state.favorites,
        reviewLater: state.reviewLater,
        customTests: state.customTests,
        revealedSolutions: state.revealedSolutions,
        splitRatio: state.splitRatio,
        settings: state.settings,
        notifications: state.notifications,
        practiceQuizXp: state.practiceQuizXp,
        isAuthenticated: state.isAuthenticated,
        activeAccountId: state.activeAccountId,
        accounts: state.accounts,
        accountSnapshots: state.accountSnapshots,
      }),
      migrate: (persistedState, version) => {
        const base = createInitialSeedState();
        if (!persistedState || typeof persistedState !== 'object') {
          return base;
        }
        const incoming = persistedState as Partial<SeedState>;
        if (version < STORAGE_VERSION) {
          const activityMap = incoming.activityMap ?? {};
          return {
            ...base,
            ...incoming,
            settings: {
              ...DEFAULT_APP_SETTINGS,
              ...(incoming.settings ?? {}),
              editor: {
                ...DEFAULT_APP_SETTINGS.editor,
                ...(incoming.settings?.editor ?? {}),
              },
            },
            streakDays: computeStreak(activityMap),
            isAuthenticated: incoming.isAuthenticated ?? true,
          };
        }
        return {
          ...base,
          ...incoming,
          settings: {
            ...DEFAULT_APP_SETTINGS,
            ...(incoming.settings ?? {}),
            editor: {
              ...DEFAULT_APP_SETTINGS.editor,
              ...(incoming.settings?.editor ?? {}),
            },
          },
          streakDays: computeStreak(incoming.activityMap ?? {}),
        };
      },
    }
  )
);
