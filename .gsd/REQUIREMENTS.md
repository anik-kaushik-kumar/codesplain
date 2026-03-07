# REQUIREMENTS.md

## Format

| ID | Requirement | Source | Priority | Status |
|----|-------------|--------|----------|--------|
| **Core Editor** | | | | |
| REQ-01 | Monaco Editor with syntax highlighting, line numbers, and copy/paste | SPEC Goal 1 | P0 | Pending |
| REQ-02 | Language selector dropdown (JS, Python, TS, Java, C++, HTML/CSS) | SPEC Goal 1 | P0 | Pending |
| REQ-03 | Language auto-detection from pasted code | SPEC Goal 1 | P1 | Pending |
| REQ-04 | Code formatting button (prettier integration) | SPEC Goal 1 | P1 | Pending |
| REQ-05 | Copy code button with clipboard API | SPEC Goal 1 | P1 | Pending |
| **AI Explanation Engine** | | | | |
| REQ-06 | "Explain Code" button triggers AI explanation request | SPEC Goal 1 | P0 | Pending |
| REQ-07 | Section 1: Summary (2-3 sentence overview) | SPEC Goal 1 | P0 | Pending |
| REQ-08 | Section 2: Line-by-line breakdown with line references | SPEC Goal 1 | P0 | Pending |
| REQ-09 | Section 3: Key concepts detected (recursion, closures, etc.) | SPEC Goal 1 | P0 | Pending |
| REQ-10 | Section 4: Potential improvements (naming, performance, logic) | SPEC Goal 1 | P0 | Pending |
| REQ-11 | Section 5: Simplified version of the code | SPEC Goal 1 | P0 | Pending |
| REQ-12 | Section 6: Example inputs and outputs with explanations | SPEC Goal 1 | P0 | Pending |
| REQ-13 | Structured JSON response format from AI providers | SPEC Goal 2 | P0 | Pending |
| REQ-14 | Streaming AI responses with progressive rendering | SPEC Goal 4 | P1 | Pending |
| **Difficulty Modes** | | | | |
| REQ-15 | Beginner mode — explain as if user is new to programming | SPEC Goal 1 | P0 | Pending |
| REQ-16 | Intermediate mode — assume basic programming knowledge | SPEC Goal 1 | P0 | Pending |
| REQ-17 | Advanced mode — discuss architecture, patterns, trade-offs | SPEC Goal 1 | P0 | Pending |
| **AI Gateway** | | | | |
| REQ-18 | Multi-provider AI gateway (Gemini, Claude, OpenAI) | SPEC Goal 2 | P0 | Pending |
| REQ-19 | Provider selection dropdown in UI | SPEC Goal 2 | P0 | Pending |
| REQ-20 | Request routing based on selected provider | SPEC Goal 2 | P0 | Pending |
| REQ-21 | Response normalization across providers into consistent JSON | SPEC Goal 2 | P0 | Pending |
| **BYOK System** | | | | |
| REQ-22 | Settings modal for configuring API keys (Gemini, Claude, OpenAI) | SPEC Goal 2 | P0 | Pending |
| REQ-23 | API keys stored encrypted in localStorage | SPEC Goal 2 | P0 | Pending |
| REQ-24 | Connection status indicator per provider (green dot) | SPEC Goal 2 | P1 | Pending |
| REQ-25 | Key validation on save | SPEC Goal 2 | P1 | Pending |
| **Free Tier** | | | | |
| REQ-26 | 10 free explanations using platform Gemini key | SPEC Goal 2 | P0 | Pending |
| REQ-27 | Usage counter displayed in top banner | SPEC Goal 2 | P0 | Pending |
| REQ-28 | Block AI requests after limit reached (prompt to add own key) | SPEC Goal 2 | P0 | Pending |
| **Syntax Visualization** | | | | |
| REQ-29 | Hovering explanation highlights corresponding code lines | SPEC Goal 3 | P1 | Pending |
| REQ-30 | Line references in explanation are clickable/hoverable | SPEC Goal 3 | P1 | Pending |
| **Complexity Meter** | | | | |
| REQ-31 | Estimate code complexity (functions, nesting, loops, cyclomatic) | SPEC Goal 1 | P1 | Pending |
| REQ-32 | Display complexity level: Beginner / Intermediate / Advanced | SPEC Goal 1 | P1 | Pending |
| **Shareable Links** | | | | |
| REQ-33 | Generate shareable URL with encoded code + explanation | SPEC Goal 3 | P2 | Pending |
| REQ-34 | Shared view renders code with syntax highlighting + explanation | SPEC Goal 3 | P2 | Pending |
| **UI/UX** | | | | |
| REQ-35 | Two-panel layout: editor left, explanation right | SPEC Goal 4 | P0 | Pending |
| REQ-36 | Dark theme matching reference designs (#0D1117 palette) | SPEC Goal 4 | P0 | Pending |
| REQ-37 | Top navigation bar with logo, nav links, settings button | SPEC Goal 4 | P0 | Pending |
| REQ-38 | Framer Motion animations for section reveals and transitions | SPEC Goal 4 | P1 | Pending |
| REQ-39 | Accordion-style collapsible explanation sections | SPEC Goal 4 | P0 | Pending |
| REQ-40 | Loading state animation during AI processing | SPEC Goal 4 | P0 | Pending |
| **Security** | | | | |
| REQ-41 | Sanitize all code input before sending to AI | Security | P0 | Pending |
| REQ-42 | Prevent prompt injection attacks via input validation | Security | P0 | Pending |
| REQ-43 | Encrypted localStorage for API keys | Security | P0 | Pending |
| REQ-44 | XSS protection on shareable links | Security | P0 | Pending |
| **Performance** | | | | |
| REQ-45 | Cache explanations locally to avoid duplicate API calls | Performance | P1 | Pending |
| REQ-46 | Rate limiting on API routes | Performance | P1 | Pending |
| REQ-47 | Large code input handling (truncation/warning) | Performance | P1 | Pending |
