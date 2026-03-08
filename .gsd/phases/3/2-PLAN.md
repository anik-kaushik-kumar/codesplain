---
phase: 3
plan: 2
wave: 2
---

# Plan 3.2: Gemini Provider & /api/explain Route

## Objective
Implement the Gemini provider using `@google/generative-ai` and create the `/api/explain` API route that streams structured explanation JSON section-by-section.

## Context
- .gsd/DECISIONS.md — ADR-008 (streaming order), ADR-006 (BYOK keys never stored server-side)
- src/lib/ai/types.ts — Types from Plan 3.1
- src/lib/ai/prompt.ts — Prompt template from Plan 3.1
- .env.local — GEMINI_API_KEY from Plan 3.1 checkpoint

## Dependencies
- Plan 3.1 must be complete (types, prompt, API key in .env.local)

## Tasks

<task type="auto">
  <name>Install Gemini SDK and create provider</name>
  <files>
    - package.json (modify — add @google/generative-ai)
    - src/lib/ai/gemini-provider.ts (create)
  </files>
  <action>
    1. Run `npm install @google/generative-ai`
    2. Create `src/lib/ai/gemini-provider.ts`:
       - Import `GoogleGenerativeAI` from `@google/generative-ai`
       - Export an async function `generateExplanation(request: ExplainRequest)`:
         - Determine the API key:
           - If `request.apiKey` is provided (BYOK), use it
           - Otherwise use `process.env.GEMINI_API_KEY` (platform free tier)
         - Initialize: `new GoogleGenerativeAI(apiKey)`
         - Get model: `genAI.getGenerativeModel({ model: "gemini-2.0-flash" })`
           - Use `gemini-2.0-flash` — fast, good quality, supports structured output
         - Configure with:
           - `generationConfig.responseMimeType = "application/json"`
           - `generationConfig.responseSchema = RESPONSE_SCHEMA`
         - Build prompt using `buildExplanationPrompt()`
         - Call `model.generateContent()` (NOT streaming for now — section-by-section streaming will be simulated)
         - Parse the JSON response into `ExplanationResponse`
         - Return the parsed response
       - Do NOT log API keys
       - Do NOT store API keys
    3. Export a helper function `validateApiKey(apiKey: string): Promise<boolean>`:
       - Make a minimal Gemini API call to verify the key works
       - Return true/false
  </action>
  <verify>npm run build 2>&1 | Select-String -Pattern "Compiled|error|✓|failed" -CaseSensitive:$false</verify>
  <done>
    - Gemini provider function accepts ExplainRequest, returns ExplanationResponse
    - Handles both BYOK and platform keys
    - No keys logged or stored
  </done>
</task>

<task type="auto">
  <name>Create /api/explain API route with streaming</name>
  <files>
    - src/app/api/explain/route.ts (create)
  </files>
  <action>
    1. Create Next.js App Router API route at `src/app/api/explain/route.ts`:
       - Export `async function POST(request: Request)`
       - Parse the JSON body as ExplainRequest
       - Validate required fields (code, language, difficulty)
       - Call `generateExplanation(request)` to get the full response
       - Stream the response section-by-section using `ReadableStream`:
         ```ts
         const stream = new ReadableStream({
           async start(controller) {
             const response = await generateExplanation(req);
             // Stream each section in order (ADR-008)
             for (const sectionKey of SECTION_ORDER) {
               const chunk: StreamChunk = {
                 section: sectionKey,
                 content: response[sectionKey],
                 done: false,
               };
               controller.enqueue(
                 encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`)
               );
               // Small delay between sections for visual streaming effect
               await new Promise(r => setTimeout(r, 100));
             }
             // Send done signal
             controller.enqueue(
               encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`)
             );
             controller.close();
           }
         });
         ```
       - Return `new Response(stream, { headers: { 'Content-Type': 'text/event-stream', ... } })`
       - Handle errors gracefully:
         - Invalid API key → 401
         - Missing code → 400
         - Gemini API error → 500 with error message
    2. Do NOT implement caching or rate limiting — that's Phase 6
    3. Do NOT implement IP-based free tier tracking — that's Phase 5
  </action>
  <verify>npm run build 2>&1 | Select-String -Pattern "Compiled|error|✓|failed" -CaseSensitive:$false</verify>
  <done>
    - /api/explain endpoint accepts POST with code, language, difficulty
    - Returns SSE stream with sections in order
    - Error handling for invalid key, missing fields
    - Build succeeds
  </done>
</task>

## Success Criteria
- [ ] `npm install @google/generative-ai` succeeds
- [ ] Gemini provider generates structured explanations
- [ ] /api/explain returns SSE stream with sections in fixed order
- [ ] Error responses have proper HTTP status codes
- [ ] `npm run build` succeeds
