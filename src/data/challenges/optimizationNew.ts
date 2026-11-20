import type { Challenge } from '../../types';

export const NEW_OPTIMIZATION_CHALLENGES: Challenge[] = [
  {
    id: 'interseccion-arrays-set',
    title: 'Intersección única con Set',
    category: 'optimization',
    difficulty: 'medium',
    xp: 100,
    acceptanceRate: 74,
    tags: ['hash set', 'arrays', 'O(n)'],
    entryPoint: 'intersectionUnique',
    targetComplexity: 'O(n)',
    perf: {
      sizeLabel: 'n = 4,000 elementos',
      maxMs: 150,
      build: () => [
        Array.from({ length: 4000 }, (_, i) => i * 2),
        Array.from({ length: 4000 }, (_, i) => i * 3),
      ],
    },
    description:
      'Dados dos arreglos de enteros `a` y `b`, devuelve un arreglo con los elementos **comunes y sin duplicados**, ordenados ascendentemente.\n\n' +
      'Evita búsquedas lineales anidadas (`O(n²)`) usando un conjunto (`Set`) para lograr tiempo `O(n + m)`.',
    examples: [
      { input: 'a = [4, 9, 5], b = [9, 4, 9, 8, 4]', output: '[4, 9]' },
      { input: 'a = [1, 2, 2, 1], b = [2, 2]', output: '[2]' },
    ],
    constraints: ['0 <= a.length, b.length <= 5 * 10^4', 'Complejidad objetivo O(n)'],
    hints: [
      'Convierte el primer arreglo en un `Set` para consultar pertenencia en `O(1)`.',
      'Recorre el segundo arreglo guardando las coincidencias en otro `Set` para evitar duplicados.',
      'Ordena numéricamente el arreglo resultante al final.',
    ],
    languages: ['javascript', 'python', 'java', 'cpp'],
    starterCode: {
      javascript: `function intersectionUnique(a, b) {\n  // Usa Set para intersección en O(n)\n  return [];\n}`,
      python: `def intersectionUnique(a: list[int], b: list[int]) -> list[int]:\n    return []`,
      java: `import java.util.*;\n\nclass Solution {\n    public List<Integer> intersectionUnique(int[] a, int[] b) {\n        return new ArrayList<>();\n    }\n}`,
      cpp: `#include <vector>\nusing namespace std;\n\nvector<int> intersectionUnique(vector<int>& a, vector<int>& b) {\n    return {};\n}`,
    },
    referenceSolution: {
      javascript: `function intersectionUnique(a, b) {\n  const setA = new Set(a);\n  const out = new Set();\n  for (const x of b) {\n    if (setA.has(x)) out.add(x);\n  }\n  return Array.from(out).sort((x, y) => x - y);\n}`,
      python: `def intersectionUnique(a: list[int], b: list[int]) -> list[int]:\n    return sorted(set(a) & set(b))`,
      java: `import java.util.*;\n\nclass Solution {\n    public List<Integer> intersectionUnique(int[] a, int[] b) {\n        Set<Integer> setA = new HashSet<>();\n        for (int x : a) setA.add(x);\n        Set<Integer> res = new TreeSet<>();\n        for (int x : b) if (setA.contains(x)) res.add(x);\n        return new ArrayList<>(res);\n    }\n}`,
      cpp: `#include <vector>\n#include <unordered_set>\n#include <algorithm>\nusing namespace std;\n\nvector<int> intersectionUnique(vector<int>& a, vector<int>& b) {\n    unordered_set<int> setA(a.begin(), a.end());\n    unordered_set<int> seen;\n    vector<int> res;\n    for (int x : b) {\n        if (setA.count(x) && !seen.count(x)) {\n            seen.insert(x);\n            res.push_back(x);\n        }\n    }\n    sort(res.begin(), res.end());\n    return res;\n}`,
    },
    tests: {
      visible: [
        { id: 't1', input: [[4, 9, 5], [9, 4, 9, 8, 4]], expected: [4, 9], inputDisplay: 'a = [4,9,5], b = [9,4,9,8,4]', expectedDisplay: '[4, 9]' },
        { id: 't2', input: [[1, 2, 2, 1], [2, 2]], expected: [2], inputDisplay: 'a = [1,2,2,1], b = [2,2]', expectedDisplay: '[2]' },
      ],
      hidden: [
        { id: 't3', input: [[1, 3], [2, 4]], expected: [], inputDisplay: 'a = [1,3], b = [2,4]', expectedDisplay: '[]' },
        { id: 't4', input: [[10, -2, 0], [0, -2, 5]], expected: [-2, 0], inputDisplay: 'a = [10,-2,0], b = [0,-2,5]', expectedDisplay: '[-2, 0]' },
      ],
    },
    editorial: {
      explanation:
        'Almacenar el primer arreglo en un conjunto hash reduce cada comprobación de `O(n)` a `O(1)` promedio. Recoger las coincidencias en un segundo conjunto elimina duplicados antes de devolver la lista ordenada.',
      timeComplexity: 'O(n + m + k log k)',
      spaceComplexity: 'O(n)',
      approaches: [
        { name: 'Doble HashSet', note: 'Construye Set(a) y filtra b en un segundo Set.' },
      ],
    },
    validationHints: {
      acceptedIdioms: {
        python: ['set(a)', 'set(b)'],
        java: ['HashSet', 'TreeSet'],
        cpp: ['unordered_set'],
      },
    },
  },
  {
    id: 'par-suma-objetivo-dos-punteros',
    title: 'Par con suma objetivo en arreglo ordenado',
    category: 'optimization',
    difficulty: 'medium',
    xp: 100,
    acceptanceRate: 72,
    tags: ['dos punteros', 'O(n)', 'búsqueda'],
    entryPoint: 'twoSumSorted',
    targetComplexity: 'O(n)',
    perf: {
      sizeLabel: 'n = 5,000 elementos',
      maxMs: 150,
      build: () => [
        Array.from({ length: 5000 }, (_, i) => i + 1),
        9999,
      ],
    },
    description:
      'Dado un arreglo `nums` **ordenado ascendentemente** y un entero `target`, encuentra dos índices `[i, j]` (`i < j`) tales que `nums[i] + nums[j] === target`.\n\n' +
      'Aprovecha que está ordenado para resolverlo en `O(n)` tiempo y `O(1)` espacio extra.',
    examples: [
      { input: 'nums = [2, 7, 11, 15], target = 9', output: '[0, 1]' },
      { input: 'nums = [-2, 1, 4, 8], target = 5', output: '[1, 2]' },
    ],
    constraints: ['2 <= nums.length <= 10^5', 'Siempre existe una única solución'],
    hints: [
      'Coloca un puntero `l = 0` al inicio y `r = nums.length - 1` al final.',
      'Si `nums[l] + nums[r] < target`, necesitas una suma mayor: incrementa `l`.',
      'Si la suma es mayor que `target`, decrementa `r`.',
    ],
    languages: ['javascript', 'python', 'java', 'cpp'],
    starterCode: {
      javascript: `function twoSumSorted(nums, target) {\n  // Dos punteros en O(n) y espacio O(1)\n  return [];\n}`,
      python: `def twoSumSorted(nums: list[int], target: int) -> list[int]:\n    return []`,
      java: `class Solution {\n    public int[] twoSumSorted(int[] nums, int target) {\n        return new int[]{};\n    }\n}`,
      cpp: `#include <vector>\nusing namespace std;\n\nvector<int> twoSumSorted(vector<int>& nums, int target) {\n    return {};\n}`,
    },
    referenceSolution: {
      javascript: `function twoSumSorted(nums, target) {\n  let l = 0;\n  let r = nums.length - 1;\n  while (l < r) {\n    const sum = nums[l] + nums[r];\n    if (sum === target) return [l, r];\n    if (sum < target) l++;\n    else r--;\n  }\n  return [];\n}`,
      python: `def twoSumSorted(nums: list[int], target: int) -> list[int]:\n    l, r = 0, len(nums) - 1\n    while l < r:\n        s = nums[l] + nums[r]\n        if s == target:\n            return [l, r]\n        if s < target:\n            l += 1\n        else:\n            r -= 1\n    return []`,
      java: `class Solution {\n    public int[] twoSumSorted(int[] nums, int target) {\n        int l = 0, r = nums.length - 1;\n        while (l < r) {\n            int sum = nums[l] + nums[r];\n            if (sum == target) return new int[]{l, r};\n            if (sum < target) l++;\n            else r--;\n        }\n        return new int[]{};\n    }\n}`,
      cpp: `#include <vector>\nusing namespace std;\n\nvector<int> twoSumSorted(vector<int>& nums, int target) {\n    int l = 0, r = (int)nums.size() - 1;\n    while (l < r) {\n        int sum = nums[l] + nums[r];\n        if (sum == target) return {l, r};\n        if (sum < target) l++;\n        else r--;\n    }\n    return {};\n}`,
    },
    tests: {
      visible: [
        { id: 't1', input: [[2, 7, 11, 15], 9], expected: [0, 1], inputDisplay: 'nums = [2,7,11,15], target = 9', expectedDisplay: '[0, 1]' },
        { id: 't2', input: [[-2, 1, 4, 8], 5], expected: [1, 2], inputDisplay: 'nums = [-2,1,4,8], target = 5', expectedDisplay: '[1, 2]' },
      ],
      hidden: [
        { id: 't3', input: [[1, 2, 3, 4, 5], 9], expected: [3, 4], inputDisplay: 'nums = [1,2,3,4,5], target = 9', expectedDisplay: '[3, 4]' },
        { id: 't4', input: [[0, 0, 3, 4], 0], expected: [0, 1], inputDisplay: 'nums = [0,0,3,4], target = 0', expectedDisplay: '[0, 1]' },
      ],
    },
    editorial: {
      explanation:
        'Al estar ordenado, los punteros convergen desde los extremos: si la suma es menor que el objetivo solo puede crecer moviendo `l` a la derecha; si es mayor, moviendo `r` a la izquierda.',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      approaches: [
        { name: 'Dos punteros convergentes', note: 'Sin memoria adicional, una sola pasada.' },
      ],
    },
  },
  {
    id: 'maxima-suma-k-ventana',
    title: 'Máxima suma de subarreglo de tamaño k',
    category: 'optimization',
    difficulty: 'hard',
    xp: 200,
    acceptanceRate: 65,
    tags: ['ventana deslizante', 'O(n)', 'arrays'],
    entryPoint: 'maxSumWindow',
    targetComplexity: 'O(n)',
    perf: {
      sizeLabel: 'n = 5,000, k = 1,200',
      maxMs: 150,
      build: () => [
        Array.from({ length: 5000 }, (_, i) => ((i * 17) % 100) - 40),
        1200,
      ],
    },
    description:
      'Dado un arreglo de enteros `nums` y un entero `k` (`1 <= k <= nums.length`), devuelve la **suma máxima** de cualquier subarreglo contiguo de longitud exactamente `k`.\n\n' +
      'Recalcular cada ventana desde cero cuesta `O(n * k)`. Usa una ventana deslizante fija para resolverlo en `O(n)`.',
    examples: [
      { input: 'nums = [2, 1, 5, 1, 3, 2], k = 3', output: '9', explanation: '[5, 1, 3] suma 9.' },
      { input: 'nums = [-4, -2, -1, -5], k = 2', output: '-3' },
    ],
    constraints: ['1 <= k <= nums.length <= 10^5', 'Complejidad temporal O(n)'],
    hints: [
      'Calcula primero la suma de los primeros `k` elementos.',
      'Al deslizar un paso hacia la derecha, suma `nums[i]` y resta `nums[i - k]`.',
      'Actualiza el máximo en cada desplazamiento.',
    ],
    languages: ['javascript', 'python', 'java', 'cpp'],
    starterCode: {
      javascript: `function maxSumWindow(nums, k) {\n  // Ventana fija de tamaño k en O(n)\n  return 0;\n}`,
      python: `def maxSumWindow(nums: list[int], k: int) -> int:\n    return 0`,
      java: `class Solution {\n    public int maxSumWindow(int[] nums, int k) {\n        return 0;\n    }\n}`,
      cpp: `#include <vector>\nusing namespace std;\n\nint maxSumWindow(vector<int>& nums, int k) {\n    return 0;\n}`,
    },
    referenceSolution: {
      javascript: `function maxSumWindow(nums, k) {\n  let windowSum = 0;\n  for (let i = 0; i < k; i++) windowSum += nums[i];\n  let best = windowSum;\n  for (let i = k; i < nums.length; i++) {\n    windowSum += nums[i] - nums[i - k];\n    if (windowSum > best) best = windowSum;\n  }\n  return best;\n}`,
      python: `def maxSumWindow(nums: list[int], k: int) -> int:\n    window_sum = sum(nums[:k])\n    best = window_sum\n    for i in range(k, len(nums)):\n        window_sum += nums[i] - nums[i - k]\n        if window_sum > best:\n            best = window_sum\n    return best`,
      java: `class Solution {\n    public int maxSumWindow(int[] nums, int k) {\n        int sum = 0;\n        for (int i = 0; i < k; i++) sum += nums[i];\n        int best = sum;\n        for (int i = k; i < nums.length; i++) {\n            sum += nums[i] - nums[i - k];\n            best = Math.max(best, sum);\n        }\n        return best;\n    }\n}`,
      cpp: `#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint maxSumWindow(vector<int>& nums, int k) {\n    int sum = 0;\n    for (int i = 0; i < k; i++) sum += nums[i];\n    int best = sum;\n    for (size_t i = k; i < nums.size(); i++) {\n        sum += nums[i] - nums[i - k];\n        best = max(best, sum);\n    }\n    return best;\n}`,
    },
    tests: {
      visible: [
        { id: 't1', input: [[2, 1, 5, 1, 3, 2], 3], expected: 9, inputDisplay: 'nums = [2,1,5,1,3,2], k = 3', expectedDisplay: '9' },
        { id: 't2', input: [[-4, -2, -1, -5], 2], expected: -3, inputDisplay: 'nums = [-4,-2,-1,-5], k = 2', expectedDisplay: '-3' },
      ],
      hidden: [
        { id: 't3', input: [[7], 1], expected: 7, inputDisplay: 'nums = [7], k = 1', expectedDisplay: '7' },
        { id: 't4', input: [[1, 9, -1, -2, 7, 3, -1, 2], 4], expected: 13, inputDisplay: 'nums = [1,9,-1,-2,7,3,-1,2], k = 4', expectedDisplay: '13' },
      ],
    },
    editorial: {
      explanation:
        'Manteniendo la suma acumulada de la ventana de ancho `k`, cada nuevo desplazamiento requiere solo una suma y una resta en `O(1)`.',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      approaches: [
        { name: 'Ventana deslizante fija', note: 'Suma inicial de k elementos y actualización incremental.' },
      ],
    },
  },
  {
    id: 'suma-subarray-prefijos',
    title: 'Subarreglos con suma exacta k',
    category: 'optimization',
    difficulty: 'hard',
    xp: 200,
    acceptanceRate: 53,
    tags: ['prefijos', 'hash map', 'O(n)'],
    entryPoint: 'subarraySumCount',
    targetComplexity: 'O(n)',
    perf: {
      sizeLabel: 'n = 4,000 elementos',
      maxMs: 150,
      build: () => [
        Array.from({ length: 4000 }, (_, i) => (i % 5) - 2),
        3,
      ],
    },
    description:
      'Dado un arreglo de enteros `nums` (pueden ser negativos o cero) y un entero `k`, devuelve el **número total de subarreglos contiguos** cuya suma sea igual a `k`.\n\n' +
      'Usa sumas prefijas acumuladas junto con un mapa de frecuencias para lograr `O(n)`.',
    examples: [
      { input: 'nums = [1, 1, 1], k = 2', output: '2' },
      { input: 'nums = [1, 2, 3, -2, 2], k = 3', output: '4' },
    ],
    constraints: ['1 <= nums.length <= 2 * 10^4', 'Complejidad objetivo O(n)'],
    hints: [
      'Si la suma prefija hasta `i` es `prefix` y antes apareció `prefix - k`, ese tramo intermedio suma exactamente `k`.',
      'Inicializa el mapa de prefijos con `{ 0: 1 }` para contar subarreglos que empiezan en el índice 0.',
      'Suma `freq.get(prefix - k) || 0` antes de incrementar `freq.get(prefix)`.',
    ],
    languages: ['javascript', 'python', 'java', 'cpp'],
    starterCode: {
      javascript: `function subarraySumCount(nums, k) {\n  // Prefijos + HashMap en O(n)\n  return 0;\n}`,
      python: `def subarraySumCount(nums: list[int], k: int) -> int:\n    return 0`,
      java: `class Solution {\n    public int subarraySumCount(int[] nums, int k) {\n        return 0;\n    }\n}`,
      cpp: `#include <vector>\nusing namespace std;\n\nint subarraySumCount(vector<int>& nums, int k) {\n    return 0;\n}`,
    },
    referenceSolution: {
      javascript: `function subarraySumCount(nums, k) {\n  const freq = new Map([[0, 1]]);\n  let prefix = 0;\n  let count = 0;\n  for (const num of nums) {\n    prefix += num;\n    count += freq.get(prefix - k) || 0;\n    freq.set(prefix, (freq.get(prefix) || 0) + 1);\n  }\n  return count;\n}`,
      python: `def subarraySumCount(nums: list[int], k: int) -> int:\n    freq = {0: 1}\n    prefix = 0\n    count = 0\n    for num in nums:\n        prefix += num\n        count += freq.get(prefix - k, 0)\n        freq[prefix] = freq.get(prefix, 0) + 1\n    return count`,
      java: `import java.util.*;\n\nclass Solution {\n    public int subarraySumCount(int[] nums, int k) {\n        Map<Integer, Integer> freq = new HashMap<>();\n        freq.put(0, 1);\n        int prefix = 0, count = 0;\n        for (int num : nums) {\n            prefix += num;\n            count += freq.getOrDefault(prefix - k, 0);\n            freq.put(prefix, freq.getOrDefault(prefix, 0) + 1);\n        }\n        return count;\n    }\n}`,
      cpp: `#include <vector>\n#include <unordered_map>\nusing namespace std;\n\nint subarraySumCount(vector<int>& nums, int k) {\n    unordered_map<int, int> freq;\n    freq[0] = 1;\n    int prefix = 0, count = 0;\n    for (int num : nums) {\n        prefix += num;\n        if (freq.count(prefix - k)) count += freq[prefix - k];\n        freq[prefix]++;\n    }\n    return count;\n}`,
    },
    tests: {
      visible: [
        { id: 't1', input: [[1, 1, 1], 2], expected: 2, inputDisplay: 'nums = [1,1,1], k = 2', expectedDisplay: '2' },
        { id: 't2', input: [[1, 2, 3, -2, 2], 3], expected: 4, inputDisplay: 'nums = [1,2,3,-2,2], k = 3', expectedDisplay: '4' },
      ],
      hidden: [
        { id: 't3', input: [[0, 0, 0], 0], expected: 6, inputDisplay: 'nums = [0,0,0], k = 0', expectedDisplay: '6' },
        { id: 't4', input: [[-1, -1, 1], 0], expected: 1, inputDisplay: 'nums = [-1,-1,1], k = 0', expectedDisplay: '1' },
      ],
    },
    editorial: {
      explanation:
        'Al haber negativos no sirve una ventana deslizante clásica. Almacenando cuántas veces se ha visto cada suma prefija `prefix`, podemos sumar instantáneamente cuántas veces ocurrió `prefix - k` en el pasado.',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      approaches: [
        { name: 'Suma prefija + HashMap de frecuencias', note: 'Sembrar freq[0] = 1 y acumular freq[prefix - k].' },
      ],
    },
  },
  {
    id: 'frecuencias-en-lineal',
    title: 'Top K frecuentes con bucket sort',
    category: 'optimization',
    difficulty: 'hard',
    xp: 200,
    acceptanceRate: 56,
    tags: ['bucket sort', 'frecuencias', 'O(n)'],
    entryPoint: 'topKFrequent',
    targetComplexity: 'O(n)',
    perf: {
      sizeLabel: 'n = 4,000 elementos',
      maxMs: 150,
      build: () => [
        Array.from({ length: 4000 }, (_, i) => (i % 40) + (i < 1500 ? 0 : 100)),
        5,
      ],
    },
    description:
      'Dado un arreglo de enteros `nums` y un entero `k`, devuelve los `k` elementos más frecuentes **ordenados de mayor a menor frecuencia** (en caso de empate, menor valor numérico primero).\n\n' +
      'Evita ordenar toda la tabla en `O(n log n)`: utiliza cubetas por frecuencia (*bucket sort*) para lograr `O(n)` en el caso general.',
    examples: [
      { input: 'nums = [1, 1, 1, 2, 2, 3], k = 2', output: '[1, 2]' },
      { input: 'nums = [5, 3, 5, 3, 1], k = 2', output: '[3, 5]' },
    ],
    constraints: ['1 <= k <= cantidad de valores distintos', '1 <= nums.length <= 10^5'],
    hints: [
      'Cuenta primero la frecuencia de cada número en un `Map`.',
      'Crea un arreglo de cubetas `buckets` de tamaño `nums.length + 1`, donde `buckets[f]` guarda los números que aparecen `f` veces.',
      'Recorre `buckets` desde la frecuencia máxima hacia abajo ordenando solo los empates dentro de cada cubeta.',
    ],
    languages: ['javascript', 'python', 'java', 'cpp'],
    starterCode: {
      javascript: `function topKFrequent(nums, k) {\n  // Usa cubetas de frecuencia en O(n)\n  return [];\n}`,
      python: `def topKFrequent(nums: list[int], k: int) -> list[int]:\n    return []`,
      java: `import java.util.*;\n\nclass Solution {\n    public List<Integer> topKFrequent(int[] nums, int k) {\n        return new ArrayList<>();\n    }\n}`,
      cpp: `#include <vector>\nusing namespace std;\n\nvector<int> topKFrequent(vector<int>& nums, int k) {\n    return {};\n}`,
    },
    referenceSolution: {
      javascript: `function topKFrequent(nums, k) {\n  const counts = new Map();\n  for (const n of nums) counts.set(n, (counts.get(n) || 0) + 1);\n  const buckets = Array.from({ length: nums.length + 1 }, () => []);\n  for (const [val, freq] of counts.entries()) {\n    buckets[freq].push(val);\n  }\n  const res = [];\n  for (let f = buckets.length - 1; f >= 1 && res.length < k; f--) {\n    if (buckets[f].length === 0) continue;\n    if (buckets[f].length > 1) buckets[f].sort((a, b) => a - b);\n    for (const val of buckets[f]) {\n      res.push(val);\n      if (res.length === k) break;\n    }\n  }\n  return res;\n}`,
      python: `from collections import Counter\n\ndef topKFrequent(nums: list[int], k: int) -> list[int]:\n    counts = Counter(nums)\n    buckets = [[] for _ in range(len(nums) + 1)]\n    for val, freq in counts.items():\n        buckets[freq].append(val)\n    res = []\n    for f in range(len(buckets) - 1, 0, -1):\n        if buckets[f]:\n            for val in sorted(buckets[f]):\n                res.append(val)\n                if len(res) == k:\n                    return res\n    return res`,
      java: `import java.util.*;\n\nclass Solution {\n    public List<Integer> topKFrequent(int[] nums, int k) {\n        Map<Integer, Integer> counts = new HashMap<>();\n        for (int n : nums) counts.put(n, counts.getOrDefault(n, 0) + 1);\n        List<List<Integer>> buckets = new ArrayList<>(nums.length + 1);\n        for (int i = 0; i <= nums.length; i++) buckets.add(new ArrayList<>());\n        for (var e : counts.entrySet()) buckets.get(e.getValue()).add(e.getKey());\n        List<Integer> res = new ArrayList<>();\n        for (int f = nums.length; f >= 1 && res.size() < k; f--) {\n            Collections.sort(buckets.get(f));\n            for (int v : buckets.get(f)) {\n                res.add(v);\n                if (res.size() == k) break;\n            }\n        }\n        return res;\n    }\n}`,
      cpp: `#include <vector>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nvector<int> topKFrequent(vector<int>& nums, int k) {\n    unordered_map<int, int> counts;\n    for (int n : nums) counts[n]++;\n    vector<vector<int>> buckets(nums.size() + 1);\n    for (auto& kv : counts) buckets[kv.second].push_back(kv.first);\n    vector<int> res;\n    for (int f = (int)nums.size(); f >= 1 && (int)res.size() < k; f--) {\n        sort(buckets[f].begin(), buckets[f].end());\n        for (int v : buckets[f]) {\n            res.push_back(v);\n            if ((int)res.size() == k) break;\n        }\n    }\n    return res;\n}`,
    },
    tests: {
      visible: [
        { id: 't1', input: [[1, 1, 1, 2, 2, 3], 2], expected: [1, 2], inputDisplay: 'nums = [1,1,1,2,2,3], k = 2', expectedDisplay: '[1, 2]' },
        { id: 't2', input: [[5, 3, 5, 3, 1], 2], expected: [3, 5], inputDisplay: 'nums = [5,3,5,3,1], k = 2', expectedDisplay: '[3, 5]' },
      ],
      hidden: [
        { id: 't3', input: [[42], 1], expected: [42], inputDisplay: 'nums = [42], k = 1', expectedDisplay: '[42]' },
        { id: 't4', input: [[4, 1, -1, 2, -1, 2, 3], 2], expected: [-1, 2], inputDisplay: 'nums = [4,1,-1,2,-1,2,3], k = 2', expectedDisplay: '[-1, 2]' },
      ],
    },
    editorial: {
      explanation:
        'La frecuencia máxima de cualquier número nunca supera `nums.length`. Indexando un arreglo de cubetas por frecuencia se recolectan los `k` elementos más frecuentes recorriendo de derecha a izquierda en tiempo lineal.',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      approaches: [
        { name: 'Bucket sort por frecuencias', note: 'Evita ordenar n elementos distintos cuando solo interesan los k mayores.' },
      ],
    },
  },
  {
    id: 'reemplazar-bubble-sort',
    title: 'Reemplazar ordenación cuadrática (Merge Sort)',
    category: 'optimization',
    difficulty: 'hard',
    xp: 200,
    acceptanceRate: 62,
    tags: ['divide y vencerás', 'merge sort', 'O(n log n)'],
    entryPoint: 'sortFast',
    targetComplexity: 'O(n log n)',
    perf: {
      sizeLabel: 'n = 8,000 elementos invertidos',
      maxMs: 40,
      build: () => [
        Array.from({ length: 8000 }, (_, i) => 8000 - i),
      ],
    },
    description:
      'El código inicial ordena el arreglo `nums` mediante *Bubble Sort* en `O(n²)`, lo cual supera el límite de tiempo con miles de elementos.\n\n' +
      'Reemplázalo implementando una ordenación en `O(n log n)` (por ejemplo *Merge Sort* o `.sort((a, b) => a - b)` sin mutar el arreglo de entrada).',
    examples: [
      { input: 'nums = [5, 2, 9, 1, 5, 6]', output: '[1, 2, 5, 5, 6, 9]' },
      { input: 'nums = [-3, 0, -10, 4]', output: '[-10, -3, 0, 4]' },
    ],
    constraints: ['0 <= nums.length <= 10^5', 'No mutar el arreglo original', 'Complejidad O(n log n)'],
    hints: [
      'Una ordenación `O(n²)` hace ~16 millones de iteraciones para `n = 4000`.',
      'Divide el arreglo en dos mitades recursivamente y fusiónalas de forma ordenada (Merge Sort), o usa `[...nums].sort((a, b) => a - b)`.',
      'Devuelve un arreglo nuevo sin alterar `nums`.',
    ],
    languages: ['javascript', 'python', 'java', 'cpp'],
    starterCode: {
      javascript: `function sortFast(nums) {\n  const arr = [...nums];\n  for (let i = 0; i < arr.length; i++) {\n    for (let j = 0; j < arr.length - i - 1; j++) {\n      if (arr[j] > arr[j + 1]) {\n        const tmp = arr[j];\n        arr[j] = arr[j + 1];\n        arr[j + 1] = tmp;\n      }\n    }\n  }\n  return arr;\n}`,
      python: `def sortFast(nums: list[int]) -> list[int]:\n    arr = list(nums)\n    for i in range(len(arr)):\n        for j in range(len(arr) - i - 1):\n            if arr[j] > arr[j + 1]:\n                arr[j], arr[j + 1] = arr[j + 1], arr[j]\n    return arr`,
      java: `import java.util.*;\n\nclass Solution {\n    public int[] sortFast(int[] nums) {\n        int[] arr = Arrays.copyOf(nums, nums.length);\n        for (int i = 0; i < arr.length; i++) {\n            for (int j = 0; j < arr.length - i - 1; j++) {\n                if (arr[j] > arr[j + 1]) {\n                    int t = arr[j]; arr[j] = arr[j + 1]; arr[j + 1] = t;\n                }\n            }\n        }\n        return arr;\n    }\n}`,
      cpp: `#include <vector>\nusing namespace std;\n\nvector<int> sortFast(const vector<int>& nums) {\n    vector<int> arr = nums;\n    for (size_t i = 0; i < arr.size(); i++) {\n        for (size_t j = 0; j + 1 < arr.size() - i; j++) {\n            if (arr[j] > arr[j + 1]) swap(arr[j], arr[j + 1]);\n        }\n    }\n    return arr;\n}`,
    },
    referenceSolution: {
      javascript: `function sortFast(nums) {\n  return [...nums].sort((a, b) => a - b);\n}`,
      python: `def sortFast(nums: list[int]) -> list[int]:\n    return sorted(nums)`,
      java: `import java.util.*;\n\nclass Solution {\n    public int[] sortFast(int[] nums) {\n        int[] arr = Arrays.copyOf(nums, nums.length);\n        Arrays.sort(arr);\n        return arr;\n    }\n}`,
      cpp: `#include <vector>\n#include <algorithm>\nusing namespace std;\n\nvector<int> sortFast(const vector<int>& nums) {\n    vector<int> arr = nums;\n    sort(arr.begin(), arr.end());\n    return arr;\n}`,
    },
    tests: {
      visible: [
        { id: 't1', input: [[5, 2, 9, 1, 5, 6]], expected: [1, 2, 5, 5, 6, 9], inputDisplay: 'nums = [5,2,9,1,5,6]', expectedDisplay: '[1, 2, 5, 5, 6, 9]' },
        { id: 't2', input: [[-3, 0, -10, 4]], expected: [-10, -3, 0, 4], inputDisplay: 'nums = [-3,0,-10,4]', expectedDisplay: '[-10, -3, 0, 4]' },
      ],
      hidden: [
        { id: 't3', input: [[]], expected: [], inputDisplay: 'nums = []', expectedDisplay: '[]' },
        { id: 't4', input: [[10, 9, 8, 7]], expected: [7, 8, 9, 10], inputDisplay: 'nums = [10,9,8,7]', expectedDisplay: '[7, 8, 9, 10]' },
      ],
    },
    editorial: {
      explanation:
        'Sustituir los dos bucles de Bubble Sort (`O(n²)`) por Timsort/Merge Sort nativo (`O(n log n)`) con copia previa reduce el tiempo de cientos de milisegundos a menos de 2 ms para 4000 elementos.',
      timeComplexity: 'O(n log n)',
      spaceComplexity: 'O(n)',
      approaches: [
        { name: 'Timsort nativo con copia', note: '[...nums].sort((a, b) => a - b) mantiene inmutabilidad.' },
      ],
    },
    validationHints: {
      forbiddenSubstrings: {
        python: ['for j in range('],
        java: ['for (int j = 0;'],
        cpp: ['for (size_t j = 0;'],
      },
    },
  },
  {
    id: 'memoizar-funcion-costosa',
    title: 'Memoizar recursión exponencial',
    category: 'optimization',
    difficulty: 'expert',
    xp: 350,
    acceptanceRate: 48,
    tags: ['memoización', 'programación dinámica', 'O(n)'],
    entryPoint: 'countWaysMemo',
    targetComplexity: 'O(n)',
    perf: {
      sizeLabel: 'n = 36 escalones (evita O(2ⁿ))',
      maxMs: 120,
      build: () => [36],
    },
    description:
      'Una persona puede subir una escalera dando saltos de `1` o `2` escalones. Implementa `countWaysMemo(n)` para devolver de cuántas formas distintas puede llegar exactamente al escalón `n`.\n\n' +
      'La recursión ingenua `f(n - 1) + f(n - 2)` recalcula millones de subproblemas en `O(2ⁿ)`. Optimízala con **memoización** o DP iterativa a `O(n)`.',
    examples: [
      { input: 'n = 4', output: '5', explanation: 'Formas: 1+1+1+1, 1+1+2, 1+2+1, 2+1+1, 2+2.' },
      { input: 'n = 10', output: '89' },
    ],
    constraints: ['0 <= n <= 45', 'Complejidad temporal O(n)'],
    hints: [
      'Guarda los resultados ya calculados en un objeto o `Map` (`memo`) indexado por `n`.',
      'Casos base: para `n <= 1`, devuelve `1`.',
      'También puedes resolverlo con dos variables iterativas (`prev`, `curr`) en `O(1)` espacio.',
    ],
    languages: ['javascript', 'python', 'java', 'cpp'],
    starterCode: {
      javascript: `function countWaysMemo(n) {\n  // Optimiza esta recursión exponencial O(2^n) a O(n)\n  if (n <= 1) return 1;\n  return countWaysMemo(n - 1) + countWaysMemo(n - 2);\n}`,
      python: `def countWaysMemo(n: int) -> int:\n    if n <= 1:\n        return 1\n    return countWaysMemo(n - 1) + countWaysMemo(n - 2)`,
      java: `class Solution {\n    public int countWaysMemo(int n) {\n        if (n <= 1) return 1;\n        return countWaysMemo(n - 1) + countWaysMemo(n - 2);\n    }\n}`,
      cpp: `int countWaysMemo(int n) {\n    if (n <= 1) return 1;\n    return countWaysMemo(n - 1) + countWaysMemo(n - 2);\n}`,
    },
    referenceSolution: {
      javascript: `function countWaysMemo(n) {\n  if (n <= 1) return 1;\n  let prev = 1;\n  let curr = 1;\n  for (let i = 2; i <= n; i++) {\n    const next = prev + curr;\n    prev = curr;\n    curr = next;\n  }\n  return curr;\n}`,
      python: `def countWaysMemo(n: int) -> int:\n    if n <= 1:\n        return 1\n    prev, curr = 1, 1\n    for _ in range(2, n + 1):\n        prev, curr = curr, prev + curr\n    return curr`,
      java: `class Solution {\n    public int countWaysMemo(int n) {\n        if (n <= 1) return 1;\n        int prev = 1, curr = 1;\n        for (int i = 2; i <= n; i++) {\n            int next = prev + curr;\n            prev = curr;\n            curr = next;\n        }\n        return curr;\n    }\n}`,
      cpp: `int countWaysMemo(int n) {\n    if (n <= 1) return 1;\n    int prev = 1, curr = 1;\n    for (int i = 2; i <= n; i++) {\n        int next = prev + curr;\n        prev = curr;\n        curr = next;\n    }\n    return curr;\n}`,
    },
    tests: {
      visible: [
        { id: 't1', input: [4], expected: 5, inputDisplay: 'n = 4', expectedDisplay: '5' },
        { id: 't2', input: [10], expected: 89, inputDisplay: 'n = 10', expectedDisplay: '89' },
      ],
      hidden: [
        { id: 't3', input: [0], expected: 1, inputDisplay: 'n = 0', expectedDisplay: '1' },
        { id: 't4', input: [25], expected: 121393, inputDisplay: 'n = 25', expectedDisplay: '121393' },
      ],
    },
    editorial: {
      explanation:
        'Al almacenar los subproblemas previos (ya sea con una tabla `memo` top-down o iterando con dos punteros bottom-up), cada estado `0..n` se calcula exactamente una vez en lugar de crecer exponencialmente.',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      approaches: [
        { name: 'DP iterativa en O(1) espacio', note: 'Solo necesita los dos valores anteriores.' },
        { name: 'Recursión con memo', note: 'Cachea cada resultado por clave n en un Map.' },
      ],
    },
    validationHints: {
      forbiddenSubstrings: {
        python: ['return countWaysMemo(n - 1) + countWaysMemo(n - 2)'],
        java: ['return countWaysMemo(n - 1) + countWaysMemo(n - 2);'],
        cpp: ['return countWaysMemo(n - 1) + countWaysMemo(n - 2);'],
      },
    },
  },
  {
    id: 'reducir-espacio-dp',
    title: 'Reducir espacio DP a O(1) (House Robber)',
    category: 'optimization',
    difficulty: 'expert',
    xp: 350,
    acceptanceRate: 49,
    tags: ['programación dinámica', 'O(1) espacio', 'O(n)'],
    entryPoint: 'robHouses',
    targetComplexity: 'O(n)',
    perf: {
      sizeLabel: 'n = 5,000 casas',
      maxMs: 150,
      build: () => [
        Array.from({ length: 5000 }, (_, i) => (i * 13) % 50 + 1),
      ],
    },
    description:
      'Dado un arreglo `nums` donde `nums[i]` representa el botín de la casa `i`, calcula la cantidad máxima que puedes obtener sin elegir nunca dos casas adyacentes.\n\n' +
      'Optimiza la DP clásica (que usaba un arreglo `dp[n]`) para que consuma `O(n)` en tiempo y **`O(1)` en espacio**.',
    examples: [
      { input: 'nums = [2, 7, 9, 3, 1]', output: '12', explanation: '2 + 9 + 1 = 12.' },
      { input: 'nums = [1, 2, 3, 1]', output: '4' },
    ],
    constraints: ['0 <= nums.length <= 10^5', 'Complejidad temporal O(n) y espacial O(1)'],
    hints: [
      'En cada paso `i`, `dp[i]` solo depende de `dp[i - 1]` y `dp[i - 2]`.',
      'Mantén dos variables `robPrev` (hace 2 casas) y `robCurr` (hasta la casa anterior).',
      'Actualiza `next = Math.max(robCurr, robPrev + val)` en cada iteración.',
    ],
    languages: ['javascript', 'python', 'java', 'cpp'],
    starterCode: {
      javascript: `function robHouses(nums) {\n  // DP en O(n) tiempo y O(1) espacio\n  return 0;\n}`,
      python: `def robHouses(nums: list[int]) -> int:\n    return 0`,
      java: `class Solution {\n    public int robHouses(int[] nums) {\n        return 0;\n    }\n}`,
      cpp: `#include <vector>\nusing namespace std;\n\nint robHouses(vector<int>& nums) {\n    return 0;\n}`,
    },
    referenceSolution: {
      javascript: `function robHouses(nums) {\n  let prev = 0;\n  let curr = 0;\n  for (const val of nums) {\n    const next = Math.max(curr, prev + val);\n    prev = curr;\n    curr = next;\n  }\n  return curr;\n}`,
      python: `def robHouses(nums: list[int]) -> int:\n    prev, curr = 0, 0\n    for val in nums:\n        prev, curr = curr, max(curr, prev + val)\n    return curr`,
      java: `class Solution {\n    public int robHouses(int[] nums) {\n        int prev = 0, curr = 0;\n        for (int val : nums) {\n            int next = Math.max(curr, prev + val);\n            prev = curr;\n            curr = next;\n        }\n        return curr;\n    }\n}`,
      cpp: `#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint robHouses(vector<int>& nums) {\n    int prev = 0, curr = 0;\n    for (int val : nums) {\n        int next = max(curr, prev + val);\n        prev = curr;\n        curr = next;\n    }\n    return curr;\n}`,
    },
    tests: {
      visible: [
        { id: 't1', input: [[2, 7, 9, 3, 1]], expected: 12, inputDisplay: 'nums = [2,7,9,3,1]', expectedDisplay: '12' },
        { id: 't2', input: [[1, 2, 3, 1]], expected: 4, inputDisplay: 'nums = [1,2,3,1]', expectedDisplay: '4' },
      ],
      hidden: [
        { id: 't3', input: [[]], expected: 0, inputDisplay: 'nums = []', expectedDisplay: '0' },
        { id: 't4', input: [[10]], expected: 10, inputDisplay: 'nums = [10]', expectedDisplay: '10' },
      ],
    },
    editorial: {
      explanation:
        'La transición `dp[i] = max(dp[i-1], dp[i-2] + nums[i])` solo consulta los dos estados inmediatos anteriores, por lo que basta rotar dos variables escalares sin asignar un arreglo auxiliar.',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      approaches: [
        { name: 'Compresión de estado DP', note: 'Dos acumuladores prev y curr reemplazan al vector completo.' },
      ],
    },
  },
  {
    id: 'busqueda-prefijos-trie',
    title: 'Consultas rápidas de prefijos (Trie / Mapa)',
    category: 'optimization',
    difficulty: 'expert',
    xp: 350,
    acceptanceRate: 44,
    tags: ['trie', 'prefijos', 'hash map', 'O(n)'],
    entryPoint: 'prefixQueries',
    targetComplexity: 'O(n)',
    perf: {
      sizeLabel: '2,000 palabras + 2,000 consultas',
      maxMs: 150,
      build: () => [
        Array.from({ length: 2000 }, (_, i) => `p${i % 50}_word_${i}`),
        Array.from({ length: 2000 }, (_, i) => `p${i % 60}_`),
      ],
    },
    description:
      'Dada una lista de `words` y una lista de `queries`, devuelve un arreglo de enteros indicando cuántas palabras de `words` comienzan con cada prefijo de `queries`.\n\n' +
      'Recorrer `words` para cada consulta cuesta `O(W * Q)`. Preprocesa todos los prefijos en un **Trie** (o tabla hash de prefijos) para responder en tiempo lineal.',
    examples: [
      { input: 'words = ["algo", "algoritmo", "alerta"], queries = ["alg", "al", "b"]', output: '[2, 3, 0]' },
    ],
    constraints: ['1 <= words.length, queries.length <= 10^4', 'Longitud de cada palabra <= 20'],
    hints: [
      'Recorre cada palabra de `words` e inserta sus prefijos progresivos en un Trie o incrementa un contador en un `Map` por cada subcadena prefijo.',
      'Con un `Map` de prefijos, cada palabra de longitud `L` actualiza a lo sumo `L` entradas.',
      'Luego cada consulta se responde en `O(1)` leyendo el contador del prefijo.',
    ],
    languages: ['javascript', 'python', 'java', 'cpp'],
    starterCode: {
      javascript: `function prefixQueries(words, queries) {\n  // Preprocesa prefijos para responder en O(1) por consulta\n  return [];\n}`,
      python: `def prefixQueries(words: list[str], queries: list[str]) -> list[int]:\n    return []`,
      java: `import java.util.*;\n\nclass Solution {\n    public int[] prefixQueries(String[] words, String[] queries) {\n        return new int[]{};\n    }\n}`,
      cpp: `#include <vector>\n#include <string>\nusing namespace std;\n\nvector<int> prefixQueries(vector<string>& words, vector<string>& queries) {\n    return {};\n}`,
    },
    referenceSolution: {
      javascript: `function prefixQueries(words, queries) {\n  const root = Object.create(null);\n  for (const word of words) {\n    let node = root;\n    for (let i = 0; i < word.length; i++) {\n      const ch = word[i];\n      if (!node[ch]) node[ch] = { count: 0, next: Object.create(null) };\n      node[ch].count++;\n      node = node[ch].next;\n    }\n  }\n  return queries.map((q) => {\n    if (q === '') return words.length;\n    let node = root;\n    let ans = 0;\n    for (let i = 0; i < q.length; i++) {\n      const entry = node[q[i]];\n      if (!entry) return 0;\n      ans = entry.count;\n      node = entry.next;\n    }\n    return ans;\n  });\n}`,
      python: `def prefixQueries(words: list[str], queries: list[str]) -> list[int]:\n    counts = {}\n    for w in words:\n        for i in range(1, len(w) + 1):\n            p = w[:i]\n            counts[p] = counts.get(p, 0) + 1\n    return [len(words) if q == "" else counts.get(q, 0) for q in queries]`,
      java: `import java.util.*;\n\nclass Solution {\n    public int[] prefixQueries(String[] words, String[] queries) {\n        Map<String, Integer> counts = new HashMap<>();\n        for (String w : words) {\n            for (int i = 1; i <= w.length(); i++) {\n                String p = w.substring(0, i);\n                counts.put(p, counts.getOrDefault(p, 0) + 1);\n            }\n        }\n        int[] res = new int[queries.length];\n        for (int i = 0; i < queries.length; i++) {\n            res[i] = queries[i].isEmpty() ? words.length : counts.getOrDefault(queries[i], 0);\n        }\n        return res;\n    }\n}`,
      cpp: `#include <vector>\n#include <string>\n#include <unordered_map>\nusing namespace std;\n\nvector<int> prefixQueries(vector<string>& words, vector<string>& queries) {\n    unordered_map<string, int> counts;\n    for (const auto& w : words) {\n        for (size_t i = 1; i <= w.size(); i++) {\n            counts[w.substr(0, i)]++;\n        }\n    }\n    vector<int> res;\n    for (const auto& q : queries) {\n        res.push_back(q.empty() ? (int)words.size() : counts[q]);\n    }\n    return res;\n}`,
    },
    tests: {
      visible: [
        { id: 't1', input: [['algo', 'algoritmo', 'alerta'], ['alg', 'al', 'b']], expected: [2, 3, 0], inputDisplay: 'words = ["algo","algoritmo","alerta"], queries = ["alg","al","b"]', expectedDisplay: '[2, 3, 0]' },
      ],
      hidden: [
        { id: 't2', input: [['code', 'coder', 'code'], ['code', 'coder', 'cod', '']], expected: [3, 1, 3, 3], inputDisplay: 'words = ["code","coder","code"], queries = ["code","coder","cod",""]', expectedDisplay: '[3, 1, 3, 3]' },
        { id: 't3', input: [[], ['x']], expected: [0], inputDisplay: 'words = [], queries = ["x"]', expectedDisplay: '[0]' },
      ],
    },
    editorial: {
      explanation:
        'Un Trie donde cada nodo acumula el conteo de palabras que pasan por él (o un diccionario de prefijos) permite responder cada consulta en tiempo proporcional solo a la longitud del prefijo, independiente de cuántas palabras existan.',
      timeComplexity: 'O(W·L + Q·L)',
      spaceComplexity: 'O(W·L)',
      approaches: [
        { name: 'Árbol de prefijos (Trie)', note: 'Cada arista almacena cuántos términos pasan por ese prefijo.' },
      ],
    },
  },
];
