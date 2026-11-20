import test from 'node:test';
import assert from 'node:assert/strict';
import { computeStreak } from './streak';
import type { ActivityDay } from '../types';

test('computeStreak returns 0 on empty activityMap', () => {
  assert.equal(computeStreak({}, new Date('2026-11-20T12:00:00Z')), 0);
});

test('computeStreak counts consecutive days ending today', () => {
  const map: Record<string, ActivityDay> = {
    '2026-11-18': { date: '2026-11-18', count: 1, xp: 50 },
    '2026-11-19': { date: '2026-11-19', count: 2, xp: 100 },
    '2026-11-20': { date: '2026-11-20', count: 1, xp: 50 },
  };
  assert.equal(computeStreak(map, new Date('2026-11-20T12:00:00Z')), 3);
});

test('computeStreak preserves streak when today has no activity yet but yesterday did', () => {
  const map: Record<string, ActivityDay> = {
    '2026-11-17': { date: '2026-11-17', count: 1, xp: 50 },
    '2026-11-18': { date: '2026-11-18', count: 1, xp: 50 },
    '2026-11-19': { date: '2026-11-19', count: 3, xp: 150 },
  };
  assert.equal(computeStreak(map, new Date('2026-11-20T08:00:00Z')), 3);
});

test('computeStreak resets to 0 when gap exceeds 1 day', () => {
  const map: Record<string, ActivityDay> = {
    '2026-11-17': { date: '2026-11-17', count: 2, xp: 100 },
    '2026-11-18': { date: '2026-11-18', count: 1, xp: 50 },
  };
  assert.equal(computeStreak(map, new Date('2026-11-20T12:00:00Z')), 0);
});
