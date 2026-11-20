import type { Challenge } from '../../types';

export const NEW_DEBUGGING_CHALLENGES: Challenge[] = [
  {
    id: 'bug-promedio-division-entera',
    title: 'Bug: Promedio con división entera',
    category: 'debugging',
    difficulty: 'easy',
    xp: 50,
    acceptanceRate: 83,
    tags: ['debugging', 'math', 'arrays'],
    entryPoint: 'averageScore',
    description:
      'La función `averageScore(scores)` debe devolver el promedio exacto redondeado a **2 decimales** (número). El código actual trunca los valores con `Math.trunc` / división entera antes de promediar, perdiendo precisión. Corrígelo (y devuelve `0` si el arreglo está vacío).',
    examples: [
      { input: 'scores = [3, 4]', output: '3.5' },
      { input: 'scores = [10, 9, 9]', output: '9.33' },
    ],
    constraints: ['0 <= scores.length <= 10^4'],
    hints: [
      'No trunques la suma ni dividas usando enteros antes de convertir a flotante.',
      'En JS redondea con `Math.round((sum / scores.length) * 100) / 100`.',
      'Si `scores.length === 0`, devuelve `0`.',
    ],
    languages: ['javascript', 'python', 'java', 'cpp'],
    starterCode: {
      javascript: `function averageScore(scores) {\n  if (scores.length === 0) return 0;\n  let sum = 0;\n  for (const s of scores) sum += s;\n  return Math.trunc(sum / scores.length);\n}`,
      python: `def averageScore(scores: list[int]) -> float:\n    if not scores:\n        return 0.0\n    return float(sum(scores) // len(scores))`,
      java: `class Solution {\n    public double averageScore(int[] scores) {\n        if (scores.length == 0) return 0;\n        int sum = 0;\n        for (int s : scores) sum += s;\n        return sum / scores.length;\n    }\n}`,
      cpp: `#include <vector>\nusing namespace std;\n\ndouble averageScore(vector<int> scores) {\n    if (scores.empty()) return 0.0;\n    int sum = 0;\n    for (int s : scores) sum += s;\n    return sum / scores.size();\n}`,
    },
    referenceSolution: {
      javascript: `function averageScore(scores) {\n  if (scores.length === 0) return 0;\n  let sum = 0;\n  for (const s of scores) sum += s;\n  return Math.round((sum / scores.length) * 100) / 100;\n}`,
      python: `def averageScore(scores: list[int]) -> float:\n    if not scores:\n        return 0.0\n    return round(sum(scores) / len(scores), 2)`,
      java: `class Solution {\n    public double averageScore(int[] scores) {\n        if (scores.length == 0) return 0.0;\n        double sum = 0;\n        for (int s : scores) sum += s;\n        return Math.round((sum / scores.length) * 100.0) / 100.0;\n    }\n}`,
      cpp: `#include <vector>\n#include <cmath>\nusing namespace std;\n\ndouble averageScore(vector<int> scores) {\n    if (scores.empty()) return 0.0;\n    double sum = 0;\n    for (int s : scores) sum += s;\n    return round((sum / scores.size()) * 100.0) / 100.0;\n}`,
    },
    tests: {
      visible: [
        { id: 't1', input: [[3, 4]], expected: 3.5, inputDisplay: 'scores = [3, 4]', expectedDisplay: '3.5' },
        { id: 't2', input: [[10, 9, 9]], expected: 9.33, inputDisplay: 'scores = [10, 9, 9]', expectedDisplay: '9.33' },
      ],
      hidden: [
        { id: 't3', input: [[]], expected: 0, inputDisplay: 'scores = []', expectedDisplay: '0' },
        { id: 't4', input: [[1, 2, 2]], expected: 1.67, inputDisplay: 'scores = [1, 2, 2]', expectedDisplay: '1.67' },
      ],
    },
    validationHints: {
      forbiddenSubstrings: {
        python: ['// len(scores)'],
        java: ['int sum = 0;'],
        cpp: ['int sum = 0;'],
      },
    },
    editorial: {
      explanation: 'Evita el truncamiento entero (`Math.trunc`, `//` en Python o división `int/int` en Java/C++) usando punto flotante y redondeando a 2 decimales.',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      approaches: [{ name: 'Suma flotante + redondeo', note: 'Multiplica por 100, redondea y divide entre 100.' }],
    },
  },
  {
    id: 'bug-mutacion-accidental-array',
    title: 'Bug: Mutación accidental de array',
    category: 'debugging',
    difficulty: 'medium',
    xp: 100,
    acceptanceRate: 68,
    tags: ['debugging', 'arrays'],
    entryPoint: 'appendWithoutMutating',
    description:
      'La función `appendWithoutMutating(list, item)` debe devolver un objeto `{ updated, originalLength }` donde `updated` contiene todos los elementos de `list` más `item` al final, **sin modificar `list`**. El código actual usa `.push()` directo sobre `list`. Corrígelo.',
    examples: [
      { input: 'list = [1, 2], item = 3', output: '{ updated: [1, 2, 3], originalLength: 2 }' },
    ],
    constraints: ['0 <= list.length <= 10^4'],
    hints: [
      '`list.push(item)` modifica el arreglo original y devuelve la nueva longitud, no el arreglo.',
      'Crea un nuevo arreglo con el operador spread `[...list, item]`.',
      'Lee `list.length` sin haberlo alterado.',
    ],
    languages: ['javascript', 'python', 'java', 'cpp'],
    starterCode: {
      javascript: `function appendWithoutMutating(list, item) {\n  const originalLength = list.length;\n  list.push(item);\n  return { updated: list, originalLength: list.length };\n}`,
      python: `def appendWithoutMutating(items: list[int], item: int) -> dict:\n    items.append(item)\n    return {"updated": items, "originalLength": len(items)}`,
      java: `import java.util.*;\n\nclass Solution {\n    public List<Integer> appendWithoutMutating(List<Integer> list, int item) {\n        list.add(item);\n        return list;\n    }\n}`,
      cpp: `#include <vector>\nusing namespace std;\n\nvector<int> appendWithoutMutating(vector<int>& list, int item) {\n    list.push_back(item);\n    return list;\n}`,
    },
    referenceSolution: {
      javascript: `function appendWithoutMutating(list, item) {\n  return {\n    updated: [...list, item],\n    originalLength: list.length,\n  };\n}`,
      python: `def appendWithoutMutating(items: list[int], item: int) -> dict:\n    updated = [*items, item]\n    return {"updated": updated, "originalLength": len(items)}`,
      java: `import java.util.*;\n\nclass Solution {\n    public List<Integer> appendWithoutMutating(List<Integer> list, int item) {\n        List<Integer> updated = new ArrayList<>(list);\n        updated.add(item);\n        return updated;\n    }\n}`,
      cpp: `#include <vector>\nusing namespace std;\n\nvector<int> appendWithoutMutating(const vector<int>& list, int item) {\n    vector<int> updated = list;\n    updated.push_back(item);\n    return updated;\n}`,
    },
    tests: {
      visible: [
        { id: 't1', input: [[1, 2], 3], expected: { updated: [1, 2, 3], originalLength: 2 }, inputDisplay: 'list = [1, 2], item = 3', expectedDisplay: '{ updated: [1, 2, 3], originalLength: 2 }' },
      ],
      hidden: [
        { id: 't2', input: [[], 9], expected: { updated: [9], originalLength: 0 }, inputDisplay: 'list = [], item = 9', expectedDisplay: '{ updated: [9], originalLength: 0 }' },
      ],
    },
    validationHints: {
      forbiddenSubstrings: {
        python: ['items.append(item)'],
        java: ['list.add(item)'],
        cpp: ['list.push_back(item)'],
      },
    },
    editorial: {
      explanation: 'Construye una copia nueva (`[...list, item]`) antes de añadir el elemento para respetar la inmutabilidad del parámetro.',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      approaches: [{ name: 'Copia superficial + inserción', note: 'Preserva la referencia original intacta.' }],
    },
  },
  {
    id: 'bug-condicion-invertida-filter',
    title: 'Bug: Condición invertida en filter',
    category: 'debugging',
    difficulty: 'medium',
    xp: 100,
    acceptanceRate: 71,
    tags: ['debugging', 'arrays'],
    entryPoint: 'keepActiveAdults',
    description:
      'Dado un arreglo de objetos `{ name, age, active }`, devuelve los nombres de los usuarios que **están activos** (`active === true`) y tienen **18 años o más**. El filtro actual tiene la condición invertida y devuelve los inactivos o menores. Corrígelo.',
    examples: [
      {
        input: 'users = [{name:"Ana",age:20,active:true}, {name:"Luis",age:17,active:true}, {name:"Eva",age:25,active:false}]',
        output: '["Ana"]',
      },
    ],
    constraints: ['0 <= users.length <= 5000'],
    hints: [
      'Revisa la negación lógica `!u.active` y el operador de edad `u.age < 18`.',
      'Debe cumplirse `u.active === true && u.age >= 18`.',
      'Mapea el resultado a `u.name` manteniendo el orden original.',
    ],
    languages: ['javascript', 'python', 'java', 'cpp'],
    starterCode: {
      javascript: `function keepActiveAdults(users) {\n  return users\n    .filter((u) => !u.active || u.age < 18)\n    .map((u) => u.name);\n}`,
      python: `def keepActiveAdults(users: list[dict]) -> list[str]:\n    return [u["name"] for u in users if not u["active"] or u["age"] < 18]`,
      java: `import java.util.*;\n\nclass Solution {\n    public List<String> keepActiveAdults(List<String> names, int[] ages, boolean[] active) {\n        List<String> out = new ArrayList<>();\n        for (int i = 0; i < names.size(); i++) {\n            if (!active[i] || ages[i] < 18) out.add(names.get(i));\n        }\n        return out;\n    }\n}`,
      cpp: `#include <vector>\n#include <string>\nusing namespace std;\n\nvector<string> keepActiveAdults(vector<string> names, vector<int> ages, vector<bool> active) {\n    vector<string> out;\n    for (size_t i = 0; i < names.size(); i++) {\n        if (!active[i] || ages[i] < 18) out.push_back(names[i]);\n    }\n    return out;\n}`,
    },
    referenceSolution: {
      javascript: `function keepActiveAdults(users) {\n  return users\n    .filter((u) => u.active === true && u.age >= 18)\n    .map((u) => u.name);\n}`,
      python: `def keepActiveAdults(users: list[dict]) -> list[str]:\n    return [u["name"] for u in users if u["active"] is True and u["age"] >= 18]`,
      java: `import java.util.*;\n\nclass Solution {\n    public List<String> keepActiveAdults(List<String> names, int[] ages, boolean[] active) {\n        List<String> out = new ArrayList<>();\n        for (int i = 0; i < names.size(); i++) {\n            if (active[i] && ages[i] >= 18) out.add(names.get(i));\n        }\n        return out;\n    }\n}`,
      cpp: `#include <vector>\n#include <string>\nusing namespace std;\n\nvector<string> keepActiveAdults(vector<string> names, vector<int> ages, vector<bool> active) {\n    vector<string> out;\n    for (size_t i = 0; i < names.size(); i++) {\n        if (active[i] && ages[i] >= 18) out.push_back(names[i]);\n    }\n    return out;\n}`,
    },
    tests: {
      visible: [
        {
          id: 't1',
          input: [[{ name: 'Ana', age: 20, active: true }, { name: 'Luis', age: 17, active: true }, { name: 'Eva', age: 25, active: false }]],
          expected: ['Ana'],
          inputDisplay: 'users = [Ana(20,true), Luis(17,true), Eva(25,false)]',
          expectedDisplay: '["Ana"]',
        },
      ],
      hidden: [
        {
          id: 't2',
          input: [[{ name: 'Sol', age: 18, active: true }, { name: 'Leo', age: 18, active: false }]],
          expected: ['Sol'],
          inputDisplay: 'users = [Sol(18,true), Leo(18,false)]',
          expectedDisplay: '["Sol"]',
        },
        { id: 't3', input: [[]], expected: [], inputDisplay: 'users = []', expectedDisplay: '[]' },
      ],
    },
    validationHints: {
      forbiddenSubstrings: {
        python: ['not u["active"]'],
        java: ['!active[i]'],
        cpp: ['!active[i]'],
      },
    },
    editorial: {
      explanation: 'Aplica las leyes de De Morgan correctamente: la condición positiva es `u.active === true && u.age >= 18`.',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      approaches: [{ name: 'Filtro positivo estricto', note: 'Incluye el límite exacto age === 18.' }],
    },
  },
  {
    id: 'bug-acumulador-sin-inicializar',
    title: 'Bug: Acumulador sin inicializar',
    category: 'debugging',
    difficulty: 'medium',
    xp: 100,
    acceptanceRate: 66,
    tags: ['debugging', 'arrays', 'hash-map'],
    entryPoint: 'groupTotals',
    description:
      'Dado un arreglo de movimientos `{ category, amount }`, devuelve un objeto con el total acumulado por cada `category`. El código actual olvida inicializar la clave en `0` antes de sumar, generando `NaN` o `KeyError`. Corrígelo.',
    examples: [
      { input: 'items = [{category:"a",amount:10},{category:"b",amount:5},{category:"a",amount:15}]', output: '{ a: 25, b: 5 }' },
    ],
    constraints: ['0 <= items.length <= 10^4'],
    hints: [
      'Sumar a `totals[item.category]` cuando aún es `undefined` produce `NaN`.',
      'Usa `(totals[item.category] ?? 0) + item.amount`.',
      'Comprueba que un arreglo vacío devuelva `{}`.',
    ],
    languages: ['javascript', 'python', 'java', 'cpp'],
    starterCode: {
      javascript: `function groupTotals(items) {\n  const totals = {};\n  for (const item of items) {\n    totals[item.category] += item.amount;\n  }\n  return totals;\n}`,
      python: `def groupTotals(items: list[dict]) -> dict:\n    totals = {}\n    for item in items:\n        totals[item["category"]] += item["amount"]\n    return totals`,
      java: `import java.util.*;\n\nclass Solution {\n    public Map<String, Integer> groupTotals(List<String> cats, int[] amounts) {\n        Map<String, Integer> totals = new HashMap<>();\n        for (int i = 0; i < cats.size(); i++) {\n            totals.put(cats.get(i), totals.get(cats.get(i)) + amounts[i]);\n        }\n        return totals;\n    }\n}`,
      cpp: `#include <vector>\n#include <string>\n#include <unordered_map>\nusing namespace std;\n\nunordered_map<string, int> groupTotals(vector<string> cats, vector<int> amounts) {\n    unordered_map<string, int> totals;\n    for (size_t i = 0; i < cats.size(); i++) {\n        totals.at(cats[i]) += amounts[i];\n    }\n    return totals;\n}`,
    },
    referenceSolution: {
      javascript: `function groupTotals(items) {\n  const totals = {};\n  for (const item of items) {\n    totals[item.category] = (totals[item.category] ?? 0) + item.amount;\n  }\n  return totals;\n}`,
      python: `def groupTotals(items: list[dict]) -> dict:\n    totals = {}\n    for item in items:\n        cat = item["category"]\n        totals[cat] = totals.get(cat, 0) + item["amount"]\n    return totals`,
      java: `import java.util.*;\n\nclass Solution {\n    public Map<String, Integer> groupTotals(List<String> cats, int[] amounts) {\n        Map<String, Integer> totals = new HashMap<>();\n        for (int i = 0; i < cats.size(); i++) {\n            String cat = cats.get(i);\n            totals.put(cat, totals.getOrDefault(cat, 0) + amounts[i]);\n        }\n        return totals;\n    }\n}`,
      cpp: `#include <vector>\n#include <string>\n#include <unordered_map>\nusing namespace std;\n\nunordered_map<string, int> groupTotals(vector<string> cats, vector<int> amounts) {\n    unordered_map<string, int> totals;\n    for (size_t i = 0; i < cats.size(); i++) {\n        totals[cats[i]] += amounts[i];\n    }\n    return totals;\n}`,
    },
    tests: {
      visible: [
        {
          id: 't1',
          input: [[{ category: 'a', amount: 10 }, { category: 'b', amount: 5 }, { category: 'a', amount: 15 }]],
          expected: { a: 25, b: 5 },
          inputDisplay: 'items = [{a,10}, {b,5}, {a,15}]',
          expectedDisplay: '{ a: 25, b: 5 }',
        },
      ],
      hidden: [
        { id: 't2', input: [[]], expected: {}, inputDisplay: 'items = []', expectedDisplay: '{}' },
        {
          id: 't3',
          input: [[{ category: 'x', amount: -3 }, { category: 'x', amount: 8 }]],
          expected: { x: 5 },
          inputDisplay: 'items = [{x,-3}, {x,8}]',
          expectedDisplay: '{ x: 5 }',
        },
      ],
    },
    validationHints: {
      forbiddenSubstrings: {
        python: ['totals[item["category"]] += item["amount"]'],
        java: ['totals.get(cats.get(i))'],
        cpp: ['totals.at(cats[i])'],
      },
    },
    editorial: {
      explanation: 'Inicializa las entradas ausentes con `?? 0` en JS, `dict.get(k, 0)` en Python o `getOrDefault` en Java antes de acumular.',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(k)',
      approaches: [{ name: 'Lectura con valor por defecto 0', note: 'Evita NaN y excepciones por clave inexistente.' }],
    },
  },
  {
    id: 'bug-closure-bucle',
    title: 'Bug: Closure dentro de un bucle',
    category: 'debugging',
    difficulty: 'hard',
    xp: 200,
    acceptanceRate: 57,
    tags: ['debugging', 'arrays'],
    entryPoint: 'buildMultipliers',
    description:
      'La función `buildMultipliers(n, factor)` debe devolver un arreglo de longitud `n` donde el elemento `i` sea el resultado de llamar a una función capturada para el índice `i`, devolviendo `i * factor`.\n\n' +
      'El código actual usa `var` en el bucle y todas las funciones capturan el valor final `n`. Corrígelo para que cada entrada devuelva su `i * factor` real.',
    examples: [
      { input: 'n = 4, factor = 10', output: '[0, 10, 20, 30]' },
    ],
    constraints: ['0 <= n <= 1000'],
    hints: [
      '`var` tiene alcance de función, no de bloque, por lo que todas las clausuras comparten la misma variable `i`.',
      'Cambia `var` por `let` (o crea un ámbito por iteración).',
      'Asegúrate de devolver los valores ejecutados `[0, factor, 2*factor, ...]`.',
    ],
    languages: ['javascript', 'python', 'java', 'cpp'],
    starterCode: {
      javascript: `function buildMultipliers(n, factor) {\n  const fns = [];\n  for (var i = 0; i < n; i++) {\n    fns.push(() => i * factor);\n  }\n  return fns.map((fn) => fn());\n}`,
      python: `def buildMultipliers(n: int, factor: int) -> list[int]:\n    fns = [lambda: i * factor for i in range(n)]\n    return [fn() for fn in fns]`,
      java: `import java.util.*;\nimport java.util.function.*;\n\nclass Solution {\n    public List<Integer> buildMultipliers(int n, int factor) {\n        List<Integer> out = new ArrayList<>();\n        int[] shared = new int[]{0};\n        List<Supplier<Integer>> fns = new ArrayList<>();\n        for (shared[0] = 0; shared[0] < n; shared[0]++) {\n            fns.add(() -> shared[0] * factor);\n        }\n        for (Supplier<Integer> fn : fns) out.add(fn.get());\n        return out;\n    }\n}`,
      cpp: `#include <vector>\n#include <functional>\nusing namespace std;\n\nvector<int> buildMultipliers(int n, int factor) {\n    vector<function<int()>> fns;\n    int i = 0;\n    for (i = 0; i < n; i++) {\n        fns.push_back([&i, factor]() { return i * factor; });\n    }\n    vector<int> out;\n    for (auto& fn : fns) out.push_back(fn());\n    return out;\n}`,
    },
    referenceSolution: {
      javascript: `function buildMultipliers(n, factor) {\n  const fns = [];\n  for (let i = 0; i < n; i++) {\n    fns.push(() => i * factor);\n  }\n  return fns.map((fn) => fn());\n}`,
      python: `def buildMultipliers(n: int, factor: int) -> list[int]:\n    fns = [lambda idx=i: idx * factor for i in range(n)]\n    return [fn() for fn in fns]`,
      java: `import java.util.*;\nimport java.util.function.*;\n\nclass Solution {\n    public List<Integer> buildMultipliers(int n, int factor) {\n        List<Integer> out = new ArrayList<>();\n        List<Supplier<Integer>> fns = new ArrayList<>();\n        for (int i = 0; i < n; i++) {\n            int idx = i;\n            fns.add(() -> idx * factor);\n        }\n        for (Supplier<Integer> fn : fns) out.add(fn.get());\n        return out;\n    }\n}`,
      cpp: `#include <vector>\n#include <functional>\nusing namespace std;\n\nvector<int> buildMultipliers(int n, int factor) {\n    vector<function<int()>> fns;\n    for (int i = 0; i < n; i++) {\n        fns.push_back([i, factor]() { return i * factor; });\n    }\n    vector<int> out;\n    for (auto& fn : fns) out.push_back(fn());\n    return out;\n}`,
    },
    tests: {
      visible: [
        { id: 't1', input: [4, 10], expected: [0, 10, 20, 30], inputDisplay: 'n = 4, factor = 10', expectedDisplay: '[0, 10, 20, 30]' },
      ],
      hidden: [
        { id: 't2', input: [0, 5], expected: [], inputDisplay: 'n = 0, factor = 5', expectedDisplay: '[]' },
        { id: 't3', input: [3, -2], expected: [0, -2, -4], inputDisplay: 'n = 3, factor = -2', expectedDisplay: '[0, -2, -4]' },
      ],
    },
    validationHints: {
      forbiddenSubstrings: {
        python: ['lambda: i * factor'],
        java: ['shared[0]'],
        cpp: ['[&i, factor]'],
      },
    },
    editorial: {
      explanation: 'Cada iteración necesita su propio enlace léxico: `let` en JS, parámetro por defecto `idx=i` en Python o captura por valor `[i]` en C++.',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      approaches: [{ name: 'Captura por valor / alcance de bloque', note: 'Evita compartir la variable mutable del bucle.' }],
    },
  },
  {
    id: 'bug-ordenar-numeros-texto',
    title: 'Bug: Ordenar números como texto',
    category: 'debugging',
    difficulty: 'hard',
    xp: 200,
    acceptanceRate: 62,
    tags: ['debugging', 'sorting', 'arrays'],
    entryPoint: 'sortNumbersAsc',
    description:
      'La función `sortNumbersAsc(nums)` debe devolver un nuevo arreglo con los números ordenados de menor a mayor numéricamente (incluyendo negativos y números de varios dígitos). El código actual ordena lexicográficamente (`"100" < "20"`). Corrígelo.',
    examples: [
      { input: 'nums = [100, 20, 3, -5, 0]', output: '[-5, 0, 3, 20, 100]' },
    ],
    constraints: ['0 <= nums.length <= 10^4'],
    hints: [
      'En JavaScript `.sort()` convierte elementos a string si no pasas función comparadora.',
      'Pasa `(a, b) => a - b` sobre una copia `[...nums]`.',
      'En Python ordena usando `sorted(nums)` como enteros, no `key=str`.',
    ],
    languages: ['javascript', 'python', 'java', 'cpp'],
    starterCode: {
      javascript: `function sortNumbersAsc(nums) {\n  return [...nums].sort();\n}`,
      python: `def sortNumbersAsc(nums: list[int]) -> list[int]:\n    return sorted(nums, key=str)`,
      java: `import java.util.*;\n\nclass Solution {\n    public int[] sortNumbersAsc(int[] nums) {\n        String[] strs = new String[nums.length];\n        for (int i = 0; i < nums.length; i++) strs[i] = String.valueOf(nums[i]);\n        Arrays.sort(strs);\n        int[] res = new int[nums.length];\n        for (int i = 0; i < nums.length; i++) res[i] = Integer.parseInt(strs[i]);\n        return res;\n    }\n}`,
      cpp: `#include <vector>\n#include <string>\n#include <algorithm>\nusing namespace std;\n\nvector<int> sortNumbersAsc(vector<int> nums) {\n    sort(nums.begin(), nums.end(), [](int a, int b) { return to_string(a) < to_string(b); });\n    return nums;\n}`,
    },
    referenceSolution: {
      javascript: `function sortNumbersAsc(nums) {\n  return [...nums].sort((a, b) => a - b);\n}`,
      python: `def sortNumbersAsc(nums: list[int]) -> list[int]:\n    return sorted(nums)`,
      java: `import java.util.*;\n\nclass Solution {\n    public int[] sortNumbersAsc(int[] nums) {\n        int[] res = Arrays.copyOf(nums, nums.length);\n        Arrays.sort(res);\n        return res;\n    }\n}`,
      cpp: `#include <vector>\n#include <algorithm>\nusing namespace std;\n\nvector<int> sortNumbersAsc(vector<int> nums) {\n    sort(nums.begin(), nums.end());\n    return nums;\n}`,
    },
    tests: {
      visible: [
        { id: 't1', input: [[100, 20, 3, -5, 0]], expected: [-5, 0, 3, 20, 100], inputDisplay: 'nums = [100,20,3,-5,0]', expectedDisplay: '[-5, 0, 3, 20, 100]' },
      ],
      hidden: [
        { id: 't2', input: [[10, 2, 1, 20]], expected: [1, 2, 10, 20], inputDisplay: 'nums = [10,2,1,20]', expectedDisplay: '[1, 2, 10, 20]' },
        { id: 't3', input: [[]], expected: [], inputDisplay: 'nums = []', expectedDisplay: '[]' },
      ],
    },
    validationHints: {
      forbiddenSubstrings: {
        python: ['key=str'],
        java: ['String.valueOf'],
        cpp: ['to_string(a)'],
      },
    },
    editorial: {
      explanation: 'Proporciona un comparador numérico `(a, b) => a - b` y copia el arreglo antes de ordenar para no mutar la entrada.',
      timeComplexity: 'O(n log n)',
      spaceComplexity: 'O(n)',
      approaches: [{ name: 'Comparador numérico sobre copia', note: 'Orden numérico real en O(n log n).' }],
    },
  },
  {
    id: 'bug-copia-superficial-profunda',
    title: 'Bug: Copia superficial vs profunda',
    category: 'debugging',
    difficulty: 'hard',
    xp: 200,
    acceptanceRate: 49,
    tags: ['debugging', 'recursion', 'arrays'],
    entryPoint: 'cloneAndBumpNested',
    description:
      'Dado un arreglo bidimensional `grid` y un índice `[row, col]`, devuelve `{ updated, originalCell }` incrementando en `1` la celda `[row][col]` en `updated`, **sin mutar** `grid` ni ninguna de sus filas internas.\n\n' +
      'El código actual hace `[...grid]` (copia superficial) y comparte las referencias de las filas internas. Corrígelo.',
    examples: [
      { input: 'grid = [[1, 2], [3, 4]], row = 0, col = 1', output: '{ updated: [[1, 3], [3, 4]], originalCell: 2 }' },
    ],
    constraints: ['1 <= grid.length, grid[0].length <= 100'],
    hints: [
      '`[...grid]` solo copia el primer nivel: `copy[0] === grid[0]`.',
      'Copia cada fila interna con `.map((r) => [...r])`.',
      'Guarda o lee `grid[row][col]` verificando que siga intacto.',
    ],
    languages: ['javascript', 'python', 'java', 'cpp'],
    starterCode: {
      javascript: `function cloneAndBumpNested(grid, row, col) {\n  const copy = [...grid];\n  copy[row][col] += 1;\n  return { updated: copy, originalCell: grid[row][col] };\n}`,
      python: `def cloneAndBumpNested(grid: list[list[int]], row: int, col: int) -> dict:\n    copy = list(grid)\n    copy[row][col] += 1\n    return {"updated": copy, "originalCell": grid[row][col]}`,
      java: `class Solution {\n    public int[][] cloneAndBumpNested(int[][] grid, int row, int col) {\n        int[][] copy = grid.clone();\n        copy[row][col] += 1;\n        return copy;\n    }\n}`,
      cpp: `#include <vector>\nusing namespace std;\n\nvector<vector<int>> cloneAndBumpNested(vector<vector<int>>& grid, int row, int col) {\n    grid[row][col] += 1;\n    return grid;\n}`,
    },
    referenceSolution: {
      javascript: `function cloneAndBumpNested(grid, row, col) {\n  const originalCell = grid[row][col];\n  const copy = grid.map((r) => [...r]);\n  copy[row][col] += 1;\n  return { updated: copy, originalCell };\n}`,
      python: `def cloneAndBumpNested(grid: list[list[int]], row: int, col: int) -> dict:\n    original_cell = grid[row][col]\n    copy = [list(r) for r in grid]\n    copy[row][col] += 1\n    return {"updated": copy, "originalCell": original_cell}`,
      java: `class Solution {\n    public int[][] cloneAndBumpNested(int[][] grid, int row, int col) {\n        int[][] copy = new int[grid.length][];\n        for (int i = 0; i < grid.length; i++) {\n            copy[i] = grid[i].clone();\n        }\n        copy[row][col] += 1;\n        return copy;\n    }\n}`,
      cpp: `#include <vector>\nusing namespace std;\n\nvector<vector<int>> cloneAndBumpNested(const vector<vector<int>>& grid, int row, int col) {\n    vector<vector<int>> copy = grid;\n    copy[row][col] += 1;\n    return copy;\n}`,
    },
    tests: {
      visible: [
        {
          id: 't1',
          input: [[[1, 2], [3, 4]], 0, 1],
          expected: { updated: [[1, 3], [3, 4]], originalCell: 2 },
          inputDisplay: 'grid = [[1,2],[3,4]], row = 0, col = 1',
          expectedDisplay: '{ updated: [[1,3],[3,4]], originalCell: 2 }',
        },
      ],
      hidden: [
        {
          id: 't2',
          input: [[[10]], 0, 0],
          expected: { updated: [[11]], originalCell: 10 },
          inputDisplay: 'grid = [[10]], row = 0, col = 0',
          expectedDisplay: '{ updated: [[11]], originalCell: 10 }',
        },
      ],
    },
    validationHints: {
      forbiddenSubstrings: {
        python: ['copy = list(grid)'],
        java: ['grid.clone()'],
        cpp: ['(vector<vector<int>>& grid', 'return grid;'],
      },
    },
    editorial: {
      explanation: 'En matrices anidadas, una copia superficial comparte las referencias de las filas internas. Clona cada fila explícitamente.',
      timeComplexity: 'O(m · n)',
      spaceComplexity: 'O(m · n)',
      approaches: [{ name: 'Clonado por fila', note: 'Aísla cada subarreglo antes de modificarlo.' }],
    },
  },
  {
    id: 'bug-recursion-sin-caso-base',
    title: 'Bug: Recursión sin caso base',
    category: 'debugging',
    difficulty: 'expert',
    xp: 350,
    acceptanceRate: 44,
    tags: ['debugging', 'recursion', 'math'],
    entryPoint: 'safePower',
    description:
      'La función recursiva `safePower(base, exp)` debe calcular `base^exp` para cualquier entero `exp >= 0` (con exponenciación binaria rápida o recursión simple). El código actual entra en recursión infinita cuando `exp === 0` o `exp < 0`. Corrígelo.',
    examples: [
      { input: 'base = 2, exp = 10', output: '1024' },
      { input: 'base = 5, exp = 0', output: '1' },
    ],
    constraints: ['0 <= exp <= 30', '-10 <= base <= 10'],
    hints: [
      'Toda recursión necesita un caso base que retorne sin llamarse a sí misma: si `exp <= 0`, devuelve `1`.',
      'Divide el exponente entre 2 para lograr O(log exp) pasos.',
      'Si `exp % 2 === 1`, multiplica `half * half * base`; si es par, `half * half`.',
    ],
    languages: ['javascript', 'python', 'java', 'cpp'],
    starterCode: {
      javascript: `function safePower(base, exp) {\n  // Falta el caso base exp <= 0\n  return base * safePower(base, exp - 1);\n}`,
      python: `def safePower(base: int, exp: int) -> int:\n    return base * safePower(base, exp - 1)`,
      java: `class Solution {\n    public long safePower(long base, int exp) {\n        return base * safePower(base, exp - 1);\n    }\n}`,
      cpp: `long long safePower(long long base, int exp) {\n    return base * safePower(base, exp - 1);\n}`,
    },
    referenceSolution: {
      javascript: `function safePower(base, exp) {\n  if (exp <= 0) return 1;\n  const half = safePower(base, Math.floor(exp / 2));\n  return exp % 2 === 0 ? half * half : half * half * base;\n}`,
      python: `def safePower(base: int, exp: int) -> int:\n    if exp <= 0:\n        return 1\n    half = safePower(base, exp // 2)\n    return half * half if exp % 2 == 0 else half * half * base`,
      java: `class Solution {\n    public long safePower(long base, int exp) {\n        if (exp <= 0) return 1;\n        long half = safePower(base, exp / 2);\n        return exp % 2 == 0 ? half * half : half * half * base;\n    }\n}`,
      cpp: `long long safePower(long long base, int exp) {\n    if (exp <= 0) return 1;\n    long long half = safePower(base, exp / 2);\n    return exp % 2 == 0 ? half * half : half * half * base;\n}`,
    },
    tests: {
      visible: [
        { id: 't1', input: [2, 10], expected: 1024, inputDisplay: 'base = 2, exp = 10', expectedDisplay: '1024' },
        { id: 't2', input: [5, 0], expected: 1, inputDisplay: 'base = 5, exp = 0', expectedDisplay: '1' },
      ],
      hidden: [
        { id: 't3', input: [3, 1], expected: 3, inputDisplay: 'base = 3, exp = 1', expectedDisplay: '3' },
        { id: 't4', input: [-2, 5], expected: -32, inputDisplay: 'base = -2, exp = 5', expectedDisplay: '-32' },
      ],
    },
    validationHints: {
      requiredTokens: {
        python: ['if exp <= 0', 'return 1'],
        java: ['if (exp <= 0)'],
        cpp: ['if (exp <= 0)'],
      },
    },
    editorial: {
      explanation: 'Define el caso base `if (exp <= 0) return 1` y usa exponenciación binaria para reducir la profundidad de la pila a `O(log exp)`.',
      timeComplexity: 'O(log exp)',
      spaceComplexity: 'O(log exp)',
      approaches: [{ name: 'Exponenciación binaria recursiva', note: 'Evita desbordamiento de pila y garantiza convergencia.' }],
    },
  },
  {
    id: 'bug-indice-negativo-slice',
    title: 'Bug: Índice negativo en slice',
    category: 'debugging',
    difficulty: 'expert',
    xp: 350,
    acceptanceRate: 41,
    tags: ['debugging', 'arrays'],
    entryPoint: 'takeLastN',
    description:
      'La función `takeLastN(arr, n)` debe devolver los últimos `n` elementos del arreglo `arr` (en su orden original). Si `n <= 0`, debe devolver `[]`. Si `n >= arr.length`, debe devolver una copia completa de `arr`.\n\n' +
      'En JavaScript `arr.slice(-0)` equivale a `arr.slice(0)` y devuelve todo el arreglo en lugar de `[]` cuando `n = 0`, y `n < 0` falla. Corrígelo.',
    examples: [
      { input: 'arr = [10, 20, 30, 40], n = 2', output: '[30, 40]' },
      { input: 'arr = [10, 20, 30], n = 0', output: '[]' },
    ],
    constraints: ['0 <= arr.length <= 10^4', '-100 <= n <= 10^4'],
    hints: [
      'Comprueba `if (n <= 0 || arr.length === 0) return [];` al principio.',
      'Solo llama a `slice(-n)` cuando `n > 0`, o usa `slice(Math.max(0, arr.length - n))`.',
      'Asegúrate de devolver un nuevo arreglo sin mutar `arr`.',
    ],
    languages: ['javascript', 'python', 'java', 'cpp'],
    starterCode: {
      javascript: `function takeLastN(arr, n) {\n  // Bug: slice(-0) devuelve todo el arreglo, y n negativo falla\n  return arr.slice(-n);\n}`,
      python: `def takeLastN(arr: list[int], n: int) -> list[int]:\n    return arr[-n:]`,
      java: `import java.util.*;\n\nclass Solution {\n    public List<Integer> takeLastN(List<Integer> arr, int n) {\n        return arr.subList(arr.size() - n, arr.size());\n    }\n}`,
      cpp: `#include <vector>\nusing namespace std;\n\nvector<int> takeLastN(vector<int> arr, int n) {\n    return vector<int>(arr.end() - n, arr.end());\n}`,
    },
    referenceSolution: {
      javascript: `function takeLastN(arr, n) {\n  if (n <= 0 || arr.length === 0) return [];\n  const start = Math.max(0, arr.length - n);\n  return arr.slice(start);\n}`,
      python: `def takeLastN(arr: list[int], n: int) -> list[int]:\n    if n <= 0 or not arr:\n        return []\n    start = max(0, len(arr) - n)\n    return arr[start:]`,
      java: `import java.util.*;\n\nclass Solution {\n    public List<Integer> takeLastN(List<Integer> arr, int n) {\n        if (n <= 0 || arr.isEmpty()) return new ArrayList<>();\n        int start = Math.max(0, arr.size() - n);\n        return new ArrayList<>(arr.subList(start, arr.size()));\n    }\n}`,
      cpp: `#include <vector>\n#include <algorithm>\nusing namespace std;\n\nvector<int> takeLastN(vector<int> arr, int n) {\n    if (n <= 0 || arr.empty()) return {};\n    int start = max(0, (int)arr.size() - n);\n    return vector<int>(arr.begin() + start, arr.end());\n}`,
    },
    tests: {
      visible: [
        { id: 't1', input: [[10, 20, 30, 40], 2], expected: [30, 40], inputDisplay: 'arr = [10,20,30,40], n = 2', expectedDisplay: '[30, 40]' },
        { id: 't2', input: [[10, 20, 30], 0], expected: [], inputDisplay: 'arr = [10,20,30], n = 0', expectedDisplay: '[]' },
      ],
      hidden: [
        { id: 't3', input: [[1, 2], 10], expected: [1, 2], inputDisplay: 'arr = [1, 2], n = 10', expectedDisplay: '[1, 2]' },
        { id: 't4', input: [[1, 2, 3], -2], expected: [], inputDisplay: 'arr = [1, 2, 3], n = -2', expectedDisplay: '[]' },
      ],
    },
    validationHints: {
      forbiddenSubstrings: {
        python: ['return arr[-n:]'],
        java: ['arr.subList(arr.size() - n'],
        cpp: ['arr.end() - n'],
      },
    },
    editorial: {
      explanation: 'Tanto en JS (`slice(-0)`) como en Python (`arr[-0:]`), usar `-n` cuando `n === 0` devuelve toda la lista. Validar `n <= 0` y calcular `start = max(0, len - n)` elimina la ambigüedad.',
      timeComplexity: 'O(min(n, len))',
      spaceComplexity: 'O(min(n, len))',
      approaches: [{ name: 'Cálculo de índice inicial no negativo', note: 'Seguro frente a n = 0, n < 0 y n > arr.length.' }],
    },
  },
];
