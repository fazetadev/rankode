import test from 'node:test';
import assert from 'node:assert/strict';
import { CHALLENGES } from '../data/challenges';
import {
  evaluateSimulatedCode,
  executeJavaScriptDirect,
  executePerformanceTest,
} from './judge';
import type { Language } from '../types';

function getChallenge(id: string) {
  const challenge = CHALLENGES.find((c) => c.id === id);
  assert.ok(challenge, `desafío ${id} no encontrado`);
  return challenge;
}

function allTests(id: string) {
  const challenge = getChallenge(id);
  return [...challenge.tests.visible, ...challenge.tests.hidden];
}

// ---------------------------------------------------------------------------
// JavaScript: formas habituales de escribir la solución
// ---------------------------------------------------------------------------

const JS_BODY = "function reverseString(s) { return [...s].reverse().join(''); }";

const jsVariants: Record<string, string> = {
  'función normal': JS_BODY,
  'arrow function': "const reverseString = (s) => [...s].reverse().join('');",
  'con console.log suelto': `${JS_BODY}\nconsole.log(reverseString('hola'));`,
  'export function': "export function reverseString(s) { return [...s].reverse().join(''); }",
  'export default function': "export default function reverseString(s) { return [...s].reverse().join(''); }",
  'export const': "export const reverseString = (s) => [...s].reverse().join('');",
  'export { ... } al final': `${JS_BODY}\nexport { reverseString };`,
  'module.exports': `${JS_BODY}\nmodule.exports = { reverseString };`,
  'exports.x': `${JS_BODY}\nexports.reverseString = reverseString;`,
  'comentario final sin salto de línea': `${JS_BODY} // listo`,
  'declara su propia variable module': `const module = 1;\n${JS_BODY}`,
};

for (const [label, code] of Object.entries(jsVariants)) {
  test(`JS acepta: ${label}`, () => {
    const res = executeJavaScriptDirect(code, 'reverseString', allTests('invertir-cadena'));
    assert.equal(res.passed, true, res.error ?? JSON.stringify(res.results));
  });
}

test('JS: nombre de función incorrecto sugiere el nombre que sí definió el usuario', () => {
  const res = executeJavaScriptDirect(
    'function invertir(s) { return s; }',
    'reverseString',
    allTests('invertir-cadena')
  );
  assert.equal(res.passed, false);
  assert.match(res.error ?? '', /reverseString/);
  assert.match(res.error ?? '', /invertir/);
});

test('JS: errores de sintaxis, excepciones y código incorrecto no se pierden', () => {
  const tests = allTests('invertir-cadena');

  const syntax = executeJavaScriptDirect('function reverseString(s) { return (; }', 'reverseString', tests);
  assert.equal(syntax.passed, false);
  assert.match(syntax.error ?? '', /sintaxis/i);

  const throws = executeJavaScriptDirect(
    "function reverseString(s) { throw new Error('boom'); }",
    'reverseString',
    tests
  );
  assert.equal(throws.passed, false);
  assert.ok(throws.results.every((r) => r.error === 'boom'));

  const topLevelThrow = executeJavaScriptDirect(
    "throw new Error('fallo al cargar');\nfunction reverseString(s) { return s; }",
    'reverseString',
    tests
  );
  assert.equal(topLevelThrow.passed, false);
  assert.match(topLevelThrow.error ?? '', /fallo al cargar/);

  const wrong = executeJavaScriptDirect('function reverseString(s) { return s; }', 'reverseString', tests);
  assert.equal(wrong.passed, false);
});

// ---------------------------------------------------------------------------
// Juez simulado: soluciones correctas escritas de forma distinta a la de referencia
// ---------------------------------------------------------------------------

interface Alternative {
  label: string;
  id: string;
  lang: Language;
  code: string;
}

