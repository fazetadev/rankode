import React from 'react';
import { CodeBlock } from './CodeBlock';

interface MarkdownProps {
  content: string;
  className?: string;
}

function renderInline(line: string): React.ReactNode[] {
  const tokens = line.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g);
  return tokens.map((token, idx) => {
    if (!token) return null;

    if (token.startsWith('**') && token.endsWith('**')) {
      return (
        <strong key={idx} className="font-semibold text-[#FAFAFA]">
          {token.slice(2, -2)}
        </strong>
      );
    }
    if (token.startsWith('*') && token.endsWith('*') && token.length > 2) {
      return (
        <em key={idx} className="italic text-[#E4E4E7]">
          {token.slice(1, -1)}
        </em>
      );
    }
    if (token.startsWith('`') && token.endsWith('`')) {
      return (
        <code
          key={idx}
          className="rounded border border-[#27272A] bg-[#18181B] px-1.5 py-0.5 font-mono text-xs text-[#FAFAFA]"
        >
          {token.slice(1, -1)}
        </code>
      );
    }
    const linkMatch = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      const href = linkMatch[2];
      const isSafe = href.startsWith('http://') || href.startsWith('https://') || href.startsWith('/');
      if (!isSafe) return <React.Fragment key={idx}>{linkMatch[1]}</React.Fragment>;
      return (
        <a
          key={idx}
          href={href}
          target={href.startsWith('http') ? '_blank' : undefined}
          rel={href.startsWith('http') ? 'noreferrer noopener' : undefined}
          className="text-[#8B5CF6] underline underline-offset-2 hover:text-[#A78BFA]"
        >
          {linkMatch[1]}
        </a>
      );
    }

    return <React.Fragment key={idx}>{token}</React.Fragment>;
  });
}

export function Markdown({ content, className = '' }: MarkdownProps) {
  const lines = content.replace(/\r\n/g, '\n').split('\n');
  const blocks: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Bloques de código cercados ```lang
    if (line.trim().startsWith('```')) {
      const lang = line.trim().slice(3).trim() || undefined;
      i += 1;
      const codeLines: string[] = [];
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i += 1;
      }
      i += 1;
      blocks.push(<CodeBlock key={`code-${i}`} code={codeLines.join('\n')} language={lang} />);
      continue;
    }

    // Encabezados
    const headingMatch = line.match(/^(#{1,3})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = headingMatch[2];
      if (level === 1) {
        blocks.push(
          <h2 key={`h-${i}`} className="text-base font-semibold text-[#FAFAFA]">
            {renderInline(text)}
          </h2>
        );
      } else if (level === 2) {
        blocks.push(
          <h3 key={`h-${i}`} className="text-sm font-semibold text-[#FAFAFA]">
            {renderInline(text)}
          </h3>
        );
      } else {
        blocks.push(
          <h4 key={`h-${i}`} className="text-xs font-semibold uppercase tracking-wide text-[#A1A1AA]">
            {renderInline(text)}
          </h4>
        );
      }
      i += 1;
      continue;
    }

    // Listas no ordenadas
    if (/^\s*[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*]\s+/, ''));
        i += 1;
      }
      blocks.push(
        <ul key={`ul-${i}`} className="list-disc space-y-1.5 pl-5 text-sm text-[#D4D4D8]">
          {items.map((item, idx) => (
            <li key={idx}>{renderInline(item)}</li>
          ))}
        </ul>
      );
      continue;
    }

    // Listas ordenadas
    if (/^\s*\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+\.\s+/, ''));
        i += 1;
      }
      blocks.push(
        <ol key={`ol-${i}`} className="list-decimal space-y-1.5 pl-5 text-sm text-[#D4D4D8]">
          {items.map((item, idx) => (
            <li key={idx}>{renderInline(item)}</li>
          ))}
        </ol>
      );
      continue;
    }

    // Líneas vacías
    if (!line.trim()) {
      i += 1;
      continue;
    }

    // Párrafo
    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !lines[i].trim().startsWith('```') &&
      !/^#{1,3}\s+/.test(lines[i]) &&
      !/^\s*[-*]\s+/.test(lines[i]) &&
      !/^\s*\d+\.\s+/.test(lines[i])
    ) {
      paraLines.push(lines[i]);
      i += 1;
    }
    blocks.push(
      <p key={`p-${i}`} className="text-sm leading-relaxed text-[#D4D4D8]">
        {renderInline(paraLines.join(' '))}
      </p>
    );
  }

  return <div className={`space-y-3 ${className}`}>{blocks}</div>;
}
