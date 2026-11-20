import test from 'node:test';
import assert from 'node:assert/strict';
import { compareComplexity, estimateComplexity, meetsTargetComplexity } from './complexity';

test('estimateComplexity detects O(1), O(n), O(n log n), O(n^2) and O(2^n)', () => {
  assert.equal(estimateComplexity('function f(x) { return x + 1; }', 'javascript').bigO, 'O(1)');

  assert.equal(
    estimateComplexity('function f(arr) { for (let i = 0; i < arr.length; i++) {} }', 'javascript').bigO,
    'O(n)'
  );

  assert.equal(
    estimateComplexity('function f(arr) { return [...arr].sort((a,b) => a - b); }', 'javascript').bigO,
    'O(n log n)'
  );

  assert.equal(
    estimateComplexity(
      'function f(arr) { for (let i = 0; i < arr.length; i++) { for (let j = i + 1; j < arr.length; j++) {} } }',
      'javascript'
    ).bigO,
    'O(n²)'
  );

  assert.equal(
    estimateComplexity(
      'function f(arr) { for (const x of arr) { if (arr.includes(x)) return x; } }',
      'javascript'
    ).bigO,
    'O(n²)'
  );

  assert.equal(
    estimateComplexity(
      'function fib(n) { if (n <= 1) return n; return fib(n - 1) + fib(n - 2); }',
      'javascript',
      'fib'
    ).bigO,
    'O(2ⁿ)'
  );
});

test('estimateComplexity ignores comments and strings', () => {
  const code = `function f(n) {
    // for (let i = 0; i < n; i++) { for (let j = 0; j < n; j++) {} }
    const s = "for (let i = 0; i < n; i++) {}";
    return n * 2;
  }`;
  assert.equal(estimateComplexity(code, 'javascript').bigO, 'O(1)');
});

test('estimateComplexity works for Python indentation', () => {
  const pyQuadratic = `def solve(nums):\n    for i in range(len(nums)):\n        for j in range(len(nums)):\n            pass\n    return 0`;
  assert.equal(estimateComplexity(pyQuadratic, 'python').bigO, 'O(n²)');

  const pyLinear = `def solve(nums):\n    seen = set()\n    for x in nums:\n        seen.add(x)\n    return 0`;
  assert.equal(estimateComplexity(pyLinear, 'python').bigO, 'O(n)');
});

test('compareComplexity and meetsTargetComplexity rank orders accurately', () => {
  assert.ok(compareComplexity('O(n)', 'O(n²)') < 0);
  assert.equal(meetsTargetComplexity('O(n)', 'O(n)'), true);
  assert.equal(meetsTargetComplexity('O(1)', 'O(n)'), true);
  assert.equal(meetsTargetComplexity('O(n²)', 'O(n)'), false);
});
