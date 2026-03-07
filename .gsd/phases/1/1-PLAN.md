---
phase: 1
plan: 1
wave: 1
---

# Plan 1.1: Next.js Project Initialization & Design Tokens

## Objective
Initialize the Next.js project with TypeScript and Tailwind CSS. Configure the complete design system with color tokens, typography, and global styles matching the reference designs. This is the foundation everything else builds on.

## Context
- .gsd/SPEC.md — Design system tokens, tech stack
- .gsd/DECISIONS.md — ADR-001 (App Router), ADR-005 (Monaco)
- stitch/code.html — Reference HTML with Tailwind config and color values
- stitch/screen (2).png — Main app reference screenshot

## Tasks

<task type="auto">
  <name>Initialize Next.js with TypeScript + Tailwind CSS</name>
  <files>
    - package.json (created)
    - tsconfig.json (created)
    - tailwind.config.ts (created)
    - postcss.config.mjs (created)
    - next.config.ts (created)
    - src/app/layout.tsx (created)
    - src/app/page.tsx (created)
    - src/app/globals.css (created)
  </files>
  <action>
    1. Run `npx -y create-next-app@latest ./ --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm` in the project root
       - Use `./` to init in current directory
       - Use `--app` for App Router (ADR-001)
       - NON-INTERACTIVE mode with all flags specified
    2. If the project directory has existing files that conflict, handle gracefully
    3. Verify the project scaffolds correctly with `npm run dev`
  </action>
  <verify>npm run build 2>&1 | Select-String -Pattern "Compiled successfully|✓"</verify>
  <done>Next.js app builds and runs on localhost:3000 without errors</done>
</task>

<task type="auto">
  <name>Configure Tailwind design tokens and typography</name>
  <files>
    - tailwind.config.ts (modify)
    - src/app/globals.css (modify)
    - src/app/layout.tsx (modify)
  </files>
  <action>
    1. Install Google Fonts via `next/font/google` — load Inter (400, 500, 600) and JetBrains Mono (400, 500)
    2. Update `tailwind.config.ts` with brand color tokens from SPEC.md:
       ```
       brand: {
         bg: '#0D1117',
         card: '#161B22',
         border: '#30363D',
         muted: '#8B949E',
         text: '#C9D1D9',
         link: '#58A6FF',
         success: '#238636',
         primary: '#2F81F7',
       }
       ```
    3. Extend fontFamily: sans → Inter, mono → JetBrains Mono
    4. Update `globals.css` with:
       - CSS reset/base styles
       - Body: bg-brand-bg, text-brand-text, antialiased
       - Scrollbar styling (dark theme)
       - Focus ring utilities matching blue accent
    5. Update `layout.tsx`:
       - Apply font variables to html element
       - Set `className="dark"` on html
       - Add meta tags: title "CodeSplain", description "Understand any code in seconds"
    6. Do NOT use Tailwind CDN — use the npm-installed PostCSS pipeline
    7. Do NOT add any layout components yet — that's Plan 1.2
  </action>
  <verify>npm run build 2>&1 | Select-String -Pattern "Compiled successfully|✓"</verify>
  <done>
    - tailwind.config.ts contains all brand color tokens
    - Fonts load correctly (Inter + JetBrains Mono via next/font)
    - Page renders with dark background (#0D1117) and correct body text color
  </done>
</task>

## Success Criteria
- [ ] `npm run dev` starts without errors on localhost:3000
- [ ] Page has dark background (#0D1117) with Inter font
- [ ] Tailwind brand tokens are configured and usable (e.g., `bg-brand-card`)
- [ ] No Tailwind CDN — using proper PostCSS build pipeline
