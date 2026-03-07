---
phase: 1
plan: 2
wave: 2
---

# Plan 1.2: Application Shell Layout & Navigation

## Objective
Build the two-panel application shell and top navigation bar matching the reference designs. This creates the visual structure that all subsequent phases (editor, explanation panel, controls) slot into.

## Context
- .gsd/SPEC.md — Design system, layout description
- .gsd/phases/1/1-PLAN.md — Must complete first (design tokens, fonts)
- stitch/screen (2).png — Main app layout: nav bar, free tier banner, left editor panel, right explanation panel
- stitch/code.html — HTML/Tailwind reference for component styles

## Dependencies
- Plan 1.1 must be complete (Next.js running, Tailwind tokens configured)

## Tasks

<task type="auto">
  <name>Create top navigation bar component</name>
  <files>
    - src/components/Navbar.tsx (create)
    - src/app/layout.tsx (modify)
  </files>
  <action>
    1. Create `src/components/Navbar.tsx`:
       - Fixed top nav bar with dark background (bg-brand-bg, border-b border-brand-border)
       - Left side: CodeSplain logo/icon + "CodeSplain" text (font-semibold, text-white)
         - Logo: use a simple code bracket icon (e.g., `<>` styled, or an SVG)
       - Right side: nav links — "Docs", "GitHub", "Settings" (text-brand-muted, hover:text-white)
         - Settings button opens settings modal (wire onClick handler, modal comes in Phase 5)
         - Use Framer Motion is NOT installed yet — do NOT import it; just use CSS transitions for hover
       - Height: h-14 (56px) approximately
       - Match the reference screenshot nav bar style exactly
    2. Import Navbar into `layout.tsx` and render above `{children}`
    3. Do NOT implement Framer Motion animations yet — use CSS `transition-colors` for hovers
    4. Do NOT implement the settings modal — just the button that will trigger it later
  </action>
  <verify>npm run build 2>&1 | Select-String -Pattern "Compiled successfully|✓"</verify>
  <done>
    - Navbar renders at top with logo, nav links, settings button
    - Hover states work on nav links (muted → white transition)
    - Navbar is visually consistent with reference screenshot
  </done>
</task>

<task type="auto">
  <name>Create two-panel layout with free tier banner</name>
  <files>
    - src/components/FreeTierBanner.tsx (create)
    - src/components/EditorPanel.tsx (create — placeholder)
    - src/components/ExplanationPanel.tsx (create — placeholder)
    - src/app/page.tsx (modify)
  </files>
  <action>
    1. Create `src/components/FreeTierBanner.tsx`:
       - Horizontal banner below navbar
       - Left: sparkle icon + "Free Mode — 10 explanations remaining" (text-sm)
       - Center: progress bar (blue fill on dark track, showing usage like 3/10)
       - Right: "3/10 USED" counter
       - Colors: text in brand-link (#58A6FF), bg slightly different from main bg
       - This is a STATIC display component for now — state management comes in Phase 5

    2. Create `src/components/EditorPanel.tsx`:
       - Placeholder panel for the left side
       - Dark card background (bg-brand-card or bg-brand-bg)
       - Show placeholder text: "Code editor will be loaded here" (centered, text-brand-muted)
       - Include toolbar placeholder area at top (where language selector, Format, Copy buttons go)
       - This is a SHELL only — Monaco Editor integration is Phase 2

    3. Create `src/components/ExplanationPanel.tsx`:
       - Placeholder panel for the right side
       - Show placeholder areas for: AI Provider selector, Explain Code button, and 6 accordion sections
       - Use card backgrounds (bg-brand-card) with border-brand-border
       - List placeholder section headers with icons:
         - "Summary" (dash icon)
         - "Line-by-line explanation" (list icon)
         - "Concepts detected" (lightbulb icon)
         - "Code improvements" (bulb icon)
         - "Simplified version" (sparkle icon)
         - "Example inputs/outputs" (terminal icon)
       - Each section should be styled as a clickable row with chevron indicator
       - This is a SHELL only — real content rendering is Phase 4

    4. Update `src/app/page.tsx`:
       - Import all three components
       - Layout structure:
         - FreeTierBanner full width below navbar
         - Below banner: flex container with two panels
         - Left panel (EditorPanel): flex-1 or ~60% width
         - Right panel (ExplanationPanel): ~40% width or fixed 400px
         - Both panels should fill remaining viewport height (h-[calc(100vh-navbar-banner)])
       - Use Tailwind flex/grid utilities
       - Ensure panels have proper spacing/padding

    5. Do NOT add any interactivity beyond hover states
    6. Do NOT install Framer Motion yet — CSS transitions only
  </action>
  <verify>npm run build 2>&1 | Select-String -Pattern "Compiled successfully|✓"</verify>
  <done>
    - Two-panel layout renders correctly with proper proportions
    - Free tier banner displays at top with progress bar
    - Left panel shows editor placeholder
    - Right panel shows explanation section headers
    - Overall visual structure matches reference screenshot layout
  </done>
</task>

<task type="checkpoint:human-verify">
  <name>Visual verification against reference designs</name>
  <action>
    Open localhost:3000 in browser and compare against stitch/screen (2).png reference.
    Verify:
    - Dark theme background (#0D1117)
    - Navbar with logo, links, settings button
    - Free tier banner with progress bar
    - Two-panel split layout
    - Correct typography (Inter for UI, placeholder for mono)
    - Overall color palette matches reference
  </action>
  <done>Layout visually matches reference design structure</done>
</task>

## Success Criteria
- [ ] `npm run build` succeeds with zero errors
- [ ] Two-panel layout renders at correct proportions
- [ ] Navbar has logo, nav links, settings button with hover states
- [ ] Free tier banner displays usage counter and progress bar
- [ ] All components use brand design tokens (no hardcoded colors)
- [ ] Layout matches reference screenshot structure
