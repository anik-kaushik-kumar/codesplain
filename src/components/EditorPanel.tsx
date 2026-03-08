"use client";

import { useState, useRef } from "react";
import Editor, { type Monaco } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { codesplainTheme, DEFAULT_CODE } from "@/lib/monaco-theme";

interface EditorPanelProps {
    onLanguageChange?: (language: string) => void;
    language?: string;
}

export default function EditorPanel({
    language = "typescript",
}: EditorPanelProps) {
    const [code, setCode] = useState(DEFAULT_CODE);
    const [copied, setCopied] = useState(false);
    const [formatted, setFormatted] = useState(false);
    const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

    const handleBeforeMount = (monaco: Monaco) => {
        monaco.editor.defineTheme("codesplain-dark", codesplainTheme);
    };

    const handleMount = (editor: editor.IStandaloneCodeEditor) => {
        editorRef.current = editor;
    };

    const handleCopy = async () => {
        if (code) {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleFormat = () => {
        if (editorRef.current) {
            editorRef.current.getAction("editor.action.formatDocument")?.run();
            setFormatted(true);
            setTimeout(() => setFormatted(false), 2000);
        }
    };

    return (
        <div className="flex flex-col h-full">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-brand-border">
                <div className="flex items-center gap-3">
                    {/* Language selector placeholder — replaced in Plan 2.2 */}
                    <div className="flex items-center gap-2 bg-brand-card border border-brand-border rounded-md px-3 py-1.5 text-sm text-white cursor-pointer hover:border-brand-muted transition-colors">
                        <span className="capitalize">
                            {language === "cpp" ? "C++" : language}
                        </span>
                        <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="text-brand-muted"
                        >
                            <polyline points="6 9 12 15 18 9" />
                        </svg>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Format button */}
                    <button
                        onClick={handleFormat}
                        className="flex items-center gap-1.5 text-xs text-brand-muted hover:text-white transition-colors"
                    >
                        <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                        </svg>
                        {formatted ? "Formatted!" : "Format"}
                    </button>
                    {/* Copy button */}
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-1.5 text-xs text-brand-muted hover:text-white transition-colors"
                    >
                        <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                        {copied ? "Copied!" : "Copy"}
                    </button>
                </div>
            </div>

            {/* Monaco Editor */}
            <div className="flex-1">
                <Editor
                    height="100%"
                    language={language}
                    value={code}
                    theme="codesplain-dark"
                    beforeMount={handleBeforeMount}
                    onMount={handleMount}
                    onChange={(value) => setCode(value || "")}
                    loading={
                        <div className="flex items-center justify-center h-full bg-brand-bg">
                            <div className="text-center">
                                <div className="w-6 h-6 border-2 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                                <p className="text-brand-muted text-sm">Loading editor...</p>
                            </div>
                        </div>
                    }
                    options={{
                        fontSize: 14,
                        fontFamily: "'JetBrains Mono', monospace",
                        minimap: { enabled: false },
                        lineNumbers: "on",
                        scrollBeyondLastLine: false,
                        padding: { top: 16 },
                        renderLineHighlight: "gutter",
                        automaticLayout: true,
                        tabSize: 2,
                        wordWrap: "on",
                        smoothScrolling: true,
                        cursorBlinking: "smooth",
                        cursorSmoothCaretAnimation: "on",
                        bracketPairColorization: { enabled: true },
                        guides: {
                            bracketPairs: true,
                            indentation: true,
                        },
                    }}
                />
            </div>
        </div>
    );
}
