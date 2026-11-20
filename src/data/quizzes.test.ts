import test from 'node:test';
import assert from 'node:assert/strict';
import { QUIZ_QUESTIONS } from '../data/quizzes';

test('quizzes dataset contains 60 valid micro-exercises (20 output, 20 bug, 20 complexity)', () => {
  assert.equal(QUIZ_QUESTIONS.length, 60);

  const counts = new Map<string, number>();
  const ids = new Set<string>();

  for (const q of QUIZ_QUESTIONS) {
    assert.ok(!ids.has(q.id), `duplicate quiz id: ${q.id}`);
    ids.add(q.id);
    counts.set(q.type, (counts.get(q.type) ?? 0) + 1);
    assert.equal(q.options.length, 4, `${q.id} must have 4 options`);
    assert.ok(q.correctIndex >= 0 && q.correctIndex < 4, `${q.id} invalid correctIndex`);
    assert.ok(q.xp >= 5 && q.xp <= 15, `${q.id} xp out of 5..15 range`);
    assert.ok(q.explanation.length > 10, `${q.id} needs explanation`);
  }

  assert.equal(counts.get('output'), 20);
  assert.equal(counts.get('bug'), 20);
  assert.equal(counts.get('complexity'), 20);
});
