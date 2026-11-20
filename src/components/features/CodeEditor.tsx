import { useMemo, useRef, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';
import { oneDark } from '@codemirror/theme-one-dark';
import { EditorView, keymap } from '@codemirror/view';
import { Prec, type ChangeSpec, type StateCommand } from '@codemirror/state';
import { useAppStore } from '../../store/useAppStore';
import type { EditorSettings, Language } from '../../types';

interface CodeEditorProps {
  value: string;
  language: Language;
  onChange: (value: string) => void;
  onRunShortcut?: () => void;
  onSubmitShortcut?: () => void;
  onSaveShortcut?: () => void;
  height?: string;
  settingsOverride?: Partial<EditorSettings>;
}

function createToggleCommentCommand(commentToken: string): StateCommand {
  return ({ state, dispatch }) => {
    const { doc, selection } = state;
    const processedLines = new Set<number>();
    const lineNumbers: number[] = [];

    for (const range of selection.ranges) {
      const startLine = doc.lineAt(range.from).number;
      const endPos = range.to > range.from && doc.lineAt(range.to).from === range.to ? range.to - 1 : range.to;
      const endLine = doc.lineAt(endPos).number;
      for (let ln = startLine; ln <= endLine; ln += 1) {
        if (!processedLines.has(ln)) {
          processedLines.add(ln);
          lineNumbers.push(ln);
        }
      }
    }

    const lines = lineNumbers.map((n) => doc.line(n));
    const nonEmpty = lines.filter((l) => l.text.trim().length > 0);
    const allCommented =
      nonEmpty.length > 0 && nonEmpty.every((l) => l.text.trimStart().startsWith(commentToken));

    const changes: ChangeSpec[] = [];
    for (const line of lines) {
      if (allCommented) {
        const leadingSpaces = line.text.length - line.text.trimStart().length;
        const prefixLen = line.text.slice(leadingSpaces).startsWith(`${commentToken} `)
          ? commentToken.length + 1
          : commentToken.length;
        if (line.text.slice(leadingSpaces).startsWith(commentToken)) {
          changes.push({
            from: line.from + leadingSpaces,
            to: line.from + leadingSpaces + prefixLen,
            insert: '',
          });
        }
      } else if (line.text.trim().length > 0) {
        changes.push({
          from: line.from,
          to: line.from,
          insert: `${commentToken} `,
        });
      }
    }

    if (changes.length === 0) return false;
    dispatch(state.update({ changes }));
    return true;
  };
}

export function CodeEditor({
  value,
  language,
  onChange,
  onRunShortcut,
  onSubmitShortcut,
  onSaveShortcut,
  height = '380px',
  settingsOverride,
}: CodeEditorProps) {
  const storeSettings = useAppStore((s) => s.settings.editor);
  const editorSettings: EditorSettings = {
    ...storeSettings,
    ...settingsOverride,
  };

  const runRef = useRef(onRunShortcut);
  const submitRef = useRef(onSubmitShortcut);
  const saveRef = useRef(onSaveShortcut);

  useEffect(() => {
    runRef.current = onRunShortcut;
  }, [onRunShortcut]);

  useEffect(() => {
    submitRef.current = onSubmitShortcut;
  }, [onSubmitShortcut]);

  useEffect(() => {
    saveRef.current = onSaveShortcut;
  }, [onSaveShortcut]);

  const themeExtension = useMemo(
    () =>
      EditorView.theme({
        '&': {
          backgroundColor: '#111113',
          color: '#FAFAFA',
          fontSize: `${editorSettings.fontSize}px`,
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
      }),
    [editorSettings.fontSize]
  );

  const extensions = useMemo(() => {
    const langExt =
      language === 'javascript'
        ? javascript()
        : language === 'python'
          ? python()
          : language === 'java'
            ? java()
            : cpp();

    const toggleComment = createToggleCommentCommand(language === 'python' ? '#' : '//');

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
        {
          key: 'Mod-s',
          run: () => {
            saveRef.current?.();
            return true;
          },
        },
        {
          key: 'Mod-/',
          run: toggleComment,
        },
      ])
    );

    const list = [langExt, themeExtension, shortcuts];
    if (editorSettings.lineWrapping) {
      list.push(EditorView.lineWrapping);
    }
    return list;
  }, [language, themeExtension, editorSettings.lineWrapping]);

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
          lineNumbers: editorSettings.lineNumbers,
          highlightActiveLineGutter: true,
          highlightActiveLine: true,
          foldGutter: false,
          dropCursor: true,
          allowMultipleSelections: false,
          indentOnInput: true,
          bracketMatching: true,
          closeBrackets: editorSettings.closeBrackets,
          autocompletion: editorSettings.autocompletion,
          tabSize: editorSettings.tabSize,
        }}
      />
    </div>
  );
}
