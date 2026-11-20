import { useMemo, useRef, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';
import { oneDark } from '@codemirror/theme-one-dark';
import { EditorView, keymap } from '@codemirror/view';
import { Prec } from '@codemirror/state';
import type { Language } from '../../types';

interface CodeEditorProps {
  value: string;
  language: Language;
  onChange: (value: string) => void;
  onRunShortcut?: () => void;
  onSubmitShortcut?: () => void;
  height?: string;
}

const CUSTOM_EDITOR_THEME = EditorView.theme({
  '&': {
    backgroundColor: '#111113',
    color: '#FAFAFA',
    fontSize: '13px',
    fontFamily: '"JetBrains Mono", ui-monospace, SFMono-Regular, monospace',
  },
  '.cm-content': {
    fontFamily: '"JetBrains Mono", ui-monospace, SFMono-Regular, monospace',
    padding: '12px 0',
  },
  '.cm-gutters': {
    backgroundColor: '#111113',
    color: '#52525B',
    borderRight: '1px solid #27272A',
    fontFamily: '"JetBrains Mono", ui-monospace, SFMono-Regular, monospace',
  },
  '.cm-activeLine': {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  '.cm-activeLineGutter': {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    color: '#A1A1AA',
  },
  '&.cm-focused': {
    outline: 'none',
  },
});

export function CodeEditor({
  value,
  language,
  onChange,
  onRunShortcut,
  onSubmitShortcut,
  height = '380px',
}: CodeEditorProps) {
  const runRef = useRef(onRunShortcut);
  const submitRef = useRef(onSubmitShortcut);

  useEffect(() => {
    runRef.current = onRunShortcut;
  }, [onRunShortcut]);

  useEffect(() => {
    submitRef.current = onSubmitShortcut;
  }, [onSubmitShortcut]);

  const extensions = useMemo(() => {
    const langExt =
      language === 'javascript'
        ? javascript()
        : language === 'python'
          ? python()
          : language === 'java'
            ? java()
            : cpp();

    const shortcuts = Prec.highest(
      keymap.of([
        {
          key: 'Mod-Enter',
          run: () => {
            runRef.current?.();
            return true;
          },
        },
        {
          key: 'Mod-Shift-Enter',
          run: () => {
            submitRef.current?.();
            return true;
          },
        },
      ])
    );

    return [langExt, CUSTOM_EDITOR_THEME, shortcuts];
  }, [language]);

  return (
    <div
      data-testid="code-editor-container"
      className="overflow-hidden rounded-md border border-[#27272A] bg-[#111113]"
    >
      <CodeMirror
        value={value}
        height={height}
        theme={oneDark}
        extensions={extensions}
        onChange={onChange}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLineGutter: true,
          highlightActiveLine: true,
          foldGutter: false,
          dropCursor: true,
          allowMultipleSelections: false,
          indentOnInput: true,
          bracketMatching: true,
          closeBrackets: true,
          autocompletion: true,
          tabSize: 2,
        }}
      />
    </div>
  );
}
