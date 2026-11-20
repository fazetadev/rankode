import test from 'node:test';
import assert from 'node:assert/strict';
import {
  RANKS,
  BASE_XP_BY_DIFFICULTY,
  getRankForXp,
  getNextRank,
  getRankProgress,
  calculateStreakBonusRate,
  calculateChallengeXp,
  getDailyChallengeId,
} from './xp';

test('rank thresholds match specification', () => {
  assert.equal(RANKS.length, 8);
  assert.equal(getRankForXp(0).id, 'rookie');
  assert.equal(getRankForXp(499).id, 'rookie');
  assert.equal(getRankForXp(500).id, 'bronze');
  assert.equal(getRankForXp(1500).id, 'silver');
  assert.equal(getRankForXp(3500).id, 'gold');
  assert.equal(getRankForXp(7000).id, 'platinum');
  assert.equal(getRankForXp(12000).id, 'diamond');
  assert.equal(getRankForXp(20000).id, 'master');
  assert.equal(getRankForXp(35000).id, 'legend');
  assert.equal(getNextRank(35000), null);
});

test('rank progress calculates remaining XP and percentage accurately', () => {
  const prog = getRankProgress(250);
  assert.equal(prog.currentRank.id, 'rookie');
  assert.equal(prog.nextRank?.id, 'bronze');
  assert.equal(prog.xpRemaining, 250);
  assert.equal(prog.percentage, 50);
});

test('streak bonus caps at 25%', () => {
  assert.equal(calculateStreakBonusRate(0), 0);
  assert.equal(calculateStreakBonusRate(3), 0.15);
  assert.equal(calculateStreakBonusRate(5), 0.25);
  assert.equal(calculateStreakBonusRate(20), 0.25);
});

test('calculateChallengeXp applies bonuses, complexity bonus, penalties, solutionRevealed and repeat rule', () => {
  assert.equal(BASE_XP_BY_DIFFICULTY.medium, 100);

  const solvedFirstTryDaily = calculateChallengeXp({
    difficulty: 'medium',
    alreadySolved: false,
    isFirstTryWithoutFails: true,
    isDailyChallenge: true,
    hintsUsedCount: 1,
    streakDays: 2,
    meetsComplexityBonus: true,
  });

  // Base 100 + Daily 50 + FirstTry 10 + Streak 10 + Complexity 15 - Hint 10 = 175
  assert.equal(solvedFirstTryDaily.baseXp, 100);
  assert.equal(solvedFirstTryDaily.dailyBonus, 50);
  assert.equal(solvedFirstTryDaily.firstTryBonus, 10);
  assert.equal(solvedFirstTryDaily.streakBonus, 10);
  assert.equal(solvedFirstTryDaily.complexityBonus, 15);
  assert.equal(solvedFirstTryDaily.hintPenalty, 10);
  assert.equal(solvedFirstTryDaily.total, 175);

  const repeat = calculateChallengeXp({
    difficulty: 'expert',
    alreadySolved: true,
    isFirstTryWithoutFails: false,
    isDailyChallenge: true,
    hintsUsedCount: 0,
    streakDays: 5,
  });
  assert.equal(repeat.total, 0);
  assert.equal(repeat.alreadySolved, true);

  const revealed = calculateChallengeXp({
    difficulty: 'hard',
    alreadySolved: false,
    isFirstTryWithoutFails: true,
    isDailyChallenge: false,
    hintsUsedCount: 0,
    streakDays: 3,
    solutionRevealed: true,
  });
  assert.equal(revealed.total, 0);
});

test('daily challenge selection is deterministic per UTC day', () => {
  const ids = ['a', 'b', 'c', 'd'];
  const date = new Date('2026-11-19T12:00:00Z');
  assert.equal(getDailyChallengeId(ids, date), getDailyChallengeId(ids, date));
});
