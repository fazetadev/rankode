import { STORAGE_VERSION } from '../config';
import type { SeedState } from '../data/seed';
import { computeStreak } from './streak';

/**
 * Migra una cadena JSON guardada bajo la clave antigua `arena_platform_state_v1`
 * al formato `rankode_state_v2` (versión 2) preservando XP, envíos, borradores, pistas y perfil.
 */
export function migrateLegacyStatePayload(
  rawJson: string,
  baseZeroState: SeedState
): { state: SeedState & { isAuthenticated: boolean }; version: number } | null {
  try {
    const parsed = JSON.parse(rawJson) as {
      state?: Partial<SeedState>;
      version?: number;
    };

    const legacy = parsed?.state ?? (parsed as Partial<SeedState>);
    if (!legacy || typeof legacy !== 'object') return null;

    const activityMap = legacy.activityMap ?? {};
    const computedStreak = computeStreak(activityMap);
    const streakDays = computedStreak > 0 ? computedStreak : (legacy.streakDays ?? 0);

    const merged: SeedState & { isAuthenticated: boolean } = {
      ...baseZeroState,
      profile: {
        ...baseZeroState.profile,
        ...(legacy.profile ?? {}),
      },
      xp: typeof legacy.xp === 'number' ? legacy.xp : baseZeroState.xp,
      streakDays,
      selectedLanguage: legacy.selectedLanguage ?? baseZeroState.selectedLanguage,
      solvedChallengeIds: Array.isArray(legacy.solvedChallengeIds)
        ? legacy.solvedChallengeIds
        : baseZeroState.solvedChallengeIds,
      attemptedChallengeIds: Array.isArray(legacy.attemptedChallengeIds)
        ? legacy.attemptedChallengeIds
        : baseZeroState.attemptedChallengeIds,
      unlockedHints: legacy.unlockedHints ?? baseZeroState.unlockedHints,
      drafts: legacy.drafts ?? baseZeroState.drafts,
      submissions: Array.isArray(legacy.submissions)
        ? legacy.submissions
        : baseZeroState.submissions,
      activityMap,
      isAuthenticated: true,
    };

    return {
      state: merged,
      version: STORAGE_VERSION,
    };
  } catch {
    return null;
  }
}
