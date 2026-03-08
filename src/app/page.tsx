"use client";

import { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import FreeTierBanner from "@/components/FreeTierBanner";
import EditorPanel from "@/components/EditorPanel";
import ExplanationPanel from "@/components/ExplanationPanel";
import DifficultySelector from "@/components/DifficultySelector";
import SettingsModal from "@/components/SettingsModal";
import { useExplain } from "@/hooks/useExplain";
import { DEFAULT_CODE } from "@/lib/monaco-theme";
import { loadApiKey, hasStoredKey } from "@/lib/crypto";
import { decodeShareState, generateShareUrl } from "@/lib/sharing";
import type { LanguageId, Difficulty } from "@/lib/languages";
import type { ProviderId } from "@/lib/ai/types";

interface ByokModel {
  id: string;
  displayName: string;
  available: boolean;
  provider: ProviderId;
}

const PROVIDERS: ProviderId[] = ["gemini", "openai", "anthropic"];

export default function Home() {
  const [language, setLanguage] = useState<LanguageId>("typescript");
  const [difficulty, setDifficulty] = useState<Difficulty>("beginner");
  const [code, setCode] = useState(DEFAULT_CODE);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState("gemini-2.0-flash");
  const [selectedProvider, setSelectedProvider] = useState<ProviderId>("gemini");
  const [isByokMode, setIsByokMode] = useState(false);
  const [byokModels, setByokModels] = useState<ByokModel[]>([]);
  const [providerKeys, setProviderKeys] = useState<Record<ProviderId, string | null>>({
    gemini: null,
    openai: null,
    anthropic: null,
  });
  const [shareToast, setShareToast] = useState(false);

  const hasByokKey = Object.values(providerKeys).some((k) => k !== null);

  // Fetch models for a specific provider key
  const fetchModelsForProvider = useCallback(async (provider: ProviderId, key: string) => {
    try {
      const res = await fetch("/api/models", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: key, provider }),
      });
      if (res.ok) {
        const data = await res.json();
        return (data.models || []) as ByokModel[];
      }
    } catch {
      // ignore
    }
    return [];
  }, []);

  // Load all provider keys + models on mount
  useEffect(() => {
    (async () => {
      const newKeys: Record<ProviderId, string | null> = { gemini: null, openai: null, anthropic: null };
      const allModels: ByokModel[] = [];

      for (const p of PROVIDERS) {
        if (typeof window !== "undefined" && hasStoredKey(p)) {
          const key = await loadApiKey(p);
          if (key) {
            newKeys[p] = key;
            const models = await fetchModelsForProvider(p, key);
            allModels.push(...models);
          }
        }
      }

      setProviderKeys(newKeys);
      setByokModels(allModels);

      // Restore selections
      const savedModel = localStorage.getItem("codesplain_selected_model");
      const savedProvider = localStorage.getItem("codesplain_selected_provider") as ProviderId | null;
      const savedByokMode = localStorage.getItem("codesplain_byok_mode");
      if (savedModel) setSelectedModel(savedModel);
      if (savedProvider) setSelectedProvider(savedProvider);
      if (savedByokMode === "true") setIsByokMode(true);

      // Decode share URL
      const params = new URLSearchParams(window.location.search);
      const shareParam = params.get("s");
      if (shareParam) {
        const state = decodeShareState(shareParam);
        if (state) {
          setCode(state.code);
          setLanguage(state.language as LanguageId);
          setDifficulty(state.difficulty as Difficulty);
          window.history.replaceState({}, "", window.location.pathname);
        }
      }
    })();
  }, [fetchModelsForProvider]);

  // Keyboard shortcut: Ctrl+Enter / Cmd+Enter
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        handleExplain();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  // Settings callback — handles key changes per provider
  const handleKeyChange = useCallback(
    async (provider: ProviderId, hasKey: boolean, key: string | null) => {
      setProviderKeys((prev) => ({ ...prev, [provider]: hasKey ? key : null }));

      if (hasKey && key) {
        const models = await fetchModelsForProvider(provider, key);
        setByokModels((prev) => [
          ...prev.filter((m) => m.provider !== provider),
          ...models,
        ]);
      } else {
        setByokModels((prev) => prev.filter((m) => m.provider !== provider));
        // If removed provider was selected, reset to free tier
        if (selectedProvider === provider && isByokMode) {
          setIsByokMode(false);
          setSelectedModel("gemini-2.0-flash");
          setSelectedProvider("gemini");
          localStorage.removeItem("codesplain_byok_mode");
          localStorage.setItem("codesplain_selected_model", "gemini-2.0-flash");
          localStorage.setItem("codesplain_selected_provider", "gemini");
        }
      }
    },
    [fetchModelsForProvider, selectedProvider, isByokMode]
  );

  const handleSelectModel = useCallback(
    (modelId: string, provider: ProviderId, isByok: boolean) => {
      setSelectedModel(modelId);
      setSelectedProvider(provider);
      setIsByokMode(isByok);
      localStorage.setItem("codesplain_selected_model", modelId);
      localStorage.setItem("codesplain_selected_provider", provider);
      localStorage.setItem("codesplain_byok_mode", String(isByok));
    },
    []
  );

  const { explain, sections, isLoading, error, activeSection } = useExplain();

  const handleExplain = () => {
    if (code.trim()) {
      const keyToUse = isByokMode ? providerKeys[selectedProvider] : null;
      const modelToUse = isByokMode ? selectedModel : "gemini-2.0-flash";
      const providerToUse = isByokMode ? selectedProvider : "gemini";
      explain(code, language, difficulty, keyToUse, modelToUse, providerToUse);
    }
  };

  const handleShare = () => {
    const url = generateShareUrl({ code, language, difficulty });
    navigator.clipboard.writeText(url).then(() => {
      setShareToast(true);
      setTimeout(() => setShareToast(false), 2000);
    });
  };

  const hasExplanation = Object.values(sections).some((s) => s && s.length > 0);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar onSettingsClick={() => setSettingsOpen(true)} />
      <FreeTierBanner hasByokKey={isByokMode} />

      <div className="flex flex-1 min-h-0">
        <div className="flex-[3] border-r border-brand-border">
          <EditorPanel
            language={language}
            onLanguageChange={setLanguage}
            code={code}
            onCodeChange={setCode}
          />
        </div>

        <div className="flex-[2] bg-brand-bg flex flex-col">
          <div className="px-4 pt-4 pb-2">
            <label className="text-xs font-medium text-brand-muted uppercase tracking-wider block mb-2">
              Difficulty Level
            </label>
            <DifficultySelector value={difficulty} onChange={setDifficulty} />
          </div>
          <div className="flex-1 min-h-0">
            <ExplanationPanel
              sections={sections}
              isLoading={isLoading}
              error={error}
              activeSection={activeSection}
              onExplain={handleExplain}
              hasByokKey={hasByokKey}
              selectedModel={selectedModel}
              selectedProvider={selectedProvider}
              byokModels={byokModels}
              onSelectModel={handleSelectModel}
              onOpenSettings={() => setSettingsOpen(true)}
              onShare={handleShare}
              hasExplanation={hasExplanation}
              shareToast={shareToast}
            />
          </div>
        </div>
      </div>

      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onKeyChange={handleKeyChange}
      />
    </div>
  );
}
