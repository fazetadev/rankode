import type { ChallengeEditorial, ComplexityBigO, PerfSpec } from '../../types';

export interface ChallengeMetaPatch {
  editorial: ChallengeEditorial;
  acceptanceRate: number;
  targetComplexity?: ComplexityBigO;
  perf?: PerfSpec;
}

export const EXISTING_CHALLENGES_META: Record<string, ChallengeMetaPatch> = {
  fizzbuzz: {
    acceptanceRate: 84,
    editorial: {
      explanation:
        'La clave de FizzBuzz es comprobar **primero** la divisibilidad conjunta por 3 y 5 (`i % 15 === 0`). Si evalúas `i % 3 === 0` antes, los múltiplos de 15 devolverían `"Fizz"` por error.',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      approaches: [
        { name: 'Condicional ordenado', note: 'Evalúa % 15 primero, luego % 3 y % 5.' },
        { name: 'Concatenación de cadena', note: 'Acumula "Fizz" y "Buzz" y usa String(i) si queda vacía.' },
      ],
    },
  },
  'invertir-cadena': {
    acceptanceRate: 87,
    editorial: {
      explanation:
        'Recorrer la cadena desde el final hacia el inicio (o intercambiar extremos con dos punteros sobre un arreglo de caracteres) invierte el orden en tiempo lineal.',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      approaches: [
        { name: 'Dos punteros', note: 'Convierte a arreglo, intercambia left/right y vuelve a unir.' },
        { name: 'Bucle inverso', note: 'Concatena caracteres desde s.length - 1 hasta 0.' },
      ],
    },
  },
  'palindromo-limpio': {
    acceptanceRate: 76,
    editorial: {
      explanation:
        'Primero normaliza la cadena pasando a minúsculas y filtrando todo carácter fuera de `a-z` y `0-9`. Luego compara con dos punteros desde ambos extremos hacia el centro.',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      approaches: [
        { name: 'Normalización + dos punteros', note: 'Limpia con regex y compara extremos en O(n).' },
        { name: 'Dos punteros in-place', note: 'Salta caracteres no alfanuméricos sin crear cadena auxiliar: O(1) espacio.' },
      ],
    },
  },
  anagramas: {
    acceptanceRate: 71,
    editorial: {
      explanation:
        'Dos cadenas de distinta longitud nunca son anagramas. Con longitudes iguales, cuenta la frecuencia de cada carácter de `s` y descuéntala recorriendo `t`.',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(k)',
      approaches: [
        { name: 'Tabla de frecuencias', note: 'Un mapa de conteos logra tiempo O(n) y espacio acotado al alfabeto.' },
        { name: 'Ordenación', note: 'Ordenar ambas cadenas cuesta O(n log n) pero es muy conciso.' },
      ],
    },
  },
  'parentesis-balanceados': {
    acceptanceRate: 68,
    editorial: {
      explanation:
        'Una pila LIFO garantiza que el último delimitador abierto sea siempre el primero en cerrarse. Si al cerrar la pila está vacía o el tipo no coincide, la secuencia es inválida.',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      approaches: [
        { name: 'Pila con mapa de cierres', note: 'Push en aperturas, pop y comparación directa en cierres.' },
      ],
    },
  },
  'numeros-romanos': {
    acceptanceRate: 61,
    editorial: {
      explanation:
        'Recorre de izquierda a derecha: si el símbolo actual vale menos que el siguiente (`IV`, `IX`, etc.), réstalo; en cualquier otro caso, súmalo.',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      approaches: [
        { name: 'Comparación con el siguiente símbolo', note: 'Una sola pasada lineal sobre la cadena.' },
      ],
    },
  },
  'bug-off-by-one': {
    acceptanceRate: 81,
    editorial: {
      explanation:
        'El bucle usaba `i < end` omitiendo el índice `end`. Ajustar la condición a `i <= end` y acotar `start >= 0` y `end < nums.length` resuelve el fallo.',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      approaches: [
        { name: 'Límites inclusivos acotados', note: 'Usa Math.max(0, start) y Math.min(end, nums.length - 1).' },
      ],
    },
  },
  'bug-comparacion-estricta': {
    acceptanceRate: 79,
    editorial: {
      explanation:
        'El operador `==` en JavaScript realiza coerción de tipos (`0 == false`, `0 == ""`). Usar `===` (y en Python `type(item) is type(target)`) evita falsos positivos.',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      approaches: [
        { name: 'Igualdad estricta', note: 'Compara tanto valor como tipo exacto.' },
      ],
    },
  },
  'bug-mutacion-referencia': {
    acceptanceRate: 64,
    editorial: {
      explanation:
        '`Array.prototype.sort()` muta el arreglo original y ordena alfabéticamente si no recibe comparador numérico. Clona primero con `[...nums]` y usa `(a, b) => b - a`.',
      timeComplexity: 'O(n log n)',
      spaceComplexity: 'O(n)',
      approaches: [
        { name: 'Copia defensiva + comparador numérico', note: 'Preserva nums[0] intacto.' },
      ],
    },
  },
  'bug-busqueda-binaria': {
    acceptanceRate: 58,
    editorial: {
      explanation:
        'Cuando `nums[mid] < target`, asignar `left = mid` en lugar de `left = mid + 1` puede causar un bucle infinito en subarreglos de 2 elementos.',
      timeComplexity: 'O(log n)',
      spaceComplexity: 'O(1)',
      approaches: [
        { name: 'Descartar mid con mid + 1 / mid - 1', note: 'Garantiza que el intervalo se reduzca estrictamente en cada paso.' },
      ],
    },
  },
  'bug-aplanado-profundo': {
    acceptanceRate: 54,
    editorial: {
      explanation:
        'Comprobar `if (item)` descarta valores falsy válidos como `0`, `false` o `""`. Debe comprobarse `Array.isArray(item)` y preservar el resto tal cual.',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      approaches: [
        { name: 'Recursión con Array.isArray', note: 'No filtra valores falsy durante el recorrido.' },
      ],
    },
  },
  'bug-lru-eviction': {
    acceptanceRate: 41,
    editorial: {
      explanation:
        'En una caché LRU, tanto `get` como `put` sobre una clave existente deben marcarla como recién usada (eliminarla y reinsertarla en el `Map` para moverla al final).',
      timeComplexity: 'O(1)',
      spaceComplexity: 'O(capacity)',
      approaches: [
        { name: 'Map ordenado por inserción', note: 'Eliminar y volver a insertar actualiza la posición de uso reciente en O(1).' },
      ],
    },
  },
  'suma-dos-numeros': {
    acceptanceRate: 78,
    editorial: {
      explanation:
        'Guarda en un `Map` cada número visto junto a su índice. Antes de insertarlo, comprueba si `target - nums[i]` ya existe en el mapa.',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      approaches: [
        { name: 'Hash Map en una pasada', note: 'Reduce de O(n²) a O(n).' },
      ],
    },
  },
  'fusionar-intervalos': {
    acceptanceRate: 63,
    editorial: {
      explanation:
        'Ordena los intervalos por su inicio. Recorre comparando el inicio actual con el fin del último intervalo agregado: si solapan, actualiza el fin al máximo.',
      timeComplexity: 'O(n log n)',
      spaceComplexity: 'O(n)',
      approaches: [
        { name: 'Ordenación por inicio + fusión lineal', note: 'Crea copias de intervalos para evitar mutar la entrada.' },
      ],
    },
  },
  'agrupar-anagramas': {
    acceptanceRate: 62,
    editorial: {
      explanation:
        'Todas las palabras que son anagramas comparten exactamente la misma representación ordenada alfabéticamente. Usa esa clave en un mapa para agruparlas.',
      timeComplexity: 'O(n · k log k)',
      spaceComplexity: 'O(n · k)',
      approaches: [
        { name: 'Clave ordenada por palabra', note: 'Ordena caracteres de cada cadena para formar la clave del grupo.' },
      ],
    },
  },
  'islas-en-matriz': {
    acceptanceRate: 51,
    editorial: {
      explanation:
        'Cada vez que encuentres un `"1"` no visitado, incrementa el contador de islas y lanza un DFS/BFS para marcar toda la tierra conectada horizontal o verticalmente.',
      timeComplexity: 'O(filas · columnas)',
      spaceComplexity: 'O(filas · columnas)',
      approaches: [
        { name: 'DFS / BFS en cuadrícula', note: 'Marca celdas visitadas con una matriz booleana o copia.' },
      ],
    },
  },
  'cambio-monedas-minimo': {
    acceptanceRate: 48,
    editorial: {
      explanation:
        'Usa programación dinámica bottom-up donde `dp[a]` representa el mínimo número de monedas para formar la cantidad `a`. Inicializa `dp[0] = 0` y el resto en infinito.',
      timeComplexity: 'O(amount · coins)',
      spaceComplexity: 'O(amount)',
      approaches: [
        { name: 'DP iterativa 1D', note: 'Actualiza dp[a] = min(dp[a], dp[a - coin] + 1).' },
      ],
    },
  },
  'mediana-dos-arrays': {
    acceptanceRate: 36,
    editorial: {
      explanation:
        'Mediante búsqueda binaria sobre el arreglo más corto, particiona ambos arreglos de modo que la mitad izquierda tenga exactamente la mitad de los elementos y todos sean menores o iguales que los de la mitad derecha.',
      timeComplexity: 'O(log(min(m, n)))',
      spaceComplexity: 'O(1)',
      approaches: [
        { name: 'Búsqueda binaria de partición', note: 'Evita fusionar ambos arreglos en O(m + n).' },
      ],
    },
  },
  'duplicados-en-lineal': {
    acceptanceRate: 74,
    targetComplexity: 'O(n)',
    perf: {
      sizeLabel: 'n = 20 000',
      maxMs: 120,
      build: () => {
        const arr = Array.from({ length: 20000 }, (_, i) => i);
        arr[19999] = 15000;
        return [arr];
      },
    },
    editorial: {
      explanation:
        'Un `Set` permite consultar en `O(1)` promedio si un número ya apareció antes. El primero que ya esté en el conjunto es el primer duplicado.',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      approaches: [
        { name: 'Hash Set en una pasada', note: 'Elimina el doble bucle O(n²).' },
      ],
    },
  },
  'max-subarray-kadane': {
    acceptanceRate: 66,
    targetComplexity: 'O(n)',
    perf: {
      sizeLabel: 'n = 25 000',
      maxMs: 100,
      build: () => [Array.from({ length: 25000 }, (_, i) => ((i * 17) % 41) - 20)],
    },
    editorial: {
      explanation:
        'El algoritmo de Kadane decide en cada posición si conviene extender el subarreglo actual (`curr + nums[i]`) o empezar uno nuevo desde `nums[i]`.',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      approaches: [
        { name: 'Algoritmo de Kadane', note: 'Mantiene best y curr en espacio constante.' },
      ],
    },
  },
  'ventana-deslizante-max': {
    acceptanceRate: 59,
    targetComplexity: 'O(n)',
    perf: {
      sizeLabel: 'n = 20 000',
      maxMs: 120,
      build: () => {
        const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let out = '';
        for (let i = 0; i < 20000; i += 1) out += chars[(i * 7) % chars.length];
        return [out];
      },
    },
    editorial: {
      explanation:
        'Mantén una ventana `[left, right]` y un mapa con la última posición vista de cada carácter. Cuando un carácter se repita dentro de la ventana, mueve `left` a `lastSeen + 1`.',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(min(n, alfabeto))',
      approaches: [
        { name: 'Ventana deslizante con mapa de índices', note: 'Cada puntero avanza a lo sumo n veces.' },
      ],
    },
  },
  'producto-excepto-propio': {
    acceptanceRate: 53,
    targetComplexity: 'O(n)',
    perf: {
      sizeLabel: 'n = 20 000',
      maxMs: 120,
      build: () => [Array.from({ length: 20000 }, (_, i) => (i % 5) + 1)],
    },
    editorial: {
      explanation:
        'Calcula en una primera pasada el producto acumulado a la izquierda de cada índice, y en una segunda pasada de derecha a izquierda multiplica por el acumulado derecho.',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1) extra',
      approaches: [
        { name: 'Productos prefijo y sufijo', note: 'No usa división y funciona incluso con ceros.' },
      ],
    },
  },
  'contenedor-mas-agua': {
    acceptanceRate: 57,
    targetComplexity: 'O(n)',
    perf: {
      sizeLabel: 'n = 25 000',
      maxMs: 100,
      build: () => [Array.from({ length: 25000 }, (_, i) => ((i * 13) % 500) + 1)],
    },
    editorial: {
      explanation:
        'Coloca dos punteros en los extremos. El área queda limitada por la barra más baja, así que en cada paso mueve hacia adentro el puntero de menor altura.',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      approaches: [
        { name: 'Dos punteros desde extremos', note: 'Descarta la barra limitante en O(1) por paso.' },
      ],
    },
  },
  'subsecuencia-creciente': {
    acceptanceRate: 42,
    targetComplexity: 'O(n log n)',
    perf: {
      sizeLabel: 'n = 15 000',
      maxMs: 160,
      build: () => [Array.from({ length: 15000 }, (_, i) => (i * 37) % 5000)],
    },
    editorial: {
      explanation:
        'Mantén un arreglo `tails` donde `tails[k]` es el menor valor final posible de una subsecuencia creciente de longitud `k + 1`. Usa búsqueda binaria para ubicar cada número.',
      timeComplexity: 'O(n log n)',
      spaceComplexity: 'O(n)',
      approaches: [
        { name: 'Patience sorting + búsqueda binaria', note: 'Mejora el enfoque DP clásico de O(n²) a O(n log n).' },
      ],
    },
  },
};
