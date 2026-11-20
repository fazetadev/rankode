import type { Challenge } from '../../types';

export const NEW_LOGIC_CHALLENGES: Challenge[] = [
  {
    id: 'contar-vocales',
    title: 'Contar vocales',
    category: 'logic',
    difficulty: 'easy',
    xp: 50,
    acceptanceRate: 88,
    tags: ['strings', 'arrays'],
    entryPoint: 'countVowels',
    description:
      'Dada una cadena de texto `s`, devuelve la cantidad total de vocales (`a, e, i, o, u`) sin importar si están en mayúsculas o minúsculas.\n\n' +
      'Para simplificar, considera únicamente vocales ASCII sin tilde.',
    examples: [
      { input: 's = "rankode"', output: '3' },
      { input: 's = "AEIOU xyz"', output: '5' },
    ],
    constraints: ['0 <= s.length <= 10^4'],
    hints: [
      'Convierte cada carácter a minúscula antes de comprobarlo.',
      'Usa un Set o una cadena `"aeiou"` para verificar pertenencia en O(1).',
      'Recorre toda la cadena sumando 1 por cada coincidencia.',
    ],
    languages: ['javascript', 'python', 'java', 'cpp'],
    starterCode: {
      javascript: `function countVowels(s) {\n  // Devuelve el total de vocales en s\n  return 0;\n}`,
      python: `def countVowels(s: str) -> int:\n    # Devuelve el total de vocales en s\n    return 0`,
      java: `class Solution {\n    public int countVowels(String s) {\n        return 0;\n    }\n}`,
      cpp: `#include <string>\nusing namespace std;\n\nint countVowels(string s) {\n    return 0;\n}`,
    },
    referenceSolution: {
      javascript: `function countVowels(s) {\n  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n  let count = 0;\n  for (const ch of s.toLowerCase()) {\n    if (vowels.has(ch)) count++;\n  }\n  return count;\n}`,
      python: `def countVowels(s: str) -> int:\n    vowels = set("aeiou")\n    count = 0\n    for ch in s.lower():\n        if ch in vowels:\n            count += 1\n    return count`,
      java: `class Solution {\n    public int countVowels(String s) {\n        String lower = s.toLowerCase();\n        int count = 0;\n        for (int i = 0; i < lower.length(); i++) {\n            char c = lower.charAt(i);\n            if (c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u') count++;\n        }\n        return count;\n    }\n}`,
      cpp: `#include <string>\n#include <cctype>\nusing namespace std;\n\nint countVowels(string s) {\n    int count = 0;\n    for (char ch : s) {\n        char c = tolower((unsigned char)ch);\n        if (c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u') count++;\n    }\n    return count;\n}`,
    },
    tests: {
      visible: [
        { id: 't1', input: ['rankode'], expected: 3, inputDisplay: 's = "rankode"', expectedDisplay: '3' },
        { id: 't2', input: ['AEIOU xyz'], expected: 5, inputDisplay: 's = "AEIOU xyz"', expectedDisplay: '5' },
      ],
      hidden: [
        { id: 't3', input: ['bcdfg'], expected: 0, inputDisplay: 's = "bcdfg"', expectedDisplay: '0' },
        { id: 't4', input: [''], expected: 0, inputDisplay: 's = ""', expectedDisplay: '0' },
      ],
    },
    editorial: {
      explanation: 'Recorre la cadena carácter por carácter en minúsculas y verifica si pertenece al conjunto `{a, e, i, o, u}`.',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      approaches: [{ name: 'Búsqueda en Set constante', note: 'Tiempo lineal con espacio auxiliar constante.' }],
    },
  },
  {
    id: 'suma-digitos',
    title: 'Suma de dígitos',
    category: 'logic',
    difficulty: 'easy',
    xp: 50,
    acceptanceRate: 86,
    tags: ['math', 'recursion'],
    entryPoint: 'sumDigits',
    description:
      'Dado un entero `n` (puede ser negativo o cero), devuelve la suma de sus dígitos en valor absoluto.',
    examples: [
      { input: 'n = 492', output: '15', explanation: '4 + 9 + 2 = 15' },
      { input: 'n = -305', output: '8' },
    ],
    constraints: ['-10^9 <= n <= 10^9'],
    hints: [
      'Convierte `n` primero a valor absoluto (`Math.abs(n)`).',
      'Puedes obtener el último dígito con `num % 10` y reducirlo con división entera entre 10.',
      'También puedes convertir a cadena, pero la aritmética modular evita asignaciones.',
    ],
    languages: ['javascript', 'python', 'java', 'cpp'],
    starterCode: {
      javascript: `function sumDigits(n) {\n  // Suma los dígitos de |n|\n  return -1;\n}`,
      python: `def sumDigits(n: int) -> int:\n    # Suma los dígitos de |n|\n    return -1`,
      java: `class Solution {\n    public int sumDigits(int n) {\n        return -1;\n    }\n}`,
      cpp: `int sumDigits(int n) {\n    return -1;\n}`,
    },
    referenceSolution: {
      javascript: `function sumDigits(n) {\n  let num = Math.abs(n);\n  let total = 0;\n  while (num > 0) {\n    total += num % 10;\n    num = Math.floor(num / 10);\n  }\n  return total;\n}`,
      python: `def sumDigits(n: int) -> int:\n    num = abs(n)\n    total = 0\n    while num > 0:\n        total += num % 10\n        num //= 10\n    return total`,
      java: `class Solution {\n    public int sumDigits(int n) {\n        int num = Math.abs(n);\n        int total = 0;\n        while (num > 0) {\n            total += num % 10;\n            num /= 10;\n        }\n        return total;\n    }\n}`,
      cpp: `#include <cstdlib>\nusing namespace std;\n\nint sumDigits(int n) {\n    long long num = llabs((long long)n);\n    int total = 0;\n    while (num > 0) {\n        total += (int)(num % 10);\n        num /= 10;\n    }\n    return total;\n}`,
    },
    tests: {
      visible: [
        { id: 't1', input: [492], expected: 15, inputDisplay: 'n = 492', expectedDisplay: '15' },
        { id: 't2', input: [-305], expected: 8, inputDisplay: 'n = -305', expectedDisplay: '8' },
      ],
      hidden: [
        { id: 't3', input: [0], expected: 0, inputDisplay: 'n = 0', expectedDisplay: '0' },
        { id: 't4', input: [99999], expected: 45, inputDisplay: 'n = 99999', expectedDisplay: '45' },
      ],
    },
    editorial: {
      explanation: 'Toma `|n|` y extrae dígitos repetidamente con `% 10` y división entera entre `10` hasta llegar a `0`.',
      timeComplexity: 'O(log₁₀ n)',
      spaceComplexity: 'O(1)',
      approaches: [{ name: 'Módulo y división entera', note: 'Sin conversión a string ni memoria extra.' }],
    },
  },
  {
    id: 'maximo-sin-math-max',
    title: 'Máximo sin Math.max',
    category: 'logic',
    difficulty: 'easy',
    xp: 50,
    acceptanceRate: 85,
    tags: ['arrays'],
    entryPoint: 'findMax',
    description:
      'Dado un arreglo no vacío de enteros `nums`, encuentra y devuelve el valor máximo **sin usar** `Math.max`, `max()` ni ordenar el arreglo.',
    examples: [
      { input: 'nums = [3, 19, -4, 7]', output: '19' },
      { input: 'nums = [-10, -2, -30]', output: '-2' },
    ],
    constraints: ['1 <= nums.length <= 10^4', 'No usar Math.max / max() / sort()'],
    hints: [
      'Inicializa `best = nums[0]` (no uses `0`, porque todos los números podrían ser negativos).',
      'Recorre desde el índice 1 comparando cada elemento con `best`.',
      'Si `nums[i] > best`, actualiza `best = nums[i]`.',
    ],
    languages: ['javascript', 'python', 'java', 'cpp'],
    starterCode: {
      javascript: `function findMax(nums) {\n  // Encuentra el mayor elemento sin usar Math.max\n  return 0;\n}`,
      python: `def findMax(nums: list[int]) -> int:\n    # Encuentra el mayor elemento sin usar max()\n    return 0`,
      java: `class Solution {\n    public int findMax(int[] nums) {\n        return 0;\n    }\n}`,
      cpp: `#include <vector>\nusing namespace std;\n\nint findMax(vector<int> nums) {\n    return 0;\n}`,
    },
    referenceSolution: {
      javascript: `function findMax(nums) {\n  let best = nums[0];\n  for (let i = 1; i < nums.length; i++) {\n    if (nums[i] > best) best = nums[i];\n  }\n  return best;\n}`,
      python: `def findMax(nums: list[int]) -> int:\n    best = nums[0]\n    for i in range(1, len(nums)):\n        if nums[i] > best:\n            best = nums[i]\n    return best`,
      java: `class Solution {\n    public int findMax(int[] nums) {\n        int best = nums[0];\n        for (int i = 1; i < nums.length; i++) {\n            if (nums[i] > best) best = nums[i];\n        }\n        return best;\n    }\n}`,
      cpp: `#include <vector>\nusing namespace std;\n\nint findMax(vector<int> nums) {\n    int best = nums[0];\n    for (size_t i = 1; i < nums.size(); i++) {\n        if (nums[i] > best) best = nums[i];\n    }\n    return best;\n}`,
    },
    tests: {
      visible: [
        { id: 't1', input: [[3, 19, -4, 7]], expected: 19, inputDisplay: 'nums = [3,19,-4,7]', expectedDisplay: '19' },
        { id: 't2', input: [[-10, -2, -30]], expected: -2, inputDisplay: 'nums = [-10,-2,-30]', expectedDisplay: '-2' },
      ],
      hidden: [
        { id: 't3', input: [[42]], expected: 42, inputDisplay: 'nums = [42]', expectedDisplay: '42' },
        { id: 't4', input: [[-5, -1, -99]], expected: -1, inputDisplay: 'nums = [-5,-1,-99]', expectedDisplay: '-1' },
      ],
    },
    validationHints: {
      forbiddenSubstrings: {
        python: ['max('],
        java: ['Math.max'],
        cpp: ['max_element'],
      },
    },
    editorial: {
      explanation: 'Inicializa el máximo con `nums[0]` para soportar arreglos totalmente negativos y recorre linealmente.',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      approaches: [{ name: 'Escaneo lineal', note: 'Una pasada y cero memoria adicional.' }],
    },
  },
  {
    id: 'contar-palabras',
    title: 'Contar palabras',
    category: 'logic',
    difficulty: 'medium',
    xp: 100,
    acceptanceRate: 74,
    tags: ['strings'],
    entryPoint: 'countWords',
    description:
      'Dada una cadena `s` que puede contener múltiples espacios seguidos, espacios al inicio o al final, devuelve cuántas palabras no vacías contiene.',
    examples: [
      { input: 's = "  hola   mundo  rankode  "', output: '3' },
      { input: 's = "   "', output: '0' },
    ],
    constraints: ['0 <= s.length <= 10^4'],
    hints: [
      'Recortar espacios extremos con `trim()` evita cadenas vacías al dividir.',
      'Cuidado con `"".split(" ")` en JS, que devuelve `[""]` de longitud 1.',
      'Una máquina de estados booleana `inWord` resuelve el problema en O(1) espacio.',
    ],
    languages: ['javascript', 'python', 'java', 'cpp'],
    starterCode: {
      javascript: `function countWords(s) {\n  // Cuenta palabras separadas por espacios\n  return -1;\n}`,
      python: `def countWords(s: str) -> int:\n    # Cuenta palabras separadas por espacios\n    return -1`,
      java: `class Solution {\n    public int countWords(String s) {\n        return -1;\n    }\n}`,
      cpp: `#include <string>\nusing namespace std;\n\nint countWords(string s) {\n    return -1;\n}`,
    },
    referenceSolution: {
      javascript: `function countWords(s) {\n  let count = 0;\n  let inWord = false;\n  for (let i = 0; i < s.length; i++) {\n    if (s[i] !== ' ' && s[i] !== '\\t' && s[i] !== '\\n') {\n      if (!inWord) {\n        count++;\n        inWord = true;\n      }\n    } else {\n      inWord = false;\n    }\n  }\n  return count;\n}`,
      python: `def countWords(s: str) -> int:\n    return len(s.split())`,
      java: `class Solution {\n    public int countWords(String s) {\n        String trimmed = s.trim();\n        if (trimmed.isEmpty()) return 0;\n        return trimmed.split("\\\\s+").length;\n    }\n}`,
      cpp: `#include <string>\n#include <sstream>\nusing namespace std;\n\nint countWords(string s) {\n    istringstream iss(s);\n    string word;\n    int count = 0;\n    while (iss >> word) count++;\n    return count;\n}`,
    },
    tests: {
      visible: [
        { id: 't1', input: ['  hola   mundo  rankode  '], expected: 3, inputDisplay: 's = "  hola   mundo  rankode  "', expectedDisplay: '3' },
        { id: 't2', input: ['   '], expected: 0, inputDisplay: 's = "   "', expectedDisplay: '0' },
      ],
      hidden: [
        { id: 't3', input: [''], expected: 0, inputDisplay: 's = ""', expectedDisplay: '0' },
        { id: 't4', input: ['una  dos\ttres\ncuatro'], expected: 4, inputDisplay: 's = "una  dos\\ttres\\ncuatro"', expectedDisplay: '4' },
      ],
    },
    editorial: {
      explanation: 'Cuenta transiciones de espacio a carácter no blanco con una bandera `inWord`, evitando crear arreglos intermedios.',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      approaches: [
        { name: 'Bandera inWord', note: 'Espacio constante O(1).' },
        { name: 'trim + split(/\\s+/)', note: 'Legible y conciso manejando el caso vacío.' },
      ],
    },
  },
  {
    id: 'eliminar-duplicados-ordenado',
    title: 'Eliminar duplicados de array ordenado',
    category: 'logic',
    difficulty: 'medium',
    xp: 100,
    acceptanceRate: 70,
    tags: ['arrays', 'two-pointers'],
    entryPoint: 'uniqueSorted',
    description:
      'Dado un arreglo de enteros **ya ordenado** de forma no decreciente `nums`, devuelve un nuevo arreglo con los elementos únicos manteniendo el orden ascendente.',
    examples: [
      { input: 'nums = [1, 1, 2, 2, 3, 4, 4]', output: '[1, 2, 3, 4]' },
      { input: 'nums = []', output: '[]' },
    ],
    constraints: ['0 <= nums.length <= 10^4', 'nums está ordenado'],
    hints: [
      'Como el arreglo está ordenado, los duplicados siempre son adyacentes.',
      'Compara cada elemento con el último agregado al arreglo de salida.',
      'Si `nums.length === 0`, devuelve `[]` directamente.',
    ],
    languages: ['javascript', 'python', 'java', 'cpp'],
    starterCode: {
      javascript: `function uniqueSorted(nums) {\n  // Devuelve un arreglo sin duplicados\n  return null;\n}`,
      python: `def uniqueSorted(nums: list[int]) -> list[int]:\n    # Devuelve una lista sin duplicados\n    return [-1]`,
      java: `import java.util.*;\n\nclass Solution {\n    public List<Integer> uniqueSorted(int[] nums) {\n        return Collections.singletonList(-1);\n    }\n}`,
      cpp: `#include <vector>\nusing namespace std;\n\nvector<int> uniqueSorted(vector<int> nums) {\n    return {-1};\n}`,
    },
    referenceSolution: {
      javascript: `function uniqueSorted(nums) {\n  if (nums.length === 0) return [];\n  const out = [nums[0]];\n  for (let i = 1; i < nums.length; i++) {\n    if (nums[i] !== nums[i - 1]) out.push(nums[i]);\n  }\n  return out;\n}`,
      python: `def uniqueSorted(nums: list[int]) -> list[int]:\n    if not nums:\n        return []\n    out = [nums[0]]\n    for i in range(1, len(nums)):\n        if nums[i] != nums[i - 1]:\n            out.append(nums[i])\n    return out`,
      java: `import java.util.*;\n\nclass Solution {\n    public List<Integer> uniqueSorted(int[] nums) {\n        List<Integer> out = new ArrayList<>();\n        for (int i = 0; i < nums.length; i++) {\n            if (i == 0 || nums[i] != nums[i - 1]) out.add(nums[i]);\n        }\n        return out;\n    }\n}`,
      cpp: `#include <vector>\nusing namespace std;\n\nvector<int> uniqueSorted(vector<int> nums) {\n    vector<int> out;\n    for (size_t i = 0; i < nums.size(); i++) {\n        if (i == 0 || nums[i] != nums[i - 1]) out.push_back(nums[i]);\n    }\n    return out;\n}`,
    },
    tests: {
      visible: [
        { id: 't1', input: [[1, 1, 2, 2, 3, 4, 4]], expected: [1, 2, 3, 4], inputDisplay: 'nums = [1,1,2,2,3,4,4]', expectedDisplay: '[1, 2, 3, 4]' },
        { id: 't2', input: [[]], expected: [], inputDisplay: 'nums = []', expectedDisplay: '[]' },
      ],
      hidden: [
        { id: 't3', input: [[-3, -3, -1, 0, 0, 5]], expected: [-3, -1, 0, 5], inputDisplay: 'nums = [-3,-3,-1,0,0,5]', expectedDisplay: '[-3, -1, 0, 5]' },
        { id: 't4', input: [[7]], expected: [7], inputDisplay: 'nums = [7]', expectedDisplay: '[7]' },
      ],
    },
    editorial: {
      explanation: 'Al estar ordenado, basta comparar `nums[i]` con `nums[i - 1]` para omitir repeticiones consecutivas sin usar `Set`.',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      approaches: [{ name: 'Comparación adyacente', note: 'Aprovecha el orden previo en una sola pasada.' }],
    },
  },
  {
    id: 'rotar-array-k',
    title: 'Rotar array k posiciones',
    category: 'logic',
    difficulty: 'medium',
    xp: 100,
    acceptanceRate: 63,
    tags: ['arrays', 'two-pointers', 'math'],
    entryPoint: 'rotateArray',
    description:
      'Dado un arreglo `nums` y un entero no negativo `k`, devuelve un nuevo arreglo rotado `k` posiciones hacia la derecha.\n\n' +
      'Ten en cuenta que `k` puede ser mayor que `nums.length`.',
    examples: [
      { input: 'nums = [1, 2, 3, 4, 5], k = 2', output: '[4, 5, 1, 2, 3]' },
      { input: 'nums = [1, 2], k = 5', output: '[2, 1]' },
    ],
    constraints: ['0 <= nums.length <= 10^4', '0 <= k <= 10^5'],
    hints: [
      'Reduce `k` con `k = k % nums.length` para evitar rotaciones completas innecesarias.',
      'Un elemento en índice `i` termina en `(i + k) % n`.',
      'También puedes invertir todo el arreglo, luego los primeros `k` elementos y luego el resto.',
    ],
    languages: ['javascript', 'python', 'java', 'cpp'],
    starterCode: {
      javascript: `function rotateArray(nums, k) {\n  // Devuelve un nuevo arreglo rotado k a la derecha\n  return null;\n}`,
      python: `def rotateArray(nums: list[int], k: int) -> list[int]:\n    # Devuelve la lista rotada k a la derecha\n    return [-1]`,
      java: `class Solution {\n    public int[] rotateArray(int[] nums, int k) {\n        return new int[]{-1};\n    }\n}`,
      cpp: `#include <vector>\nusing namespace std;\n\nvector<int> rotateArray(vector<int> nums, int k) {\n    return {-1};\n}`,
    },
    referenceSolution: {
      javascript: `function rotateArray(nums, k) {\n  const n = nums.length;\n  if (n === 0) return [];\n  const shift = k % n;\n  const res = new Array(n);\n  for (let i = 0; i < n; i++) {\n    res[(i + shift) % n] = nums[i];\n  }\n  return res;\n}`,
      python: `def rotateArray(nums: list[int], k: int) -> list[int]:\n    n = len(nums)\n    if n == 0:\n        return []\n    shift = k % n\n    return nums[-shift:] + nums[:-shift] if shift else list(nums)`,
      java: `class Solution {\n    public int[] rotateArray(int[] nums, int k) {\n        int n = nums.length;\n        if (n == 0) return new int[0];\n        int shift = k % n;\n        int[] res = new int[n];\n        for (int i = 0; i < n; i++) {\n            res[(i + shift) % n] = nums[i];\n        }\n        return res;\n    }\n}`,
      cpp: `#include <vector>\nusing namespace std;\n\nvector<int> rotateArray(vector<int> nums, int k) {\n    int n = (int)nums.size();\n    if (n == 0) return {};\n    int shift = k % n;\n    vector<int> res(n);\n    for (int i = 0; i < n; i++) {\n        res[(i + shift) % n] = nums[i];\n    }\n    return res;\n}`,
    },
    tests: {
      visible: [
        { id: 't1', input: [[1, 2, 3, 4, 5], 2], expected: [4, 5, 1, 2, 3], inputDisplay: 'nums = [1,2,3,4,5], k = 2', expectedDisplay: '[4, 5, 1, 2, 3]' },
        { id: 't2', input: [[1, 2], 5], expected: [2, 1], inputDisplay: 'nums = [1,2], k = 5', expectedDisplay: '[2, 1]' },
      ],
      hidden: [
        { id: 't3', input: [[], 3], expected: [], inputDisplay: 'nums = [], k = 3', expectedDisplay: '[]' },
        { id: 't4', input: [[10, 20, 30], 0], expected: [10, 20, 30], inputDisplay: 'nums = [10,20,30], k = 0', expectedDisplay: '[10, 20, 30]' },
      ],
    },
    editorial: {
      explanation: 'Normaliza `shift = k % n` y ubica cada elemento `i` en `(i + shift) % n` para no mutar la entrada y lograr tiempo lineal.',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      approaches: [{ name: 'Mapeo modular', note: 'Calcula el índice destino directo con módulo.' }],
    },
  },
  {
    id: 'numero-perfecto',
    title: 'Número perfecto',
    category: 'logic',
    difficulty: 'hard',
    xp: 200,
    acceptanceRate: 56,
    tags: ['math'],
    entryPoint: 'isPerfectNumber',
    description:
      'Un **número perfecto** es un entero positivo igual a la suma de todos sus divisores positivos propios (excluyendo el propio número).\n\n' +
      'Dado un entero `n`, devuelve `true` si es perfecto y `false` en caso contrario. Evita iterar hasta `n`: aprovecha los pares de divisores hasta `√n`.',
    examples: [
      { input: 'n = 28', output: 'true', explanation: '1 + 2 + 4 + 7 + 14 = 28' },
      { input: 'n = 12', output: 'false' },
    ],
    constraints: ['1 <= n <= 10^8', 'Complejidad objetivo O(√n)'],
    hints: [
      'El 1 no es perfecto porque no tiene divisores propios positivos que sumen 1.',
      'Comienza `sum = 1` para `n > 1` e itera `d` desde `2` hasta `Math.floor(Math.sqrt(n))`.',
      'Si `n % d === 0`, suma `d` y también `n / d` (siempre que `d !== n / d`).',
    ],
    languages: ['javascript', 'python', 'java', 'cpp'],
    starterCode: {
      javascript: `function isPerfectNumber(n) {\n  // Devuelve true si n es un número perfecto\n  return null;\n}`,
      python: `def isPerfectNumber(n: int) -> bool:\n    # Devuelve True si n es un número perfecto\n    return None`,
      java: `class Solution {\n    public boolean isPerfectNumber(int n) {\n        return false;\n    }\n}`,
      cpp: `bool isPerfectNumber(int n) {\n    return false;\n}`,
    },
    referenceSolution: {
      javascript: `function isPerfectNumber(n) {\n  if (n <= 1) return false;\n  let sum = 1;\n  for (let d = 2; d * d <= n; d++) {\n    if (n % d === 0) {\n      sum += d;\n      const other = n / d;\n      if (other !== d) sum += other;\n    }\n  }\n  return sum === n;\n}`,
      python: `def isPerfectNumber(n: int) -> bool:\n    if n <= 1:\n        return False\n    total = 1\n    d = 2\n    while d * d <= n:\n        if n % d == 0:\n            total += d\n            other = n // d\n            if other != d:\n                total += other\n        d += 1\n    return total == n`,
      java: `class Solution {\n    public boolean isPerfectNumber(int n) {\n        if (n <= 1) return false;\n        int sum = 1;\n        for (int d = 2; (long) d * d <= n; d++) {\n            if (n % d == 0) {\n                sum += d;\n                int other = n / d;\n                if (other != d) sum += other;\n            }\n        }\n        return sum == n;\n    }\n}`,
      cpp: `bool isPerfectNumber(int n) {\n    if (n <= 1) return false;\n    int sum = 1;\n    for (long long d = 2; d * d <= n; d++) {\n        if (n % d == 0) {\n            sum += (int)d;\n            long long other = n / d;\n            if (other != d) sum += (int)other;\n        }\n    }\n    return sum == n;\n}`,
    },
    tests: {
      visible: [
        { id: 't1', input: [28], expected: true, inputDisplay: 'n = 28', expectedDisplay: 'true' },
        { id: 't2', input: [12], expected: false, inputDisplay: 'n = 12', expectedDisplay: 'false' },
      ],
      hidden: [
        { id: 't3', input: [1], expected: false, inputDisplay: 'n = 1', expectedDisplay: 'false' },
        { id: 't4', input: [496], expected: true, inputDisplay: 'n = 496', expectedDisplay: 'true' },
        { id: 't5', input: [8128], expected: true, inputDisplay: 'n = 8128', expectedDisplay: 'true' },
      ],
    },
    editorial: {
      explanation: 'Los divisores vienen en pares `(d, n / d)`. Explorando hasta `√n` reducimos la complejidad de `O(n)` a `O(√n)`.',
      timeComplexity: 'O(√n)',
      spaceComplexity: 'O(1)',
      approaches: [{ name: 'Pares de divisores hasta √n', note: 'Evita sumar dos veces la raíz cuadrada cuando d * d === n.' }],
    },
  },
  {
    id: 'convertir-a-binario',
    title: 'Convertir a binario',
    category: 'logic',
    difficulty: 'hard',
    xp: 200,
    acceptanceRate: 61,
    tags: ['bits', 'math', 'strings'],
    entryPoint: 'toBinary',
    description:
      'Dado un entero `n` (puede ser `0` o negativo), devuelve su representación binaria en cadena de texto **sin usar** `toString(2)` ni `bin()`. Si `n < 0`, antepón el signo `"-"`.',
    examples: [
      { input: 'n = 13', output: '"1101"' },
      { input: 'n = -6', output: '"-110"' },
    ],
    constraints: ['-10^9 <= n <= 10^9', 'Prohibido usar toString(2) o bin()'],
    hints: [
      'El caso `n === 0` debe devolver `"0"`.',
      'Divide repetidamente entre 2 guardando el resto (`num % 2`) en orden inverso.',
      'Si `n < 0`, calcula el binario de `|n|` y antepón `"-"`.',
    ],
    languages: ['javascript', 'python', 'java', 'cpp'],
    starterCode: {
      javascript: `function toBinary(n) {\n  // Convierte n a binario sin toString(2)\n  return '';\n}`,
      python: `def toBinary(n: int) -> str:\n    # Convierte n a binario sin bin()\n    return ""`,
      java: `class Solution {\n    public String toBinary(int n) {\n        return "";\n    }\n}`,
      cpp: `#include <string>\nusing namespace std;\n\nstring toBinary(int n) {\n    return "";\n}`,
    },
    referenceSolution: {
      javascript: `function toBinary(n) {\n  if (n === 0) return '0';\n  const sign = n < 0 ? '-' : '';\n  let num = Math.abs(n);\n  const bits = [];\n  while (num > 0) {\n    bits.push(String(num % 2));\n    num = Math.floor(num / 2);\n  }\n  return sign + bits.reverse().join('');\n}`,
      python: `def toBinary(n: int) -> str:\n    if n == 0:\n        return "0"\n    sign = "-" if n < 0 else ""\n    num = abs(n)\n    bits = []\n    while num > 0:\n        bits.append(str(num % 2))\n        num //= 2\n    return sign + "".join(reversed(bits))`,
      java: `class Solution {\n    public String toBinary(int n) {\n        if (n == 0) return "0";\n        String sign = n < 0 ? "-" : "";\n        long num = Math.abs((long) n);\n        StringBuilder sb = new StringBuilder();\n        while (num > 0) {\n            sb.append(num % 2);\n            num /= 2;\n        }\n        return sign + sb.reverse().toString();\n    }\n}`,
      cpp: `#include <string>\n#include <algorithm>\nusing namespace std;\n\nstring toBinary(int n) {\n    if (n == 0) return "0";\n    string sign = n < 0 ? "-" : "";\n    long long num = n < 0 ? -(long long)n : (long long)n;\n    string bits;\n    while (num > 0) {\n        bits.push_back((char)('0' + (num % 2)));\n        num /= 2;\n    }\n    reverse(bits.begin(), bits.end());\n    return sign + bits;\n}`,
    },
    tests: {
      visible: [
        { id: 't1', input: [13], expected: '1101', inputDisplay: 'n = 13', expectedDisplay: '"1101"' },
        { id: 't2', input: [-6], expected: '-110', inputDisplay: 'n = -6', expectedDisplay: '"-110"' },
      ],
      hidden: [
        { id: 't3', input: [0], expected: '0', inputDisplay: 'n = 0', expectedDisplay: '"0"' },
        { id: 't4', input: [255], expected: '11111111', inputDisplay: 'n = 255', expectedDisplay: '"11111111"' },
      ],
    },
    validationHints: {
      forbiddenSubstrings: {
        python: ['bin('],
        java: ['toBinaryString'],
      },
    },
    editorial: {
      explanation: 'Las divisiones sucesivas entre 2 generan los bits del menos significativo al más significativo. Basta invertirlos al final.',
      timeComplexity: 'O(log₂ |n|)',
      spaceComplexity: 'O(log₂ |n|)',
      approaches: [{ name: 'Divisiones sucesivas entre 2', note: 'Maneja 0 y signos negativos explícitamente.' }],
    },
  },
  {
    id: 'transponer-matriz',
    title: 'Transponer matriz',
    category: 'logic',
    difficulty: 'expert',
    xp: 350,
    acceptanceRate: 52,
    tags: ['matrix', 'arrays'],
    entryPoint: 'transposeMatrix',
    description:
      'Dada una matriz rectangular `matrix` de tamaño `m × n` (puede estar vacía), devuelve su matriz traspuesta de tamaño `n × m` sin mutar la matriz original.\n\n' +
      'El elemento `matrix[r][c]` pasa a la posición `result[c][r]`.',
    examples: [
      { input: 'matrix = [[1, 2, 3], [4, 5, 6]]', output: '[[1, 4], [2, 5], [3, 6]]' },
      { input: 'matrix = []', output: '[]' },
    ],
    constraints: ['0 <= m, n <= 500', 'Todas las filas tienen igual longitud'],
    hints: [
      'Comprueba `matrix.length === 0 || matrix[0].length === 0` al principio.',
      'La nueva matriz tiene `cols` filas y `rows` columnas.',
      'Asigna `out[c][r] = matrix[r][c]` con dos bucles limpios.',
    ],
    languages: ['javascript', 'python', 'java', 'cpp'],
    starterCode: {
      javascript: `function transposeMatrix(matrix) {\n  // Devuelve la matriz traspuesta\n  return null;\n}`,
      python: `def transposeMatrix(matrix: list[list[int]]) -> list[list[int]]:\n    # Devuelve la matriz traspuesta\n    return [[-1]]`,
      java: `class Solution {\n    public int[][] transposeMatrix(int[][] matrix) {\n        return new int[][]{{-1}};\n    }\n}`,
      cpp: `#include <vector>\nusing namespace std;\n\nvector<vector<int>> transposeMatrix(vector<vector<int>> matrix) {\n    return {{-1}};\n}`,
    },
    referenceSolution: {
      javascript: `function transposeMatrix(matrix) {\n  if (matrix.length === 0 || matrix[0].length === 0) return [];\n  const rows = matrix.length;\n  const cols = matrix[0].length;\n  const out = Array.from({ length: cols }, () => new Array(rows));\n  for (let r = 0; r < rows; r++) {\n    for (let c = 0; c < cols; c++) {\n      out[c][r] = matrix[r][c];\n    }\n  }\n  return out;\n}`,
      python: `def transposeMatrix(matrix: list[list[int]]) -> list[list[int]]:\n    if not matrix or not matrix[0]:\n        return []\n    rows, cols = len(matrix), len(matrix[0])\n    return [[matrix[r][c] for r in range(rows)] for c in range(cols)]`,
      java: `class Solution {\n    public int[][] transposeMatrix(int[][] matrix) {\n        if (matrix.length == 0 || matrix[0].length == 0) return new int[0][0];\n        int rows = matrix.length, cols = matrix[0].length;\n        int[][] out = new int[cols][rows];\n        for (int r = 0; r < rows; r++) {\n            for (int c = 0; c < cols; c++) {\n                out[c][r] = matrix[r][c];\n            }\n        }\n        return out;\n    }\n}`,
      cpp: `#include <vector>\nusing namespace std;\n\nvector<vector<int>> transposeMatrix(vector<vector<int>> matrix) {\n    if (matrix.empty() || matrix[0].empty()) return {};\n    int rows = (int)matrix.size();\n    int cols = (int)matrix[0].size();\n    vector<vector<int>> out(cols, vector<int>(rows));\n    for (int r = 0; r < rows; r++) {\n        for (int c = 0; c < cols; c++) {\n            out[c][r] = matrix[r][c];\n        }\n    }\n    return out;\n}`,
    },
    tests: {
      visible: [
        { id: 't1', input: [[[1, 2, 3], [4, 5, 6]]], expected: [[1, 4], [2, 5], [3, 6]], inputDisplay: 'matrix = [[1,2,3],[4,5,6]]', expectedDisplay: '[[1,4],[2,5],[3,6]]' },
        { id: 't2', input: [[]], expected: [], inputDisplay: 'matrix = []', expectedDisplay: '[]' },
      ],
      hidden: [
        { id: 't3', input: [[[7]]], expected: [[7]], inputDisplay: 'matrix = [[7]]', expectedDisplay: '[[7]]' },
        { id: 't4', input: [[[1, 2], [3, 4], [5, 6]]], expected: [[1, 3, 5], [2, 4, 6]], inputDisplay: 'matrix = [[1,2],[3,4],[5,6]]', expectedDisplay: '[[1,3,5],[2,4,6]]' },
      ],
    },
    editorial: {
      explanation: 'Construye una nueva matriz con dimensiones invertidas (`cols × rows`) y copia `out[c][r] = matrix[r][c]` validando matrices vacías.',
      timeComplexity: 'O(m · n)',
      spaceComplexity: 'O(m · n)',
      approaches: [{ name: 'Asignación por dimensiones invertidas', note: 'Funciona para cualquier matriz rectangular m × n.' }],
    },
  },
];
