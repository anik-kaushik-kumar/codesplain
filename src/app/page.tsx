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

export default function Home() {
  const [language, setLanguage] = useState<LanguageId>("typescript");
  const [difficulty, setDifficulty] = useState<Difficulty>("beginner");
  const [code, setCode] = useState(DEFAULT_CODE);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [hasByokKey, setHasByokKey] = useState(false);
  const [byokKey, setByokKey] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState("gemini-2.0-flash");
  const [shareToast, setShareToast] = useState(false);

  // Load BYOK state + share URL on mount
  useEffect(() => {
    (async () => {
      if (typeof window !== "undefined" && hasStoredKey("gemini")) {
        const key = await loadApiKey("gemini");
        if (key) {
          setHasByokKey(true);
          setByokKey(key);
        }
      }
      const saved = localStorage.getItem("codesplain_selected_model");
      if (saved) setSelectedModel(saved);

      // Decode share URL
      const params = new URLSearchParams(window.location.search);
      const shareParam = params.get("s");
      if (shareParam) {
        const state = decodeShareState(shareParam);
        if (state) {
          setCode(state.code);
          setLanguage(state.language as LanguageId);
          setDifficulty(state.difficulty as Difficulty);
          // Clean URL
          window.history.replaceState({}, "", window.location.pathname);
        }
      }
    })();
  }, []);

  // Keyboard shortcut: Ctrl+Enter / Cmd+Enter to explain
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

  const handleKeyChange = useCallback((hasKey: boolean, key: string | null) => {
    setHasByokKey(hasKey);
    setByokKey(key);
    if (!hasKey) {
      setSelectedModel("gemini-2.0-flash");
    }
    const saved = localStorage.getItem("codesplain_selected_model");
    if (saved) setSelectedModel(saved);
  }, []);

  const { explain, sections, isLoading, error, activeSection } = useExplain();

  const handleExplain = () => {
    if (code.trim()) {
      explain(code, language, difficulty, byokKey, selectedModel);
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
      <FreeTierBanner hasByokKey={hasByokKey} />

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
