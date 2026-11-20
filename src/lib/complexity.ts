import type { ComplexityBigO, ComplexityEstimate, Language } from '../types';

const COMPLEXITY_RANK: Record<ComplexityBigO, number> = {
  'O(1)': 1,
  'O(log n)': 2,
  'O(n)': 3,
  'O(n log n)': 4,
  'O(n²)': 5,
  'O(n³)': 6,
  'O(2ⁿ)': 7,
};

export function compareComplexity(estimated: ComplexityBigO, target: ComplexityBigO): number {
  return COMPLEXITY_RANK[estimated] - COMPLEXITY_RANK[target];
}

export function meetsTargetComplexity(estimated: ComplexityBigO, target: ComplexityBigO): boolean {
  return compareComplexity(estimated, target) <= 0;
}

/**
 * Elimina comentarios y literales de cadena para evitar falsos positivos en la detección léxica.
 */
export function stripCommentsAndStrings(code: string, language: Language): string {
  let result = '';
  let i = 0;
  let inSingle = false;
  let inDouble = false;
  let inBacktick = false;
  let inLineComment = false;
  let inBlockComment = false;

  while (i < code.length) {
    const ch = code[i];
    const next = code[i + 1];
    const prev = code[i - 1];

    if (inLineComment) {
      if (ch === '\n') {
        inLineComment = false;
        result += '\n';
      }
      i += 1;
      continue;
    }

    if (inBlockComment) {
      if (ch === '*' && next === '/') {
        inBlockComment = false;
        i += 2;
      } else {
        if (ch === '\n') result += '\n';
        i += 1;
      }
      continue;
    }

    if (!inSingle && !inDouble && !inBacktick) {
      if (language === 'python' && ch === '#') {
        inLineComment = true;
        i += 1;
        continue;
      }
      if (language !== 'python' && ch === '/' && next === '/') {
        inLineComment = true;
        i += 2;
        continue;
      }
      if (language !== 'python' && ch === '/' && next === '*') {
        inBlockComment = true;
        i += 2;
        continue;
      }
    }

    if (ch === "'" && !inDouble && !inBacktick && prev !== '\\') {
      inSingle = !inSingle;
      result += ' ';
      i += 1;
      continue;
    }
    if (ch === '"' && !inSingle && !inBacktick && prev !== '\\') {
      inDouble = !inDouble;
      result += ' ';
      i += 1;
      continue;
    }
    if (language === 'javascript' && ch === '`' && !inSingle && !inDouble && prev !== '\\') {
      inBacktick = !inBacktick;
      result += ' ';
      i += 1;
      continue;
    }

    if (inSingle || inDouble || inBacktick) {
      result += ch === '\n' ? '\n' : ' ';
    } else {
      result += ch;
    }
    i += 1;
  }

  return result;
}

