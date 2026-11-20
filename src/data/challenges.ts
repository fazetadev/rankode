import type { Challenge } from '../types';

export const CHALLENGES: Challenge[] = [
  // =========================================================================
  // CATEGORÍA 1: LÓGICA (6 desafíos)
  // =========================================================================
  {
    id: 'fizzbuzz',
    title: 'FizzBuzz clásico',
    category: 'logic',
    difficulty: 'easy',
    xp: 50,
    tags: ['bucles', 'módulo', 'cadenas'],
    entryPoint: 'fizzBuzz',
    description:
      'Dado un entero positivo `n`, devuelve un arreglo de cadenas de longitud `n` (indexado desde 1) donde:\n\n' +
      '- Si el número es múltiplo de 3 y 5, el elemento es `"FizzBuzz"`.\n' +
      '- Si solo es múltiplo de 3, es `"Fizz"`.\n' +
      '- Si solo es múltiplo de 5, es `"Buzz"`.\n' +
      '- En cualquier otro caso, es el número convertido a cadena.',
    examples: [
      { input: 'n = 5', output: '["1", "2", "Fizz", "4", "Buzz"]' },
      {
        input: 'n = 15',
        output: '["1", "2", "Fizz", ..., "14", "FizzBuzz"]',
        explanation: 'El 15 es divisible entre 3 y 5 simultáneamente.',
      },
    ],
    constraints: ['1 <= n <= 1000', 'Todos los elementos deben ser strings'],
    hints: [
      'Evalúa primero la condición combinada (divisible por 15 o por 3 y 5 a la vez).',
      'Usa el operador módulo (%) para comprobar divisibilidad sin resto.',
      'Recorre con un bucle desde i = 1 hasta n inclusive y añade cada cadena al arreglo.',
    ],
    languages: ['javascript', 'python', 'java', 'cpp'],
    starterCode: {
      javascript: `function fizzBuzz(n) {\n  // Devuelve un arreglo de cadenas desde 1 hasta n\n  return [];\n}`,
      python: `def fizzBuzz(n: int) -> list[str]:\n    # Devuelve una lista de cadenas desde 1 hasta n\n    return []`,
      java: `import java.util.*;\n\nclass Solution {\n    public List<String> fizzBuzz(int n) {\n        List<String> result = new ArrayList<>();\n        return result;\n    }\n}`,
      cpp: `#include <vector>\n#include <string>\nusing namespace std;\n\nvector<string> fizzBuzz(int n) {\n    vector<string> result;\n    return result;\n}`,
    },
    referenceSolution: {
      javascript: `function fizzBuzz(n) {\n  const result = [];\n  for (let i = 1; i <= n; i++) {\n    if (i % 15 === 0) result.push('FizzBuzz');\n    else if (i % 3 === 0) result.push('Fizz');\n    else if (i % 5 === 0) result.push('Buzz');\n    else result.push(String(i));\n  }\n  return result;\n}`,
      python: `def fizzBuzz(n: int) -> list[str]:\n    result = []\n    for i in range(1, n + 1):\n        if i % 15 == 0:\n            result.append("FizzBuzz")\n        elif i % 3 == 0:\n            result.append("Fizz")\n        elif i % 5 == 0:\n            result.append("Buzz")\n        else:\n            result.append(str(i))\n    return result`,
      java: `import java.util.*;\n\nclass Solution {\n    public List<String> fizzBuzz(int n) {\n        List<String> result = new ArrayList<>();\n        for (int i = 1; i <= n; i++) {\n            if (i % 15 == 0) result.add("FizzBuzz");\n            else if (i % 3 == 0) result.add("Fizz");\n            else if (i % 5 == 0) result.add("Buzz");\n            else result.add(String.valueOf(i));\n        }\n        return result;\n    }\n}`,
      cpp: `#include <vector>\n#include <string>\nusing namespace std;\n\nvector<string> fizzBuzz(int n) {\n    vector<string> result;\n    for (int i = 1; i <= n; i++) {\n        if (i % 15 == 0) result.push_back("FizzBuzz");\n        else if (i % 3 == 0) result.push_back("Fizz");\n        else if (i % 5 == 0) result.push_back("Buzz");\n        else result.push_back(to_string(i));\n    }\n    return result;\n}`,
    },
    tests: {
      visible: [
        { id: 't1', input: [3], expected: ['1', '2', 'Fizz'], inputDisplay: 'n = 3', expectedDisplay: '["1", "2", "Fizz"]' },
        { id: 't2', input: [5], expected: ['1', '2', 'Fizz', '4', 'Buzz'], inputDisplay: 'n = 5', expectedDisplay: '["1", "2", "Fizz", "4", "Buzz"]' },
      ],
      hidden: [
        { id: 't3', input: [1], expected: ['1'], inputDisplay: 'n = 1', expectedDisplay: '["1"]' },
        {
          id: 't4',
          input: [15],
          expected: ['1', '2', 'Fizz', '4', 'Buzz', 'Fizz', '7', '8', 'Fizz', 'Buzz', '11', 'Fizz', '13', '14', 'FizzBuzz'],
          inputDisplay: 'n = 15',
          expectedDisplay: '["1", ..., "FizzBuzz"]',
        },
      ],
    },
    validationHints: {
      requiredTokens: {
        python: ['FizzBuzz', 'Fizz', 'Buzz', '%'],
        java: ['FizzBuzz', 'Fizz', 'Buzz', '%'],
        cpp: ['FizzBuzz', 'Fizz', 'Buzz', '%'],
      },
    },
  },
  {
    id: 'invertir-cadena',
    title: 'Invertir cadena',
    category: 'logic',
    difficulty: 'easy',
    xp: 50,
    tags: ['cadenas', 'dos punteros'],
    entryPoint: 'reverseString',
    description:
      'Dada una cadena de texto `s`, devuelve una nueva cadena con los caracteres en orden inverso.\n\n' +
      'Respeta espacios, signos de puntuación y diferencias entre mayúsculas y minúsculas.',
    examples: [
      { input: 's = "arena"', output: '"anera"' },
      { input: 's = "Hola Mundo"', output: '"odnuM aloH"' },
    ],
    constraints: ['0 <= s.length <= 10^4', 'Cadena ASCII o UTF-8 simple'],
    hints: [
      'Puedes recorrer la cadena desde el último índice hasta 0.',
      'Con dos punteros (izquierda y derecha) puedes intercambiar caracteres sobre un arreglo.',
      'No olvides manejar la cadena vacía devolver "".',
    ],
    languages: ['javascript', 'python', 'java', 'cpp'],
    starterCode: {
      javascript: `function reverseString(s) {\n  // Devuelve la cadena invertida\n  return '';\n}`,
      python: `def reverseString(s: str) -> str:\n    # Devuelve la cadena invertida\n    return ""`,
      java: `class Solution {\n    public String reverseString(String s) {\n        return "";\n    }\n}`,
      cpp: `#include <string>\nusing namespace std;\n\nstring reverseString(string s) {\n    return "";\n}`,
    },
    referenceSolution: {
      javascript: `function reverseString(s) {\n  let out = '';\n  for (let i = s.length - 1; i >= 0; i--) {\n    out += s[i];\n  }\n  return out;\n}`,
      python: `def reverseString(s: str) -> str:\n    chars = list(s)\n    left, right = 0, len(chars) - 1\n    while left < right:\n        chars[left], chars[right] = chars[right], chars[left]\n        left += 1\n        right -= 1\n    return "".join(chars)`,
      java: `class Solution {\n    public String reverseString(String s) {\n        StringBuilder sb = new StringBuilder();\n        for (int i = s.length() - 1; i >= 0; i--) {\n            sb.append(s.charAt(i));\n        }\n        return sb.toString();\n    }\n}`,
      cpp: `#include <string>\n#include <algorithm>\nusing namespace std;\n\nstring reverseString(string s) {\n    int left = 0, right = (int)s.size() - 1;\n    while (left < right) {\n        swap(s[left++], s[right--]);\n    }\n    return s;\n}`,
    },
    tests: {
      visible: [
        { id: 't1', input: ['arena'], expected: 'anera', inputDisplay: 's = "arena"', expectedDisplay: '"anera"' },
        { id: 't2', input: ['Hola Mundo'], expected: 'odnuM aloH', inputDisplay: 's = "Hola Mundo"', expectedDisplay: '"odnuM aloH"' },
      ],
      hidden: [
        { id: 't3', input: [''], expected: '', inputDisplay: 's = ""', expectedDisplay: '""' },
        { id: 't4', input: ['12345!'], expected: '!54321', inputDisplay: 's = "12345!"', expectedDisplay: '"!54321"' },
      ],
    },
    validationHints: {
      acceptedIdioms: {
        python: ['s[::-1]', 'join(reversed('],
        java: ['.reverse()'],
        cpp: ['reverse(s.begin()'],
      },
    },
  },
  {
    id: 'palindromo-limpio',
    title: 'Palíndromo alfanumérico',
    category: 'logic',
    difficulty: 'easy',
    xp: 50,
    tags: ['cadenas', 'dos punteros', 'normalización'],
    entryPoint: 'isPalindrome',
    description:
      'Dada una cadena `s`, determina si es un palíndromo considerando **únicamente caracteres alfanuméricos** (`a-z`, `0-9`) e ignorando mayúsculas, espacios y puntuación.',
    examples: [
      { input: 's = "Anita lava la tina"', output: 'true' },
      { input: 's = "race a car"', output: 'false' },
    ],
    constraints: ['0 <= s.length <= 10^4', 'Una cadena vacía o sin alfanuméricos se considera true'],
    hints: [
      'Convierte primero toda la cadena a minúsculas y filtra caracteres no alfanuméricos.',
      'Compara el carácter en la posición `left` con el de `right` avanzando hacia el centro.',
      'En JavaScript puedes limpiar con `replace(/[^a-z0-9]/gi, "").toLowerCase()`.',
    ],
    languages: ['javascript', 'python', 'java', 'cpp'],
    starterCode: {
      javascript: `function isPalindrome(s) {\n  // Devuelve true o false\n  return false;\n}`,
      python: `def isPalindrome(s: str) -> bool:\n    # Devuelve True o False\n    return False`,
      java: `class Solution {\n    public boolean isPalindrome(String s) {\n        return false;\n    }\n}`,
      cpp: `#include <string>\nusing namespace std;\n\nbool isPalindrome(string s) {\n    return false;\n}`,
    },
    referenceSolution: {
      javascript: `function isPalindrome(s) {\n  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');\n  let l = 0;\n  let r = clean.length - 1;\n  while (l < r) {\n    if (clean[l] !== clean[r]) return false;\n    l++;\n    r--;\n  }\n  return true;\n}`,
      python: `def isPalindrome(s: str) -> bool:\n    clean = [ch.lower() for ch in s if ch.isalnum()]\n    left, right = 0, len(clean) - 1\n    while left < right:\n        if clean[left] != clean[right]:\n            return False\n        left += 1\n        right -= 1\n    return True`,
      java: `class Solution {\n    public boolean isPalindrome(String s) {\n        int l = 0, r = s.length() - 1;\n        while (l < r) {\n            while (l < r && !Character.isLetterOrDigit(s.charAt(l))) l++;\n            while (l < r && !Character.isLetterOrDigit(s.charAt(r))) r--;\n            if (Character.toLowerCase(s.charAt(l)) != Character.toLowerCase(s.charAt(r))) return false;\n            l++;\n            r--;\n        }\n        return true;\n    }\n}`,
      cpp: `#include <string>\n#include <cctype>\nusing namespace std;\n\nbool isPalindrome(string s) {\n    int l = 0, r = (int)s.size() - 1;\n    while (l < r) {\n        while (l < r && !isalnum((unsigned char)s[l])) l++;\n        while (l < r && !isalnum((unsigned char)s[r])) r--;\n        if (tolower((unsigned char)s[l]) != tolower((unsigned char)s[r])) return false;\n        l++;\n        r--;\n    }\n    return true;\n}`,
    },
    tests: {
      visible: [
        { id: 't1', input: ['Anita lava la tina'], expected: true, inputDisplay: 's = "Anita lava la tina"', expectedDisplay: 'true' },
        { id: 't2', input: ['race a car'], expected: false, inputDisplay: 's = "race a car"', expectedDisplay: 'false' },
      ],
      hidden: [
        { id: 't3', input: ['A man, a plan, a canal: Panama'], expected: true, inputDisplay: 's = "A man, a plan, a canal: Panama"', expectedDisplay: 'true' },
        { id: 't4', input: ['   '], expected: true, inputDisplay: 's = "   "', expectedDisplay: 'true' },
      ],
    },
    validationHints: {
      // Evidencia de que se filtran los caracteres no alfanuméricos antes de comparar.
      acceptedIdioms: {
        python: ['isalnum()', 're.sub('],
        java: ['replaceAll(', 'isLetterOrDigit('],
        cpp: ['isalnum('],
      },
    },
  },
  {
    id: 'anagramas',
    title: 'Detector de anagramas',
    category: 'logic',
    difficulty: 'medium',
    xp: 100,
    tags: ['frecuencias', 'hash map', 'cadenas'],
    entryPoint: 'isAnagram',
    description:
      'Dadas dos cadenas `s` y `t`, devuelve `true` si `t` es un anagrama de `s` (contiene exactamente los mismos caracteres con la misma frecuencia), y `false` en caso contrario.\n\n' +
      'La comparación distingue entre mayúsculas y minúsculas, aunque todas las entradas de prueba están en minúsculas.',
    examples: [
      { input: 's = "roma", t = "amor"', output: 'true' },
      { input: 's = "rata", t = "pata"', output: 'false' },
    ],
    constraints: ['0 <= s.length, t.length <= 5 * 10^4', 'Complejidad objetivo O(n)'],
    hints: [
      'Si `s.length !== t.length`, es imposible que sean anagramas.',
      'Cuenta las apariciones de cada carácter de `s` en un mapa de frecuencias.',
      'Resta las frecuencias recorriendo `t`; si alguna baja de cero, devuelve false.',
    ],
    languages: ['javascript', 'python', 'java', 'cpp'],
    starterCode: {
      javascript: `function isAnagram(s, t) {\n  // Comprueba si t es anagrama de s\n  return false;\n}`,
      python: `def isAnagram(s: str, t: str) -> bool:\n    # Comprueba si t es anagrama de s\n    return False`,
      java: `class Solution {\n    public boolean isAnagram(String s, String t) {\n        return false;\n    }\n}`,
      cpp: `#include <string>\nusing namespace std;\n\nbool isAnagram(string s, string t) {\n    return false;\n}`,
    },
    referenceSolution: {
      javascript: `function isAnagram(s, t) {\n  if (s.length !== t.length) return false;\n  const counts = {};\n  for (let i = 0; i < s.length; i++) {\n    counts[s[i]] = (counts[s[i]] || 0) + 1;\n  }\n  for (let i = 0; i < t.length; i++) {\n    if (!counts[t[i]]) return false;\n    counts[t[i]]--;\n  }\n  return true;\n}`,
      python: `def isAnagram(s: str, t: str) -> bool:\n    if len(s) != len(t):\n        return False\n    counts = {}\n    for ch in s:\n        counts[ch] = counts.get(ch, 0) + 1\n    for ch in t:\n        if counts.get(ch, 0) == 0:\n            return False\n        counts[ch] -= 1\n    return True`,
      java: `import java.util.*;\n\nclass Solution {\n    public boolean isAnagram(String s, String t) {\n        if (s.length() != t.length()) return false;\n        Map<Character, Integer> counts = new HashMap<>();\n        for (char c : s.toCharArray()) counts.put(c, counts.getOrDefault(c, 0) + 1);\n        for (char c : t.toCharArray()) {\n            int rem = counts.getOrDefault(c, 0);\n            if (rem == 0) return false;\n            counts.put(c, rem - 1);\n        }\n        return true;\n    }\n}`,
      cpp: `#include <string>\n#include <unordered_map>\nusing namespace std;\n\nbool isAnagram(string s, string t) {\n    if (s.size() != t.size()) return false;\n    unordered_map<char, int> counts;\n    for (char c : s) counts[c]++;\n    for (char c : t) {\n        if (counts[c] == 0) return false;\n        counts[c]--;\n    }\n    return true;\n}`,
    },
    tests: {
      visible: [
        { id: 't1', input: ['roma', 'amor'], expected: true, inputDisplay: 's = "roma", t = "amor"', expectedDisplay: 'true' },
        { id: 't2', input: ['rata', 'pata'], expected: false, inputDisplay: 's = "rata", t = "pata"', expectedDisplay: 'false' },
      ],
      hidden: [
        { id: 't3', input: ['aabbcc', 'abcabc'], expected: true, inputDisplay: 's = "aabbcc", t = "abcabc"', expectedDisplay: 'true' },
        { id: 't4', input: ['ab', 'a'], expected: false, inputDisplay: 's = "ab", t = "a"', expectedDisplay: 'false' },
      ],
    },
    validationHints: {
      // Alternativas habituales: ordenar ambas cadenas y compararlas, o comparar contadores.
      acceptedIdioms: {
        python: ['sorted(s)==sorted(t)', 'Counter(s)==Counter(t)'],
        java: ['Arrays.equals('],
        cpp: ['sort(s.begin()'],
      },
    },
  },
  {
    id: 'parentesis-balanceados',
    title: 'Paréntesis balanceados',
    category: 'logic',
    difficulty: 'medium',
    xp: 100,
    tags: ['pila', 'cadenas', 'validación'],
    entryPoint: 'isValidBrackets',
    description:
      'Dada una cadena `s` que contiene únicamente los caracteres `(`, `)`, `{`, `}`, `[` y `]`, determina si la secuencia está correctamente balanceada.\n\n' +
      'Todo delimitador abierto debe cerrarse con el tipo correspondiente y en el orden exacto.',
    examples: [
      { input: 's = "({[]})"', output: 'true' },
      { input: 's = "([)]"', output: 'false' },
    ],
    constraints: ['1 <= s.length <= 10^4', 'Solo caracteres (){}[]'],
    hints: [
      'Utiliza una pila (stack) para ir almacenando los delimitadores de apertura.',
      'Al encontrar un carácter de cierre, verifica que coincida con el tope de la pila.',
      'Al finalizar el recorrido, la pila debe quedar completamente vacía.',
    ],
    languages: ['javascript', 'python', 'java', 'cpp'],
    starterCode: {
      javascript: `function isValidBrackets(s) {\n  // Valida si los delimitadores están balanceados\n  return false;\n}`,
      python: `def isValidBrackets(s: str) -> bool:\n    # Valida si los delimitadores están balanceados\n    return False`,
      java: `import java.util.*;\n\nclass Solution {\n    public boolean isValidBrackets(String s) {\n        return false;\n    }\n}`,
      cpp: `#include <string>\nusing namespace std;\n\nbool isValidBrackets(string s) {\n    return false;\n}`,
    },
    referenceSolution: {
      javascript: `function isValidBrackets(s) {\n  const pairs = { ')': '(', ']': '[', '}': '{' };\n  const stack = [];\n  for (const ch of s) {\n    if (ch === '(' || ch === '[' || ch === '{') {\n      stack.push(ch);\n    } else if (stack.pop() !== pairs[ch]) {\n      return false;\n    }\n  }\n  return stack.length === 0;\n}`,
      python: `def isValidBrackets(s: str) -> bool:\n    pairs = {")": "(", "]": "[", "}": "{"}\n    stack = []\n    for ch in s:\n        if ch in "([{":\n            stack.append(ch)\n        elif not stack or stack.pop() != pairs.get(ch):\n            return False\n    return len(stack) == 0`,
      java: `import java.util.*;\n\nclass Solution {\n    public boolean isValidBrackets(String s) {\n        Deque<Character> stack = new ArrayDeque<>();\n        for (char ch : s.toCharArray()) {\n            if (ch == '(' || ch == '[' || ch == '{') stack.push(ch);\n            else {\n                if (stack.isEmpty()) return false;\n                char open = stack.pop();\n                if ((ch == ')' && open != '(') || (ch == ']' && open != '[') || (ch == '}' && open != '{')) return false;\n            }\n        }\n        return stack.isEmpty();\n    }\n}`,
      cpp: `#include <string>\n#include <stack>\nusing namespace std;\n\nbool isValidBrackets(string s) {\n    stack<char> st;\n    for (char ch : s) {\n        if (ch == '(' || ch == '[' || ch == '{') st.push(ch);\n        else {\n            if (st.empty()) return false;\n            char open = st.top(); st.pop();\n            if ((ch == ')' && open != '(') || (ch == ']' && open != '[') || (ch == '}' && open != '{')) return false;\n        }\n    }\n    return st.empty();\n}`,
    },
    tests: {
      visible: [
        { id: 't1', input: ['({[]})'], expected: true, inputDisplay: 's = "({[]})"', expectedDisplay: 'true' },
        { id: 't2', input: ['([)]'], expected: false, inputDisplay: 's = "([)]"', expectedDisplay: 'false' },
      ],
      hidden: [
        { id: 't3', input: ['()[]{}'], expected: true, inputDisplay: 's = "()[]{}"', expectedDisplay: 'true' },
        { id: 't4', input: ['((('], expected: false, inputDisplay: 's = "((("', expectedDisplay: 'false' },
        { id: 't5', input: [']'], expected: false, inputDisplay: 's = "]"', expectedDisplay: 'false' },
      ],
    },
  },
  {
    id: 'numeros-romanos',
    title: 'Conversor de números romanos',
    category: 'logic',
    difficulty: 'hard',
    xp: 200,
    tags: ['cadenas', 'diccionarios', 'lógica'],
    entryPoint: 'romanToInt',
    description:
      'Dado un numeral romano válido `s` (en mayúsculas, entre `1` y `3999`), conviértelo a su valor entero.\n\n' +
      'Recuerda las reglas de sustracción: si un símbolo de menor valor precede a uno de mayor valor (`IV`, `IX`, `XL`, `XC`, `CD`, `CM`), su valor se resta en lugar de sumarse.',
    examples: [
      { input: 's = "XIV"', output: '14' },
      { input: 's = "MCMXCIV"', output: '1994', explanation: '1000 + (1000 - 100) + (100 - 10) + (5 - 1)' },
    ],
    constraints: ['1 <= s.length <= 15', 'Símbolos válidos: I, V, X, L, C, D, M'],
    hints: [
      'Crea un mapa con los 7 símbolos y sus valores numéricos.',
      'Recorre de izquierda a derecha comparando `valor[i]` con `valor[i + 1]`.',
      'Si `valor[i] < valor[i + 1]`, resta `valor[i]` del acumulado; en caso contrario, súmalo.',
    ],
    languages: ['javascript', 'python', 'java', 'cpp'],
    starterCode: {
      javascript: `function romanToInt(s) {\n  // Convierte la cadena romana en entero\n  return 0;\n}`,
      python: `def romanToInt(s: str) -> int:\n    # Convierte la cadena romana en entero\n    return 0`,
      java: `class Solution {\n    public int romanToInt(String s) {\n        return 0;\n    }\n}`,
      cpp: `#include <string>\nusing namespace std;\n\nint romanToInt(string s) {\n    return 0;\n}`,
    },
    referenceSolution: {
      javascript: `function romanToInt(s) {\n  const map = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };\n  let total = 0;\n  for (let i = 0; i < s.length; i++) {\n    const curr = map[s[i]];\n    const next = map[s[i + 1]] || 0;\n    if (curr < next) total -= curr;\n    else total += curr;\n  }\n  return total;\n}`,
      python: `def romanToInt(s: str) -> int:\n    values = {"I": 1, "V": 5, "X": 10, "L": 50, "C": 100, "D": 500, "M": 1000}\n    total = 0\n    for i, ch in enumerate(s):\n        curr = values[ch]\n        nxt = values[s[i + 1]] if i + 1 < len(s) else 0\n        if curr < nxt:\n            total -= curr\n        else:\n            total += curr\n    return total`,
      java: `import java.util.*;\n\nclass Solution {\n    public int romanToInt(String s) {\n        Map<Character, Integer> values = Map.of('I', 1, 'V', 5, 'X', 10, 'L', 50, 'C', 100, 'D', 500, 'M', 1000);\n        int total = 0;\n        for (int i = 0; i < s.length(); i++) {\n            int curr = values.get(s.charAt(i));\n            int next = i + 1 < s.length() ? values.get(s.charAt(i + 1)) : 0;\n            total += (curr < next) ? -curr : curr;\n        }\n        return total;\n    }\n}`,
      cpp: `#include <string>\n#include <unordered_map>\nusing namespace std;\n\nint romanToInt(string s) {\n    unordered_map<char, int> values = {{'I',1},{'V',5},{'X',10},{'L',50},{'C',100},{'D',500},{'M',1000}};\n    int total = 0;\n    for (size_t i = 0; i < s.size(); i++) {\n        int curr = values[s[i]];\n        int next = (i + 1 < s.size()) ? values[s[i + 1]] : 0;\n        total += (curr < next) ? -curr : curr;\n    }\n    return total;\n}`,
    },
    tests: {
      visible: [
        { id: 't1', input: ['XIV'], expected: 14, inputDisplay: 's = "XIV"', expectedDisplay: '14' },
        { id: 't2', input: ['MCMXCIV'], expected: 1994, inputDisplay: 's = "MCMXCIV"', expectedDisplay: '1994' },
      ],
      hidden: [
        { id: 't3', input: ['III'], expected: 3, inputDisplay: 's = "III"', expectedDisplay: '3' },
        { id: 't4', input: ['CDXLIV'], expected: 444, inputDisplay: 's = "CDXLIV"', expectedDisplay: '444' },
        { id: 't5', input: ['MMMCMXCIX'], expected: 3999, inputDisplay: 's = "MMMCMXCIX"', expectedDisplay: '3999' },
      ],
    },
  },

  // =========================================================================
  // CATEGORÍA 2: DEBUGGING (6 desafíos)
  // =========================================================================
  {
    id: 'bug-off-by-one',
    title: 'Bug: Bucle fuera de rango',
    category: 'debugging',
    difficulty: 'easy',
    xp: 50,
    tags: ['debugging', 'off-by-one', 'arrays'],
    entryPoint: 'sumRange',
    description:
      'La función `sumRange(nums, start, end)` debe devolver la suma de todos los elementos de `nums` entre los índices `start` y `end` **ambos inclusive**.\n\n' +
      'El código actual tiene un error clásico *off-by-one* y omite el último elemento del rango (además de no validar límites). Encuentra y corrige el bug.',
    examples: [
      { input: 'nums = [2, 4, 6, 8], start = 1, end = 3', output: '18', explanation: '4 + 6 + 8 = 18' },
      { input: 'nums = [10, 20, 30], start = 0, end = 0', output: '10' },
    ],
    constraints: ['0 <= start <= end < nums.length', 'nums contiene al menos 1 entero'],
    hints: [
      'Fíjate en la condición de parada del bucle `for`: `i < end` excluye el índice `end`.',
      'Cambia la condición a `i <= end` asegurando que `end` no supere `nums.length - 1`.',
      'Comprueba el caso cuando `start === end`: debe sumar exactamente ese elemento.',
    ],
    languages: ['javascript', 'python', 'java', 'cpp'],
    starterCode: {
      javascript: `function sumRange(nums, start, end) {\n  let total = 0;\n  for (let i = start; i < end; i++) {\n    total += nums[i];\n  }\n  return total;\n}`,
      python: `def sumRange(nums: list[int], start: int, end: int) -> int:\n    total = 0\n    for i in range(start, end):\n        total += nums[i]\n    return total`,
      java: `class Solution {\n    public int sumRange(int[] nums, int start, int end) {\n        int total = 0;\n        for (int i = start; i < end; i++) {\n            total += nums[i];\n        }\n        return total;\n    }\n}`,
      cpp: `#include <vector>\nusing namespace std;\n\nint sumRange(vector<int> nums, int start, int end) {\n    int total = 0;\n    for (int i = start; i < end; i++) {\n        total += nums[i];\n    }\n    return total;\n}`,
    },
    referenceSolution: {
      javascript: `function sumRange(nums, start, end) {\n  let total = 0;\n  const limit = Math.min(end, nums.length - 1);\n  for (let i = Math.max(0, start); i <= limit; i++) {\n    total += nums[i];\n  }\n  return total;\n}`,
      python: `def sumRange(nums: list[int], start: int, end: int) -> int:\n    total = 0\n    limit = min(end, len(nums) - 1)\n    for i in range(max(0, start), limit + 1):\n        total += nums[i]\n    return total`,
      java: `class Solution {\n    public int sumRange(int[] nums, int start, int end) {\n        int total = 0;\n        int limit = Math.min(end, nums.length - 1);\n        for (int i = Math.max(0, start); i <= limit; i++) {\n            total += nums[i];\n        }\n        return total;\n    }\n}`,
      cpp: `#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint sumRange(vector<int> nums, int start, int end) {\n    int total = 0;\n    int limit = min(end, (int)nums.size() - 1);\n    for (int i = max(0, start); i <= limit; i++) {\n        total += nums[i];\n    }\n    return total;\n}`,
    },
    tests: {
      visible: [
        { id: 't1', input: [[2, 4, 6, 8], 1, 3], expected: 18, inputDisplay: 'nums = [2,4,6,8], start = 1, end = 3', expectedDisplay: '18' },
        { id: 't2', input: [[10, 20, 30], 0, 0], expected: 10, inputDisplay: 'nums = [10,20,30], start = 0, end = 0', expectedDisplay: '10' },
      ],
      hidden: [
        { id: 't3', input: [[-5, 5, 10, -2], 0, 3], expected: 8, inputDisplay: 'nums = [-5,5,10,-2], start = 0, end = 3', expectedDisplay: '8' },
        { id: 't4', input: [[7], 0, 0], expected: 7, inputDisplay: 'nums = [7], start = 0, end = 0', expectedDisplay: '7' },
      ],
    },
    validationHints: {
      forbiddenSubstrings: {
        python: ['range(start, end)'],
        java: ['i < end;'],
        cpp: ['i < end;'],
      },
    },
  },
  {
    id: 'bug-comparacion-estricta',
    title: 'Bug: Comparación no estricta',
    category: 'debugging',
    difficulty: 'easy',
    xp: 50,
    tags: ['debugging', 'tipos', 'igualdad'],
    entryPoint: 'countExactMatches',
    description:
      'La función `countExactMatches(items, target)` debe contar cuántas veces aparece `target` en `items` **respetando estrictamente el tipo de dato** (por ejemplo, `0` no debe coincidir con `false`, `""` ni `"0"`).\n\n' +
      'El código inicial usa igualdad débil / lógica laxa y produce falsos positivos. Corrígelo.',
    examples: [
      { input: 'items = [0, false, "0", "", 0], target = 0', output: '2' },
      { input: 'items = [1, true, "1"], target = true', output: '1' },
    ],
    constraints: ['0 <= items.length <= 5000', 'Comparación estricta de valor y tipo'],
    hints: [
      'En JavaScript, `0 == false` y `0 == ""` evalúan a `true` por coerción de tipos.',
      'Reemplaza `==` por `===` (o `Object.is` si hubiera NaN).',
      'En Python recuerda que `isinstance(True, int)` y `True == 1` es verdadero: verifica el tipo exacto.',
    ],
    languages: ['javascript', 'python', 'java', 'cpp'],
    starterCode: {
      javascript: `function countExactMatches(items, target) {\n  let count = 0;\n  for (const item of items) {\n    if (item == target) {\n      count++;\n    }\n  }\n  return count;\n}`,
      python: `def countExactMatches(items: list, target) -> int:\n    count = 0\n    for item in items:\n        if item == target:\n            count += 1\n    return count`,
      java: `import java.util.*;\n\nclass Solution {\n    public int countExactMatches(List<Object> items, Object target) {\n        int count = 0;\n        for (Object item : items) {\n            if (String.valueOf(item).equals(String.valueOf(target))) {\n                count++;\n            }\n        }\n        return count;\n    }\n}`,
      cpp: `#include <vector>\n#include <string>\nusing namespace std;\n\nint countExactMatches(vector<string> items, string target) {\n    int count = 0;\n    for (const auto& item : items) {\n        if (item.find(target) != string::npos) count++;\n    }\n    return count;\n}`,
    },
    referenceSolution: {
      javascript: `function countExactMatches(items, target) {\n  let count = 0;\n  for (const item of items) {\n    if (item === target) {\n      count++;\n    }\n  }\n  return count;\n}`,
      python: `def countExactMatches(items: list, target) -> int:\n    count = 0\n    for item in items:\n        if type(item) is type(target) and item == target:\n            count += 1\n    return count`,
      java: `import java.util.*;\n\nclass Solution {\n    public int countExactMatches(List<Object> items, Object target) {\n        int count = 0;\n        for (Object item : items) {\n            if (Objects.equals(item, target)) {\n                count++;\n            }\n        }\n        return count;\n    }\n}`,
      cpp: `#include <vector>\n#include <string>\nusing namespace std;\n\nint countExactMatches(vector<string> items, string target) {\n    int count = 0;\n    for (const auto& item : items) {\n        if (item == target) count++;\n    }\n    return count;\n}`,
    },
    tests: {
      visible: [
        { id: 't1', input: [[0, false, '0', '', 0], 0], expected: 2, inputDisplay: 'items = [0, false, "0", "", 0], target = 0', expectedDisplay: '2' },
        { id: 't2', input: [[1, true, '1'], true], expected: 1, inputDisplay: 'items = [1, true, "1"], target = true', expectedDisplay: '1' },
      ],
      hidden: [
        { id: 't3', input: [[null, undefined, 0, ''], null], expected: 1, inputDisplay: 'items = [null, undefined, 0, ""], target = null', expectedDisplay: '1' },
        { id: 't4', input: [['a', 'b', 'c'], 'd'], expected: 0, inputDisplay: 'items = ["a","b","c"], target = "d"', expectedDisplay: '0' },
      ],
    },
    validationHints: {
      forbiddenSubstrings: {
        python: ['if item == target:'],
        java: ['String.valueOf(item).equals'],
        cpp: ['item.find(target)'],
      },
    },
  },
  {
    id: 'bug-mutacion-referencia',
    title: 'Bug: Mutación de referencia',
    category: 'debugging',
    difficulty: 'medium',
    xp: 100,
    tags: ['debugging', 'inmutabilidad', 'ordenación'],
    entryPoint: 'topKWithoutMutating',
    description:
      'Dado un arreglo `nums` y un entero `k`, devuelve un objeto `{ topK, originalFirst }` donde `topK` son los `k` números mayores ordenados de mayor a menor, y `originalFirst` es el primer elemento de `nums` **sin haber mutado el arreglo original**.\n\n' +
      'El código actual ordena `nums` *in-place* (y además ordena lexicográficamente en JS), alterando `nums[0]`. Corrígelo.',
    examples: [
      { input: 'nums = [3, 10, 2, 25], k = 2', output: '{ topK: [25, 10], originalFirst: 3 }' },
    ],
    constraints: ['1 <= k <= nums.length <= 10^4'],
    hints: [
      'En JavaScript `Array.prototype.sort()` muta el arreglo original y sin comparador ordena como texto (`"10" < "2"`).',
      'Crea una copia con `[...nums]` antes de ordenar con `(a, b) => b - a`.',
      'Lee `nums[0]` antes o después sin haber alterado `nums`.',
    ],
    languages: ['javascript', 'python', 'java', 'cpp'],
    starterCode: {
      javascript: `function topKWithoutMutating(nums, k) {\n  const sorted = nums.sort();\n  return {\n    topK: sorted.slice(0, k),\n    originalFirst: nums[0],\n  };\n}`,
      python: `def topKWithoutMutating(nums: list[int], k: int) -> dict:\n    nums.sort(reverse=True)\n    return {"topK": nums[:k], "originalFirst": nums[0]}`,
      java: `import java.util.*;\n\nclass Solution {\n    public List<Integer> topKWithoutMutating(int[] nums, int k) {\n        Arrays.sort(nums);\n        List<Integer> res = new ArrayList<>();\n        for (int i = 0; i < k; i++) res.add(nums[i]);\n        return res;\n    }\n}`,
      cpp: `#include <vector>\n#include <algorithm>\nusing namespace std;\n\nvector<int> topKWithoutMutating(vector<int>& nums, int k) {\n    sort(nums.begin(), nums.end());\n    return vector<int>(nums.begin(), nums.begin() + k);\n}`,
    },
    referenceSolution: {
      javascript: `function topKWithoutMutating(nums, k) {\n  const originalFirst = nums[0];\n  const sorted = [...nums].sort((a, b) => b - a);\n  return {\n    topK: sorted.slice(0, k),\n    originalFirst,\n  };\n}`,
      python: `def topKWithoutMutating(nums: list[int], k: int) -> dict:\n    original_first = nums[0]\n    ordered = sorted(nums, reverse=True)\n    return {"topK": ordered[:k], "originalFirst": original_first}`,
      java: `import java.util.*;\n\nclass Solution {\n    public List<Integer> topKWithoutMutating(int[] nums, int k) {\n        int[] copy = Arrays.copyOf(nums, nums.length);\n        Arrays.sort(copy);\n        List<Integer> res = new ArrayList<>();\n        for (int i = copy.length - 1; i >= copy.length - k; i--) {\n            res.add(copy[i]);\n        }\n        return res;\n    }\n}`,
      cpp: `#include <vector>\n#include <algorithm>\nusing namespace std;\n\nvector<int> topKWithoutMutating(const vector<int>& nums, int k) {\n    vector<int> copy = nums;\n    sort(copy.rbegin(), copy.rend());\n    return vector<int>(copy.begin(), copy.begin() + k);\n}`,
    },
    tests: {
      visible: [
        { id: 't1', input: [[3, 10, 2, 25], 2], expected: { topK: [25, 10], originalFirst: 3 }, inputDisplay: 'nums = [3, 10, 2, 25], k = 2', expectedDisplay: '{ topK: [25, 10], originalFirst: 3 }' },
      ],
      hidden: [
        { id: 't2', input: [[100, 9, 20, 5], 3], expected: { topK: [100, 20, 9], originalFirst: 100 }, inputDisplay: 'nums = [100, 9, 20, 5], k = 3', expectedDisplay: '{ topK: [100, 20, 9], originalFirst: 100 }' },
        { id: 't3', input: [[-10, -2, -30], 2], expected: { topK: [-2, -10], originalFirst: -10 }, inputDisplay: 'nums = [-10, -2, -30], k = 2', expectedDisplay: '{ topK: [-2, -10], originalFirst: -10 }' },
      ],
    },
    validationHints: {
      forbiddenSubstrings: {
        python: ['nums.sort('],
        java: ['Arrays.sort(nums)'],
        cpp: ['sort(nums.begin()'],
      },
    },
  },
  {
    id: 'bug-busqueda-binaria',
    title: 'Bug: Búsqueda binaria infinita',
    category: 'debugging',
    difficulty: 'medium',
    xp: 100,
    tags: ['debugging', 'búsqueda binaria', 'bucles'],
    entryPoint: 'binarySearch',
    description:
      'La función `binarySearch(nums, target)` debe devolver el índice de `target` en un arreglo ordenado ascendentemente, o `-1` si no existe.\n\n' +
      'El código actual entra en bucle infinito o devuelve `-1` erróneamente por actualizaciones incorrectas de los punteros. Encuentra y corrige los errores.',
    examples: [
      { input: 'nums = [1, 3, 5, 7, 9], target = 7', output: '3' },
      { input: 'nums = [1, 3, 5, 7, 9], target = 4', output: '-1' },
    ],
    constraints: ['0 <= nums.length <= 10^4', 'Complejidad O(log n)'],
    hints: [
      'Al descartar `mid`, debes mover `left = mid + 1` y `right = mid - 1` (no igualarlos a `mid`).',
      'La condición del bucle debe ser `left <= right` para evaluar el caso de un único elemento restante.',
      'Calcula `mid` usando división entera: `Math.floor((left + right) / 2)`.',
    ],
    languages: ['javascript', 'python', 'java', 'cpp'],
    starterCode: {
      javascript: `function binarySearch(nums, target) {\n  let left = 0;\n  let right = nums.length - 1;\n  while (left < right) {\n    const mid = Math.floor((left + right) / 2);\n    if (nums[mid] === target) return mid;\n    if (nums[mid] < target) left = mid;\n    else right = mid;\n  }\n  return -1;\n}`,
      python: `def binarySearch(nums: list[int], target: int) -> int:\n    left, right = 0, len(nums) - 1\n    while left < right:\n        mid = (left + right) // 2\n        if nums[mid] == target:\n            return mid\n        if nums[mid] < target:\n            left = mid\n        else:\n            right = mid\n    return -1`,
      java: `class Solution {\n    public int binarySearch(int[] nums, int target) {\n        int left = 0, right = nums.length - 1;\n        while (left < right) {\n            int mid = (left + right) / 2;\n            if (nums[mid] == target) return mid;\n            if (nums[mid] < target) left = mid;\n            else right = mid;\n        }\n        return -1;\n    }\n}`,
      cpp: `#include <vector>\nusing namespace std;\n\nint binarySearch(vector<int> nums, int target) {\n    int left = 0, right = (int)nums.size() - 1;\n    while (left < right) {\n        int mid = (left + right) / 2;\n        if (nums[mid] == target) return mid;\n        if (nums[mid] < target) left = mid;\n        else right = mid;\n    }\n    return -1;\n}`,
    },
    referenceSolution: {
      javascript: `function binarySearch(nums, target) {\n  let left = 0;\n  let right = nums.length - 1;\n  while (left <= right) {\n    const mid = Math.floor((left + right) / 2);\n    if (nums[mid] === target) return mid;\n    if (nums[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  return -1;\n}`,
      python: `def binarySearch(nums: list[int], target: int) -> int:\n    left, right = 0, len(nums) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if nums[mid] == target:\n            return mid\n        if nums[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1`,
      java: `class Solution {\n    public int binarySearch(int[] nums, int target) {\n        int left = 0, right = nums.length - 1;\n        while (left <= right) {\n            int mid = left + (right - left) / 2;\n            if (nums[mid] == target) return mid;\n            if (nums[mid] < target) left = mid + 1;\n            else right = mid - 1;\n        }\n        return -1;\n    }\n}`,
      cpp: `#include <vector>\nusing namespace std;\n\nint binarySearch(vector<int> nums, int target) {\n    int left = 0, right = (int)nums.size() - 1;\n    while (left <= right) {\n        int mid = left + (right - left) / 2;\n        if (nums[mid] == target) return mid;\n        if (nums[mid] < target) left = mid + 1;\n        else right = mid - 1;\n    }\n    return -1;\n}`,
    },
    tests: {
      visible: [
        { id: 't1', input: [[1, 3, 5, 7, 9], 7], expected: 3, inputDisplay: 'nums = [1,3,5,7,9], target = 7', expectedDisplay: '3' },
        { id: 't2', input: [[1, 3, 5, 7, 9], 4], expected: -1, inputDisplay: 'nums = [1,3,5,7,9], target = 4', expectedDisplay: '-1' },
      ],
      hidden: [
        { id: 't3', input: [[5], 5], expected: 0, inputDisplay: 'nums = [5], target = 5', expectedDisplay: '0' },
        { id: 't4', input: [[], 1], expected: -1, inputDisplay: 'nums = [], target = 1', expectedDisplay: '-1' },
        { id: 't5', input: [[2, 4, 6, 8], 8], expected: 3, inputDisplay: 'nums = [2,4,6,8], target = 8', expectedDisplay: '3' },
      ],
    },
    validationHints: {
      forbiddenSubstrings: {
        python: ['left = mid\n', 'right = mid\n'],
        java: ['left = mid;', 'right = mid;'],
        cpp: ['left = mid;', 'right = mid;'],
      },
      requiredTokens: {
        python: ['mid + 1', 'mid - 1'],
        java: ['mid + 1', 'mid - 1'],
        cpp: ['mid + 1', 'mid - 1'],
      },
    },
  },
  {
    id: 'bug-aplanado-profundo',
    title: 'Bug: Aplanado recursivo',
    category: 'debugging',
    difficulty: 'hard',
    xp: 200,
    tags: ['debugging', 'recursión', 'arrays'],
    entryPoint: 'flattenArray',
    description:
      'La función `flattenArray(arr)` debe aplanar un arreglo con múltiples niveles de anidamiento en un único arreglo plano, preservando todos los valores (incluidos `0`, `false` y `""`).\n\n' +
      'El código inicial descarta valores falsy y no concatena correctamente las llamadas recursivas. Corrígelo sin usar `.flat(Infinity)`.',
    examples: [
      { input: 'arr = [1, [0, [false, 2]], "", [3]]', output: '[1, 0, false, 2, "", 3]' },
    ],
    constraints: ['Profundidad máxima de anidación <= 100', 'Preservar orden y valores falsy'],
    hints: [
      'La comprobación `if (item)` descarta `0`, `false` y `""`. Elimínala.',
      'Cuando `Array.isArray(item)` es verdadero, añade los elementos devueltos por `flattenArray(item)` con `result.push(...flattenArray(item))`.',
      'Comprueba un arreglo vacío `[]` dentro de otro arreglo: no debe insertar nada.',
    ],
    languages: ['javascript', 'python', 'java', 'cpp'],
    starterCode: {
      javascript: `function flattenArray(arr) {\n  const result = [];\n  for (const item of arr) {\n    if (Array.isArray(item)) {\n      result.push(flattenArray(item));\n    } else if (item) {\n      result.push(item);\n    }\n  }\n  return result;\n}`,
      python: `def flattenArray(arr: list) -> list:\n    result = []\n    for item in arr:\n        if isinstance(item, list):\n            result.append(flattenArray(item))\n        elif item:\n            result.append(item)\n    return result`,
      java: `import java.util.*;\n\nclass Solution {\n    public List<Object> flattenArray(List<Object> arr) {\n        List<Object> result = new ArrayList<>();\n        for (Object item : arr) {\n            if (item instanceof List) result.add(flattenArray((List<Object>) item));\n            else if (item != null) result.add(item);\n        }\n        return result;\n    }\n}`,
      cpp: `#include <vector>\nusing namespace std;\n\n// En C++ plano simulado: fusiona subvectores filtrando correctamente\nvector<int> flattenArray(const vector<vector<int>>& arr) {\n    vector<int> result;\n    for (const auto& sub : arr) {\n        if (!sub.empty()) result.push_back(sub[0]);\n    }\n    return result;\n}`,
    },
    referenceSolution: {
      javascript: `function flattenArray(arr) {\n  const result = [];\n  for (const item of arr) {\n    if (Array.isArray(item)) {\n      result.push(...flattenArray(item));\n    } else {\n      result.push(item);\n    }\n  }\n  return result;\n}`,
      python: `def flattenArray(arr: list) -> list:\n    result = []\n    for item in arr:\n        if isinstance(item, list):\n            result.extend(flattenArray(item))\n        else:\n            result.append(item)\n    return result`,
      java: `import java.util.*;\n\nclass Solution {\n    @SuppressWarnings("unchecked")\n    public List<Object> flattenArray(List<Object> arr) {\n        List<Object> result = new ArrayList<>();\n        for (Object item : arr) {\n            if (item instanceof List) {\n                result.addAll(flattenArray((List<Object>) item));\n            } else {\n                result.add(item);\n            }\n        }\n        return result;\n    }\n}`,
      cpp: `#include <vector>\nusing namespace std;\n\nvector<int> flattenArray(const vector<vector<int>>& arr) {\n    vector<int> result;\n    for (const auto& sub : arr) {\n        for (int val : sub) result.push_back(val);\n    }\n    return result;\n}`,
    },
    tests: {
      visible: [
        { id: 't1', input: [[1, [0, [false, 2]], '', [3]]], expected: [1, 0, false, 2, '', 3], inputDisplay: 'arr = [1, [0, [false, 2]], "", [3]]', expectedDisplay: '[1, 0, false, 2, "", 3]' },
      ],
      hidden: [
        { id: 't2', input: [[[], [[[]]], 4]], expected: [4], inputDisplay: 'arr = [[], [[[]]], 4]', expectedDisplay: '[4]' },
        { id: 't3', input: [[[1, 2], [3, [4, 5]]]], expected: [1, 2, 3, 4, 5], inputDisplay: 'arr = [[1, 2], [3, [4, 5]]]', expectedDisplay: '[1, 2, 3, 4, 5]' },
      ],
    },
    validationHints: {
      forbiddenSubstrings: {
        python: ['result.append(flattenArray'],
        java: ['result.add(flattenArray'],
        cpp: ['sub[0]'],
      },
      requiredTokens: {
        python: ['extend'],
        java: ['addAll'],
      },
    },
  },
  {
    id: 'bug-lru-eviction',
    title: 'Bug: Caché LRU y expulsión',
    category: 'debugging',
    difficulty: 'expert',
    xp: 350,
    tags: ['debugging', 'caché', 'map', 'diseño'],
    entryPoint: 'simulateLRU',
    description:
      'La función `simulateLRU(capacity, ops)` ejecuta una secuencia de operaciones sobre una caché LRU (*Least Recently Used*) con capacidad máxima `capacity`.\n\n' +
      'Cada operación es `["put", key, value]` o `["get", key]`. Devuelve un arreglo con los resultados de todos los `"get"` (`-1` si la clave no está). El código actual **no actualiza la recencia al hacer `get` ni al sobrescribir una clave existente en `put`**, provocando expulsiones erróneas.',
    examples: [
      {
        input: 'capacity = 2, ops = [["put",1,1],["put",2,2],["get",1],["put",3,3],["get",2]]',
        output: '[1, -1]',
        explanation: 'Al consultar 1 pasa a ser el más reciente, así que al insertar 3 se expulsa el 2.',
      },
    ],
    constraints: ['1 <= capacity <= 1000', '1 <= ops.length <= 5000'],
    hints: [
      'En JavaScript, `Map` mantiene el orden de inserción: eliminar y volver a insertar mueve una clave al final (más reciente).',
      'En `get(key)`, si existe, debes borrarla y reinsertarla antes de devolver su valor.',
      'En `put(key, val)`, si la clave ya existía, bórrala antes de insertarla para no superar la capacidad ni dejarla vieja.',
    ],
    languages: ['javascript', 'python', 'java', 'cpp'],
    starterCode: {
      javascript: `function simulateLRU(capacity, ops) {\n  const cache = new Map();\n  const output = [];\n  for (const op of ops) {\n    if (op[0] === 'get') {\n      const key = op[1];\n      output.push(cache.has(key) ? cache.get(key) : -1);\n    } else {\n      const [, key, val] = op;\n      if (cache.size >= capacity) {\n        const oldest = cache.keys().next().value;\n        cache.delete(oldest);\n      }\n      cache.set(key, val);\n    }\n  }\n  return output;\n}`,
      python: `from collections import OrderedDict\n\ndef simulateLRU(capacity: int, ops: list) -> list[int]:\n    cache = OrderedDict()\n    output = []\n    for op in ops:\n        if op[0] == "get":\n            key = op[1]\n            output.append(cache[key] if key in cache else -1)\n        else:\n            key, val = op[1], op[2]\n            if len(cache) >= capacity:\n                cache.popitem(last=False)\n            cache[key] = val\n    return output`,
      java: `import java.util.*;\n\nclass Solution {\n    public List<Integer> simulateLRU(int capacity, List<int[]> ops) {\n        LinkedHashMap<Integer, Integer> cache = new LinkedHashMap<>(capacity, 0.75f, false);\n        List<Integer> output = new ArrayList<>();\n        for (int[] op : ops) {\n            if (op[0] == 0) output.add(cache.getOrDefault(op[1], -1));\n            else {\n                if (cache.size() >= capacity) {\n                    Integer oldest = cache.keySet().iterator().next();\n                    cache.remove(oldest);\n                }\n                cache.put(op[1], op[2]);\n            }\n        }\n        return output;\n    }\n}`,
      cpp: `#include <vector>\n#include <unordered_map>\n#include <list>\nusing namespace std;\n\nvector<int> simulateLRU(int capacity, vector<vector<int>> ops) {\n    unordered_map<int, int> cache;\n    vector<int> output;\n    for (auto& op : ops) {\n        if (op[0] == 0) output.push_back(cache.count(op[1]) ? cache[op[1]] : -1);\n        else cache[op[1]] = op[2];\n    }\n    return output;\n}`,
    },
    referenceSolution: {
      javascript: `function simulateLRU(capacity, ops) {\n  const cache = new Map();\n  const output = [];\n  for (const op of ops) {\n    if (op[0] === 'get') {\n      const key = op[1];\n      if (!cache.has(key)) {\n        output.push(-1);\n      } else {\n        const val = cache.get(key);\n        cache.delete(key);\n        cache.set(key, val);\n        output.push(val);\n      }\n    } else {\n      const [, key, val] = op;\n      if (cache.has(key)) {\n        cache.delete(key);\n      } else if (cache.size >= capacity) {\n        const oldest = cache.keys().next().value;\n        cache.delete(oldest);\n      }\n      cache.set(key, val);\n    }\n  }\n  return output;\n}`,
      python: `from collections import OrderedDict\n\ndef simulateLRU(capacity: int, ops: list) -> list[int]:\n    cache = OrderedDict()\n    output = []\n    for op in ops:\n        if op[0] == "get":\n            key = op[1]\n            if key not in cache:\n                output.append(-1)\n            else:\n                cache.move_to_end(key)\n                output.append(cache[key])\n        else:\n            key, val = op[1], op[2]\n            if key in cache:\n                cache.move_to_end(key)\n            elif len(cache) >= capacity:\n                cache.popitem(last=False)\n            cache[key] = val\n    return output`,
      java: `import java.util.*;\n\nclass Solution {\n    public List<Integer> simulateLRU(int capacity, List<int[]> ops) {\n        LinkedHashMap<Integer, Integer> cache = new LinkedHashMap<>(capacity, 0.75f, true) {\n            protected boolean removeEldestEntry(Map.Entry<Integer, Integer> eldest) {\n                return size() > capacity;\n            }\n        };\n        List<Integer> output = new ArrayList<>();\n        for (int[] op : ops) {\n            if (op[0] == 0) output.add(cache.getOrDefault(op[1], -1));\n            else cache.put(op[1], op[2]);\n        }\n        return output;\n    }\n}`,
      cpp: `#include <vector>\n#include <unordered_map>\n#include <list>\nusing namespace std;\n\nvector<int> simulateLRU(int capacity, vector<vector<int>> ops) {\n    list<pair<int, int>> order;\n    unordered_map<int, list<pair<int, int>>::iterator> pos;\n    vector<int> output;\n    for (auto& op : ops) {\n        if (op[0] == 0) {\n            if (!pos.count(op[1])) output.push_back(-1);\n            else { order.splice(order.begin(), order, pos[op[1]]); output.push_back(pos[op[1]]->second); }\n        } else {\n            if (pos.count(op[1])) { pos[op[1]]->second = op[2]; order.splice(order.begin(), order, pos[op[1]]); }\n            else {\n                if ((int)order.size() >= capacity) { pos.erase(order.back().first); order.pop_back(); }\n                order.push_front({op[1], op[2]});\n                pos[op[1]] = order.begin();\n            }\n        }\n    }\n    return output;\n}`,
    },
    tests: {
      visible: [
        {
          id: 't1',
          input: [2, [['put', 1, 1], ['put', 2, 2], ['get', 1], ['put', 3, 3], ['get', 2]]],
          expected: [1, -1],
          inputDisplay: 'cap=2, put(1,1), put(2,2), get(1), put(3,3), get(2)',
          expectedDisplay: '[1, -1]',
        },
      ],
      hidden: [
        {
          id: 't2',
          input: [2, [['put', 2, 1], ['put', 2, 2], ['get', 2], ['put', 1, 1], ['put', 4, 1], ['get', 2]]],
          expected: [2, -1],
          inputDisplay: 'cap=2, sobrescritura de clave 2',
          expectedDisplay: '[2, -1]',
        },
        {
          id: 't3',
          input: [1, [['put', 1, 10], ['get', 1], ['put', 2, 20], ['get', 1], ['get', 2]]],
          expected: [10, -1, 20],
          inputDisplay: 'cap=1, secuencia de reemplazo',
          expectedDisplay: '[10, -1, 20]',
        },
      ],
    },
    validationHints: {
      requiredTokens: {
        python: ['move_to_end'],
        java: ['removeEldestEntry'],
        cpp: ['splice'],
      },
    },
  },

  // =========================================================================
  // CATEGORÍA 3: RESOLUCIÓN DE PROBLEMAS (6 desafíos)
  // =========================================================================
  {
    id: 'suma-dos-numeros',
    title: 'Suma de dos números (Two Sum)',
    category: 'problem-solving',
    difficulty: 'easy',
    xp: 50,
    tags: ['hash map', 'arrays', 'búsqueda'],
    entryPoint: 'twoSum',
    description:
      'Dado un arreglo de enteros `nums` y un entero `target`, devuelve los **índices** `[i, j]` (`i < j`) de los dos números que suman `target`.\n\n' +
      'Se garantiza que existe exactamente una solución válida y no puedes usar el mismo índice dos veces.',
    examples: [
      { input: 'nums = [2, 7, 11, 15], target = 9', output: '[0, 1]' },
      { input: 'nums = [3, 2, 4], target = 6', output: '[1, 2]' },
    ],
    constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9'],
    hints: [
      'Para cada elemento `x`, el complemento necesario es `target - x`.',
      'Guarda en un `Map` o diccionario cada número visto junto a su índice.',
      'Así resuelves el problema en un solo recorrido O(n).',
    ],
    languages: ['javascript', 'python', 'java', 'cpp'],
    starterCode: {
      javascript: `function twoSum(nums, target) {\n  // Devuelve [i, j] con los índices que suman target\n  return [];\n}`,
      python: `def twoSum(nums: list[int], target: int) -> list[int]:\n    # Devuelve [i, j]\n    return []`,
      java: `import java.util.*;\n\nclass Solution {\n    public int[] twoSum(int[] nums, int target) {\n        return new int[]{};\n    }\n}`,
      cpp: `#include <vector>\nusing namespace std;\n\nvector<int> twoSum(vector<int>& nums, int target) {\n    return {};\n}`,
    },
    referenceSolution: {
      javascript: `function twoSum(nums, target) {\n  const seen = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const comp = target - nums[i];\n    if (seen.has(comp)) {\n      return [seen.get(comp), i];\n    }\n    seen.set(nums[i], i);\n  }\n  return [];\n}`,
      python: `def twoSum(nums: list[int], target: int) -> list[int]:\n    seen = {}\n    for i, num in enumerate(nums):\n        comp = target - num\n        if comp in seen:\n            return [seen[comp], i]\n        seen[num] = i\n    return []`,
      java: `import java.util.*;\n\nclass Solution {\n    public int[] twoSum(int[] nums, int target) {\n        Map<Integer, Integer> seen = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int comp = target - nums[i];\n            if (seen.containsKey(comp)) return new int[]{seen.get(comp), i};\n            seen.put(nums[i], i);\n        }\n        return new int[]{};\n    }\n}`,
      cpp: `#include <vector>\n#include <unordered_map>\nusing namespace std;\n\nvector<int> twoSum(vector<int>& nums, int target) {\n    unordered_map<int, int> seen;\n    for (int i = 0; i < (int)nums.size(); i++) {\n        int comp = target - nums[i];\n        if (seen.count(comp)) return {seen[comp], i};\n        seen[nums[i]] = i;\n    }\n    return {};\n}`,
    },
    tests: {
      visible: [
        { id: 't1', input: [[2, 7, 11, 15], 9], expected: [0, 1], inputDisplay: 'nums = [2,7,11,15], target = 9', expectedDisplay: '[0, 1]' },
        { id: 't2', input: [[3, 2, 4], 6], expected: [1, 2], inputDisplay: 'nums = [3,2,4], target = 6', expectedDisplay: '[1, 2]' },
      ],
      hidden: [
        { id: 't3', input: [[3, 3], 6], expected: [0, 1], inputDisplay: 'nums = [3,3], target = 6', expectedDisplay: '[0, 1]' },
        { id: 't4', input: [[-3, 4, 3, 90], 0], expected: [0, 2], inputDisplay: 'nums = [-3,4,3,90], target = 0', expectedDisplay: '[0, 2]' },
      ],
    },
  },
  {
    id: 'fusionar-intervalos',
    title: 'Fusionar intervalos superpuestos',
    category: 'problem-solving',
    difficulty: 'medium',
    xp: 100,
    tags: ['intervalos', 'ordenación', 'greedy'],
    entryPoint: 'mergeIntervals',
    description:
      'Dado un arreglo de intervalos `intervals` donde cada elemento es `[inicio, fin]`, fusiona todos los intervalos que se solapen y devuelve un arreglo con los intervalos resultantes ordenados por su inicio.',
    examples: [
      { input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]', output: '[[1,6],[8,10],[15,18]]' },
      { input: 'intervals = [[1,4],[4,5]]', output: '[[1,5]]' },
    ],
    constraints: ['1 <= intervals.length <= 10^4', 'inicio <= fin'],
    hints: [
      'Ordena primero los intervalos por su punto de inicio ascendente.',
      'Mantén una lista de intervalos fusionados y compara el inicio actual con el fin del último intervalo guardado.',
      'Si `actual[0] <= ultimo[1]`, extiende `ultimo[1] = Math.max(ultimo[1], actual[1])`.',
    ],
    languages: ['javascript', 'python', 'java', 'cpp'],
    starterCode: {
      javascript: `function mergeIntervals(intervals) {\n  // Fusiona intervalos solapados\n  return [];\n}`,
      python: `def mergeIntervals(intervals: list[list[int]]) -> list[list[int]]:\n    # Fusiona intervalos solapados\n    return []`,
      java: `import java.util.*;\n\nclass Solution {\n    public int[][] mergeIntervals(int[][] intervals) {\n        return new int[][]{};\n    }\n}`,
      cpp: `#include <vector>\nusing namespace std;\n\nvector<vector<int>> mergeIntervals(vector<vector<int>>& intervals) {\n    return {};\n}`,
    },
    referenceSolution: {
      javascript: `function mergeIntervals(intervals) {\n  if (intervals.length === 0) return [];\n  const sorted = [...intervals].map((it) => [it[0], it[1]]).sort((a, b) => a[0] - b[0]);\n  const merged = [sorted[0]];\n  for (let i = 1; i < sorted.length; i++) {\n    const last = merged[merged.length - 1];\n    const curr = sorted[i];\n    if (curr[0] <= last[1]) {\n      last[1] = Math.max(last[1], curr[1]);\n    } else {\n      merged.push(curr);\n    }\n  }\n  return merged;\n}`,
      python: `def mergeIntervals(intervals: list[list[int]]) -> list[list[int]]:\n    if not intervals:\n        return []\n    ordered = sorted(intervals, key=lambda x: x[0])\n    merged = [list(ordered[0])]\n    for start, end in ordered[1:]:\n        if start <= merged[-1][1]:\n            merged[-1][1] = max(merged[-1][1], end)\n        else:\n            merged.append([start, end])\n    return merged`,
      java: `import java.util.*;\n\nclass Solution {\n    public int[][] mergeIntervals(int[][] intervals) {\n        Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));\n        List<int[]> merged = new ArrayList<>();\n        for (int[] interval : intervals) {\n            if (merged.isEmpty() || merged.get(merged.size() - 1)[1] < interval[0]) {\n                merged.add(interval);\n            } else {\n                merged.get(merged.size() - 1)[1] = Math.max(merged.get(merged.size() - 1)[1], interval[1]);\n            }\n        }\n        return merged.toArray(new int[merged.size()][]);\n    }\n}`,
      cpp: `#include <vector>\n#include <algorithm>\nusing namespace std;\n\nvector<vector<int>> mergeIntervals(vector<vector<int>>& intervals) {\n    sort(intervals.begin(), intervals.end());\n    vector<vector<int>> merged;\n    for (const auto& iv : intervals) {\n        if (merged.empty() || merged.back()[1] < iv[0]) merged.push_back(iv);\n        else merged.back()[1] = max(merged.back()[1], iv[1]);\n    }\n    return merged;\n}`,
    },
    tests: {
      visible: [
        { id: 't1', input: [[[1, 3], [2, 6], [8, 10], [15, 18]]], expected: [[1, 6], [8, 10], [15, 18]], inputDisplay: '[[1,3],[2,6],[8,10],[15,18]]', expectedDisplay: '[[1,6],[8,10],[15,18]]' },
        { id: 't2', input: [[[1, 4], [4, 5]]], expected: [[1, 5]], inputDisplay: '[[1,4],[4,5]]', expectedDisplay: '[[1,5]]' },
      ],
      hidden: [
        { id: 't3', input: [[[4, 7], [1, 4]]], expected: [[1, 7]], inputDisplay: '[[4,7],[1,4]]', expectedDisplay: '[[1,7]]' },
        { id: 't4', input: [[[1, 10], [2, 3], [4, 8]]], expected: [[1, 10]], inputDisplay: '[[1,10],[2,3],[4,8]]', expectedDisplay: '[[1,10]]' },
      ],
    },
  },
  {
    id: 'agrupar-anagramas',
    title: 'Agrupar anagramas',
    category: 'problem-solving',
    difficulty: 'medium',
    xp: 100,
    tags: ['hash map', 'cadenas', 'agrupación'],
    entryPoint: 'groupAnagrams',
    description:
      'Dado un arreglo de palabras `strs`, agrúpalas de modo que cada subarreglo contenga palabras que son anagramas entre sí.\n\n' +
      'Para que la salida sea determinista en las pruebas, devuelve cada grupo ordenado alfabéticamente y la lista de grupos ordenada por su primer elemento.',
    examples: [
      { input: 'strs = ["eat","tea","tan","ate","nat","bat"]', output: '[["ate","eat","tea"],["bat"],["nat","tan"]]' },
    ],
    constraints: ['1 <= strs.length <= 10^4', '0 <= strs[i].length <= 100'],
    hints: [
      'Dos palabras son anagramas si comparten exactamente la misma clave canónica al ordenar sus letras.',
      'Usa esa cadena ordenada como clave de un `Map<string, string[]>`.',
      'Ordena cada grupo y luego ordena los grupos por `a[0].localeCompare(b[0])` (o comparación estándar).',
    ],
    languages: ['javascript', 'python', 'java', 'cpp'],
    starterCode: {
      javascript: `function groupAnagrams(strs) {\n  // Devuelve los grupos ordenados alfabéticamente\n  return [];\n}`,
      python: `def groupAnagrams(strs: list[str]) -> list[list[str]]:\n    return []`,
      java: `import java.util.*;\n\nclass Solution {\n    public List<List<String>> groupAnagrams(String[] strs) {\n        return new ArrayList<>();\n    }\n}`,
      cpp: `#include <vector>\n#include <string>\nusing namespace std;\n\nvector<vector<string>> groupAnagrams(vector<string>& strs) {\n    return {};\n}`,
    },
    referenceSolution: {
      javascript: `function groupAnagrams(strs) {\n  const groups = new Map();\n  for (const word of strs) {\n    const key = word.split('').sort().join('');\n    if (!groups.has(key)) groups.set(key, []);\n    groups.get(key).push(word);\n  }\n  return Array.from(groups.values())\n    .map((group) => group.sort())\n    .sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));\n}`,
      python: `def groupAnagrams(strs: list[str]) -> list[list[str]]:\n    groups = {}\n    for word in strs:\n        key = "".join(sorted(word))\n        groups.setdefault(key, []).append(word)\n    result = [sorted(group) for group in groups.values()]\n    result.sort(key=lambda g: g[0])\n    return result`,
      java: `import java.util.*;\n\nclass Solution {\n    public List<List<String>> groupAnagrams(String[] strs) {\n        Map<String, List<String>> groups = new HashMap<>();\n        for (String word : strs) {\n            char[] chars = word.toCharArray();\n            Arrays.sort(chars);\n            String key = new String(chars);\n            groups.computeIfAbsent(key, k -> new ArrayList<>()).add(word);\n        }\n        List<List<String>> res = new ArrayList<>();\n        for (List<String> g : groups.values()) { Collections.sort(g); res.add(g); }\n        res.sort(Comparator.comparing(g -> g.get(0)));\n        return res;\n    }\n}`,
      cpp: `#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nvector<vector<string>> groupAnagrams(vector<string>& strs) {\n    unordered_map<string, vector<string>> groups;\n    for (const auto& word : strs) {\n        string key = word;\n        sort(key.begin(), key.end());\n        groups[key].push_back(word);\n    }\n    vector<vector<string>> res;\n    for (auto& kv : groups) { sort(kv.second.begin(), kv.second.end()); res.push_back(kv.second); }\n    sort(res.begin(), res.end());\n    return res;\n}`,
    },
    tests: {
      visible: [
        {
          id: 't1',
          input: [['eat', 'tea', 'tan', 'ate', 'nat', 'bat']],
          expected: [['ate', 'eat', 'tea'], ['bat'], ['nat', 'tan']],
          inputDisplay: 'strs = ["eat","tea","tan","ate","nat","bat"]',
          expectedDisplay: '[["ate","eat","tea"],["bat"],["nat","tan"]]',
        },
      ],
      hidden: [
        { id: 't2', input: [['']], expected: [['']], inputDisplay: 'strs = [""]', expectedDisplay: '[[""]]' },
        { id: 't3', input: [['sol', 'los', 'uno']], expected: [['los', 'sol'], ['uno']], inputDisplay: 'strs = ["sol","los","uno"]', expectedDisplay: '[["los","sol"],["uno"]]' },
      ],
    },
  },
  {
    id: 'islas-en-matriz',
    title: 'Número de islas',
    category: 'problem-solving',
    difficulty: 'hard',
    xp: 200,
    tags: ['grafos', 'dfs', 'bfs', 'matriz'],
    entryPoint: 'numIslands',
    description:
      'Dada una cuadrícula binaria 2D `grid` donde `"1"` representa tierra y `"0"` representa agua, calcula el número total de islas.\n\n' +
      'Una isla está formada por celdas `"1"` conectadas horizontal o verticalmente (no en diagonal).',
    examples: [
      {
        input: 'grid = [["1","1","0","0"],["1","1","0","0"],["0","0","1","0"],["0","0","0","1"]]',
        output: '3',
      },
    ],
    constraints: ['1 <= filas, columnas <= 300', 'Cada celda es "0" o "1"'],
    hints: [
      'Recorre cada celda; cuando encuentres `"1"`, incrementa el contador de islas.',
      'Lanza una búsqueda DFS o BFS desde esa celda para marcar toda la isla conectada como `"0"` (visitada).',
      'Usa una cola o pila iterativa si la matriz pudiera crecer mucho para evitar desbordar la pila.',
    ],
    languages: ['javascript', 'python', 'java', 'cpp'],
    starterCode: {
      javascript: `function numIslands(grid) {\n  // Cuenta las islas conectadas en la matriz\n  return 0;\n}`,
      python: `def numIslands(grid: list[list[str]]) -> int:\n    return 0`,
      java: `class Solution {\n    public int numIslands(char[][] grid) {\n        return 0;\n    }\n}`,
      cpp: `#include <vector>\nusing namespace std;\n\nint numIslands(vector<vector<char>>& grid) {\n    return 0;\n}`,
    },
    referenceSolution: {
      javascript: `function numIslands(grid) {\n  if (!grid.length) return 0;\n  const rows = grid.length;\n  const cols = grid[0].length;\n  let count = 0;\n  const dfs = (r, c) => {\n    const stack = [[r, c]];\n    while (stack.length > 0) {\n      const [cr, cc] = stack.pop();\n      if (cr < 0 || cc < 0 || cr >= rows || cc >= cols || grid[cr][cc] !== '1') continue;\n      grid[cr][cc] = '0';\n      stack.push([cr + 1, cc], [cr - 1, cc], [cr, cc + 1], [cr, cc - 1]);\n    }\n  };\n  for (let r = 0; r < rows; r++) {\n    for (let c = 0; c < cols; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}`,
      python: `def numIslands(grid: list[list[str]]) -> int:\n    if not grid:\n        return 0\n    rows, cols = len(grid), len(grid[0])\n    count = 0\n    for r in range(rows):\n        for c in range(cols):\n            if grid[r][c] == "1":\n                count += 1\n                stack = [(r, c)]\n                while stack:\n                    cr, cc = stack.pop()\n                    if 0 <= cr < rows and 0 <= cc < cols and grid[cr][cc] == "1":\n                        grid[cr][cc] = "0"\n                        stack.extend([(cr+1, cc), (cr-1, cc), (cr, cc+1), (cr, cc-1)])\n    return count`,
      java: `class Solution {\n    public int numIslands(char[][] grid) {\n        int count = 0;\n        for (int r = 0; r < grid.length; r++) {\n            for (int c = 0; c < grid[0].length; c++) {\n                if (grid[r][c] == '1') { count++; dfs(grid, r, c); }\n            }\n        }\n        return count;\n    }\n    private void dfs(char[][] g, int r, int c) {\n        if (r < 0 || c < 0 || r >= g.length || c >= g[0].length || g[r][c] != '1') return;\n        g[r][c] = '0';\n        dfs(g, r + 1, c); dfs(g, r - 1, c); dfs(g, r, c + 1); dfs(g, r, c - 1);\n    }\n}`,
      cpp: `#include <vector>\nusing namespace std;\n\nvoid dfs(vector<vector<char>>& g, int r, int c) {\n    if (r < 0 || c < 0 || r >= (int)g.size() || c >= (int)g[0].size() || g[r][c] != '1') return;\n    g[r][c] = '0';\n    dfs(g, r + 1, c); dfs(g, r - 1, c); dfs(g, r, c + 1); dfs(g, r, c - 1);\n}\n\nint numIslands(vector<vector<char>>& grid) {\n    int count = 0;\n    for (int r = 0; r < (int)grid.size(); r++)\n        for (int c = 0; c < (int)grid[0].size(); c++)\n            if (grid[r][c] == '1') { count++; dfs(grid, r, c); }\n    return count;\n}`,
    },
    tests: {
      visible: [
        {
          id: 't1',
          input: [[['1', '1', '0', '0'], ['1', '1', '0', '0'], ['0', '0', '1', '0'], ['0', '0', '0', '1']]],
          expected: 3,
          inputDisplay: 'grid 4x4 con 3 islas',
          expectedDisplay: '3',
        },
      ],
      hidden: [
        {
          id: 't2',
          input: [[['1', '1', '1'], ['0', '1', '0'], ['1', '1', '1']]],
          expected: 1,
          inputDisplay: 'grid 3x3 en forma de I',
          expectedDisplay: '1',
        },
        {
          id: 't3',
          input: [[['0', '0'], ['0', '0']]],
          expected: 0,
          inputDisplay: 'grid 2x2 solo agua',
          expectedDisplay: '0',
        },
      ],
    },
  },
  {
    id: 'cambio-monedas-minimo',
    title: 'Cambio de monedas mínimo',
    category: 'problem-solving',
    difficulty: 'hard',
    xp: 200,
    tags: ['programación dinámica', 'optimización'],
    entryPoint: 'coinChange',
    description:
      'Dado un arreglo `coins` con distintas denominaciones de monedas y una cantidad entera `amount`, devuelve el **número mínimo de monedas** necesario para sumar exactamente `amount`.\n\n' +
      'Si no es posible formar esa cantidad, devuelve `-1`. Dispones de suministro infinito de cada moneda.',
    examples: [
      { input: 'coins = [1, 2, 5], amount = 11', output: '3', explanation: '5 + 5 + 1 = 11' },
      { input: 'coins = [2], amount = 3', output: '-1' },
    ],
    constraints: ['1 <= coins.length <= 12', '0 <= amount <= 10^4'],
    hints: [
      'Un enfoque voraz (greedy) falla para casos como `coins = [1, 3, 4], amount = 6`.',
      'Define `dp[x]` como el mínimo de monedas para sumar `x`, inicializado en `amount + 1`.',
      'Para cada `x` desde `1` hasta `amount`, `dp[x] = min(dp[x], dp[x - coin] + 1)`.',
    ],
    languages: ['javascript', 'python', 'java', 'cpp'],
    starterCode: {
      javascript: `function coinChange(coins, amount) {\n  // Calcula el mínimo de monedas o -1\n  return -1;\n}`,
      python: `def coinChange(coins: list[int], amount: int) -> int:\n    return -1`,
      java: `class Solution {\n    public int coinChange(int[] coins, int amount) {\n        return -1;\n    }\n}`,
      cpp: `#include <vector>\nusing namespace std;\n\nint coinChange(vector<int>& coins, int amount) {\n    return -1;\n}`,
    },
    referenceSolution: {
      javascript: `function coinChange(coins, amount) {\n  const dp = new Array(amount + 1).fill(amount + 1);\n  dp[0] = 0;\n  for (let i = 1; i <= amount; i++) {\n    for (const coin of coins) {\n      if (coin <= i) {\n        dp[i] = Math.min(dp[i], dp[i - coin] + 1);\n      }\n    }\n  }\n  return dp[amount] > amount ? -1 : dp[amount];\n}`,
      python: `def coinChange(coins: list[int], amount: int) -> int:\n    dp = [amount + 1] * (amount + 1)\n    dp[0] = 0\n    for i in range(1, amount + 1):\n        for coin in coins:\n            if coin <= i:\n                dp[i] = min(dp[i], dp[i - coin] + 1)\n    return -1 if dp[amount] > amount else dp[amount]`,
      java: `import java.util.*;\n\nclass Solution {\n    public int coinChange(int[] coins, int amount) {\n        int[] dp = new int[amount + 1];\n        Arrays.fill(dp, amount + 1);\n        dp[0] = 0;\n        for (int i = 1; i <= amount; i++) {\n            for (int coin : coins) {\n                if (coin <= i) dp[i] = Math.min(dp[i], dp[i - coin] + 1);\n            }\n        }\n        return dp[amount] > amount ? -1 : dp[amount];\n    }\n}`,
      cpp: `#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint coinChange(vector<int>& coins, int amount) {\n    vector<int> dp(amount + 1, amount + 1);\n    dp[0] = 0;\n    for (int i = 1; i <= amount; i++) {\n        for (int coin : coins) {\n            if (coin <= i) dp[i] = min(dp[i], dp[i - coin] + 1);\n        }\n    }\n    return dp[amount] > amount ? -1 : dp[amount];\n}`,
    },
    tests: {
      visible: [
        { id: 't1', input: [[1, 2, 5], 11], expected: 3, inputDisplay: 'coins = [1,2,5], amount = 11', expectedDisplay: '3' },
        { id: 't2', input: [[2], 3], expected: -1, inputDisplay: 'coins = [2], amount = 3', expectedDisplay: '-1' },
      ],
      hidden: [
        { id: 't3', input: [[1, 3, 4], 6], expected: 2, inputDisplay: 'coins = [1,3,4], amount = 6', expectedDisplay: '2' },
        { id: 't4', input: [[1], 0], expected: 0, inputDisplay: 'coins = [1], amount = 0', expectedDisplay: '0' },
      ],
    },
  },
  {
    id: 'mediana-dos-arrays',
    title: 'Mediana de dos arreglos ordenados',
    category: 'problem-solving',
    difficulty: 'expert',
    xp: 350,
    tags: ['búsqueda binaria', 'divide y vencerás'],
    entryPoint: 'findMedianSortedArrays',
    description:
      'Dados dos arreglos ordenados ascendentemente `nums1` y `nums2`, devuelve la **mediana** de ambos arreglos combinados.\n\n' +
      'La complejidad temporal ideal es `O(log(min(m, n)))`.',
    examples: [
      { input: 'nums1 = [1, 3], nums2 = [2]', output: '2' },
      { input: 'nums1 = [1, 2], nums2 = [3, 4]', output: '2.5' },
    ],
    constraints: ['0 <= m, n <= 1000', '1 <= m + n <= 2000'],
    hints: [
      'Asegúrate de hacer búsqueda binaria siempre sobre el arreglo más corto.',
      'Particiona ambos arreglos de modo que la mitad izquierda tenga `(m + n + 1) / 2` elementos.',
      'La partición es válida cuando `maxLeftX <= minRightY` y `maxLeftY <= minRightX`.',
    ],
    languages: ['javascript', 'python', 'java', 'cpp'],
    starterCode: {
      javascript: `function findMedianSortedArrays(nums1, nums2) {\n  // Devuelve la mediana numérica\n  return 0;\n}`,
      python: `def findMedianSortedArrays(nums1: list[int], nums2: list[int]) -> float:\n    return 0.0`,
      java: `class Solution {\n    public double findMedianSortedArrays(int[] nums1, int[] nums2) {\n        return 0.0;\n    }\n}`,
      cpp: `#include <vector>\nusing namespace std;\n\ndouble findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {\n    return 0.0;\n}`,
    },
    referenceSolution: {
      javascript: `function findMedianSortedArrays(nums1, nums2) {\n  if (nums1.length > nums2.length) return findMedianSortedArrays(nums2, nums1);\n  const x = nums1.length;\n  const y = nums2.length;\n  let low = 0;\n  let high = x;\n  while (low <= high) {\n    const partX = Math.floor((low + high) / 2);\n    const partY = Math.floor((x + y + 1) / 2) - partX;\n    const maxLeftX = partX === 0 ? -Infinity : nums1[partX - 1];\n    const minRightX = partX === x ? Infinity : nums1[partX];\n    const maxLeftY = partY === 0 ? -Infinity : nums2[partY - 1];\n    const minRightY = partY === y ? Infinity : nums2[partY];\n    if (maxLeftX <= minRightY && maxLeftY <= minRightX) {\n      if ((x + y) % 2 === 0) {\n        return (Math.max(maxLeftX, maxLeftY) + Math.min(minRightX, minRightY)) / 2;\n      }\n      return Math.max(maxLeftX, maxLeftY);\n    } else if (maxLeftX > minRightY) {\n      high = partX - 1;\n    } else {\n      low = partX + 1;\n    }\n  }\n  return 0;\n}`,
      python: `def findMedianSortedArrays(nums1: list[int], nums2: list[int]) -> float:\n    if len(nums1) > len(nums2):\n        nums1, nums2 = nums2, nums1\n    x, y = len(nums1), len(nums2)\n    low, high = 0, x\n    while low <= high:\n        px = (low + high) // 2\n        py = (x + y + 1) // 2 - px\n        lx = float("-inf") if px == 0 else nums1[px - 1]\n        rx = float("inf") if px == x else nums1[px]\n        ly = float("-inf") if py == 0 else nums2[py - 1]\n        ry = float("inf") if py == y else nums2[py]\n        if lx <= ry and ly <= rx:\n            if (x + y) % 2 == 0:\n                return (max(lx, ly) + min(rx, ry)) / 2\n            return float(max(lx, ly))\n        elif lx > ry:\n            high = px - 1\n        else:\n            low = px + 1\n    return 0.0`,
      java: `class Solution {\n    public double findMedianSortedArrays(int[] nums1, int[] nums2) {\n        if (nums1.length > nums2.length) return findMedianSortedArrays(nums2, nums1);\n        int x = nums1.length, y = nums2.length, low = 0, high = x;\n        while (low <= high) {\n            int px = (low + high) / 2, py = (x + y + 1) / 2 - px;\n            int lx = px == 0 ? Integer.MIN_VALUE : nums1[px - 1];\n            int rx = px == x ? Integer.MAX_VALUE : nums1[px];\n            int ly = py == 0 ? Integer.MIN_VALUE : nums2[py - 1];\n            int ry = py == y ? Integer.MAX_VALUE : nums2[py];\n            if (lx <= ry && ly <= rx) {\n                if ((x + y) % 2 == 0) return (Math.max(lx, ly) + Math.min(rx, ry)) / 2.0;\n                return Math.max(lx, ly);\n            } else if (lx > ry) high = px - 1;\n            else low = px + 1;\n        }\n        return 0.0;\n    }\n}`,
      cpp: `#include <vector>\n#include <climits>\n#include <algorithm>\nusing namespace std;\n\ndouble findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {\n    if (nums1.size() > nums2.size()) return findMedianSortedArrays(nums2, nums1);\n    int x = nums1.size(), y = nums2.size(), low = 0, high = x;\n    while (low <= high) {\n        int px = (low + high) / 2, py = (x + y + 1) / 2 - px;\n        int lx = px == 0 ? INT_MIN : nums1[px - 1];\n        int rx = px == x ? INT_MAX : nums1[px];\n        int ly = py == 0 ? INT_MIN : nums2[py - 1];\n        int ry = py == y ? INT_MAX : nums2[py];\n        if (lx <= ry && ly <= rx) {\n            if ((x + y) % 2 == 0) return (max(lx, ly) + min(rx, ry)) / 2.0;\n            return max(lx, ly);\n        } else if (lx > ry) high = px - 1;\n        else low = px + 1;\n    }\n    return 0.0;\n}`,
    },
    tests: {
      visible: [
        { id: 't1', input: [[1, 3], [2]], expected: 2, inputDisplay: 'nums1 = [1,3], nums2 = [2]', expectedDisplay: '2' },
        { id: 't2', input: [[1, 2], [3, 4]], expected: 2.5, inputDisplay: 'nums1 = [1,2], nums2 = [3,4]', expectedDisplay: '2.5' },
      ],
      hidden: [
        { id: 't3', input: [[], [1]], expected: 1, inputDisplay: 'nums1 = [], nums2 = [1]', expectedDisplay: '1' },
        { id: 't4', input: [[0, 0], [0, 0]], expected: 0, inputDisplay: 'nums1 = [0,0], nums2 = [0,0]', expectedDisplay: '0' },
      ],
    },
  },

  // =========================================================================
  // CATEGORÍA 4: OPTIMIZACIÓN (6 desafíos)
  // =========================================================================
  {
    id: 'duplicados-en-lineal',
    title: 'Primer duplicado en O(n)',
    category: 'optimization',
    difficulty: 'easy',
    xp: 50,
    tags: ['optimización', 'set', 'O(n)'],
    entryPoint: 'firstDuplicate',
    description:
      'Dado un arreglo de enteros `nums`, devuelve el **primer elemento que aparece por segunda vez** al recorrer de izquierda a derecha, o `-1` si no hay duplicados.\n\n' +
      'El código inicial usa un doble bucle `O(n²)`. Optimízalo a complejidad temporal `O(n)`.',
    examples: [
      { input: 'nums = [2, 1, 3, 5, 3, 2]', output: '3', explanation: 'El 3 repite antes que el 2.' },
      { input: 'nums = [1, 2, 3, 4]', output: '-1' },
    ],
    constraints: ['0 <= nums.length <= 10^5', 'Complejidad requerida O(n)'],
    hints: [
      'Un `Set` ofrece inserción y búsqueda en tiempo O(1) promedio.',
      'Recorre `nums` una sola vez: si el elemento ya está en el `Set`, devuélvelo inmediatamente.',
      'En caso contrario, añádelo al `Set`.',
    ],
    languages: ['javascript', 'python', 'java', 'cpp'],
    starterCode: {
      javascript: `function firstDuplicate(nums) {\n  // Enfoque ingenuo O(n^2): falla en orden de repetición y rendimiento.\n  // Optimízalo a O(n) usando un Set.\n  for (let i = 0; i < nums.length; i++) {\n    for (let j = i + 1; j < nums.length; j++) {\n      if (nums[i] === nums[j]) return nums[i];\n    }\n  }\n  return -1;\n}`,
      python: `def firstDuplicate(nums: list[int]) -> int:\n    # Enfoque ingenuo O(n^2): optimízalo a O(n) usando un set\n    for i in range(len(nums)):\n        for j in range(i + 1, len(nums)):\n            if nums[i] == nums[j]:\n                return nums[i]\n    return -1`,
      java: `import java.util.*;\n\nclass Solution {\n    public int firstDuplicate(int[] nums) {\n        for (int i = 0; i < nums.length; i++) {\n            for (int j = i + 1; j < nums.length; j++) {\n                if (nums[i] == nums[j]) return nums[i];\n            }\n        }\n        return -1;\n    }\n}`,
      cpp: `#include <vector>\nusing namespace std;\n\nint firstDuplicate(vector<int>& nums) {\n    for (int i = 0; i < (int)nums.size(); i++)\n        for (int j = i + 1; j < (int)nums.size(); j++)\n            if (nums[i] == nums[j]) return nums[i];\n    return -1;\n}`,
    },
    referenceSolution: {
      javascript: `function firstDuplicate(nums) {\n  const seen = new Set();\n  for (const num of nums) {\n    if (seen.has(num)) return num;\n    seen.add(num);\n  }\n  return -1;\n}`,
      python: `def firstDuplicate(nums: list[int]) -> int:\n    seen = set()\n    for num in nums:\n        if num in seen:\n            return num\n        seen.add(num)\n    return -1`,
      java: `import java.util.*;\n\nclass Solution {\n    public int firstDuplicate(int[] nums) {\n        Set<Integer> seen = new HashSet<>();\n        for (int num : nums) {\n            if (!seen.add(num)) return num;\n        }\n        return -1;\n    }\n}`,
      cpp: `#include <vector>\n#include <unordered_set>\nusing namespace std;\n\nint firstDuplicate(vector<int>& nums) {\n    unordered_set<int> seen;\n    for (int num : nums) {\n        if (seen.count(num)) return num;\n        seen.insert(num);\n    }\n    return -1;\n}`,
    },
    tests: {
      visible: [
        { id: 't1', input: [[2, 1, 3, 5, 3, 2]], expected: 3, inputDisplay: 'nums = [2,1,3,5,3,2]', expectedDisplay: '3' },
        { id: 't2', input: [[1, 2, 3, 4]], expected: -1, inputDisplay: 'nums = [1,2,3,4]', expectedDisplay: '-1' },
      ],
      hidden: [
        { id: 't3', input: [[5, 5]], expected: 5, inputDisplay: 'nums = [5,5]', expectedDisplay: '5' },
        { id: 't4', input: [[]], expected: -1, inputDisplay: 'nums = []', expectedDisplay: '-1' },
      ],
    },
    validationHints: {
      requiredTokens: {
        python: ['set('],
        java: ['HashSet'],
        cpp: ['unordered_set'],
      },
    },
  },
  {
    id: 'max-subarray-kadane',
    title: 'Subarreglo de suma máxima (Kadane)',
    category: 'optimization',
    difficulty: 'medium',
    xp: 100,
    tags: ['kadane', 'O(n)', 'programación dinámica'],
    entryPoint: 'maxSubArray',
    description:
      'Dado un arreglo de enteros `nums` (con positivos y negativos), encuentra el subarreglo contiguo (de al menos un elemento) que tenga la **suma máxima** y devuelve dicha suma en tiempo `O(n)`.',
    examples: [
      { input: 'nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]', output: '6', explanation: '[4, -1, 2, 1] suma 6.' },
      { input: 'nums = [-5, -2, -8]', output: '-2' },
    ],
    constraints: ['1 <= nums.length <= 10^5', 'Complejidad temporal O(n) y espacial O(1)'],
    hints: [
      'En cada posición `i`, decide si conviene continuar el subarreglo anterior (`current + nums[i]`) o empezar uno nuevo (`nums[i]`).',
      'Inicializa `best` y `current` con `nums[0]` para manejar arreglos de números negativos.',
      'Esta técnica se conoce como el algoritmo de Kadane.',
    ],
    languages: ['javascript', 'python', 'java', 'cpp'],
    starterCode: {
      javascript: `function maxSubArray(nums) {\n  // Implementa Kadane en O(n)\n  return 0;\n}`,
      python: `def maxSubArray(nums: list[int]) -> int:\n    return 0`,
      java: `class Solution {\n    public int maxSubArray(int[] nums) {\n        return 0;\n    }\n}`,
      cpp: `#include <vector>\nusing namespace std;\n\nint maxSubArray(vector<int>& nums) {\n    return 0;\n}`,
    },
    referenceSolution: {
      javascript: `function maxSubArray(nums) {\n  let current = nums[0];\n  let best = nums[0];\n  for (let i = 1; i < nums.length; i++) {\n    current = Math.max(nums[i], current + nums[i]);\n    best = Math.max(best, current);\n  }\n  return best;\n}`,
      python: `def maxSubArray(nums: list[int]) -> int:\n    current = best = nums[0]\n    for num in nums[1:]:\n        current = max(num, current + num)\n        best = max(best, current)\n    return best`,
      java: `class Solution {\n    public int maxSubArray(int[] nums) {\n        int current = nums[0], best = nums[0];\n        for (int i = 1; i < nums.length; i++) {\n            current = Math.max(nums[i], current + nums[i]);\n            best = Math.max(best, current);\n        }\n        return best;\n    }\n}`,
      cpp: `#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint maxSubArray(vector<int>& nums) {\n    int current = nums[0], best = nums[0];\n    for (size_t i = 1; i < nums.size(); i++) {\n        current = max(nums[i], current + nums[i]);\n        best = max(best, current);\n    }\n    return best;\n}`,
    },
    tests: {
      visible: [
        { id: 't1', input: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], expected: 6, inputDisplay: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', expectedDisplay: '6' },
        { id: 't2', input: [[-5, -2, -8]], expected: -2, inputDisplay: 'nums = [-5,-2,-8]', expectedDisplay: '-2' },
      ],
      hidden: [
        { id: 't3', input: [[1]], expected: 1, inputDisplay: 'nums = [1]', expectedDisplay: '1' },
        { id: 't4', input: [[5, 4, -1, 7, 8]], expected: 23, inputDisplay: 'nums = [5,4,-1,7,8]', expectedDisplay: '23' },
      ],
    },
  },
  {
    id: 'ventana-deslizante-max',
    title: 'Subcadena más larga sin repetidos',
    category: 'optimization',
    difficulty: 'medium',
    xp: 100,
    tags: ['ventana deslizante', 'hash map', 'O(n)'],
    entryPoint: 'lengthOfLongestSubstring',
    description:
      'Dada una cadena `s`, encuentra la longitud de la **subcadena contigua más larga** sin caracteres repetidos.\n\n' +
      'Resuélvelo en tiempo `O(n)` usando una ventana deslizante.',
    examples: [
      { input: 's = "abcabcbb"', output: '3', explanation: '"abc" tiene longitud 3.' },
      { input: 's = "bbbbb"', output: '1' },
    ],
    constraints: ['0 <= s.length <= 5 * 10^4'],
    hints: [
      'Mantén un puntero izquierdo `left` y avanza `right` carácter a carácter.',
      'Guarda el último índice visto de cada carácter en un `Map`.',
      'Si `s[right]` ya apareció dentro de la ventana actual (`lastIdx >= left`), salta `left = lastIdx + 1`.',
    ],
    languages: ['javascript', 'python', 'java', 'cpp'],
    starterCode: {
      javascript: `function lengthOfLongestSubstring(s) {\n  // Ventana deslizante en O(n)\n  return 0;\n}`,
      python: `def lengthOfLongestSubstring(s: str) -> int:\n    return 0`,
      java: `class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        return 0;\n    }\n}`,
      cpp: `#include <string>\nusing namespace std;\n\nint lengthOfLongestSubstring(string s) {\n    return 0;\n}`,
    },
    referenceSolution: {
      javascript: `function lengthOfLongestSubstring(s) {\n  const lastSeen = new Map();\n  let left = 0;\n  let maxLen = 0;\n  for (let right = 0; right < s.length; right++) {\n    const ch = s[right];\n    if (lastSeen.has(ch) && lastSeen.get(ch) >= left) {\n      left = lastSeen.get(ch) + 1;\n    }\n    lastSeen.set(ch, right);\n    maxLen = Math.max(maxLen, right - left + 1);\n  }\n  return maxLen;\n}`,
      python: `def lengthOfLongestSubstring(s: str) -> int:\n    last_seen = {}\n    left = 0\n    max_len = 0\n    for right, ch in enumerate(s):\n        if ch in last_seen and last_seen[ch] >= left:\n            left = last_seen[ch] + 1\n        last_seen[ch] = right\n        max_len = max(max_len, right - left + 1)\n    return max_len`,
      java: `import java.util.*;\n\nclass Solution {\n    public int lengthOfLongestSubstring(String s) {\n        Map<Character, Integer> lastSeen = new HashMap<>();\n        int left = 0, maxLen = 0;\n        for (int right = 0; right < s.length(); right++) {\n            char ch = s.charAt(right);\n            if (lastSeen.containsKey(ch) && lastSeen.get(ch) >= left) {\n                left = lastSeen.get(ch) + 1;\n            }\n            lastSeen.put(ch, right);\n            maxLen = Math.max(maxLen, right - left + 1);\n        }\n        return maxLen;\n    }\n}`,
      cpp: `#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nint lengthOfLongestSubstring(string s) {\n    unordered_map<char, int> lastSeen;\n    int left = 0, maxLen = 0;\n    for (int right = 0; right < (int)s.size(); right++) {\n        char ch = s[right];\n        if (lastSeen.count(ch) && lastSeen[ch] >= left) left = lastSeen[ch] + 1;\n        lastSeen[ch] = right;\n        maxLen = max(maxLen, right - left + 1);\n    }\n    return maxLen;\n}`,
    },
    tests: {
      visible: [
        { id: 't1', input: ['abcabcbb'], expected: 3, inputDisplay: 's = "abcabcbb"', expectedDisplay: '3' },
        { id: 't2', input: ['bbbbb'], expected: 1, inputDisplay: 's = "bbbbb"', expectedDisplay: '1' },
      ],
      hidden: [
        { id: 't3', input: ['pwwkew'], expected: 3, inputDisplay: 's = "pwwkew"', expectedDisplay: '3' },
        { id: 't4', input: [''], expected: 0, inputDisplay: 's = ""', expectedDisplay: '0' },
      ],
    },
  },
  {
    id: 'producto-excepto-propio',
    title: 'Producto excepto el propio elemento',
    category: 'optimization',
    difficulty: 'hard',
    xp: 200,
    tags: ['prefijos', 'sufijos', 'O(n)'],
    entryPoint: 'productExceptSelf',
    description:
      'Dado un arreglo de enteros `nums`, devuelve un arreglo `answer` donde `answer[i]` es igual al producto de todos los elementos de `nums` excepto `nums[i]`.\n\n' +
      '**Restricción clave**: debes hacerlo en tiempo `O(n)` y **sin usar la operación de división**.',
    examples: [
      { input: 'nums = [1, 2, 3, 4]', output: '[24, 12, 8, 6]' },
      { input: 'nums = [-1, 1, 0, -3, 3]', output: '[0, 0, 9, 0, 0]' },
    ],
    constraints: ['2 <= nums.length <= 10^5', 'Prohibido usar división (/)'],
    hints: [
      'El resultado en la posición `i` es el producto de los prefijos a la izquierda por el producto de los sufijos a la derecha.',
      'Realiza una primera pasada de izquierda a derecha acumulando el producto prefijo.',
      'Realiza una segunda pasada de derecha a izquierda multiplicando por el producto sufijo acumulado.',
    ],
    languages: ['javascript', 'python', 'java', 'cpp'],
    starterCode: {
      javascript: `function productExceptSelf(nums) {\n  // O(n) sin usar división\n  return [];\n}`,
      python: `def productExceptSelf(nums: list[int]) -> list[int]:\n    return []`,
      java: `class Solution {\n    public int[] productExceptSelf(int[] nums) {\n        return new int[]{};\n    }\n}`,
      cpp: `#include <vector>\nusing namespace std;\n\nvector<int> productExceptSelf(vector<int>& nums) {\n    return {};\n}`,
    },
    referenceSolution: {
      javascript: `function productExceptSelf(nums) {\n  const n = nums.length;\n  const res = new Array(n).fill(1);\n  let prefix = 1;\n  for (let i = 0; i < n; i++) {\n    res[i] = prefix;\n    prefix *= nums[i];\n  }\n  let suffix = 1;\n  for (let i = n - 1; i >= 0; i--) {\n    res[i] = (res[i] * suffix) || 0;\n    suffix *= nums[i];\n  }\n  return res;\n}`,
      python: `def productExceptSelf(nums: list[int]) -> list[int]:\n    n = len(nums)\n    res = [1] * n\n    prefix = 1\n    for i in range(n):\n        res[i] = prefix\n        prefix *= nums[i]\n    suffix = 1\n    for i in range(n - 1, -1, -1):\n        res[i] *= suffix\n        suffix *= nums[i]\n    return res`,
      java: `class Solution {\n    public int[] productExceptSelf(int[] nums) {\n        int n = nums.length;\n        int[] res = new int[n];\n        int prefix = 1;\n        for (int i = 0; i < n; i++) { res[i] = prefix; prefix *= nums[i]; }\n        int suffix = 1;\n        for (int i = n - 1; i >= 0; i--) { res[i] *= suffix; suffix *= nums[i]; }\n        return res;\n    }\n}`,
      cpp: `#include <vector>\nusing namespace std;\n\nvector<int> productExceptSelf(vector<int>& nums) {\n    int n = nums.size();\n    vector<int> res(n, 1);\n    int prefix = 1;\n    for (int i = 0; i < n; i++) { res[i] = prefix; prefix *= nums[i]; }\n    int suffix = 1;\n    for (int i = n - 1; i >= 0; i--) { res[i] *= suffix; suffix *= nums[i]; }\n    return res;\n}`,
    },
    tests: {
      visible: [
        { id: 't1', input: [[1, 2, 3, 4]], expected: [24, 12, 8, 6], inputDisplay: 'nums = [1,2,3,4]', expectedDisplay: '[24, 12, 8, 6]' },
        { id: 't2', input: [[-1, 1, 0, -3, 3]], expected: [0, 0, 9, 0, 0], inputDisplay: 'nums = [-1,1,0,-3,3]', expectedDisplay: '[0, 0, 9, 0, 0]' },
      ],
      hidden: [
        { id: 't3', input: [[0, 0]], expected: [0, 0], inputDisplay: 'nums = [0,0]', expectedDisplay: '[0, 0]' },
        { id: 't4', input: [[2, 3]], expected: [3, 2], inputDisplay: 'nums = [2,3]', expectedDisplay: '[3, 2]' },
      ],
    },
    validationHints: {
      forbiddenSubstrings: {
        python: [' / '],
        java: [' / '],
        cpp: [' / '],
      },
    },
  },
  {
    id: 'contenedor-mas-agua',
    title: 'Contenedor con más agua',
    category: 'optimization',
    difficulty: 'hard',
    xp: 200,
    tags: ['dos punteros', 'greedy', 'O(n)'],
    entryPoint: 'maxArea',
    description:
      'Dado un arreglo `height` de `n` alturas verticales, encuentra dos líneas que junto con el eje X formen un contenedor que almacene la **mayor cantidad de agua posible**.\n\n' +
      'El área entre `i` y `j` es `(j - i) * min(height[i], height[j])`. Optimiza la solución a `O(n)`.',
    examples: [
      { input: 'height = [1, 8, 6, 2, 5, 4, 8, 3, 7]', output: '49', explanation: 'Entre índice 1 (altura 8) e índice 8 (altura 7): 7 * 7 = 49.' },
    ],
    constraints: ['2 <= height.length <= 10^5', 'Complejidad temporal O(n)'],
    hints: [
      'Coloca un puntero en el extremo izquierdo `0` y otro en el derecho `n - 1`.',
      'En cada paso calcula el área actual y actualiza el máximo.',
      'Mueve siempre el puntero que tenga la altura menor, porque mover el mayor nunca puede aumentar el límite vertical.',
    ],
    languages: ['javascript', 'python', 'java', 'cpp'],
    starterCode: {
      javascript: `function maxArea(height) {\n  // Dos punteros en O(n)\n  return 0;\n}`,
      python: `def maxArea(height: list[int]) -> int:\n    return 0`,
      java: `class Solution {\n    public int maxArea(int[] height) {\n        return 0;\n    }\n}`,
      cpp: `#include <vector>\nusing namespace std;\n\nint maxArea(vector<int>& height) {\n    return 0;\n}`,
    },
    referenceSolution: {
      javascript: `function maxArea(height) {\n  let l = 0;\n  let r = height.length - 1;\n  let best = 0;\n  while (l < r) {\n    const area = (r - l) * Math.min(height[l], height[r]);\n    if (area > best) best = area;\n    if (height[l] < height[r]) l++;\n    else r--;\n  }\n  return best;\n}`,
      python: `def maxArea(height: list[int]) -> int:\n    l, r = 0, len(height) - 1\n    best = 0\n    while l < r:\n        best = max(best, (r - l) * min(height[l], height[r]))\n        if height[l] < height[r]:\n            l += 1\n        else:\n            r -= 1\n    return best`,
      java: `class Solution {\n    public int maxArea(int[] height) {\n        int l = 0, r = height.length - 1, best = 0;\n        while (l < r) {\n            best = Math.max(best, (r - l) * Math.min(height[l], height[r]));\n            if (height[l] < height[r]) l++;\n            else r--;\n        }\n        return best;\n    }\n}`,
      cpp: `#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint maxArea(vector<int>& height) {\n    int l = 0, r = (int)height.size() - 1, best = 0;\n    while (l < r) {\n        best = max(best, (r - l) * min(height[l], height[r]));\n        if (height[l] < height[r]) l++;\n        else r--;\n    }\n    return best;\n}`,
    },
    tests: {
      visible: [
        { id: 't1', input: [[1, 8, 6, 2, 5, 4, 8, 3, 7]], expected: 49, inputDisplay: 'height = [1,8,6,2,5,4,8,3,7]', expectedDisplay: '49' },
        { id: 't2', input: [[1, 1]], expected: 1, inputDisplay: 'height = [1,1]', expectedDisplay: '1' },
      ],
      hidden: [
        { id: 't3', input: [[4, 3, 2, 1, 4]], expected: 16, inputDisplay: 'height = [4,3,2,1,4]', expectedDisplay: '16' },
        { id: 't4', input: [[1, 2, 1]], expected: 2, inputDisplay: 'height = [1,2,1]', expectedDisplay: '2' },
      ],
    },
  },
  {
    id: 'subsecuencia-creciente',
    title: 'Subsecuencia creciente más larga (LIS)',
    category: 'optimization',
    difficulty: 'expert',
    xp: 350,
    tags: ['búsqueda binaria', 'O(n log n)', 'programación dinámica'],
    entryPoint: 'lengthOfLIS',
    description:
      'Dado un arreglo de enteros `nums`, devuelve la longitud de la **subsecuencia estrictamente creciente más larga**.\n\n' +
      'Una subsecuencia se obtiene eliminando cero o más elementos sin cambiar el orden relativo. Optimiza tu solución a `O(n log n)` usando *patience sorting* con búsqueda binaria.',
    examples: [
      { input: 'nums = [10, 9, 2, 5, 3, 7, 101, 18]', output: '4', explanation: 'La subsecuencia [2, 3, 7, 101] tiene longitud 4.' },
      { input: 'nums = [7, 7, 7, 7]', output: '1' },
    ],
    constraints: ['1 <= nums.length <= 2500', 'Complejidad objetivo O(n log n)'],
    hints: [
      'Mantén un arreglo `tails` donde `tails[k]` almacena el menor valor final posible de una subsecuencia creciente de longitud `k + 1`.',
      '`tails` siempre se mantiene estrictamente ordenado, lo que permite buscar con búsqueda binaria.',
      'Para cada `num`, busca la primera posición en `tails` con valor `>= num` y reemplázala (o añade al final si es mayor que todos).',
    ],
    languages: ['javascript', 'python', 'java', 'cpp'],
    starterCode: {
      javascript: `function lengthOfLIS(nums) {\n  // Optimiza a O(n log n) con búsqueda binaria\n  return 0;\n}`,
      python: `def lengthOfLIS(nums: list[int]) -> int:\n    return 0`,
      java: `class Solution {\n    public int lengthOfLIS(int[] nums) {\n        return 0;\n    }\n}`,
      cpp: `#include <vector>\nusing namespace std;\n\nint lengthOfLIS(vector<int>& nums) {\n    return 0;\n}`,
    },
    referenceSolution: {
      javascript: `function lengthOfLIS(nums) {\n  const tails = [];\n  for (const num of nums) {\n    let l = 0;\n    let r = tails.length;\n    while (l < r) {\n      const mid = (l + r) >> 1;\n      if (tails[mid] < num) l = mid + 1;\n      else r = mid;\n    }\n    tails[l] = num;\n  }\n  return tails.length;\n}`,
      python: `from bisect import bisect_left\n\ndef lengthOfLIS(nums: list[int]) -> int:\n    tails = []\n    for num in nums:\n        idx = bisect_left(tails, num)\n        if idx == len(tails):\n            tails.append(num)\n        else:\n            tails[idx] = num\n    return len(tails)`,
      java: `class Solution {\n    public int lengthOfLIS(int[] nums) {\n        int[] tails = new int[nums.length];\n        int size = 0;\n        for (int num : nums) {\n            int l = 0, r = size;\n            while (l < r) {\n                int m = (l + r) / 2;\n                if (tails[m] < num) l = m + 1;\n                else r = m;\n            }\n            tails[l] = num;\n            if (l == size) size++;\n        }\n        return size;\n    }\n}`,
      cpp: `#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint lengthOfLIS(vector<int>& nums) {\n    vector<int> tails;\n    for (int num : nums) {\n        auto it = lower_bound(tails.begin(), tails.end(), num);\n        if (it == tails.end()) tails.push_back(num);\n        else *it = num;\n    }\n    return tails.size();\n}`,
    },
    tests: {
      visible: [
        { id: 't1', input: [[10, 9, 2, 5, 3, 7, 101, 18]], expected: 4, inputDisplay: 'nums = [10,9,2,5,3,7,101,18]', expectedDisplay: '4' },
        { id: 't2', input: [[7, 7, 7, 7]], expected: 1, inputDisplay: 'nums = [7,7,7,7]', expectedDisplay: '1' },
      ],
      hidden: [
        { id: 't3', input: [[0, 1, 0, 3, 2, 3]], expected: 4, inputDisplay: 'nums = [0,1,0,3,2,3]', expectedDisplay: '4' },
        { id: 't4', input: [[1, 3, 6, 7, 9, 4, 10, 5, 6]], expected: 6, inputDisplay: 'nums = [1,3,6,7,9,4,10,5,6]', expectedDisplay: '6' },
      ],
    },
  },
];
