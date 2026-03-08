---
phase: 5
plan: 3
wave: 3
---

# Plan 5.3: Free Tier Usage Tracking & Limit Enforcement

## Objective
Implement server-side free tier tracking (10 explanations per IP per day) and wire the FreeTierBanner to show real usage. When limits are exceeded, block free tier requests and prompt users to add their own key.

## Context
- .gsd/DECISIONS.md — ADR-007 (IP + server-side counter for free tier)
- src/components/FreeTierBanner.tsx — Static banner (currently hardcoded)
- src/app/api/explain/route.ts — API endpoint to enforce limits
- src/app/page.tsx — State management

## Dependencies
- Plan 5.2 must be complete (BYOK key flow working)

## Tasks

<task type="auto">
  <name>Implement IP-based usage tracking and limit enforcement</name>
  <files>
    - src/lib/usage-tracker.ts (create)
    - src/app/api/explain/route.ts (modify — add limit enforcement)
    - src/app/api/usage/route.ts (create — GET endpoint for current usage)
  </files>
  <action>
    1. Create `src/lib/usage-tracker.ts`:
       - Use an in-memory Map for v1 (acceptable for portfolio project):
         ```ts
         const usageMap = new Map<string, { count: number; date: string }>();
         ```
       - Export functions:
         - `getUsage(ip: string): { used: number; limit: number; remaining: number }`
         - `incrementUsage(ip: string): { used: number; remaining: number }`
         - `isLimitReached(ip: string): boolean`
       - Daily limit: 10 explanations per IP
       - Reset counter when date changes (new day = fresh count)
       - The IP is extracted from request headers in the API route

    2. Update `src/app/api/explain/route.ts`:
       - Before calling Gemini, check if request has a BYOK key:
         - If YES: skip limit check (BYOK users have unlimited use)
         - If NO (free tier): check `isLimitReached(ip)`
           - If limit reached: return 429 with message "Free tier limit reached (10/day). Add your own API key in Settings for unlimited use."
           - If under limit: `incrementUsage(ip)` then proceed
       - Extract IP from `request.headers.get("x-forwarded-for")` or `request.headers.get("x-real-ip")` or fallback to "unknown"

    3. Create `src/app/api/usage/route.ts`:
       - GET endpoint that returns current usage for the requester's IP
       - Returns `{ used: number, limit: number, remaining: number }`
       - This is called by FreeTierBanner on mount to show real counter
  </action>
  <verify>npm run build 2>&1 | Select-String -Pattern "Compiled|error|✓|failed" -CaseSensitive:$false</verify>
  <done>
    - Free tier limited to 10 explanations per IP per day
    - BYOK users bypass limits
    - /api/usage returns current usage
    - 429 returned when limit exceeded with clear message
  </done>
</task>

<task type="auto">
  <name>Wire FreeTierBanner to real usage data</name>
  <files>
    - src/components/FreeTierBanner.tsx (modify — fetch real usage)
    - src/app/page.tsx (modify — pass BYOK status to banner)
  </files>
  <action>
    1. Update `FreeTierBanner.tsx`:
       - On mount, fetch `/api/usage` to get current usage
       - Display real `used / limit` in the counter (e.g., "3/10 USED")
       - Progress bar width = `(used / limit) * 100%`
       - Color shift: green (0-50%), yellow (50-80%), red (80-100%)
       - If BYOK key is configured:
         - Hide the banner entirely OR show "BYOK Mode — Unlimited" with different styling
       - After each explanation, refetch usage to update banner

    2. Update `page.tsx`:
       - Pass BYOK status (has key or not) to FreeTierBanner
       - After explain completes, trigger banner refresh
  </action>
  <verify>npm run build 2>&1 | Select-String -Pattern "Compiled|error|✓|failed" -CaseSensitive:$false</verify>
  <done>
    - FreeTierBanner shows real usage count
    - Progress bar reflects actual usage
    - Banner hidden/changed when BYOK key is set
    - Counter updates after each explanation
  </done>
</task>

## Success Criteria
- [ ] Free tier enforces 10 explanations/IP/day
- [ ] BYOK users bypass free tier limits
- [ ] /api/usage returns real usage data
- [ ] FreeTierBanner shows live usage counter
- [ ] Progress bar color shifts based on usage level
- [ ] Banner changes when BYOK key is configured
- [ ] `npm run build` succeeds