const LOOP_PATTERNS_BRACE = [
  /\bfor\s*\(/,
  /\bwhile\s*\(/,
  /\.(forEach|map|filter|reduce|some|every|find)\s*\(/,
];

const INNER_LINEAR_CALLS = /\.(indexOf|includes|slice|splice)\s*\(/;
const SORT_CALLS = /(\.sort\s*\(|\bsorted\s*\(|\bArrays\.sort\s*\(|\bCollections\.sort\s*\(|\bstd::sort\s*\(|\bsort\s*\()/;

function detectRecursiveBranching(cleanCode: string, entryPoint?: string): boolean {
  let fnName = entryPoint;
  if (!fnName) {
    const fnMatch =
      cleanCode.match(/\bfunction\s+([A-Za-z_]\w*)\s*\(/) ??
      cleanCode.match(/\bdef\s+([A-Za-z_]\w*)\s*\(/);
    fnName = fnMatch?.[1];
  }
  if (!fnName) return false;

  const callRegex = new RegExp(`\\b${fnName}\\s*\\(`, 'g');
  const matches = cleanCode.match(callRegex) ?? [];
  // 1 declaración + >= 2 llamadas recursivas dentro del cuerpo
  if (matches.length < 3) return false;

  const hasMemo = /\b(memo|cache|dp|Map|HashMap|unordered_map|lru_cache)\b/.test(cleanCode);
  return !hasMemo;
}

function measurePythonLoopDepth(cleanCode: string): { maxDepth: number; hasInnerLinear: boolean } {
  const lines = cleanCode.split('\n');
  const loopIndents: number[] = [];
  let maxDepth = 0;
  let hasInnerLinear = false;

  for (const rawLine of lines) {
    const trimmed = rawLine.trim();
    if (!trimmed) continue;
    const indent = rawLine.search(/\S/);
    while (loopIndents.length > 0 && indent <= loopIndents[loopIndents.length - 1]) {
      loopIndents.pop();
    }

    const isLoop = /^(for\s+.+\s+in\s+.+:|while\s+.+:)/.test(trimmed);
    if (isLoop) {
      loopIndents.push(indent);
      if (loopIndents.length > maxDepth) {
        maxDepth = loopIndents.length;
      }
    } else if (loopIndents.length > 0) {
      if (/\b\w+\s+in\s+\w+/.test(trimmed) || /\.index\s*\(/.test(trimmed)) {
        hasInnerLinear = true;
      }
    }
  }

  return { maxDepth, hasInnerLinear };
}

function measureBraceLoopDepth(cleanCode: string): { maxDepth: number; hasInnerLinear: boolean } {
  let braceDepth = 0;
  const activeLoopBraceDepths: number[] = [];
  let maxDepth = 0;
  let hasInnerLinear = false;

  const tokenRegex =
    /\b(?:for|while)\s*\(|\.(?:forEach|map|filter|reduce|some|every|find)\s*\(|\.(?:indexOf|includes|slice|splice)\s*\(|\{|\}/g;

  for (const match of cleanCode.matchAll(tokenRegex)) {
    const tok = match[0];

    if (tok === '{') {
      braceDepth += 1;
    } else if (tok === '}') {
      braceDepth = Math.max(0, braceDepth - 1);
      while (
        activeLoopBraceDepths.length > 0 &&
        braceDepth < activeLoopBraceDepths[activeLoopBraceDepths.length - 1]
      ) {
        activeLoopBraceDepths.pop();
      }
    } else if (INNER_LINEAR_CALLS.test(tok)) {
      if (activeLoopBraceDepths.length > 0) {
        hasInnerLinear = true;
      }
    } else if (LOOP_PATTERNS_BRACE.some((rx) => rx.test(tok))) {
      activeLoopBraceDepths.push(braceDepth + 1);
      if (activeLoopBraceDepths.length > maxDepth) {
        maxDepth = activeLoopBraceDepths.length;
      }
    }
  }

  return { maxDepth, hasInnerLinear };
}

/**
 * Analizador heurístico de complejidad temporal para JS, Python, Java y C++.
 */
export function estimateComplexity(
  code: string,
  language: Language,
  entryPoint?: string
): ComplexityEstimate {
  const clean = stripCommentsAndStrings(code, language);

  if (detectRecursiveBranching(clean, entryPoint)) {
    return {
      bigO: 'O(2ⁿ)',
      rank: COMPLEXITY_RANK['O(2ⁿ)'],
      reason: 'Recursión múltiple detectada sin estructura de memoización.',
    };
  }

  const { maxDepth, hasInnerLinear } =
    language === 'python' ? measurePythonLoopDepth(clean) : measureBraceLoopDepth(clean);

  const effectiveDepth = maxDepth + (maxDepth > 0 && hasInnerLinear ? 1 : 0);
  const hasSort = SORT_CALLS.test(clean);
  const hasBinaryHalving =
    effectiveDepth === 1 && /(\/=\s*2|>>\s*1|Math\.floor\([^)]*\/\s*2|\/\/\s*2)/.test(clean) && /\bwhile\b/.test(clean);

  if (effectiveDepth >= 3) {
    return {
      bigO: 'O(n³)',
      rank: COMPLEXITY_RANK['O(n³)'],
      reason: 'Tres o más niveles de iteración anidada.',
    };
  }

  if (effectiveDepth === 2) {
    return {
      bigO: 'O(n²)',
      rank: COMPLEXITY_RANK['O(n²)'],
      reason: hasInnerLinear && maxDepth === 1
        ? 'Bucle con búsqueda/copia lineal interna (indexOf/includes/slice).'
        : 'Dos niveles de bucles anidados detectados.',
    };
  }

  if (hasSort && effectiveDepth <= 1) {
    return {
      bigO: 'O(n log n)',
      rank: COMPLEXITY_RANK['O(n log n)'],
      reason: 'Ordenación integrada detectada sin bucles cuadráticos.',
    };
  }

  if (hasBinaryHalving) {
    return {
      bigO: 'O(log n)',
      rank: COMPLEXITY_RANK['O(log n)'],
      reason: 'Bucle con reducción logarítmica del espacio de búsqueda.',
    };
  }

  if (effectiveDepth === 1) {
    return {
      bigO: 'O(n)',
      rank: COMPLEXITY_RANK['O(n)'],
      reason: 'Un único nivel de recorrido lineal.',
    };
  }

  return {
    bigO: 'O(1)',
    rank: COMPLEXITY_RANK['O(1)'],
    reason: 'Sin bucles ni recursión detectada.',
  };
}
