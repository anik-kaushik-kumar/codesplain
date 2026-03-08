"use client";

import { useState, useRef, useEffect } from "react";
import type { ProviderId } from "@/lib/ai/types";

// ─── Provider Icons (white, ~14px) ───

function GeminiIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" fill="currentColor" />
        </svg>
    );
}

function OpenAIIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" />
        </svg>
    );
}

function ClaudeIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.308 3.616L12.004 21.5 9.392 10.608 3.5 8.288l13.808-4.672zM20.5 6.7L10.9 16.3l3.7 4.2 5.9-13.8z" />
        </svg>
    );
}

export function ProviderIcon({ provider }: { provider: ProviderId }) {
    switch (provider) {
        case "openai": return <OpenAIIcon />;
        case "anthropic": return <ClaudeIcon />;
        default: return <GeminiIcon />;
    }
}

// ─── Model Option Type ───

interface ModelOption {
    id: string;
    displayName: string;
    available: boolean;
    provider: ProviderId;
}

interface AIProviderDropdownProps {
    hasByokKey: boolean;
    selectedModel: string;
    selectedProvider: ProviderId;
    byokModels: ModelOption[];
    onSelectModel: (modelId: string, provider: ProviderId, isByok: boolean) => void;
    onOpenSettings: () => void;
}

const FREE_MODEL = {
    id: "gemini-2.0-flash",
    displayName: "Gemini 2.0 Flash",
    provider: "gemini" as ProviderId,
};

export default function AIProviderDropdown({
    hasByokKey,
    selectedModel,
    selectedProvider,
    byokModels,
    onSelectModel,
    onOpenSettings,
}: AIProviderDropdownProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const isByokMode = selectedModel !== FREE_MODEL.id || selectedProvider !== "gemini";
    const isFreeTier = !isByokMode;

    const currentDisplayName = isFreeTier
        ? "Gemini 2.0 Flash (Free)"
        : byokModels.find((m) => m.id === selectedModel)?.displayName || selectedModel;

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    // Group BYOK models by provider
    const modelsByProvider = byokModels.reduce<Record<string, ModelOption[]>>((acc, m) => {
        (acc[m.provider] = acc[m.provider] || []).push(m);
        return acc;
    }, {});

    const providerLabels: Record<string, { name: string; Icon: typeof GeminiIcon }> = {
        gemini: { name: "Gemini (BYOK)", Icon: GeminiIcon },
        openai: { name: "OpenAI", Icon: OpenAIIcon },
        anthropic: { name: "Anthropic", Icon: ClaudeIcon },
    };

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="w-full bg-brand-card border border-brand-border rounded-lg px-3 py-2.5 flex items-center justify-between cursor-pointer hover:border-brand-muted transition-colors"
            >
                <div className="flex items-center gap-2 truncate text-white">
                    <ProviderIcon provider={selectedProvider} />
                    <span className="text-sm">{currentDisplayName}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${isFreeTier ? "bg-yellow-500/20 text-yellow-400" : "bg-brand-primary/20 text-brand-link"
                        }`}>
                        {isFreeTier ? "FREE" : "BYOK"}
                    </span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        className={`text-brand-muted transition-transform ${open ? "rotate-180" : ""}`}>
                        <polyline points="6 9 12 15 18 9" />
                    </svg>
                </div>
            </button>

            {open && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-brand-card border border-brand-border rounded-lg shadow-xl z-50 overflow-hidden animate-[slideIn_0.15s_ease-out] max-h-[50vh] overflow-y-auto">
                    {/* Free Tier */}
                    <div className="px-1.5 py-1.5 border-b border-brand-border">
                        <button
                            onClick={() => { onSelectModel(FREE_MODEL.id, "gemini", false); setOpen(false); }}
                            className={`w-full text-left px-2.5 py-2 rounded-md transition-colors cursor-pointer flex items-center justify-between ${isFreeTier ? "bg-brand-primary/10 text-white" : "text-brand-muted hover:text-white hover:bg-white/5"
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                <GeminiIcon />
                                <div>
                                    <div className="text-sm">{FREE_MODEL.displayName}</div>
                                    <div className="text-[11px] text-brand-muted">Free tier · 10/day limit</div>
                                </div>
                            </div>
                            <span className="text-[10px] font-semibold bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded">FREE</span>
                        </button>
                    </div>

                    {/* BYOK Models grouped by provider */}
                    {Object.entries(modelsByProvider).map(([pId, models]) => {
                        const pConfig = providerLabels[pId];
                        if (!pConfig) return null;
                        const { name, Icon } = pConfig;
                        return (
                            <div key={pId} className="px-1.5 py-1.5 border-b border-brand-border last:border-b-0">
                                <div className="px-2.5 py-1 text-[10px] font-medium text-brand-muted uppercase tracking-wider flex items-center gap-1.5">
                                    <Icon />
                                    {name}
                                </div>
                                {models.map((model) => (
                                    <button
                                        key={model.id}
                                        onClick={() => { if (!model.available) return; onSelectModel(model.id, model.provider, true); setOpen(false); }}
                                        disabled={!model.available}
                                        className={`w-full text-left px-2.5 py-2 rounded-md transition-colors flex items-center justify-between ${!model.available ? "opacity-40 cursor-not-allowed"
                                                : selectedModel === model.id && isByokMode ? "bg-brand-primary/10 text-white cursor-pointer"
                                                    : "text-brand-muted hover:text-white hover:bg-white/5 cursor-pointer"
                                            }`}
                                    >
                                        <div className="truncate">
                                            <div className="text-sm">{model.displayName}</div>
                                            {!model.available && <div className="text-[11px] text-red-400">Quota exhausted</div>}
                                        </div>
                                        {model.available
                                            ? <div className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />
                                            : <div className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                                        }
                                    </button>
                                ))}
                            </div>
                        );
                    })}

                    {/* Add API Key prompt */}
                    {!hasByokKey && (
                        <div className="px-1.5 py-1.5">
                            <button
                                onClick={() => { onOpenSettings(); setOpen(false); }}
                                className="w-full text-left px-2.5 py-2 rounded-md text-brand-link hover:bg-white/5 transition-colors cursor-pointer text-sm"
                            >
                                + Add your API keys for more models
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
