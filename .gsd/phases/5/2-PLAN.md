---
phase: 5
plan: 2
wave: 2
---

# Plan 5.2: BYOK Model Discovery & Provider Selection

## Objective
When a user saves a BYOK key, scan the Gemini API for available models on that key and display them in the Settings modal. The user should be able to select which model to use for explanations. The AI provider dropdown on the main page should reflect the selected model.

## Context
- .gsd/DECISIONS.md — ADR-006 (BYOK keys sent client → API only)
- src/components/SettingsModal.tsx — Settings modal from Plan 5.1
- src/lib/ai/gemini-provider.ts — Provider that calls Gemini API
- Research: Gemini JS SDK lacks listModels(), use direct REST call to
  `https://generativelanguage.googleapis.com/v1beta/models?key=<KEY>`

## Dependencies
- Plan 5.1 must be complete (Settings modal + encrypted key storage)

## Tasks

<task type="auto">
  <name>Create model discovery API route</name>
  <files>
    - src/app/api/models/route.ts (create)
    - src/lib/ai/types.ts (modify — add model types)
  </files>
  <action>
    1. Add model types to `src/lib/ai/types.ts`:
       ```ts
       export interface GeminiModel {
         id: string;          // e.g. "models/gemini-2.0-flash"
         displayName: string; // e.g. "Gemini 2.0 Flash"
         description: string;
         supportedMethods: string[]; // e.g. ["generateContent", "streamGenerateContent"]
       }
       ```

    2. Create `src/app/api/models/route.ts`:
       - Export `async function POST(request: Request)`
       - Accept `{ apiKey: string }` in request body
       - Make a GET request to `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
       - Parse the response and filter to only models that support `generateContent`
       - Map to `GeminiModel[]` array
       - Return the list as JSON
       - Error handling:
         - Invalid key → 401
         - Network error → 500
       - **SECURITY**: The API key is sent from client → this API route → Google only
         - Do NOT log the key
         - Do NOT store the key
         - The key is used for this one request and discarded
  </action>
  <verify>npm run build 2>&1 | Select-String -Pattern "Compiled|error|✓|failed" -CaseSensitive:$false</verify>
  <done>
    - /api/models endpoint returns filtered list of available Gemini models
    - Only models supporting generateContent are included
    - API key not logged or stored
  </done>
</task>

<task type="auto">
  <name>Wire model discovery to Settings modal and provider selector</name>
  <files>
    - src/components/SettingsModal.tsx (modify — add model list)
    - src/components/ExplanationPanel.tsx (modify — show selected model)
    - src/app/page.tsx (modify — manage selected model state)
    - src/lib/ai/gemini-provider.ts (modify — use selected model)
    - src/app/api/explain/route.ts (modify — accept model parameter)
  </files>
  <action>
    1. Update `SettingsModal.tsx`:
       - After saving a BYOK key, automatically call `/api/models` with the key
       - Display "Scanning available models..." with spinner during the call
       - Show the returned models as a selectable list:
         - Each model row: radio button + model display name + description
         - Highlight the currently selected model
         - Default: first model in the list (usually gemini-2.0-flash)
       - If no models returned (invalid key), show error
       - Store the selected model ID in localStorage: `codesplain_selected_model`
       - When removing a BYOK key, clear the model selection and revert to free tier

    2. Update `page.tsx`:
       - Add `selectedModel` state (default: "gemini-2.0-flash")
       - Add `byokKey` state (loaded from encrypted localStorage on mount)
       - Pass these to ExplanationPanel and the explain function

    3. Update `ExplanationPanel.tsx`:
       - AI Provider dropdown should show:
         - If no BYOK key: "Gemini 3.0 (Google)" with FREE badge (platform key)
         - If BYOK key: selected model display name with "BYOK" badge

    4. Update `gemini-provider.ts`:
       - Accept `model` parameter in generateExplanation
       - Use the specified model instead of hardcoded "gemini-2.0-flash"

    5. Update `api/explain/route.ts`:
       - Accept optional `model` field in request body
       - Pass to generateExplanation
  </action>
  <verify>npm run build 2>&1 | Select-String -Pattern "Compiled|error|✓|failed" -CaseSensitive:$false</verify>
  <done>
    - Saving a BYOK key triggers model scan
    - Available models displayed in settings
    - User can select which model to use
    - Selected model reflected in provider dropdown
    - Explain requests use the selected model
  </done>
</task>

## Success Criteria
- [ ] /api/models returns available models for a given key
- [ ] Models list shown in Settings after saving key
- [ ] User can select a model from the discovered list
- [ ] AI Provider dropdown reflects BYOK model selection
- [ ] Explain requests use the selected model
- [ ] `npm run build` succeeds