const correctAlternatives: Alternative[] = [
  {
    label: 'Python: invertir con slicing',
    id: 'invertir-cadena',
    lang: 'python',
    code: 'def reverseString(s: str) -> str:\n    return s[::-1]',
  },
  {
    label: 'Python: invertir con join(reversed())',
    id: 'invertir-cadena',
    lang: 'python',
    code: 'def reverseString(s):\n    return "".join(reversed(s))',
  },
  {
    label: 'Java: invertir con StringBuilder.reverse()',
    id: 'invertir-cadena',
    lang: 'java',
    code: 'class Solution {\n    public String reverseString(String s) {\n        return new StringBuilder(s).reverse().toString();\n    }\n}',
  },
  {
    label: 'C++: invertir con std::reverse',
    id: 'invertir-cadena',
    lang: 'cpp',
    code: '#include <string>\n#include <algorithm>\nusing namespace std;\n\nstring reverseString(string s) {\n    reverse(s.begin(), s.end());\n    return s;\n}',
  },
  {
    label: 'Python: palíndromo con re.sub',
    id: 'palindromo-limpio',
    lang: 'python',
    code: "import re\n\ndef isPalindrome(s: str) -> bool:\n    c = re.sub(r'[^a-z0-9]', '', s.lower())\n    return c == c[::-1]",
  },
  {
    label: 'Java: palíndromo con replaceAll + reverse',
    id: 'palindromo-limpio',
    lang: 'java',
    code: 'class Solution {\n    public boolean isPalindrome(String s) {\n        String c = s.toLowerCase().replaceAll("[^a-z0-9]", "");\n        return new StringBuilder(c).reverse().toString().equals(c);\n    }\n}',
  },
  {
    label: 'C++: palíndromo con cadena limpia y reversa',
    id: 'palindromo-limpio',
    lang: 'cpp',
    code: '#include <string>\n#include <cctype>\nusing namespace std;\n\nbool isPalindrome(string s) {\n    string c;\n    for (char ch : s) if (isalnum((unsigned char)ch)) c += tolower((unsigned char)ch);\n    string r(c.rbegin(), c.rend());\n    return c == r;\n}',
  },
  {
    label: 'Python: anagrama con sorted()',
    id: 'anagramas',
    lang: 'python',
    code: 'def isAnagram(s: str, t: str) -> bool:\n    return sorted(s) == sorted(t)',
  },
  {
    label: 'Python: anagrama con Counter',
    id: 'anagramas',
    lang: 'python',
    code: 'from collections import Counter\n\ndef isAnagram(s, t):\n    return Counter(s) == Counter(t)',
  },
  {
    label: 'Java: anagrama con Arrays.sort + Arrays.equals',
    id: 'anagramas',
    lang: 'java',
    code: 'import java.util.*;\n\nclass Solution {\n    public boolean isAnagram(String s, String t) {\n        char[] a = s.toCharArray();\n        char[] b = t.toCharArray();\n        Arrays.sort(a);\n        Arrays.sort(b);\n        return Arrays.equals(a, b);\n    }\n}',
  },
  {
    label: 'C++: anagrama ordenando ambas cadenas',
    id: 'anagramas',
    lang: 'cpp',
    code: '#include <string>\n#include <algorithm>\nusing namespace std;\n\nbool isAnagram(string s, string t) {\n    sort(s.begin(), s.end());\n    sort(t.begin(), t.end());\n    return s == t;\n}',
  },
  {
    label: 'Python: búsqueda binaria corregida (usa // para el punto medio)',
    id: 'bug-busqueda-binaria',
    lang: 'python',
    code: CHALLENGES.find((c) => c.id === 'bug-busqueda-binaria')!.referenceSolution.python,
  },
];

for (const alt of correctAlternatives) {
  test(`juez simulado acepta: ${alt.label}`, () => {
    const challenge = getChallenge(alt.id);
    const res = evaluateSimulatedCode(alt.code, alt.lang, allTests(alt.id), challenge);
    assert.equal(res.passed, true, res.error ?? JSON.stringify(res.results));
  });
}

const incorrectAttempts: Alternative[] = [
  {
    label: 'Python: devuelve la entrada sin invertir',
    id: 'invertir-cadena',
    lang: 'python',
    code: 'def reverseString(s: str) -> str:\n    return s',
  },
  {
    label: 'Java: devuelve la entrada sin invertir',
    id: 'invertir-cadena',
    lang: 'java',
    code: 'class Solution {\n    public String reverseString(String s) {\n        return s;\n    }\n}',
  },
  {
    label: 'C++: devuelve la entrada sin invertir',
    id: 'invertir-cadena',
    lang: 'cpp',
    code: '#include <string>\nusing namespace std;\n\nstring reverseString(string s) {\n    return s;\n}',
  },
  {
    label: 'Python: palíndromo sin limpiar la cadena',
    id: 'palindromo-limpio',
    lang: 'python',
    code: 'def isPalindrome(s: str) -> bool:\n    return s == s[::-1]',
  },
];

for (const attempt of incorrectAttempts) {
  test(`juez simulado rechaza: ${attempt.label}`, () => {
    const challenge = getChallenge(attempt.id);
    const res = evaluateSimulatedCode(attempt.code, attempt.lang, allTests(attempt.id), challenge);
    assert.equal(res.passed, false);
  });
}

test('cuando el juez simulado no puede confirmar, explica que no ejecuta código real', () => {
  const challenge = getChallenge('invertir-cadena');
  const res = evaluateSimulatedCode(
    'def reverseString(s: str) -> str:\n    return s',
    'python',
    allTests('invertir-cadena'),
    challenge
  );
  assert.equal(res.passed, false);
  assert.equal(res.simulated, true);
  assert.match(res.error ?? '', /JavaScript/);
});

test('executePerformanceTest accepts fast O(n) code and rejects slow or wrong output', () => {
  const challenge = getChallenge('max-subarray-kadane');
  assert.ok(challenge.perf, 'max-subarray-kadane should define perf spec');

  const ok = executePerformanceTest(
    challenge.referenceSolution.javascript,
    challenge.entryPoint,
    {
      sizeLabel: challenge.perf.sizeLabel,
      args: challenge.perf.build(),
      referenceCode: challenge.referenceSolution.javascript,
      maxMs: challenge.perf.maxMs,
    }
  );
  assert.equal(ok.passed, true);

  const wrong = executePerformanceTest(
    'function maxSubArray(nums) { return 0; }',
    challenge.entryPoint,
    {
      sizeLabel: challenge.perf.sizeLabel,
      args: challenge.perf.build(),
      referenceCode: challenge.referenceSolution.javascript,
      maxMs: challenge.perf.maxMs,
    }
  );
  assert.equal(wrong.passed, false);
});
