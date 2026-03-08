"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import FreeTierBanner from "@/components/FreeTierBanner";
import EditorPanel from "@/components/EditorPanel";
import ExplanationPanel from "@/components/ExplanationPanel";
import DifficultySelector from "@/components/DifficultySelector";
import type { LanguageId, Difficulty } from "@/lib/languages";

export default function Home() {
  const [language, setLanguage] = useState<LanguageId>("typescript");
  const [difficulty, setDifficulty] = useState<Difficulty>("beginner");

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar />
      <FreeTierBanner />

      {/* Two-panel layout */}
      <div className="flex flex-1 min-h-0">
        {/* Left: Code Editor */}
        <div className="flex-[3] border-r border-brand-border">
          <EditorPanel language={language} onLanguageChange={setLanguage} />
        </div>

        {/* Right: Explanation Panel */}
        <div className="flex-[2] bg-brand-bg flex flex-col">
          {/* Difficulty selector at top of right panel */}
          <div className="px-4 pt-4 pb-2">
            <label className="text-xs font-medium text-brand-muted uppercase tracking-wider block mb-2">
              Difficulty Level
            </label>
            <DifficultySelector
              value={difficulty}
              onChange={setDifficulty}
            />
          </div>
          <div className="flex-1 min-h-0">
            <ExplanationPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
