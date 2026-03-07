# DECISIONS.md — Architecture Decision Records

## ADR Log

| ID | Date | Decision | Rationale | Status |
|----|------|----------|-----------|--------|
| ADR-001 | 2026-03-07 | Use Next.js App Router | Server components for API routes, Vercel deployment, modern React patterns | Accepted |
| ADR-002 | 2026-03-07 | Use localStorage (no database) | v1 is client-first, reduces complexity, BYOK keys stay on client | Accepted |
| ADR-003 | 2026-03-07 | Structured JSON prompts for AI | Ensures consistent rendering across providers; parse-friendly output | Accepted |
| ADR-004 | 2026-03-07 | Free tier via platform Gemini key | Gemini offers generous free pricing; 10 uses low-risk for platform cost | Accepted |
| ADR-005 | 2026-03-07 | Monaco Editor over CodeMirror | Matches user requirement; VS Code familiarity; superior TypeScript support | Accepted |
