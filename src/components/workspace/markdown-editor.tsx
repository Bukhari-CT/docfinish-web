"use client";

import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { EditorView } from "@codemirror/view";
import CodeMirror from "@uiw/react-codemirror";
import { useMemo } from "react";

const theme = EditorView.theme({
  "&": { height: "100%", fontSize: "13px", backgroundColor: "transparent" },
  ".cm-scroller": {
    fontFamily: "var(--font-jetbrains-mono), ui-monospace, monospace",
    lineHeight: "1.65",
  },
  ".cm-content": { padding: "16px 0 120px", caretColor: "#2448e0" },
  ".cm-line": { padding: "0 16px 0 12px" },
  ".cm-gutters": { backgroundColor: "transparent", border: "none", color: "#b3ab9c" },
  ".cm-activeLine": { backgroundColor: "rgba(36,72,224,0.04)" },
  ".cm-activeLineGutter": { backgroundColor: "transparent", color: "#5d6270" },
  "&.cm-focused": { outline: "none" },
  ".cm-selectionBackground, &.cm-focused .cm-selectionBackground": { backgroundColor: "#c9d4fb !important" },
  ".cm-header-1": { fontSize: "1.15em" },
});

export default function MarkdownEditor({
  value,
  onChange,
  readOnly,
}: {
  value: string;
  onChange: (v: string) => void;
  readOnly?: boolean;
}) {
  const extensions = useMemo(
    () => [markdown({ base: markdownLanguage, codeLanguages: languages }), EditorView.lineWrapping, theme],
    [],
  );
  return (
    <CodeMirror
      value={value}
      onChange={onChange}
      extensions={extensions}
      readOnly={readOnly}
      height="100%"
      className="h-full"
      basicSetup={{ foldGutter: false, highlightActiveLineGutter: true, lineNumbers: true, autocompletion: false }}
      aria-label="Markdown source"
    />
  );
}
