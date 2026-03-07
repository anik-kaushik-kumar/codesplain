---
phase: 2
plan: 2
wave: 2
---

# Plan 2.2: Language Selector, Difficulty Selector & Toolbar Controls

## Objective
Build the interactive controls: language selector dropdown, difficulty selector, functional format/copy buttons. Also update the default free provider label to Gemini 3.0. These controls will later connect to the AI gateway in Phase 3.

## Context
- .gsd/SPEC.md — Supported languages, difficulty modes
- src/components/EditorPanel.tsx — Toolbar area with placeholder controls
- src/components/ExplanationPanel.tsx — Provider label already updated to Gemini 3.0

## Dependencies
- Plan 2.1 must be complete (Monaco Editor integrated)

## Tasks

<task type="auto">
  <name>Build interactive language and difficulty selectors</name>
  <files>
    - src/components/LanguageSelector.tsx (create)
    - src/components/DifficultySelector.tsx (create)
    - src/components/EditorPanel.tsx (modify — integrate selectors)
    - src/lib/languages.ts (create — language definitions)
  </files>
  <action>
    1. Create `src/lib/languages.ts`:
       ```ts
       export const SUPPORTED_LANGUAGES = [
         { id: "javascript", label: "JavaScript", monacoId: "javascript" },
         { id: "python", label: "Python", monacoId: "python" },
         { id: "typescript", label: "TypeScript", monacoId: "typescript" },
         { id: "java", label: "Java", monacoId: "java" },
         { id: "cpp", label: "C++", monacoId: "cpp" },
         { id: "html", label: "HTML/CSS", monacoId: "html" },
       ] as const;
       ```

    2. Create `src/components/LanguageSelector.tsx`:
       - Dropdown styled as per reference (bg-brand-card, border-brand-border, rounded-md)
       - Shows current language with chevron down icon
       - On click, opens a dropdown menu with all supported languages
       - Selecting a language calls `onLanguageChange(languageId)` prop
       - Close dropdown on click outside (useEffect + ref)
       - Match the TypeScript dropdown style in the reference screenshot

    3. Create `src/components/DifficultySelector.tsx`:
       - Three-button segmented control: Beginner | Intermediate | Advanced
       - Active button has bg-brand-primary text-white
       - Inactive buttons have text-brand-muted, hover:text-white
       - Calls `onDifficultyChange(difficulty)` prop
       - Place in the right panel, above the AI provider selector

    4. Update `EditorPanel.tsx`:
       - Replace the static TypeScript dropdown with `<LanguageSelector />`
       - When language changes, update Monaco editor language via `monaco.editor.setModelLanguage()`
       - Store selected language in state and pass to selector
       - Accept `onLanguageChange` prop to bubble up the language selection

    5. Do NOT implement auto-detection yet — that's a nice-to-have refinement
  </action>
  <verify>npm run build 2>&1 | Select-String -Pattern "Compiled|error|✓|failed" -CaseSensitive:$false</verify>
  <done>
    - Language selector dropdown opens/closes and lists all 6 languages
    - Selecting a language changes Monaco syntax highlighting
    - Difficulty selector shows 3 options with active state styling
    - Dropdown closes on click outside
  </done>
</task>

<task type="auto">
  <name>Wire Format and Copy buttons</name>
  <files>
    - src/components/EditorPanel.tsx (modify)
  </files>
  <action>
    1. Wire the Copy button:
       - On click, use `navigator.clipboard.writeText(editorValue)` to copy editor content
       - Show brief "Copied!" feedback (change button text for 2 seconds, then revert)
       - Use a small useState + setTimeout pattern

    2. Wire the Format button:
       - On click, trigger Monaco's built-in format action:
         ```ts
         editorRef.current?.getAction("editor.action.formatDocument")?.run();
         ```
       - Store editorRef via the `onMount` callback from Monaco
       - Show brief "Formatted!" feedback similar to copy

    3. Ensure both buttons have proper disabled states when editor is empty

    4. Do NOT install Prettier — use Monaco's built-in formatters for now
  </action>
  <verify>npm run build 2>&1 | Select-String -Pattern "Compiled|error|✓|failed" -CaseSensitive:$false</verify>
  <done>
    - Copy button copies editor content to clipboard with "Copied!" feedback
    - Format button triggers Monaco's built-in formatting
    - Both buttons show visual feedback on click
    - Build succeeds
  </done>
</task>

<task type="checkpoint:human-verify">
  <name>Interactive verification of editor controls</name>
  <action>
    Open localhost:3000 in browser and verify:
    - Monaco Editor loads with TypeScript highlighting
    - Language selector dropdown works (switch to Python, verify highlighting changes)
    - Copy button copies content with feedback
    - Format button triggers formatting
    - Difficulty selector toggles between modes
    - Editor background seamlessly matches page background
  </action>
  <done>All editor controls work interactively as expected</done>
</task>

## Success Criteria
- [ ] Language selector lists all 6 languages and changes Monaco syntax highlighting
- [ ] Difficulty selector shows 3 modes with proper active/inactive styling
- [ ] Copy button works with clipboard API and shows feedback
- [ ] Format button triggers Monaco formatting
- [ ] Default free provider shows "Gemini 3.0 (Google)"
- [ ] `npm run build` succeeds
