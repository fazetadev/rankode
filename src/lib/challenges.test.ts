import test from 'node:test';
import assert from 'node:assert/strict';
import { CHALLENGES } from '../data/challenges';
import { SEEDED_PLAYERS } from '../data/players';
import {
  checkBasicSyntax,
  evaluateSimulatedCode,
  executeJavaScriptDirect,
} from './judge';
import type { Language } from '../types';

test('dataset includes at least 24 challenges (6 per category) and 50 players', () => {
  assert.ok(CHALLENGES.length >= 24);
  const categories = new Map<string, number>();
  for (const ch of CHALLENGES) {
    categories.set(ch.category, (categories.get(ch.category) ?? 0) + 1);
  }
  assert.equal(categories.get('logic'), 6);
  assert.equal(categories.get('debugging'), 6);
  assert.equal(categories.get('problem-solving'), 6);
  assert.equal(categories.get('optimization'), 6);
  assert.equal(SEEDED_PLAYERS.length, 50);
});

test('all 24 JavaScript reference solutions pass all visible and hidden tests, and starters fail', () => {
  for (const challenge of CHALLENGES) {
    const allTests = [...challenge.tests.visible, ...challenge.tests.hidden];
    assert.ok(challenge.tests.visible.length >= 1, `${challenge.id} needs visible tests`);
    assert.ok(challenge.tests.hidden.length >= 1, `${challenge.id} needs hidden tests`);
    assert.equal(challenge.hints.length, 3, `${challenge.id} should have 3 hints`);

    const passRes = executeJavaScriptDirect(
      challenge.referenceSolution.javascript,
      challenge.entryPoint,
      allTests
    );
    assert.equal(
      passRes.passed,
      true,
      `JS reference failed for ${challenge.id}: ${passRes.error ?? JSON.stringify(passRes.results)}`
    );

    if (challenge.id === 'bug-busqueda-binaria') {
      assert.ok(challenge.starterCode.javascript.includes('left = mid;'));
    } else {
      const starterRes = executeJavaScriptDirect(
        challenge.starterCode.javascript,
        challenge.entryPoint,
        allTests
      );
      assert.equal(
        starterRes.passed,
        false,
        `JS starter unexpectedly passed for ${challenge.id}`
      );
    }
  }
});

test('simulated judge passes reference solutions and fails starters for python, java, cpp', () => {
  const simLangs: Language[] = ['python', 'java', 'cpp'];
  for (const challenge of CHALLENGES) {
    const allTests = [...challenge.tests.visible, ...challenge.tests.hidden];
    for (const lang of simLangs) {
      const refRes = evaluateSimulatedCode(
        challenge.referenceSolution[lang],
        lang,
        allTests,
        challenge
      );
      assert.equal(
        refRes.passed,
        true,
        `${lang} reference failed simulated judge for ${challenge.id}: ${refRes.error}`
      );

      const starterRes = evaluateSimulatedCode(
        challenge.starterCode[lang],
        lang,
        allTests,
        challenge
      );
      assert.equal(
        starterRes.passed,
        false,
        `${lang} starter unexpectedly passed simulated judge for ${challenge.id}`
      );
    }
  }
});

test('syntax checker detects unclosed delimiters', () => {
  assert.ok(checkBasicSyntax('function x() { return (1; }', 'javascript'));
  assert.ok(checkBasicSyntax('def f(x:\n    return x', 'python'));
  assert.equal(checkBasicSyntax('def f(x):\n    return x', 'python'), null);
});
