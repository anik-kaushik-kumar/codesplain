---
phase: 4
plan: 1
wave: 1
---

# Plan 4.1: Markdown Rendering & Collapsible Accordions

## Objective
Install markdown rendering dependencies and build collapsible accordion sections that render AI explanation content as rich formatted markdown with syntax-highlighted code blocks.

## Context
- .gsd/SPEC.md — 6 explanation sections, formatting expectations
- src/components/ExplanationPanel.tsx — Current section rendering (plain text)
- src/lib/ai/types.ts — SectionKey, SECTION_ORDER

## Tasks

<task type="auto">
  <name>Install markdown dependencies and create MarkdownRenderer component</name>
  <files>
    - package.json (modify — add react-markdown, remark-gfm, rehype-highlight)
    - src/components/MarkdownRenderer.tsx (create)
  </files>
  <action>
    1. Run `npm install react-markdown remark-gfm rehype-highlight highlight.js`
    2. Create `src/components/MarkdownRenderer.tsx`:
       - Client component (`"use client"`)
       - Import `ReactMarkdown` from `react-markdown`
       - Import `remarkGfm` for GitHub-flavored markdown (tables, strikethrough, task lists)
       - Import `rehypeHighlight` for syntax highlighting in fenced code blocks
       - Import a dark highlight.js theme CSS (e.g., `highlight.js/styles/github-dark.css`)
       - Props: `content: string`, `className?: string`
       - Render with custom component overrides:
         - `code`: For inline code, style with `bg-brand-card px-1.5 py-0.5 rounded text-brand-link font-mono text-[13px]`
         - `pre`: Style code blocks with `bg-[#161B22] rounded-lg p-4 overflow-x-auto my-3 border border-brand-border`
         - `h1`, `h2`, `h3`: Style with appropriate `text-white font-semibold` sizes
         - `p`: Style with `text-brand-text leading-relaxed mb-2`
         - `ul`, `ol`: Style with `ml-4 space-y-1 text-brand-text`
         - `li`: Style with `text-brand-text`
         - `strong`: Style with `text-white font-semibold`
         - `a`: Style with `text-brand-link hover:underline`
         - `blockquote`: Style with `border-l-2 border-brand-primary pl-4 my-2 text-brand-muted italic`
       - This component handles ALL markdown rendering across the app
  </action>
  <verify>npm run build 2>&1 | Select-String -Pattern "Compiled|error|✓|failed" -CaseSensitive:$false</verify>
  <done>
    - MarkdownRenderer component renders markdown with syntax-highlighted code blocks
    - Code blocks use dark theme matching the design system
    - Inline code, lists, headings, links all properly styled
  </done>
</task>

<task type="auto">
  <name>Build collapsible accordion sections with animations</name>
  <files>
    - src/components/ExplanationSection.tsx (create)
    - src/components/ExplanationPanel.tsx (modify — use new components)
  </files>
  <action>
    1. Create `src/components/ExplanationSection.tsx`:
       - Props: `sectionKey`, `label`, `icon`, `color`, `content`, `isActive`, `isPending`
       - Collapsible: clicked header toggles expanded/collapsed
       - Auto-expand when content first arrives (track via useEffect)
       - Collapse/expand animation using CSS `max-height` + `overflow-hidden` + `transition`
         - Do NOT use Framer Motion — use pure CSS transitions for simplicity and performance
         - Use a ref to measure content height for smooth animation:
           ```tsx
           const contentRef = useRef<HTMLDivElement>(null);
           const [maxHeight, setMaxHeight] = useState("0px");
           // When expanded: maxHeight = contentRef.current.scrollHeight + "px"
           // When collapsed: maxHeight = "0px"
           ```
       - Header shows:
         - Left: colored icon + section label
         - Right: spinning loader (if active) | green checkmark (if has content) | chevron (if empty/collapsed)
       - Content area: render `content` through `<MarkdownRenderer />`
       - Staggered entrance animation:
         - Use a CSS keyframe `@keyframes slideIn` that slides from translateY(8px) + opacity 0 → normal
         - Apply with a delay based on section index for cascading effect when content streams in
       - Visual polish:
         - Subtle left border color matching section icon color when expanded
         - Slight background change when expanded (`bg-brand-card/30`)

    2. Update `ExplanationPanel.tsx`:
       - Replace inline section rendering loop with `<ExplanationSection />` components
       - Pass all required props from sections/isLoading/activeSection state
       - Keep the AI Provider selector, Explain button, and error display as-is
       - Keep the footer as-is
  </action>
  <verify>npm run build 2>&1 | Select-String -Pattern "Compiled|error|✓|failed" -CaseSensitive:$false</verify>
  <done>
    - Sections collapse/expand smoothly with CSS transitions
    - Sections auto-expand when content arrives
    - Content is rendered as rich markdown
    - Staggered entrance animation on sections
    - Build succeeds
  </done>
</task>

## Success Criteria
- [ ] MarkdownRenderer renders markdown with syntax-highlighted code blocks
- [ ] Sections are collapsible with smooth CSS transitions
- [ ] Sections auto-expand when content first streams in
- [ ] Staggered entrance animation for visual polish
- [ ] `npm run build` succeeds
