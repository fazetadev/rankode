import test from 'node:test';
import assert from 'node:assert/strict';
import { CHALLENGES } from '../data/challenges';
import { SEEDED_PLAYERS } from '../data/players';
import {
  checkBasicSyntax,
  evaluateSimulatedCode,
  executeJavaScriptDirect,
  executePerformanceTest,
} from './judge';
import type { Language } from '../types';

test('dataset includes 60 challenges (15 per category, >=12 easy, >=18 medium, >=18 hard, >=12 expert) and 50 players', () => {
  assert.equal(CHALLENGES.length, 60);

  const categories = new Map<string, number>();
  const difficulties = new Map<string, number>();
  const ids = new Set<string>();

  for (const ch of CHALLENGES) {
    assert.ok(!ids.has(ch.id), `duplicate challenge id: ${ch.id}`);
    ids.add(ch.id);
    categories.set(ch.category, (categories.get(ch.category) ?? 0) + 1);
    difficulties.set(ch.difficulty, (difficulties.get(ch.difficulty) ?? 0) + 1);
  }

  assert.equal(categories.get('logic'), 15);
  assert.equal(categories.get('debugging'), 15);
  assert.equal(categories.get('problem-solving'), 15);
  assert.equal(categories.get('optimization'), 15);

  assert.ok((difficulties.get('easy') ?? 0) >= 12);
  assert.ok((difficulties.get('medium') ?? 0) >= 18);
  assert.ok((difficulties.get('hard') ?? 0) >= 18);
  assert.ok((difficulties.get('expert') ?? 0) >= 12);

  assert.equal(SEEDED_PLAYERS.length, 50);
});

test('all 60 JavaScript reference solutions pass all tests & editorial/hints exist, and starters fail', () => {
  for (const challenge of CHALLENGES) {
    const allTests = [...challenge.tests.visible, ...challenge.tests.hidden];
    assert.ok(challenge.tests.visible.length >= 1, `${challenge.id} needs visible tests`);
    assert.ok(challenge.tests.hidden.length >= 1, `${challenge.id} needs hidden tests`);
    assert.equal(challenge.hints.length, 3, `${challenge.id} should have 3 hints`);
    assert.ok(challenge.editorial, `${challenge.id} missing editorial`);
    assert.ok(challenge.editorial.explanation.length > 10, `${challenge.id} editorial empty`);

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

    if (challenge.perf) {
      const perfRes = executePerformanceTest(
        challenge.referenceSolution.javascript,
        challenge.entryPoint,
        {
          sizeLabel: challenge.perf.sizeLabel,
          args: challenge.perf.build(),
          referenceCode: challenge.referenceSolution.javascript,
          maxMs: challenge.perf.maxMs,
        }
      );
      assert.equal(
        perfRes.passed,
        true,
        `Perf failed for JS reference on ${challenge.id}: ${perfRes.error}`
      );
    }

    if (
      challenge.id === 'bug-busqueda-binaria' ||
      challenge.id === 'bug-ciclo-dfs' ||
      challenge.id === 'memoizar-funcion-costosa'
    ) {
      assert.notEqual(
        challenge.starterCode.javascript.trim(),
        challenge.referenceSolution.javascript.trim(),
        `${challenge.id} starter should differ from reference`
      );
    } else if (challenge.id === 'reemplazar-bubble-sort') {
      assert.ok(challenge.perf);
      const starterPerf = executePerformanceTest(
        challenge.starterCode.javascript,
        challenge.entryPoint,
        {
          sizeLabel: challenge.perf.sizeLabel,
          args: challenge.perf.build(),
          referenceCode: challenge.referenceSolution.javascript,
          maxMs: challenge.perf.maxMs,
        }
      );
      assert.equal(starterPerf.passed, false, 'Bubble sort starter should fail perf threshold');
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
