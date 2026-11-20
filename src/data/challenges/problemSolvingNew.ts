import type { Challenge } from '../../types';

export const NEW_PROBLEM_SOLVING_CHALLENGES: Challenge[] = [
  {
    id: 'escalera-n-peldanos',
    title: 'Escalera de n peldaños',
    category: 'problem-solving',
    difficulty: 'easy',
    xp: 50,
    acceptanceRate: 79,
    tags: ['dp', 'math'],
    entryPoint: 'climbStairs',
    description:
      'Estás subiendo una escalera de `n` peldaños. En cada paso puedes subir **1 o 2 peldaños**.\n\n' +
      '¿De cuántas formas distintas puedes llegar exactamente hasta el peldaño `n`?',
    examples: [
      { input: 'n = 3', output: '3', explanation: '1+1+1, 1+2, 2+1' },
      { input: 'n = 4', output: '5' },
    ],
    constraints: ['1 <= n <= 45'],
    hints: [
      'Para llegar al peldaño `i`, necesariamente vienes de `i - 1` o de `i - 2`.',
      'Eso equivale a `ways(i) = ways(i - 1) + ways(i - 2)`.',
      'Resuélvelo iterativamente manteniendo solo las dos variables anteriores (O(1) espacio).',
    ],
    languages: ['javascript', 'python', 'java', 'cpp'],
    starterCode: {
      javascript: `function climbStairs(n) {\n  // Calcula formas de subir n peldaños\n  return 0;\n}`,
      python: `def climbStairs(n: int) -> int:\n    # Calcula formas de subir n peldaños\n    return 0`,
      java: `class Solution {\n    public int climbStairs(int n) {\n        return 0;\n    }\n}`,
      cpp: `int climbStairs(int n) {\n    return 0;\n}`,
    },
    referenceSolution: {
      javascript: `function climbStairs(n) {\n  if (n <= 2) return n;\n  let a = 1;\n  let b = 2;\n  for (let i = 3; i <= n; i++) {\n    const next = a + b;\n    a = b;\n    b = next;\n  }\n  return b;\n}`,
      python: `def climbStairs(n: int) -> int:\n    if n <= 2:\n        return n\n    a, b = 1, 2\n    for _ in range(3, n + 1):\n        a, b = b, a + b\n    return b`,
      java: `class Solution {\n    public int climbStairs(int n) {\n        if (n <= 2) return n;\n        int a = 1, b = 2;\n        for (int i = 3; i <= n; i++) {\n            int next = a + b;\n            a = b;\n            b = next;\n        }\n        return b;\n    }\n}`,
      cpp: `int climbStairs(int n) {\n    if (n <= 2) return n;\n    int a = 1, b = 2;\n    for (int i = 3; i <= n; i++) {\n        int next = a + b;\n        a = b;\n        b = next;\n    }\n    return b;\n}`,
    },
    tests: {
      visible: [
        { id: 't1', input: [3], expected: 3, inputDisplay: 'n = 3', expectedDisplay: '3' },
        { id: 't2', input: [4], expected: 5, inputDisplay: 'n = 4', expectedDisplay: '5' },
      ],
      hidden: [
        { id: 't3', input: [1], expected: 1, inputDisplay: 'n = 1', expectedDisplay: '1' },
        { id: 't4', input: [10], expected: 89, inputDisplay: 'n = 10', expectedDisplay: '89' },
      ],
    },
    editorial: {
      explanation: 'La recurrencia coincide con Fibonacci desplazado: `ways(n) = ways(n-1) + ways(n-2)` con casos base `1 -> 1, 2 -> 2`.',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      approaches: [{ name: 'DP iterativa con 2 variables', note: 'Tiempo lineal y memoria constante.' }],
    },
  },
  {
    id: 'fusionar-dos-listas-ordenadas',
    title: 'Fusionar dos listas ordenadas',
    category: 'problem-solving',
    difficulty: 'medium',
    xp: 100,
    acceptanceRate: 73,
    tags: ['arrays', 'two-pointers', 'sorting'],
    entryPoint: 'mergeSortedArrays',
    description:
      'Dados dos arreglos ordenados de forma ascendente `a` y `b`, fusiónalos en un único arreglo ordenado en tiempo `O(n + m)` sin usar `.sort()`.',
    examples: [
      { input: 'a = [1, 3, 5], b = [2, 4, 6]', output: '[1, 2, 3, 4, 5, 6]' },
      { input: 'a = [], b = [1, 2]', output: '[1, 2]' },
    ],
    constraints: ['0 <= a.length, b.length <= 10^4'],
    hints: [
      'Usa dos índices `i = 0` para `a` y `j = 0` para `b`.',
      'En cada paso agrega el menor entre `a[i]` y `b[j]` y avanza su índice.',
      'Al terminar uno de los arreglos, agrega el resto del otro.',
    ],
    languages: ['javascript', 'python', 'java', 'cpp'],
    starterCode: {
      javascript: `function mergeSortedArrays(a, b) {\n  // Fusiona a y b manteniendo el orden\n  return null;\n}`,
      python: `def mergeSortedArrays(a: list[int], b: list[int]) -> list[int]:\n    # Fusiona a y b manteniendo el orden\n    return [-1]`,
      java: `class Solution {\n    public int[] mergeSortedArrays(int[] a, int[] b) {\n        return new int[]{-1};\n    }\n}`,
      cpp: `#include <vector>\nusing namespace std;\n\nvector<int> mergeSortedArrays(vector<int> a, vector<int> b) {\n    return {-1};\n}`,
    },
    referenceSolution: {
      javascript: `function mergeSortedArrays(a, b) {\n  const res = [];\n  let i = 0;\n  let j = 0;\n  while (i < a.length && j < b.length) {\n    if (a[i] <= b[j]) res.push(a[i++]);\n    else res.push(b[j++]);\n  }\n  while (i < a.length) res.push(a[i++]);\n  while (j < b.length) res.push(b[j++]);\n  return res;\n}`,
      python: `def mergeSortedArrays(a: list[int], b: list[int]) -> list[int]:\n    res = []\n    i, j = 0, 0\n    while i < len(a) and j < len(b):\n        if a[i] <= b[j]:\n            res.append(a[i])\n            i += 1\n        else:\n            res.append(b[j])\n            j += 1\n    res.extend(a[i:])\n    res.extend(b[j:])\n    return res`,
      java: `class Solution {\n    public int[] mergeSortedArrays(int[] a, int[] b) {\n        int[] res = new int[a.length + b.length];\n        int i = 0, j = 0, k = 0;\n        while (i < a.length && j < b.length) {\n            res[k++] = (a[i] <= b[j]) ? a[i++] : b[j++];\n        }\n        while (i < a.length) res[k++] = a[i++];\n        while (j < b.length) res[k++] = b[j++];\n        return res;\n    }\n}`,
      cpp: `#include <vector>\nusing namespace std;\n\nvector<int> mergeSortedArrays(vector<int> a, vector<int> b) {\n    vector<int> res;\n    res.reserve(a.size() + b.size());\n    size_t i = 0, j = 0;\n    while (i < a.size() && j < b.size()) {\n        if (a[i] <= b[j]) res.push_back(a[i++]);\n        else res.push_back(b[j++]);\n    }\n    while (i < a.size()) res.push_back(a[i++]);\n    while (j < b.size()) res.push_back(b[j++]);\n    return res;\n}`,
    },
    tests: {
      visible: [
        { id: 't1', input: [[1, 3, 5], [2, 4, 6]], expected: [1, 2, 3, 4, 5, 6], inputDisplay: 'a = [1,3,5], b = [2,4,6]', expectedDisplay: '[1, 2, 3, 4, 5, 6]' },
        { id: 't2', input: [[], [1, 2]], expected: [1, 2], inputDisplay: 'a = [], b = [1,2]', expectedDisplay: '[1, 2]' },
      ],
      hidden: [
        { id: 't3', input: [[-5, 0, 2], [-3, 2, 7]], expected: [-5, -3, 0, 2, 2, 7], inputDisplay: 'a = [-5,0,2], b = [-3,2,7]', expectedDisplay: '[-5, -3, 0, 2, 2, 7]' },
        { id: 't4', input: [[], []], expected: [], inputDisplay: 'a = [], b = []', expectedDisplay: '[]' },
      ],
    },
    editorial: {
      explanation: 'Es el paso de fusión clásico de Merge Sort: avanza el puntero del menor elemento en cada comparación para lograr `O(n + m)`.',
      timeComplexity: 'O(n + m)',
      spaceComplexity: 'O(n + m)',
      approaches: [{ name: 'Dos punteros lineales', note: 'Evita ordenar de nuevo en O((n+m) log(n+m)).' }],
    },
  },
  {
    id: 'fibonacci-memoizacion',
    title: 'Fibonacci con memoización',
    category: 'problem-solving',
    difficulty: 'medium',
    xp: 100,
    acceptanceRate: 67,
    tags: ['dp', 'recursion', 'hash-map'],
    entryPoint: 'fibMemo',
    description:
      'Calcula el `n`-ésimo número de Fibonacci (`fib(0) = 0, fib(1) = 1, fib(n) = fib(n-1) + fib(n-2)`) en tiempo `O(n)` usando memoización o DP para que valores como `n = 45` no agoten el tiempo límite.',
    examples: [
      { input: 'n = 6', output: '8' },
      { input: 'n = 40', output: '102334155' },
    ],
    constraints: ['0 <= n <= 50'],
    hints: [
      'La recursión ingenua `fib(n-1) + fib(n-2)` es O(2ⁿ) y se cuelga para n >= 40.',
      'Guarda resultados ya calculados en un `Map` o arreglo `memo`.',
      'Comprueba `if (n <= 1) return n;` como caso base.',
    ],
    languages: ['javascript', 'python', 'java', 'cpp'],
    starterCode: {
      javascript: `function fibMemo(n) {\n  // Calcula fib(n) con memoización\n  return -1;\n}`,
      python: `def fibMemo(n: int) -> int:\n    # Calcula fib(n) con memoización\n    return -1`,
      java: `class Solution {\n    public long fibMemo(int n) {\n        return -1;\n    }\n}`,
      cpp: `long long fibMemo(int n) {\n    return -1;\n}`,
    },
    referenceSolution: {
      javascript: `function fibMemo(n, memo = new Map()) {\n  if (n <= 1) return n;\n  if (memo.has(n)) return memo.get(n);\n  const val = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);\n  memo.set(n, val);\n  return val;\n}`,
      python: `def fibMemo(n: int) -> int:\n    memo = {0: 0, 1: 1}\n    def solve(k: int) -> int:\n        if k in memo:\n            return memo[k]\n        memo[k] = solve(k - 1) + solve(k - 2)\n        return memo[k]\n    return solve(n)`,
      java: `import java.util.*;\n\nclass Solution {\n    public long fibMemo(int n) {\n        Map<Integer, Long> memo = new HashMap<>();\n        return solve(n, memo);\n    }\n    private long solve(int n, Map<Integer, Long> memo) {\n        if (n <= 1) return n;\n        if (memo.containsKey(n)) return memo.get(n);\n        long val = solve(n - 1, memo) + solve(n - 2, memo);\n        memo.put(n, val);\n        return val;\n    }\n}`,
      cpp: `#include <unordered_map>\nusing namespace std;\n\nlong long solveFib(int n, unordered_map<int, long long>& memo) {\n    if (n <= 1) return n;\n    if (memo.count(n)) return memo[n];\n    return memo[n] = solveFib(n - 1, memo) + solveFib(n - 2, memo);\n}\n\nlong long fibMemo(int n) {\n    unordered_map<int, long long> memo;\n    return solveFib(n, memo);\n}`,
    },
    tests: {
      visible: [
        { id: 't1', input: [6], expected: 8, inputDisplay: 'n = 6', expectedDisplay: '8' },
        { id: 't2', input: [10], expected: 55, inputDisplay: 'n = 10', expectedDisplay: '55' },
      ],
      hidden: [
        { id: 't3', input: [0], expected: 0, inputDisplay: 'n = 0', expectedDisplay: '0' },
        { id: 't4', input: [40], expected: 102334155, inputDisplay: 'n = 40', expectedDisplay: '102334155' },
      ],
    },
    editorial: {
      explanation: 'Al almacenar cada subproblema `fib(k)` en caché (`Map` o tabla), cada estado se calcula una sola vez reduciendo el tiempo de exponencial a lineal.',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      approaches: [{ name: 'Top-down con memoización', note: 'Cada subproblema se evalúa como máximo una vez.' }],
    },
  },
  {
    id: 'subconjuntos-power-set',
    title: 'Subconjuntos (Power Set)',
    category: 'problem-solving',
    difficulty: 'hard',
    xp: 200,
    acceptanceRate: 55,
    tags: ['recursion', 'arrays'],
    entryPoint: 'subsets',
    description:
      'Dado un arreglo de enteros únicos `nums`, devuelve todos los subconjuntos posibles (el conjunto potencia).\n\n' +
      'Para mantener un orden determinista en los casos de prueba, inclúyelos en orden **iterativo creciente** (empezando con `[[]]`, y para cada `num` en `nums` añadiendo `num` a los subconjuntos existentes).',
    examples: [
      { input: 'nums = [1, 2]', output: '[[], [1], [2], [1, 2]]' },
    ],
    constraints: ['0 <= nums.length <= 10', 'Elementos únicos'],
    hints: [
      'Empieza con `res = [[]]`.',
      'Por cada número `x` de `nums`, duplica los subconjuntos existentes agregándoles `x` al final.',
      'El orden resultante para `[1, 2, 3]` será `[[], [1], [2], [1,2], [3], [1,3], [2,3], [1,2,3]]`.',
    ],
    languages: ['javascript', 'python', 'java', 'cpp'],
    starterCode: {
      javascript: `function subsets(nums) {\n  // Devuelve todos los subconjuntos\n  return [];\n}`,
      python: `def subsets(nums: list[int]) -> list[list[int]]:\n    # Devuelve todos los subconjuntos\n    return []`,
      java: `import java.util.*;\n\nclass Solution {\n    public List<List<Integer>> subsets(int[] nums) {\n        return new ArrayList<>();\n    }\n}`,
      cpp: `#include <vector>\nusing namespace std;\n\nvector<vector<int>> subsets(vector<int> nums) {\n    return {};\n}`,
    },
    referenceSolution: {
      javascript: `function subsets(nums) {\n  const res = [[]];\n  for (const num of nums) {\n    const len = res.length;\n    for (let i = 0; i < len; i++) {\n      res.push([...res[i], num]);\n    }\n  }\n  return res;\n}`,
      python: `def subsets(nums: list[int]) -> list[list[int]]:\n    res = [[]]\n    for num in nums:\n        res.extend([curr + [num] for curr in res])\n    return res`,
      java: `import java.util.*;\n\nclass Solution {\n    public List<List<Integer>> subsets(int[] nums) {\n        List<List<Integer>> res = new ArrayList<>();\n        res.add(new ArrayList<>());\n        for (int num : nums) {\n            int size = res.size();\n            for (int i = 0; i < size; i++) {\n                List<Integer> next = new ArrayList<>(res.get(i));\n                next.add(num);\n                res.add(next);\n            }\n        }\n        return res;\n    }\n}`,
      cpp: `#include <vector>\nusing namespace std;\n\nvector<vector<int>> subsets(vector<int> nums) {\n    vector<vector<int>> res = {{}};\n    for (int num : nums) {\n        size_t size = res.size();\n        for (size_t i = 0; i < size; i++) {\n            vector<int> next = res[i];\n            next.push_back(num);\n            res.push_back(next);\n        }\n    }\n    return res;\n}`,
    },
    tests: {
      visible: [
        { id: 't1', input: [[1, 2]], expected: [[], [1], [2], [1, 2]], inputDisplay: 'nums = [1, 2]', expectedDisplay: '[[], [1], [2], [1, 2]]' },
      ],
      hidden: [
        { id: 't2', input: [[]], expected: [[]], inputDisplay: 'nums = []', expectedDisplay: '[[]]' },
        { id: 't3', input: [[1, 2, 3]], expected: [[], [1], [2], [1, 2], [3], [1, 3], [2, 3], [1, 2, 3]], inputDisplay: 'nums = [1, 2, 3]', expectedDisplay: '8 subconjuntos' },
      ],
    },
    editorial: {
      explanation: 'Construye el conjunto potencia iterativamente: cada nuevo número duplica la cantidad de subconjuntos previos añadiéndose al final de cada uno.',
      timeComplexity: 'O(n · 2ⁿ)',
      spaceComplexity: 'O(n · 2ⁿ)',
      approaches: [{ name: 'Expansión iterativa', note: 'Sin recursión ni riesgo de orden distinto.' }],
    },
  },
  {
    id: 'camino-minimo-cuadricula-bfs',
    title: 'Camino mínimo en cuadrícula (BFS)',
    category: 'problem-solving',
    difficulty: 'hard',
    xp: 200,
    acceptanceRate: 49,
    tags: ['graphs', 'matrix'],
    entryPoint: 'shortestPathGrid',
    description:
      'Dada una cuadrícula binaria `grid` de `m × n` donde `0` es celda libre y `1` es obstáculo, devuelve el número mínimo de pasos (moviendo arriba, abajo, izquierda o derecha) desde `(0, 0)` hasta `(m - 1, n - 1)`, o `-1` si no existe camino.',
    examples: [
      { input: 'grid = [[0,0,0],[1,1,0],[0,0,0]]', output: '4' },
      { input: 'grid = [[0,1],[1,0]]', output: '-1' },
    ],
    constraints: ['1 <= m, n <= 100', 'grid[r][c] es 0 o 1'],
    hints: [
      'Si la celda inicial `(0,0)` o la final `(m-1,n-1)` es `1`, devuelve `-1` inmediatamente.',
      'BFS garantiza encontrar el camino más corto en grafos sin pesos.',
      'Usa una cola `[r, c, dist]` y marca las celdas visitadas al encolarlas, no al desencolarlas.',
    ],
    languages: ['javascript', 'python', 'java', 'cpp'],
    starterCode: {
      javascript: `function shortestPathGrid(grid) {\n  // Devuelve pasos mínimos o -1\n  return -2;\n}`,
      python: `def shortestPathGrid(grid: list[list[int]]) -> int:\n    # Devuelve pasos mínimos o -1\n    return -2`,
      java: `class Solution {\n    public int shortestPathGrid(int[][] grid) {\n        return -2;\n    }\n}`,
      cpp: `#include <vector>\nusing namespace std;\n\nint shortestPathGrid(vector<vector<int>> grid) {\n    return -2;\n}`,
    },
    referenceSolution: {
      javascript: `function shortestPathGrid(grid) {\n  const rows = grid.length;\n  const cols = grid[0].length;\n  if (grid[0][0] === 1 || grid[rows - 1][cols - 1] === 1) return -1;\n  if (rows === 1 && cols === 1) return 0;\n  const visited = Array.from({ length: rows }, () => new Array(cols).fill(false));\n  visited[0][0] = true;\n  const queue = [[0, 0, 0]];\n  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];\n  let head = 0;\n  while (head < queue.length) {\n    const [r, c, d] = queue[head++];\n    for (const [dr, dc] of dirs) {\n      const nr = r + dr;\n      const nc = c + dc;\n      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !visited[nr][nc] && grid[nr][nc] === 0) {\n        if (nr === rows - 1 && nc === cols - 1) return d + 1;\n        visited[nr][nc] = true;\n        queue.push([nr, nc, d + 1]);\n      }\n    }\n  }\n  return -1;\n}`,
      python: `from collections import deque\n\ndef shortestPathGrid(grid: list[list[int]]) -> int:\n    rows, cols = len(grid), len(grid[0])\n    if grid[0][0] == 1 or grid[rows - 1][cols - 1] == 1:\n        return -1\n    if rows == 1 and cols == 1:\n        return 0\n    visited = [[False] * cols for _ in range(rows)]\n    visited[0][0] = True\n    q = deque([(0, 0, 0)])\n    for_dirs = ((1, 0), (-1, 0), (0, 1), (0, -1))\n    while q:\n        r, c, d = q.popleft()\n        for dr, dc in for_dirs:\n            nr, nc = r + dr, c + dc\n            if 0 <= nr < rows and 0 <= nc < cols and not visited[nr][nc] and grid[nr][nc] == 0:\n                if nr == rows - 1 and nc == cols - 1:\n                    return d + 1\n                visited[nr][nc] = True\n                q.append((nr, nc, d + 1))\n    return -1`,
      java: `import java.util.*;\n\nclass Solution {\n    public int shortestPathGrid(int[][] grid) {\n        int rows = grid.length, cols = grid[0].length;\n        if (grid[0][0] == 1 || grid[rows - 1][cols - 1] == 1) return -1;\n        if (rows == 1 && cols == 1) return 0;\n        boolean[][] visited = new boolean[rows][cols];\n        visited[0][0] = true;\n        Queue<int[]> q = new ArrayDeque<>();\n        q.offer(new int[]{0, 0, 0});\n        int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};\n        while (!q.isEmpty()) {\n            int[] cur = q.poll();\n            for (int[] dir : dirs) {\n                int nr = cur[0] + dir[0], nc = cur[1] + dir[1];\n                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !visited[nr][nc] && grid[nr][nc] == 0) {\n                    if (nr == rows - 1 && nc == cols - 1) return cur[2] + 1;\n                    visited[nr][nc] = true;\n                    q.offer(new int[]{nr, nc, cur[2] + 1});\n                }\n            }\n        }\n        return -1;\n    }\n}`,
      cpp: `#include <vector>\n#include <queue>\nusing namespace std;\n\nint shortestPathGrid(vector<vector<int>> grid) {\n    int rows = (int)grid.size(), cols = (int)grid[0].size();\n    if (grid[0][0] == 1 || grid[rows - 1][cols - 1] == 1) return -1;\n    if (rows == 1 && cols == 1) return 0;\n    vector<vector<bool>> visited(rows, vector<bool>(cols, false));\n    visited[0][0] = true;\n    queue<vector<int>> q;\n    q.push({0, 0, 0});\n    int dirs[4][2] = {{1,0},{-1,0},{0,1},{0,-1}};\n    while (!q.empty()) {\n        auto cur = q.front(); q.pop();\n        for (auto& dir : dirs) {\n            int nr = cur[0] + dir[0], nc = cur[1] + dir[1];\n            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !visited[nr][nc] && grid[nr][nc] == 0) {\n                if (nr == rows - 1 && nc == cols - 1) return cur[2] + 1;\n                visited[nr][nc] = true;\n                q.push({nr, nc, cur[2] + 1});\n            }\n        }\n    }\n    return -1;\n}`,
    },
    tests: {
      visible: [
        { id: 't1', input: [[[0, 0, 0], [1, 1, 0], [0, 0, 0]]], expected: 4, inputDisplay: 'grid = [[0,0,0],[1,1,0],[0,0,0]]', expectedDisplay: '4' },
        { id: 't2', input: [[[0, 1], [1, 0]]], expected: -1, inputDisplay: 'grid = [[0,1],[1,0]]', expectedDisplay: '-1' },
      ],
      hidden: [
        { id: 't3', input: [[[0]]], expected: 0, inputDisplay: 'grid = [[0]]', expectedDisplay: '0' },
        { id: 't4', input: [[[0, 0], [0, 0]]], expected: 2, inputDisplay: 'grid = [[0,0],[0,0]]', expectedDisplay: '2' },
      ],
    },
    editorial: {
      explanation: 'La búsqueda en anchura (BFS) explora por capas de distancia creciente, por lo que la primera vez que alcanza `(m-1, n-1)` garantiza el camino mínimo.',
      timeComplexity: 'O(m · n)',
      spaceComplexity: 'O(m · n)',
      approaches: [{ name: 'BFS por niveles en cuadrícula', note: 'Marca visitado al encolar para no duplicar estados.' }],
    },
  },
  {
    id: 'validar-sudoku',
    title: 'Validar filas y columnas de sudoku',
    category: 'problem-solving',
    difficulty: 'hard',
    xp: 200,
    acceptanceRate: 53,
    tags: ['matrix', 'hash-map'],
    entryPoint: 'isValidSudoku',
    description:
      'Dado un tablero de Sudoku `9 × 9` con dígitos `"1"–"9"` y `"."` para casillas vacías, determina si el tablero parcial es válido comprobando que no haya dígitos repetidos en ninguna **fila**, **columna** ni **subcuadrícula `3 × 3`**.',
    examples: [
      { input: 'board = [["5","3",".",...], ...]', output: 'true' },
    ],
    constraints: ['board es siempre 9 × 9', 'Solo dígitos "1"-"9" o "."'],
    hints: [
      'Ignora las casillas con valor `"."`.',
      'Usa conjuntos `rows[r]`, `cols[c]` y `boxes[Math.floor(r/3)*3 + Math.floor(c/3)]`.',
      'Si un dígito ya existe en alguno de los tres conjuntos, devuelve `false`.',
    ],
    languages: ['javascript', 'python', 'java', 'cpp'],
    starterCode: {
      javascript: `function isValidSudoku(board) {\n  // Valida filas, columnas y cajas 3x3\n  return null;\n}`,
      python: `def isValidSudoku(board: list[list[str]]) -> bool:\n    # Valida filas, columnas y cajas 3x3\n    return None`,
      java: `class Solution {\n    public boolean isValidSudoku(char[][] board) {\n        return false;\n    }\n}`,
      cpp: `#include <vector>\nusing namespace std;\n\nbool isValidSudoku(vector<vector<char>> board) {\n    return false;\n}`,
    },
    referenceSolution: {
      javascript: `function isValidSudoku(board) {\n  const rows = Array.from({ length: 9 }, () => new Set());\n  const cols = Array.from({ length: 9 }, () => new Set());\n  const boxes = Array.from({ length: 9 }, () => new Set());\n  for (let r = 0; r < 9; r++) {\n    for (let c = 0; c < 9; c++) {\n      const val = board[r][c];\n      if (val === '.') continue;\n      const b = Math.floor(r / 3) * 3 + Math.floor(c / 3);\n      if (rows[r].has(val) || cols[c].has(val) || boxes[b].has(val)) return false;\n      rows[r].add(val);\n      cols[c].add(val);\n      boxes[b].add(val);\n    }\n  }\n  return true;\n}`,
      python: `def isValidSudoku(board: list[list[str]]) -> bool:\n    rows = [set() for _ in range(9)]\n    cols = [set() for _ in range(9)]\n    boxes = [set() for _ in range(9)]\n    for r in range(9):\n        for c in range(9):\n            val = board[r][c]\n            if val == ".":\n                continue\n            b = (r // 3) * 3 + (c // 3)\n            if val in rows[r] or val in cols[c] or val in boxes[b]:\n                return False\n            rows[r].add(val)\n            cols[c].add(val)\n            boxes[b].add(val)\n    return True`,
      java: `import java.util.*;\n\nclass Solution {\n    public boolean isValidSudoku(char[][] board) {\n        Set<Character>[] rows = new HashSet[9];\n        Set<Character>[] cols = new HashSet[9];\n        Set<Character>[] boxes = new HashSet[9];\n        for (int i = 0; i < 9; i++) {\n            rows[i] = new HashSet<>(); cols[i] = new HashSet<>(); boxes[i] = new HashSet<>();\n        }\n        for (int r = 0; r < 9; r++) {\n            for (int c = 0; c < 9; c++) {\n                char val = board[r][c];\n                if (val == '.') continue;\n                int b = (r / 3) * 3 + (c / 3);\n                if (!rows[r].add(val) || !cols[c].add(val) || !boxes[b].add(val)) return false;\n            }\n        }\n        return true;\n    }\n}`,
      cpp: `#include <vector>\n#include <unordered_set>\nusing namespace std;\n\nbool isValidSudoku(vector<vector<char>> board) {\n    vector<unordered_set<char>> rows(9), cols(9), boxes(9);\n    for (int r = 0; r < 9; r++) {\n        for (int c = 0; c < 9; c++) {\n            char val = board[r][c];\n            if (val == '.') continue;\n            int b = (r / 3) * 3 + (c / 3);\n            if (rows[r].count(val) || cols[c].count(val) || boxes[b].count(val)) return false;\n            rows[r].insert(val); cols[c].insert(val); boxes[b].insert(val);\n        }\n    }\n    return true;\n}`,
    },
    tests: {
      visible: [
        {
          id: 't1',
          input: [[
            ['5','3','.','.','7','.','.','.','.'],
            ['6','.','.','1','9','5','.','.','.'],
            ['.','9','8','.','.','.','.','6','.'],
            ['8','.','.','.','6','.','.','.','3'],
            ['4','.','.','8','.','3','.','.','1'],
            ['7','.','.','.','2','.','.','.','6'],
            ['.','6','.','.','.','.','2','8','.'],
            ['.','.','.','4','1','9','.','.','5'],
            ['.','.','.','.','8','.','.','7','9'],
          ]],
          expected: true,
          inputDisplay: 'tablero válido 9x9',
          expectedDisplay: 'true',
        },
      ],
      hidden: [
        {
          id: 't2',
          input: [[
            ['8','3','.','.','7','.','.','.','.'],
            ['6','.','.','1','9','5','.','.','.'],
            ['.','9','8','.','.','.','.','6','.'],
            ['8','.','.','.','6','.','.','.','3'],
            ['4','.','.','8','.','3','.','.','1'],
            ['7','.','.','.','2','.','.','.','6'],
            ['.','6','.','.','.','.','2','8','.'],
            ['.','.','.','4','1','9','.','.','5'],
            ['.','.','.','.','8','.','.','7','9'],
          ]],
          expected: false,
          inputDisplay: 'tablero con 8 repetido en columna 0',
          expectedDisplay: 'false',
        },
      ],
    },
    editorial: {
      explanation: 'Mapea cada celda `(r, c)` a su caja `(r // 3) * 3 + (c // 3)` y valida en una única pasada con conjuntos por fila, columna y bloque.',
      timeComplexity: 'O(1) (81 celdas fijas)',
      spaceComplexity: 'O(1)',
      approaches: [{ name: 'Tres arreglos de HashSet', note: 'Detecta colisiones de fila, columna y subcuadrícula en O(1).' }],
    },
  },
  {
    id: 'permutaciones-cadena',
    title: 'Permutaciones de cadena',
    category: 'problem-solving',
    difficulty: 'expert',
    xp: 350,
    acceptanceRate: 46,
    tags: ['recursion', 'strings'],
    entryPoint: 'stringPermutations',
    description:
      'Dada una cadena de caracteres distintos `s`, devuelve un arreglo con **todas sus permutaciones posibles**, ordenadas lexicográficamente.',
    examples: [
      { input: 's = "abc"', output: '["abc", "acb", "bac", "bca", "cab", "cba"]' },
    ],
    constraints: ['0 <= s.length <= 7', 'Caracteres únicos'],
    hints: [
      'Ordena primero los caracteres de `s` para que el backtracking genere permutaciones ya en orden lexicográfico.',
      'Usa un arreglo `used` de booleanos para marcar qué carácter ya está en el prefijo actual.',
      'Para `s = ""`, devuelve `[""]`.',
    ],
    languages: ['javascript', 'python', 'java', 'cpp'],
    starterCode: {
      javascript: `function stringPermutations(s) {\n  // Devuelve permutaciones ordenadas\n  return [];\n}`,
      python: `def stringPermutations(s: str) -> list[str]:\n    # Devuelve permutaciones ordenadas\n    return []`,
      java: `import java.util.*;\n\nclass Solution {\n    public List<String> stringPermutations(String s) {\n        return new ArrayList<>();\n    }\n}`,
      cpp: `#include <vector>\n#include <string>\nusing namespace std;\n\nvector<string> stringPermutations(string s) {\n    return {};\n}`,
    },
    referenceSolution: {
      javascript: `function stringPermutations(s) {\n  const chars = s.split('').sort();\n  const used = new Array(chars.length).fill(false);\n  const res = [];\n  function backtrack(path) {\n    if (path.length === chars.length) {\n      res.push(path.join(''));\n      return;\n    }\n    for (let i = 0; i < chars.length; i++) {\n      if (used[i]) continue;\n      used[i] = true;\n      path.push(chars[i]);\n      backtrack(path);\n      path.pop();\n      used[i] = false;\n    }\n  }\n  backtrack([]);\n  return res;\n}`,
      python: `def stringPermutations(s: str) -> list[str]:\n    chars = sorted(s)\n    used = [False] * len(chars)\n    res = []\n    def backtrack(path: list[str]):\n        if len(path) == len(chars):\n            res.append("".join(path))\n            return\n        for i in range(len(chars)):\n            if used[i]:\n                continue\n            used[i] = True\n            path.append(chars[i])\n            backtrack(path)\n            path.pop()\n            used[i] = False\n    backtrack([])\n    return res`,
      java: `import java.util.*;\n\nclass Solution {\n    public List<String> stringPermutations(String s) {\n        char[] chars = s.toCharArray();\n        Arrays.sort(chars);\n        boolean[] used = new boolean[chars.length];\n        List<String> res = new ArrayList<>();\n        backtrack(chars, used, new StringBuilder(), res);\n        return res;\n    }\n    private void backtrack(char[] chars, boolean[] used, StringBuilder path, List<String> res) {\n        if (path.length() == chars.length) {\n            res.add(path.toString());\n            return;\n        }\n        for (int i = 0; i < chars.length; i++) {\n            if (used[i]) continue;\n            used[i] = true;\n            path.append(chars[i]);\n            backtrack(chars, used, path, res);\n            path.deleteCharAt(path.length() - 1);\n            used[i] = false;\n        }\n    }\n}`,
      cpp: `#include <vector>\n#include <string>\n#include <algorithm>\nusing namespace std;\n\nvector<string> stringPermutations(string s) {\n    sort(s.begin(), s.end());\n    vector<string> res;\n    do {\n        res.push_back(s);\n    } while (next_permutation(s.begin(), s.end()));\n    return res;\n}`,
    },
    tests: {
      visible: [
        { id: 't1', input: ['abc'], expected: ['abc', 'acb', 'bac', 'bca', 'cab', 'cba'], inputDisplay: 's = "abc"', expectedDisplay: '["abc","acb","bac","bca","cab","cba"]' },
      ],
      hidden: [
        { id: 't2', input: [''], expected: [''], inputDisplay: 's = ""', expectedDisplay: '[""]' },
        { id: 't3', input: ['ba'], expected: ['ab', 'ba'], inputDisplay: 's = "ba"', expectedDisplay: '["ab", "ba"]' },
      ],
    },
    editorial: {
      explanation: 'Ordenar los caracteres al inicio garantiza que el backtracking en profundidad genere todas las permutaciones directamente en orden lexicográfico.',
      timeComplexity: 'O(n · n!)',
      spaceComplexity: 'O(n · n!)',
      approaches: [{ name: 'Backtracking ordenado', note: 'Marca posiciones usadas y retrocede al salir de la rama.' }],
    },
  },
  {
    id: 'combinaciones-monedas',
    title: 'Combinaciones de monedas',
    category: 'problem-solving',
    difficulty: 'expert',
    xp: 350,
    acceptanceRate: 43,
    tags: ['dp', 'arrays'],
    entryPoint: 'coinCombinations',
    description:
      'Dado un arreglo de denominaciones distintas `coins` y una cantidad objetivo `amount`, devuelve **de cuántas formas distintas** se puede sumar exactamente `amount` teniendo monedas ilimitadas de cada tipo (el orden de las monedas no importa).',
    examples: [
      { input: 'coins = [1, 2, 5], amount = 5', output: '4', explanation: '5, 2+2+1, 2+1+1+1, 1+1+1+1+1' },
      { input: 'coins = [2], amount = 3', output: '0' },
    ],
    constraints: ['0 <= amount <= 5000', '1 <= coins.length <= 50'],
    hints: [
      'A diferencia de permutaciones, aquí `[1,2]` y `[2,1]` cuentan como una sola combinación.',
      'Itera primero por cada moneda `coin` en el bucle externo y por `a` desde `coin` hasta `amount` en el interno.',
      'Inicializa `dp[0] = 1` y suma `dp[a] += dp[a - coin]`.',
    ],
    languages: ['javascript', 'python', 'java', 'cpp'],
    starterCode: {
      javascript: `function coinCombinations(coins, amount) {\n  // Cuenta combinaciones únicas para formar amount\n  return -1;\n}`,
      python: `def coinCombinations(coins: list[int], amount: int) -> int:\n    # Cuenta combinaciones únicas para formar amount\n    return -1`,
      java: `class Solution {\n    public int coinCombinations(int[] coins, int amount) {\n        return -1;\n    }\n}`,
      cpp: `#include <vector>\nusing namespace std;\n\nint coinCombinations(vector<int> coins, int amount) {\n    return -1;\n}`,
    },
    referenceSolution: {
      javascript: `function coinCombinations(coins, amount) {\n  const dp = new Array(amount + 1).fill(0);\n  dp[0] = 1;\n  for (const coin of coins) {\n    for (let a = coin; a <= amount; a++) {\n      dp[a] += dp[a - coin];\n    }\n  }\n  return dp[amount];\n}`,
      python: `def coinCombinations(coins: list[int], amount: int) -> int:\n    dp = [0] * (amount + 1)\n    dp[0] = 1\n    for coin in coins:\n        for a in range(coin, amount + 1):\n            dp[a] += dp[a - coin]\n    return dp[amount]`,
      java: `class Solution {\n    public int coinCombinations(int[] coins, int amount) {\n        int[] dp = new int[amount + 1];\n        dp[0] = 1;\n        for (int coin : coins) {\n            for (int a = coin; a <= amount; a++) {\n                dp[a] += dp[a - coin];\n            }\n        }\n        return dp[amount];\n    }\n}`,
      cpp: `#include <vector>\nusing namespace std;\n\nint coinCombinations(vector<int> coins, int amount) {\n    vector<int> dp(amount + 1, 0);\n    dp[0] = 1;\n    for (int coin : coins) {\n        for (int a = coin; a <= amount; a++) {\n            dp[a] += dp[a - coin];\n        }\n    }\n    return dp[amount];\n}`,
    },
    tests: {
      visible: [
        { id: 't1', input: [[1, 2, 5], 5], expected: 4, inputDisplay: 'coins = [1,2,5], amount = 5', expectedDisplay: '4' },
        { id: 't2', input: [[2], 3], expected: 0, inputDisplay: 'coins = [2], amount = 3', expectedDisplay: '0' },
      ],
      hidden: [
        { id: 't3', input: [[1, 2], 0], expected: 1, inputDisplay: 'coins = [1,2], amount = 0', expectedDisplay: '1' },
        { id: 't4', input: [[1, 5, 10], 12], expected: 4, inputDisplay: 'coins = [1,5,10], amount = 12', expectedDisplay: '4' },
      ],
    },
    editorial: {
      explanation: 'Al iterar primero sobre cada moneda y luego sobre las cantidades crecientes, imponemos un orden canónico de denominaciones que evita contar permutaciones repetidas.',
      timeComplexity: 'O(coins · amount)',
      spaceComplexity: 'O(amount)',
      approaches: [{ name: 'Mochila ilimitada 1D', note: 'Bucle externo por monedas, interno por cantidad.' }],
    },
  },
  {
    id: 'n-reinas-contar',
    title: 'N-Reinas (contar soluciones)',
    category: 'problem-solving',
    difficulty: 'expert',
    xp: 350,
    acceptanceRate: 39,
    tags: ['recursion', 'matrix'],
    entryPoint: 'totalNQueens',
    description:
      'El problema de las **N-Reinas** consiste en colocar `n` reinas en un tablero de ajedrez `n × n` de forma que ninguna reina ataque a otra (ni misma fila, ni misma columna, ni mismas diagonales).\n\n' +
      'Dado un entero `n`, devuelve el **número total de soluciones distintas**.',
    examples: [
      { input: 'n = 4', output: '2' },
      { input: 'n = 1', output: '1' },
    ],
    constraints: ['1 <= n <= 10'],
    hints: [
      'Coloca exactamente una reina por fila `r` mediante backtracking.',
      'Mantén conjuntos (o arreglos booleanos) para columnas ocupadas `cols`, diagonal principal `r - c` y diagonal secundaria `r + c`.',
      'Cuando `r === n`, encontraste una configuración válida: suma 1.',
    ],
    languages: ['javascript', 'python', 'java', 'cpp'],
    starterCode: {
      javascript: `function totalNQueens(n) {\n  // Cuenta soluciones válidas de N-Reinas\n  return 0;\n}`,
      python: `def totalNQueens(n: int) -> int:\n    # Cuenta soluciones válidas de N-Reinas\n    return 0`,
      java: `class Solution {\n    public int totalNQueens(int n) {\n        return 0;\n    }\n}`,
      cpp: `int totalNQueens(int n) {\n    return 0;\n}`,
    },
    referenceSolution: {
      javascript: `function totalNQueens(n) {\n  const cols = new Set();\n  const diag1 = new Set();\n  const diag2 = new Set();\n  let count = 0;\n  function backtrack(row) {\n    if (row === n) {\n      count++;\n      return;\n    }\n    for (let col = 0; col < n; col++) {\n      if (cols.has(col) || diag1.has(row - col) || diag2.has(row + col)) continue;\n      cols.add(col);\n      diag1.add(row - col);\n      diag2.add(row + col);\n      backtrack(row + 1);\n      cols.delete(col);\n      diag1.delete(row - col);\n      diag2.delete(row + col);\n    }\n  }\n  backtrack(0);\n  return count;\n}`,
      python: `def totalNQueens(n: int) -> int:\n    cols, diag1, diag2 = set(), set(), set()\n    count = 0\n    def backtrack(row: int):\n        nonlocal count\n        if row == n:\n            count += 1\n            return\n        for col in range(n):\n            if col in cols or (row - col) in diag1 or (row + col) in diag2:\n                continue\n            cols.add(col)\n            diag1.add(row - col)\n            diag2.add(row + col)\n            backtrack(row + 1)\n            cols.remove(col)\n            diag1.remove(row - col)\n            diag2.remove(row + col)\n    backtrack(0)\n    return count`,
      java: `import java.util.*;\n\nclass Solution {\n    private int count = 0;\n    public int totalNQueens(int n) {\n        count = 0;\n        backtrack(0, n, new HashSet<>(), new HashSet<>(), new HashSet<>());\n        return count;\n    }\n    private void backtrack(int row, int n, Set<Integer> cols, Set<Integer> d1, Set<Integer> d2) {\n        if (row == n) { count++; return; }\n        for (int col = 0; col < n; col++) {\n            if (cols.contains(col) || d1.contains(row - col) || d2.contains(row + col)) continue;\n            cols.add(col); d1.add(row - col); d2.add(row + col);\n            backtrack(row + 1, n, cols, d1, d2);\n            cols.remove(col); d1.remove(row - col); d2.remove(row + col);\n        }\n    }\n}`,
      cpp: `#include <vector>\nusing namespace std;\n\nvoid solveQueens(int row, int n, vector<bool>& cols, vector<bool>& d1, vector<bool>& d2, int& count) {\n    if (row == n) { count++; return; }\n    for (int col = 0; col < n; col++) {\n        int id1 = row - col + n, id2 = row + col;\n        if (cols[col] || d1[id1] || d2[id2]) continue;\n        cols[col] = d1[id1] = d2[id2] = true;\n        solveQueens(row + 1, n, cols, d1, d2, count);\n        cols[col] = d1[id1] = d2[id2] = false;\n    }\n}\n\nint totalNQueens(int n) {\n    int count = 0;\n    vector<bool> cols(n, false), d1(2 * n, false), d2(2 * n, false);\n    solveQueens(0, n, cols, d1, d2, count);\n    return count;\n}`,
    },
    tests: {
      visible: [
        { id: 't1', input: [4], expected: 2, inputDisplay: 'n = 4', expectedDisplay: '2' },
        { id: 't2', input: [1], expected: 1, inputDisplay: 'n = 1', expectedDisplay: '1' },
      ],
      hidden: [
        { id: 't3', input: [3], expected: 0, inputDisplay: 'n = 3', expectedDisplay: '0' },
        { id: 't4', input: [8], expected: 92, inputDisplay: 'n = 8', expectedDisplay: '92' },
      ],
    },
    editorial: {
      explanation: 'Coloca una reina por fila comprobando colisiones de columna y diagonales (`row - col` y `row + col`) en `O(1)`.',
      timeComplexity: 'O(n!)',
      spaceComplexity: 'O(n)',
      approaches: [{ name: 'Backtracking con conjuntos de ataque', note: 'Poda inmediata antes de descender a la fila siguiente.' }],
    },
  },
];
