---
phase: 3
plan: 3
wave: 3
---

# Plan 3.3: Frontend Streaming Integration & End-to-End Test

## Objective
Wire the "Explain Code" button to the /api/explain endpoint and handle SSE streaming on the frontend, showing each explanation section as it arrives.

## Context
- src/app/api/explain/route.ts — SSE streaming endpoint from Plan 3.2
- src/lib/ai/types.ts — StreamChunk, SectionKey, SECTION_ORDER
- src/components/ExplanationPanel.tsx — Section headers to populate
- src/app/page.tsx — State management hub

## Dependencies
- Plan 3.2 must be complete (API route working)

## Tasks

<task type="auto">
  <name>Create streaming client hook and wire Explain button</name>
  <files>
    - src/hooks/useExplain.ts (create)
    - src/app/page.tsx (modify)
    - src/components/ExplanationPanel.tsx (modify)
  </files>
  <action>
    1. Create `src/hooks/useExplain.ts`:
       - Custom hook: `useExplain()` returns `{ explain, sections, isLoading, error, activeSection }`
       - `sections` is a Record<SectionKey, string> — starts empty, fills as sections stream in
       - `activeSection` tracks which section is currently being received
       - `explain(code, language, difficulty)` function:
         a. Set isLoading = true, clear previous sections and error
         b. Fetch POST to `/api/explain` with the payload
         c. Read the response as SSE using `response.body.getReader()` + `TextDecoder`
         d. Parse each `data: {...}` line as StreamChunk
         e. For each chunk: update `sections[chunk.section] = chunk.content`
         f. When `done: true` received, set isLoading = false
         g. On error: set error message, isLoading = false
       - Handle partial SSE parsing (data may come in incomplete chunks)

    2. Update `src/app/page.tsx`:
       - Import and use `useExplain()` hook
       - Pass `explain` function, `sections`, `isLoading`, `error`, `activeSection` to ExplanationPanel
       - Wire the function call: when Explain button clicked, call `explain(code, language, difficulty)`
       - The code value needs to come from EditorPanel — lift code state to page level:
         - Move `code` state from EditorPanel to page.tsx
         - Pass `code`, `setCode` as props to EditorPanel

    3. Update `src/components/ExplanationPanel.tsx`:
       - Accept new props: `sections`, `isLoading`, `error`, `activeSection`, `onExplain`
       - Wire "Explain Code" button onClick to `onExplain()`
       - For each section row:
         - If section has content in `sections[key]`: show it expanded with the content rendered as text
         - If section is `activeSection` and `isLoading`: show a loading spinner
         - If section has no content and not loading: show as collapsed placeholder
       - The sections should auto-expand as content arrives
       - Show error message if API returns error
       - Disable "Explain Code" button while loading (show "Explaining..." text with spinner)

    4. Update `src/components/EditorPanel.tsx`:
       - Accept `code` and `onCodeChange` as props (lifted state)
       - Remove internal `useState` for code
  </action>
  <verify>npm run build 2>&1 | Select-String -Pattern "Compiled|error|✓|failed" -CaseSensitive:$false</verify>
  <done>
    - Explain button triggers API call
    - Sections appear one by one as SSE chunks arrive
    - Loading states show correctly
    - Error handling works
    - Build succeeds
  </done>
</task>

<task type="checkpoint:human-verify">
  <name>End-to-end test: paste code → get explanation</name>
  <action>
    Open localhost:3000 in browser:
    1. The sample TypeScript code should be pre-loaded in the editor
    2. Select "Beginner" difficulty
    3. Click "Explain Code"
    4. Watch sections appear one at a time in order: Summary → Line-by-line → Concepts → Improvements → Simplified → Examples
    5. Each section should auto-expand with AI-generated content
    6. After all sections complete, the "Explain Code" button should re-enable
    7. Try changing language to Python, paste a Python snippet, explain again
    8. Verify the explanation adjusts to the new language

    If Gemini API key is not set or fails, verify error handling shows a clear message.
  </action>
  <done>Full end-to-end flow works: code → explain → streaming sections</done>
</task>

## Success Criteria
- [ ] "Explain Code" button triggers API call
- [ ] Sections stream in fixed order (summary first, examples last)
- [ ] Each section auto-expands as content arrives
- [ ] Loading spinner shows per-section while streaming
- [ ] Error messages display for API failures
- [ ] Button disabled during loading with "Explaining..." text
- [ ] `npm run build` succeeds
