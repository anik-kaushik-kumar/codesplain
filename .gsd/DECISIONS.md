# DECISIONS.md — Architecture Decision Records

## ADR Log

| ID | Date | Decision | Rationale | Status |
|----|------|----------|-----------|--------|
| ADR-001 | 2026-03-07 | Use Next.js App Router | Server components for API routes, Vercel deployment, modern React patterns | Accepted |
| ADR-002 | 2026-03-07 | localStorage for BYOK keys; database for free tier | BYOK keys client-only (never server-stored); free tier needs IP-based tracking via DB | **Revised** |
| ADR-003 | 2026-03-07 | Structured JSON prompts for AI | Ensures consistent rendering across providers; parse-friendly output | Accepted |
| ADR-004 | 2026-03-07 | Free tier via platform Gemini key | Gemini offers generous free pricing; 10 uses low-risk for platform cost | Accepted |
| ADR-005 | 2026-03-07 | Monaco Editor over CodeMirror | Matches user requirement; VS Code familiarity; superior TypeScript support | Accepted |
| ADR-006 | 2026-03-07 | BYOK keys never stored/logged server-side | Keys sent client → API gateway per-request; zero server persistence; security-first | Accepted |
| ADR-007 | 2026-03-07 | Free tier tracking via IP + database counter | Prevents localStorage bypass; server-side enforcement is more tamper-resistant | Accepted |
| ADR-008 | 2026-03-07 | Stream AI sections in fixed order | summary → line_by_line → concepts → improvements → simplified_code → examples | Accepted |

---

## Phase 5 Decisions — BYOK, Free Tier & Settings

**Date:** 2026-03-07

### BYOK Security

- BYOK keys stored **only** in encrypted localStorage on the client
- Key sent directly from **client → API gateway** per-request
- Key must **never** be stored server-side
- Key must **never** be logged (API routes must not log request bodies containing keys)

### Free Tier Tracking

- Track usage by **IP address + database counter** (not localStorage)
- This introduces a **minimal database requirement** (e.g., Vercel KV, Upstash Redis, or SQLite)
- Server-side enforcement prevents client-side tampering with free tier limits

### Constraints

- API routes must strip/redact API keys from all logs and error reports
- Database only stores IP hashes + usage counts — no PII beyond IP

---

## Phase 3 Decisions — AI Gateway & Provider Integration

**Date:** 2026-03-07

### Streaming Order

AI responses must stream partial explanation sections in this fixed order:

1. `summary`
2. `line_by_line`
3. `concepts`
4. `improvements`
5. `simplified_code`
6. `examples`

### Approach

- Each section streams as it becomes available
- Frontend renders sections progressively (accordion opens as content arrives)
- Prompt engineering must enforce this section order across all providers
