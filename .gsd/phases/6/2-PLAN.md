---
phase: 6
plan: 2
wave: 2
---

# Plan 6.2: Shareable Links & Final UI Polish

## Objective
Implement shareable explanation links with URL-encoded state and add final UI polish (responsive tweaks, keyboard shortcuts, meta tags, favicon).

## Context
- src/app/page.tsx — Main page state
- src/app/layout.tsx — Meta tags
- src/components/*.tsx — All UI components

## Dependencies
- Plan 6.1 must be complete (security hardening)

## Tasks

<task type="auto">
  <name>Implement shareable explanation links</name>
  <files>
    - src/lib/sharing.ts (create)
    - src/app/page.tsx (modify — read/write URL state)
  </files>
  <action>
    1. Create `src/lib/sharing.ts`:
       - `encodeShareState(code: string, language: string, difficulty: string): string`
         - Compress state to URL-safe base64: `btoa(JSON.stringify({ c: code, l: language, d: difficulty }))`
         - Keep URL short by using abbreviated keys
       - `decodeShareState(encoded: string): { code: string; language: string; difficulty: string } | null`
         - Parse the base64 back to state
         - Return null if invalid/corrupted
       - `generateShareUrl(state: { code: string; language: string; difficulty: string }): string`
         - Returns `${window.location.origin}?s=${encodedState}`

    2. Update `page.tsx`:
       - On mount, check URL for `?s=` parameter
       - If present, decode and set code, language, difficulty from URL state
       - Add a "Share" button to the explanation panel (below the sections, visible when explanation exists)
       - Share button copies the share URL to clipboard with toast feedback
       - Use `navigator.clipboard.writeText()` for copy
  </action>
  <verify>npm run build 2>&1 | Select-String -Pattern "Compiled|error|✓|failed" -CaseSensitive:$false</verify>
  <done>
    - Share URL generated with encoded code + settings
    - Share URL loads state on page mount
    - Copy-to-clipboard with toast feedback
  </done>
</task>

<task type="auto">
  <name>Final UI polish: meta tags, keyboard shortcuts, responsive</name>
  <files>
    - src/app/layout.tsx (modify — SEO meta tags)
    - src/app/page.tsx (modify — keyboard shortcut)
    - src/components/ExplanationPanel.tsx (modify — share button)
  </files>
  <action>
    1. Update `layout.tsx`:
       - Title: "CodeSplain — AI Code Explainer"
       - Meta description: "Paste code, get instant AI-powered explanations. Supports multiple languages and difficulty levels."
       - Open Graph tags for social sharing
       - Favicon: use the existing Next.js favicon or add a simple code icon

    2. Add keyboard shortcut to `page.tsx`:
       - `Ctrl+Enter` / `Cmd+Enter` triggers Explain Code
       - Show hint text below the Explain button: "⌘+Enter"

    3. Add Share button to `ExplanationPanel.tsx`:
       - Only visible when at least one section has content
       - Styled as a subtle outline button: "Share Explanation"
       - Shows "Copied!" toast for 2 seconds after clicking
       - Position: below the sections, above the footer
  </action>
  <verify>npm run build 2>&1 | Select-String -Pattern "Compiled|error|✓|failed" -CaseSensitive:$false</verify>
  <done>
    - SEO meta tags in place
    - Ctrl+Enter keyboard shortcut works
    - Share button appears after explanation
    - Build succeeds
  </done>
</task>

## Success Criteria
- [ ] Shareable links encode/decode code + settings
- [ ] Share URL loads state on page visit
- [ ] Copy-to-clipboard with toast
- [ ] SEO meta tags present
- [ ] Ctrl+Enter keyboard shortcut
- [ ] `npm run build` succeeds
