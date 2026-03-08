"use client";

import type { SectionKey } from "@/lib/ai/types";
import { SECTION_ORDER } from "@/lib/ai/types";
import ExplanationSection from "@/components/ExplanationSection";

interface ExplanationPanelProps {
    sections: Partial<Record<SectionKey, string>>;
    isLoading: boolean;
    error: string | null;
    activeSection: SectionKey | null;
    onExplain: () => void;
    hasByokKey: boolean;
    selectedModel: string;
    onShare: () => void;
    hasExplanation: boolean;
    shareToast: boolean;
}

const SECTION_CONFIG: {
    key: SectionKey;
    label: string;
    icon: string;
    color: string;
}[] = [
        { key: "summary", label: "Summary", icon: "—", color: "text-blue-400" },
        {
            key: "line_by_line",
            label: "Line-by-line explanation",
            icon: "≡",
            color: "text-purple-400",
        },
        {
            key: "concepts",
            label: "Concepts detected",
            icon: "◉",
            color: "text-green-400",
        },
        {
            key: "improvements",
            label: "Code improvements",
            icon: "✦",
            color: "text-yellow-400",
        },
        {
            key: "simplified_code",
            label: "Simplified version",
            icon: "✧",
            color: "text-cyan-400",
        },
        {
            key: "examples",
            label: "Example inputs/outputs",
            icon: "▫",
            color: "text-orange-400",
        },
    ];

export default function ExplanationPanel({
    sections,
    isLoading,
    error,
    activeSection,
    onExplain,
    hasByokKey,
    selectedModel,
    onShare,
    hasExplanation,
    shareToast,
}: ExplanationPanelProps) {
    const modelDisplayName = hasByokKey
        ? selectedModel.replace("models/", "").split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
        : "Gemini 3.0 (Google)";
    return (
        <div className="flex flex-col h-full">
            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
                {/* AI Provider */}
                <div>
                    <label className="text-xs font-medium text-brand-muted uppercase tracking-wider block mb-2">
                        AI Provider
                    </label>
                    <div className="bg-brand-card border border-brand-border rounded-lg px-3 py-2.5 flex items-center justify-between cursor-pointer hover:border-brand-muted transition-colors">
                        <span className="text-sm text-white">{modelDisplayName}</span>
                        <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${hasByokKey
                                ? "bg-brand-primary/20 text-brand-link"
                                : "bg-yellow-500/20 text-yellow-400"
                                }`}>
                                {hasByokKey ? "BYOK" : "FREE"}
                            </span>
                            <svg
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                className="text-brand-muted"
                            >
                                <polyline points="6 9 12 15 18 9" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Explain Button */}
                <button
                    onClick={onExplain}
                    disabled={isLoading}
                    className={`w-full py-3 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all ${isLoading
                        ? "bg-brand-primary/50 cursor-not-allowed text-white/70"
                        : "bg-brand-primary hover:bg-brand-primary-hover text-white cursor-pointer"
                        }`}
                >
                    {isLoading ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Explaining...
                        </>
                    ) : (
                        <>
                            <span className="text-lg">✦</span>
                            Explain Code
                        </>
                    )}
                </button>

                {/* Keyboard shortcut hint */}
                <p className="text-center text-[11px] text-brand-muted -mt-1">
                    {typeof navigator !== "undefined" && /Mac/i.test(navigator.userAgent) ? "⌘" : "Ctrl"}+Enter
                </p>

                {/* Error */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2.5 text-red-400 text-sm animate-[slideIn_0.3s_ease-out]">
                        {error}
                    </div>
                )}

                {/* Sections — Collapsible Accordions */}
                <div className="space-y-1.5">
                    {SECTION_CONFIG.map(({ key, label, icon, color }, index) => {
                        const content = sections[key];
                        const isActive = activeSection === key && isLoading;
                        const sectionIdx = SECTION_ORDER.indexOf(key);
                        const activeIdx = activeSection
                            ? SECTION_ORDER.indexOf(activeSection)
                            : -1;
                        const isPending = isLoading && !content && sectionIdx > activeIdx;

                        return (
                            <ExplanationSection
                                key={key}
                                sectionKey={key}
                                label={label}
                                icon={icon}
                                color={color}
                                content={content}
                                isActive={isActive}
                                isPending={isPending}
                                index={index}
                            />
                        );
                    })}
                </div>

                {/* Share Button */}
                {hasExplanation && !isLoading && (
                    <button
                        onClick={onShare}
                        className="w-full py-2 rounded-lg border border-brand-border text-brand-muted hover:text-white hover:border-brand-muted text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                            <polyline points="16 6 12 2 8 6" />
                            <line x1="12" y1="2" x2="12" y2="15" />
                        </svg>
                        {shareToast ? "Copied!" : "Share Explanation"}
                    </button>
                )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 border-t border-brand-border flex items-center justify-between text-xs text-brand-muted">
                <div className="flex items-center gap-1.5">
                    <div
                        className={`w-1.5 h-1.5 rounded-full ${isLoading ? "bg-yellow-400 animate-pulse" : "bg-green-400"}`}
                    />
                    {isLoading ? "Processing..." : "AI ready"}
                </div>
                <span>v2.4.0-stable</span>
            </div>
        </div>
    );
}
