---
phase: 4
plan: 2
wave: 2
---

# Plan 4.2: Loading States, Skeleton UI & Visual Polish

## Objective
Add polished loading states with skeleton placeholders, section entrance micro-animations, and final visual polish to make the explanation panel feel premium and alive.

## Context
- src/components/ExplanationSection.tsx — Accordion from Plan 4.1
- src/components/ExplanationPanel.tsx — Panel with sections
- src/app/globals.css — Design system tokens

## Dependencies
- Plan 4.1 must be complete (accordions + markdown rendering)

## Tasks

<task type="auto">
  <name>Add skeleton loading states and micro-animations</name>
  <files>
    - src/components/SkeletonLoader.tsx (create)
    - src/components/ExplanationSection.tsx (modify — add skeleton during loading)
    - src/app/globals.css (modify — add keyframe animations)
  </files>
  <action>
    1. Create `src/components/SkeletonLoader.tsx`:
       - A reusable skeleton component that shows animated placeholder lines
       - Props: `lines?: number` (default 3)
       - Each line is a rounded bar with a shimmer animation
       - Use CSS `@keyframes shimmer` with a gradient sweep from left to right
       - Vary line widths (100%, 85%, 70%) for realistic text skeleton appearance
       - Style: `bg-brand-border/30 rounded` with shimmer overlay

    2. Update `ExplanationSection.tsx`:
       - When `isActive` (currently being streamed):
         - Show `<SkeletonLoader />` inside the expanded section UNTIL content starts arriving
         - Once content arrives, crossfade from skeleton to markdown content
       - When `isPending` (waiting for its turn):
         - Show dimmed header only (opacity-40)
         - Subtle pulse animation on icon

    3. Add CSS keyframes to `globals.css`:
       ```css
       @keyframes shimmer {
         0% { background-position: -200% 0; }
         100% { background-position: 200% 0; }
       }

       @keyframes slideIn {
         from { opacity: 0; transform: translateY(8px); }
         to { opacity: 1; transform: translateY(0); }
       }

       @keyframes pulse-subtle {
         0%, 100% { opacity: 1; }
         50% { opacity: 0.5; }
       }
       ```

    4. Do NOT install Framer Motion — pure CSS animations are sufficient and lighter
  </action>
  <verify>npm run build 2>&1 | Select-String -Pattern "Compiled|error|✓|failed" -CaseSensitive:$false</verify>
  <done>
    - Skeleton loader shows animated shimmer bars while section is being generated
    - Sections fade in with slideIn animation
    - Pending sections show dimmed state with subtle pulse
    - All animations are smooth CSS (no jank)
  </done>
</task>

<task type="checkpoint:human-verify">
  <name>Visual verification of explanation panel</name>
  <action>
    Open localhost:3000 in browser and verify:
    - Click "Explain Code" to trigger AI call
    - Section headers are visible with correct icons and colors
    - Sections expand/collapse when clicked
    - Content renders as rich markdown (headings, code blocks, lists)
    - Code blocks in explanations have syntax highlighting
    - Overall feel is premium and polished
    
    If API key has quota, also verify:
    - Streaming sections appear with skeleton → content transition
    - Staggered entrance animation as sections arrive
    - Green checkmarks appear for completed sections
  </action>
  <done>Explanation panel looks and feels premium with smooth animations</done>
</task>

## Success Criteria
- [ ] Skeleton shimmer animation shows during section generation
- [ ] Sections slide in with staggered entrance animation
- [ ] Pending sections are dimmed with subtle pulse
- [ ] All animations are pure CSS (no external animation library)
- [ ] `npm run build` succeeds
