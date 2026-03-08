---
phase: 3
plan: 1
wave: 1
---

# Plan 3.1: AI Gateway Types, Prompt Template & API Key Setup

## Objective
Define the type system for the AI explanation engine, create the structured prompt template, and set up the Gemini API key. This is the foundation for the provider layer.

## Context
- .gsd/SPEC.md — 6 explanation sections, difficulty modes, streaming order
- .gsd/DECISIONS.md — ADR-003 (structured JSON prompts), ADR-004 (Gemini free tier), ADR-008 (streaming order)
- src/lib/languages.ts — LanguageId, Difficulty types

## Tasks

<task type="auto">
  <name>Create AI gateway types and interfaces</name>
  <files>
    - src/lib/ai/types.ts (create)
  </files>
  <action>
    1. Create `src/lib/ai/types.ts` with all type definitions:
       ```ts
       // The 6 explanation sections in streaming order (ADR-008)
       export type SectionKey = 
         | "summary"
         | "line_by_line"
         | "concepts"
         | "improvements"
         | "simplified_code"
         | "examples";

       export const SECTION_ORDER: SectionKey[] = [
         "summary",
         "line_by_line",
         "concepts",
         "improvements",
         "simplified_code",
         "examples",
       ];

       export interface ExplanationSection {
         key: SectionKey;
         title: string;
         content: string;
       }

       export interface ExplanationResponse {
         summary: string;
         line_by_line: string;
         concepts: string;
         improvements: string;
         simplified_code: string;
         examples: string;
       }

       export interface ExplainRequest {
         code: string;
         language: string;
         difficulty: "beginner" | "intermediate" | "advanced";
         provider: "gemini";  // only gemini for now
         apiKey?: string;     // BYOK key — only used from client
       }

       export type StreamChunk = {
         section: SectionKey;
         content: string;
         done: boolean;
       };
       ```
    2. Export all types
    3. The types should be shared between client and server
  </action>
  <verify>npm run build 2>&1 | Select-String -Pattern "Compiled|error|✓|failed" -CaseSensitive:$false</verify>
  <done>All AI gateway types defined and importable from @/lib/ai/types</done>
</task>

<task type="auto">
  <name>Create structured prompt template</name>
  <files>
    - src/lib/ai/prompt.ts (create)
  </files>
  <action>
    1. Create `src/lib/ai/prompt.ts` with a function `buildExplanationPrompt(code, language, difficulty)`:
       - Return a system prompt and user prompt pair
       - System prompt sets the AI role as a code explanation expert
       - User prompt includes:
         - The code to explain
         - The detected/selected language
         - The difficulty level with clear guidance:
           - beginner: simple vocabulary, step-by-step, analogies, assume no prior coding knowledge
           - intermediate: standard technical terms, patterns, trade-offs
           - advanced: deep internals, performance, edge cases, best practices
       - Instruct the AI to return a JSON object with exactly 6 keys matching ExplanationResponse
       - Each key's content should be markdown-formatted text
       - Be VERY specific about the format expected for each section:
         - summary: 2-3 sentence overview
         - line_by_line: markdown with line numbers and explanations
         - concepts: bullet list of programming concepts used
         - improvements: numbered list of suggestions with code examples
         - simplified_code: a simpler rewrite of the code
         - examples: sample inputs and outputs demonstrating usage
    2. Also export a `RESPONSE_SCHEMA` object for Gemini's structured output:
       ```ts
       export const RESPONSE_SCHEMA = {
         type: "object",
         properties: {
           summary: { type: "string" },
           line_by_line: { type: "string" },
           concepts: { type: "string" },
           improvements: { type: "string" },
           simplified_code: { type: "string" },
           examples: { type: "string" },
         },
         required: ["summary", "line_by_line", "concepts", "improvements", "simplified_code", "examples"],
       };
       ```
    3. Do NOT hardcode any API keys
  </action>
  <verify>npm run build 2>&1 | Select-String -Pattern "Compiled|error|✓|failed" -CaseSensitive:$false</verify>
  <done>
    - Prompt function generates system + user prompts for all 3 difficulty levels
    - Response schema matches ExplanationResponse type
    - No hardcoded keys
  </done>
</task>

<task type="checkpoint:decision">
  <name>User provides Gemini API key</name>
  <action>
    1. Ask user to paste their Gemini API key
    2. Create `.env.local` with:
       ```
       GEMINI_API_KEY=<user's key>
       ```
    3. Verify `.env.local` is in `.gitignore` (Next.js default includes it)
    4. This key is the platform's free tier key — NEVER exposed to client
  </action>
  <done>.env.local exists with GEMINI_API_KEY set</done>
</task>

## Success Criteria
- [ ] All AI types defined and importable
- [ ] Prompt template generates correct structure for all difficulties
- [ ] `.env.local` has GEMINI_API_KEY (not committed to git)
