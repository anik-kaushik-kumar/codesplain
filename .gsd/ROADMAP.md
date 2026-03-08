# ROADMAP.md

> **Current Phase**: Not started
> **Milestone**: v1.0

## Must-Haves (from SPEC)

- [ ] Monaco code editor with syntax highlighting and language selection
- [ ] AI explanation engine producing 6 structured sections
- [ ] Multi-provider AI gateway (Gemini, Claude, OpenAI)
- [ ] BYOK settings modal with encrypted key storage
- [ ] Free tier with 10 explanations on platform Gemini key
- [ ] Two-panel dark-themed UI matching reference designs
- [ ] Difficulty mode selector (Beginner / Intermediate / Advanced)

## Phases

### Phase 1: Project Scaffolding & Design System
**Status**: ✅ Complete
**Objective**: Initialize Next.js project with TypeScript, Tailwind CSS, and establish the complete design system. Set up the base layout structure, fonts (Inter + JetBrains Mono), color tokens, and global styles matching the reference designs.
**Requirements**: REQ-35, REQ-36, REQ-37
**Deliverable**: Running Next.js app with styled shell layout (nav bar, two-panel structure, dark theme)

---

### Phase 2: Monaco Editor & Controls
**Status**: ✅ Complete
**Objective**: Integrate Monaco Editor with full code editing capabilities. Build the language selector dropdown, difficulty selector, format button, and copy button. Implement language auto-detection.
**Requirements**: REQ-01, REQ-02, REQ-03, REQ-04, REQ-05, REQ-15, REQ-16, REQ-17
**Deliverable**: Fully functional left panel with Monaco Editor and all control toolbar elements

---

### Phase 3: AI Gateway & Provider Integration
**Status**: ✅ Complete
**Objective**: Build the AI gateway API routes that route requests to the correct provider (Gemini, Claude, OpenAI). Design structured prompts that return consistent JSON across all providers. Implement response normalization and streaming. **Streaming must deliver sections in fixed order:** summary → line_by_line → concepts → improvements → simplified_code → examples.
**Requirements**: REQ-06, REQ-13, REQ-14, REQ-18, REQ-19, REQ-20, REQ-21
**Deliverable**: Working API endpoint `/api/explain` that accepts code, language, difficulty, provider, and API key, returning streaming structured JSON in section order

---

### Phase 4: Explanation Panel & Visualization
**Status**: ✅ Complete
**Objective**: Build the right-side explanation panel with all 6 sections as collapsible accordions. Implement streaming render, Framer Motion animations, syntax visualization (hover-to-highlight), complexity meter, and loading states.
**Requirements**: REQ-07, REQ-08, REQ-09, REQ-10, REQ-11, REQ-12, REQ-29, REQ-30, REQ-31, REQ-32, REQ-38, REQ-39, REQ-40
**Deliverable**: Complete explanation panel rendering AI responses with interactive features

---

### Phase 5: BYOK, Free Tier & Settings
**Status**: ✅ Complete
**Objective**: Build the AI Providers settings modal matching reference design. Implement encrypted localStorage for API keys (never server-stored/logged), connection status indicators, free tier usage tracking via **IP + database counter** (not localStorage), and limit enforcement.
**Requirements**: REQ-22, REQ-23, REQ-24, REQ-25, REQ-26, REQ-27, REQ-28
**Deliverable**: Fully working BYOK system with server-side free tier enforcement

---

### Phase 6: Sharing, Security & Polish
**Status**: ✅ Complete
**Objective**: Implement shareable explanation links with encoded state. Add security hardening (input sanitization, prompt injection prevention, XSS protection). Add caching, rate limiting, large input handling. Final UI polish and animations.
**Requirements**: REQ-33, REQ-34, REQ-41, REQ-42, REQ-43, REQ-44, REQ-45, REQ-46, REQ-47
**Deliverable**: Production-ready application with all features complete
