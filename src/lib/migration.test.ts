import test from 'node:test';
import assert from 'node:assert/strict';
import { createInitialSeedState } from '../data/seed';
import { migrateLegacyStatePayload } from './migration';

test('migrateLegacyStatePayload preserves v1 progress, drafts, hints, and submissions', () => {
  const legacyPayload = JSON.stringify({
    version: 1,
    state: {
      profile: { username: 'ana_legacy', country: 'MX', joinedAt: '2026-10-01T00:00:00.000Z' },
      xp: 450,
      streakDays: 4,
      selectedLanguage: 'python',
      solvedChallengeIds: ['fizzbuzz', 'invertir-cadena'],
      attemptedChallengeIds: ['fizzbuzz', 'invertir-cadena'],
      unlockedHints: { fizzbuzz: [0] },
      drafts: { 'fizzbuzz::python': 'def fizzBuzz(n): return []' },
      submissions: [
        {
          id: 'sub-old-1',
          challengeId: 'fizzbuzz',
          challengeTitle: 'FizzBuzz clásico',
          language: 'python',
          passed: true,
          passedCount: 4,
          totalCount: 4,
          xpEarned: 50,
          runtimeMs: 12,
          simulated: true,
          createdAt: '2026-11-18T10:00:00.000Z',
        },
      ],
      activityMap: {},
    },
  });

  const migrated = migrateLegacyStatePayload(legacyPayload, createInitialSeedState());
  assert.ok(migrated);
  assert.equal(migrated.version, 2);
  assert.equal(migrated.state.profile.username, 'ana_legacy');
  assert.equal(migrated.state.xp, 450);
  assert.equal(migrated.state.selectedLanguage, 'python');
  assert.deepEqual(migrated.state.solvedChallengeIds, ['fizzbuzz', 'invertir-cadena']);
  assert.equal(migrated.state.drafts['fizzbuzz::python'], 'def fizzBuzz(n): return []');
  assert.deepEqual(migrated.state.unlockedHints, { fizzbuzz: [0] });
  assert.equal(migrated.state.submissions.length, 1);
  assert.equal(migrated.state.isAuthenticated, true);
});
