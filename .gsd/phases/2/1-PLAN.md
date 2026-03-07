---
phase: 2
plan: 1
wave: 1
---

# Plan 2.1: Monaco Editor Integration

## Objective
Install and integrate Monaco Editor into the EditorPanel, replacing the placeholder. Configure the editor with a dark theme matching the design system. This is the core interactive element users will type/paste code into.

## Context
- .gsd/SPEC.md — Supported languages, design tokens
- src/components/EditorPanel.tsx — Current placeholder to replace
- src/app/globals.css — Brand color tokens

## Tasks

<task type="auto">
  <name>Install and integrate Monaco Editor</name>
  <files>
    - package.json (modify — add @monaco-editor/react)
    - src/components/EditorPanel.tsx (modify — replace placeholder with Monaco)
  </files>
  <action>
    1. Run `npm install @monaco-editor/react`
    2. Replace the center placeholder div in `EditorPanel.tsx` with Monaco Editor:
       ```tsx
       import Editor from "@monaco-editor/react";
       ```
    3. The EditorPanel must be a client component (`"use client"` at top)
    4. Configure Monaco Editor with:
       - `height="100%"` to fill the panel
       - `defaultLanguage="typescript"` (matches the toolbar selector default)
       - `theme="codesplain-dark"` (custom theme — see Task 2)
       - `defaultValue` with a helpful sample code snippet showing a TypeScript async function
       - `options`:
         - `fontSize: 14`
         - `fontFamily: "'JetBrains Mono', monospace"`
         - `minimap: { enabled: false }` (clean look per reference)
         - `lineNumbers: "on"`
         - `scrollBeyondLastLine: false`
         - `padding: { top: 16 }`
         - `renderLineHighlight: "gutter"`
         - `automaticLayout: true`
         - `tabSize: 2`
         - `wordWrap: "on"`
    5. Store the editor value in a `useState` hook and update `onChange`
    6. Handle Monaco loading state — show a subtle loading spinner or "Loading editor..." text
    7. Do NOT wrap Monaco in dynamic import yet
    8. Style the toolbar to show line numbers on the left of the toolbar area
  </action>
  <verify>npm run build 2>&1 | Select-String -Pattern "Compiled|error|✓|failed" -CaseSensitive:$false</verify>
  <done>
    - Monaco Editor renders in left panel with TypeScript syntax highlighting
    - Editor is editable — user can type and paste code
    - Loading state shows while Monaco initializes
    - Build succeeds with no errors
  </done>
</task>

<task type="auto">
  <name>Create custom dark theme for Monaco</name>
  <files>
    - src/lib/monaco-theme.ts (create)
    - src/components/EditorPanel.tsx (modify — apply theme)
  </files>
  <action>
    1. Create `src/lib/monaco-theme.ts` with a custom Monaco theme definition:
       ```ts
       import type { editor } from "monaco-editor";
       
       export const codesplainTheme: editor.IStandaloneThemeData = {
         base: "vs-dark",
         inherit: true,
         rules: [
           // Keep vs-dark rules but customize key tokens
         ],
         colors: {
           "editor.background": "#0D1117",
           "editor.foreground": "#C9D1D9",
           "editor.lineHighlightBackground": "#161B2240",
           "editor.selectionBackground": "#2F81F740",
           "editorLineNumber.foreground": "#8B949E",
           "editorLineNumber.activeForeground": "#C9D1D9",
           "editor.inactiveSelectionBackground": "#2F81F720",
           "editorCursor.foreground": "#58A6FF",
           "editorIndentGuide.background": "#30363D",
           "editorIndentGuide.activeBackground": "#8B949E",
         },
       };
       ```
    2. In EditorPanel, use `beforeMount` callback to define the theme:
       ```tsx
       const handleBeforeMount = (monaco: Monaco) => {
         monaco.editor.defineTheme("codesplain-dark", codesplainTheme);
       };
       ```
    3. Set `theme="codesplain-dark"` on the Editor component
    4. The editor background MUST match the main page background (#0D1117) for seamless look
  </action>
  <verify>npm run build 2>&1 | Select-String -Pattern "Compiled|error|✓|failed" -CaseSensitive:$false</verify>
  <done>
    - Editor uses custom dark theme matching the CodeSplain design system
    - Editor background is #0D1117 (seamless with page)
    - Cursor is blue (#58A6FF), selection is semi-transparent blue
    - Line numbers are muted gray (#8B949E)
  </done>
</task>

## Success Criteria
- [ ] Monaco Editor renders and is fully editable
- [ ] Custom dark theme applied matching the design system
- [ ] Loading state shown while editor initializes
- [ ] `npm run build` succeeds
