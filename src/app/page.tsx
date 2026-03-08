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

interface ByokModel {
  id: string;
  displayName: string;
  available: boolean;
}

export default function Home() {
  const [language, setLanguage] = useState<LanguageId>("typescript");
  const [difficulty, setDifficulty] = useState<Difficulty>("beginner");
  const [code, setCode] = useState(DEFAULT_CODE);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [hasByokKey, setHasByokKey] = useState(false);
  const [byokKey, setByokKey] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState("gemini-2.0-flash");
  const [isByokMode, setIsByokMode] = useState(false);
  const [byokModels, setByokModels] = useState<ByokModel[]>([]);
  const [shareToast, setShareToast] = useState(false);

  // Fetch BYOK models when key changes
  const fetchByokModels = useCallback(async (key: string) => {
    try {
      const res = await fetch("/api/models", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: key }),
      });
      if (res.ok) {
        const data = await res.json();
        setByokModels(data.models || []);
      }
    } catch {
      setByokModels([]);
    }
  }, []);

  // Load BYOK state + share URL on mount
  useEffect(() => {
    (async () => {
      if (typeof window !== "undefined" && hasStoredKey("gemini")) {
        const key = await loadApiKey("gemini");
        if (key) {
          setHasByokKey(true);
          setByokKey(key);
          fetchByokModels(key);
        }
      }
      const savedModel = localStorage.getItem("codesplain_selected_model");
      const savedByokMode = localStorage.getItem("codesplain_byok_mode");
      if (savedModel) setSelectedModel(savedModel);
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
  }, [fetchByokModels]);

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

  const handleKeyChange = useCallback(
    (hasKey: boolean, key: string | null) => {
      setHasByokKey(hasKey);
      setByokKey(key);
      if (!hasKey) {
        setIsByokMode(false);
        setSelectedModel("gemini-2.0-flash");
        setByokModels([]);
        localStorage.removeItem("codesplain_byok_mode");
        localStorage.removeItem("codesplain_selected_model");
      } else if (key) {
        fetchByokModels(key);
      }
    },
    [fetchByokModels]
  );

  const handleSelectModel = useCallback(
    (modelId: string, isByok: boolean) => {
      setSelectedModel(modelId);
      setIsByokMode(isByok);
      localStorage.setItem("codesplain_selected_model", modelId);
      localStorage.setItem("codesplain_byok_mode", String(isByok));
    },
    []
  );

  const { explain, sections, isLoading, error, activeSection } = useExplain();

  const handleExplain = () => {
    if (code.trim()) {
      // Only pass BYOK key if in BYOK mode
      const keyToUse = isByokMode ? byokKey : null;
      const modelToUse = isByokMode ? selectedModel : "gemini-2.0-flash";
      explain(code, language, difficulty, keyToUse, modelToUse);
    }
  };

  const handleShare = () => {
    const url = generateShareUrl({ code, language, difficulty });
    navigator.clipboard.writeText(url).then(() => {
      setShareToast(true);
      setTimeout(() => setShareToast(false), 2000);
    });
  };

  const hasExplanation = Object.values(sections).some(
    (s) => s && s.length > 0
  );

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar onSettingsClick={() => setSettingsOpen(true)} />
      <FreeTierBanner hasByokKey={isByokMode} />

      {/* Two-panel layout */}
      <div className="flex flex-1 min-h-0">
        {/* Left: Code Editor */}
        <div className="flex-[3] border-r border-brand-border">
          <EditorPanel
            language={language}
            onLanguageChange={setLanguage}
            code={code}
            onCodeChange={setCode}
          />
        </div>

        {/* Right: Explanation Panel */}
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

      {/* Settings Modal */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onKeyChange={handleKeyChange}
      />
    </div>
  );
}
