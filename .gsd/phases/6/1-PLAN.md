---
phase: 6
plan: 1
wave: 1
---

# Plan 6.1: Security Hardening & Input Validation

## Objective
Add input sanitization, prompt injection prevention, XSS protection, rate limiting, and large input handling to make the application production-ready.

## Context
- src/app/api/explain/route.ts — Main API route
- src/lib/ai/prompt.ts — Prompt template
- src/lib/ai/gemini-provider.ts — Provider
- src/components/EditorPanel.tsx — Code input

## Tasks

<task type="auto">
  <name>Add input validation, sanitization, and rate limiting</name>
  <files>
    - src/lib/security.ts (create)
    - src/app/api/explain/route.ts (modify — add security checks)
  </files>
  <action>
    1. Create `src/lib/security.ts`:
       - `sanitizeCode(code: string): string` — trim whitespace, limit to 10,000 characters, strip null bytes
       - `detectPromptInjection(code: string): boolean` — check for common injection patterns (e.g., "ignore previous instructions", "system:", "you are now", etc.) — return true if suspicious
       - `MAX_CODE_LENGTH = 10000` — constant for UI and API use
       - `RATE_LIMIT_WINDOW = 60000` (1 min)
       - `RATE_LIMIT_MAX = 5` (5 requests per minute per IP)
       - In-memory rate limiter using Map (similar to usage-tracker):
         ```ts
         export function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number }
         ```
       - Export all for use in API route

    2. Update `src/app/api/explain/route.ts`:
       - Import and apply `sanitizeCode()` to the code input
       - Check `detectPromptInjection()` — if true, return 400 with "Suspicious input detected"
       - Check `checkRateLimit(ip)` — if not allowed, return 429 with retry-after header
       - Validate code length <= MAX_CODE_LENGTH before processing
       - XSS: API already returns JSON (not raw HTML), so output is safe
       - Ensure error messages never leak internal details (already implemented)
  </action>
  <verify>npm run build 2>&1 | Select-String -Pattern "Compiled|error|✓|failed" -CaseSensitive:$false</verify>
  <done>
    - Code input sanitized (trimmed, length-limited, null bytes stripped)
    - Prompt injection detection blocks suspicious inputs
    - Rate limiting enforces 5 req/min per IP
    - Build succeeds
  </done>
</task>

<task type="auto">
  <name>Add character limit indicator to editor</name>
  <files>
    - src/components/EditorPanel.tsx (modify — add character counter)
  </files>
  <action>
    1. Add a character count indicator to the editor toolbar:
       - Show `{currentLength} / {MAX_CODE_LENGTH}` at the bottom-right of the editor
       - Color shift: normal (< 80%), yellow (80-95%), red (> 95%)
       - If code exceeds limit, show warning and disable Explain button
    2. Import `MAX_CODE_LENGTH` from `src/lib/security.ts`
  </action>
  <verify>npm run build 2>&1 | Select-String -Pattern "Compiled|error|✓|failed" -CaseSensitive:$false</verify>
  <done>Character counter visible, color shifts at thresholds, limit enforced in UI</done>
</task>

## Success Criteria
- [ ] Input sanitization strips dangerous content
- [ ] Prompt injection detection blocks suspicious code
- [ ] Rate limiting enforces 5 req/min per IP
- [ ] Character limit visible in editor with color shift
- [ ] `npm run build` succeeds
