---
phase: 5
plan: 1
wave: 1
---

# Plan 5.1: Settings Modal & Encrypted BYOK Key Storage

## Objective
Build the Settings modal with BYOK key input, encrypted localStorage storage, and connection status indicator. Keys must NEVER be stored or logged server-side (ADR-006).

## Context
- .gsd/SPEC.md — BYOK security constraints
- .gsd/DECISIONS.md — ADR-006 (BYOK security), ADR-004 (Gemini free tier)
- src/components/Navbar.tsx — Settings button trigger
- src/app/page.tsx — State management hub

## Tasks

<task type="auto">
  <name>Create encrypted key storage utilities</name>
  <files>
    - src/lib/crypto.ts (create)
  </files>
  <action>
    1. Create `src/lib/crypto.ts` with functions for encrypting/decrypting API keys in localStorage:
       - Use the Web Crypto API (`window.crypto.subtle`) for AES-GCM encryption
       - Generate a device-specific encryption key on first use via `crypto.subtle.generateKey()`:
         - Store the raw CryptoKey in IndexedDB (not localStorage — more secure)
         - If key doesn't exist in IndexedDB, generate a new one
       - Export functions:
         ```ts
         async function encryptKey(plainKey: string): Promise<string>
         // Returns base64-encoded { iv, ciphertext }
         
         async function decryptKey(encrypted: string): Promise<string>
         // Decrypts base64 back to plaintext key
         
         async function saveApiKey(provider: string, apiKey: string): Promise<void>
         // Encrypts and stores in localStorage under `codesplain_key_{provider}`
         
         async function loadApiKey(provider: string): Promise<string | null>
         // Loads and decrypts from localStorage
         
         async function removeApiKey(provider: string): Promise<void>
         // Removes key from localStorage
         ```
    2. NEVER log keys to console
    3. NEVER send keys to any analytics or error tracking
  </action>
  <verify>npm run build 2>&1 | Select-String -Pattern "Compiled|error|✓|failed" -CaseSensitive:$false</verify>
  <done>Crypto utilities compile and handle encrypt/decrypt/save/load/remove flows</done>
</task>

<task type="auto">
  <name>Build Settings modal with BYOK key input</name>
  <files>
    - src/components/SettingsModal.tsx (create)
    - src/components/Navbar.tsx (modify — wire Settings button)
    - src/app/page.tsx (modify — add modal state)
  </files>
  <action>
    1. Create `src/components/SettingsModal.tsx`:
       - Full-screen overlay modal with backdrop blur
       - Dark card design matching brand theme
       - Header: "AI Providers" with close (X) button
       - Provider card for Gemini:
         - Provider name + logo area
         - API key input field (type="password" with show/hide toggle)
         - "Save Key" button → calls `saveApiKey("gemini", key)`
         - "Remove Key" button (shown when key exists) → calls `removeApiKey("gemini")`
         - Connection status indicator:
           - 🟢 "Connected" — key saved and validated
           - 🟡 "Validating..." — checking key
           - 🔴 "Invalid key" — validation failed
           - ⚪ "Not configured" — no key saved
       - "Available Models" section (empty for now — Plan 5.2 will wire this)
       - Footer note: "API keys are encrypted and stored locally. They are never sent to our servers."
    2. On mount, check if a key exists via `loadApiKey("gemini")` and show status
    3. Wire modal open/close:
       - Navbar "Settings" button opens modal
       - Modal state managed in page.tsx
       - Close on backdrop click or X button
       - Close on Escape key
    4. Style to match the premium dark theme with smooth entrance animation
  </action>
  <verify>npm run build 2>&1 | Select-String -Pattern "Compiled|error|✓|failed" -CaseSensitive:$false</verify>
  <done>
    - Settings modal opens from Navbar
    - BYOK key can be entered, saved (encrypted), and removed
    - Connection status indicator works
    - Modal closes on backdrop/X/Escape
  </done>
</task>

## Success Criteria
- [ ] API keys encrypted with AES-GCM before localStorage storage
- [ ] Keys never logged or sent server-side
- [ ] Settings modal opens/closes properly
- [ ] BYOK key can be saved, loaded, and removed
- [ ] `npm run build` succeeds
