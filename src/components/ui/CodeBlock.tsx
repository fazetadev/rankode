import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { useT } from '../../i18n/useT';

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
  showCopy?: boolean;
}

const KEYWORDS = new Set([
  'function', 'return', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 'break', 'continue',
  'class', 'new', 'import', 'export', 'from', 'default', 'switch', 'case', 'true', 'false', 'null',
  'undefined', 'def', 'elif', 'in', 'not', 'and', 'or', 'None', 'True', 'False', 'pass', 'public',
  'private', 'int', 'boolean', 'void', 'String', 'vector', 'using', 'namespace', 'std', 'auto',
]);

function highlightLine(line: string, lang?: string): React.ReactNode[] {
  const isPython = lang === 'python' || lang === 'py';
  const commentIdx = isPython ? line.indexOf('#') : line.indexOf('//');
  const codePart = commentIdx >= 0 ? line.slice(0, commentIdx) : line;
  const commentPart = commentIdx >= 0 ? line.slice(commentIdx) : '';

  const tokens = codePart.split(/("[^"]*"|'[^']*'|`[^`]*`|\b[A-Za-z_]\w*\b|\b\d+(?:\.\d+)?\b)/g);

  const nodes: React.ReactNode[] = tokens.map((tok, i) => {
    if (!tok) return null;
    if (tok.startsWith('"') || tok.startsWith("'") || tok.startsWith('`')) {
      return (
        <span key={i} className="text-emerald-400">
          {tok}
        </span>
      );
    }
    if (/^\d+(?:\.\d+)?$/.test(tok)) {
      return (
        <span key={i} className="text-amber-300">
          {tok}
        </span>
      );
    }
    if (KEYWORDS.has(tok)) {
      return (
        <span key={i} className="text-[#C084FC]">
          {tok}
        </span>
      );
    }
    return <span key={i}>{tok}</span>;
  });

  if (commentPart) {
    nodes.push(
      <span key="comment" className="text-[#71717A]">
        {commentPart}
      </span>
    );
  }

  return nodes;
}

export function CodeBlock({ code, language, className = '', showCopy = true }: CodeBlockProps) {
  const t = useT();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Ignorar si clipboard no está disponible
    }
  };

  const lines = code.replace(/\n$/, '').split('\n');

  return (
    <div
      className={`overflow-hidden rounded-md border border-[#27272A] bg-[#09090B] ${className}`}
    >
      {(language || showCopy) && (
        <div className="flex items-center justify-between border-b border-[#27272A] bg-[#111113] px-3 py-1.5 text-[11px] text-[#71717A]">
          <span className="font-mono uppercase">{language || 'code'}</span>
          {showCopy && (
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] text-[#A1A1AA] transition-colors hover:bg-[#18181B] hover:text-[#FAFAFA]"
            >
              {copied ? (
                <>
                  <Check aria-hidden="true" className="h-3 w-3 text-emerald-400" />
                  <span className="text-emerald-400">{t('common.copied')}</span>
                </>
              ) : (
                <>
                  <Copy aria-hidden="true" className="h-3 w-3" />
                  <span>{t('common.copy')}</span>
                </>
              )}
            </button>
          )}
        </div>
      )}
      <pre className="overflow-x-auto p-3 font-mono text-xs leading-relaxed text-[#E4E4E7]">
        <code>
          {lines.map((line, idx) => (
            <div key={idx} className="whitespace-pre">
              {line.length > 0 ? highlightLine(line, language) : '\u00A0'}
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
}
