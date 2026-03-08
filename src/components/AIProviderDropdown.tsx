"use client";

import { useState, useRef, useEffect } from "react";

interface ModelOption {
    id: string;
    displayName: string;
    available: boolean;
}

interface AIProviderDropdownProps {
    hasByokKey: boolean;
    selectedModel: string;
    byokModels: ModelOption[];
    onSelectModel: (modelId: string, isByok: boolean) => void;
    onOpenSettings: () => void;
}

const FREE_MODEL = {
    id: "gemini-2.0-flash",
    displayName: "Gemini 2.0 Flash",
};

export default function AIProviderDropdown({
    hasByokKey,
    selectedModel,
    byokModels,
    onSelectModel,
    onOpenSettings,
}: AIProviderDropdownProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    // Determine current display name
    const isByokMode =
        hasByokKey &&
        selectedModel !== FREE_MODEL.id &&
        byokModels.some((m) => m.id === selectedModel);

    const currentDisplayName = isByokMode
        ? byokModels.find((m) => m.id === selectedModel)?.displayName ||
        selectedModel
        : "Gemini 2.0 Flash (Free)";

    // Close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <div ref={ref} className="relative">
            {/* Trigger */}
            <button
                onClick={() => setOpen(!open)}
                className="w-full bg-brand-card border border-brand-border rounded-lg px-3 py-2.5 flex items-center justify-between cursor-pointer hover:border-brand-muted transition-colors"
            >
                <span className="text-sm text-white truncate">
                    {currentDisplayName}
                </span>
                <div className="flex items-center gap-2 shrink-0">
                    <span
                        className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${isByokMode
                                ? "bg-brand-primary/20 text-brand-link"
                                : "bg-yellow-500/20 text-yellow-400"
                            }`}
                    >
                        {isByokMode ? "BYOK" : "FREE"}
                    </span>
                    <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className={`text-brand-muted transition-transform ${open ? "rotate-180" : ""}`}
                    >
                        <polyline points="6 9 12 15 18 9" />
                    </svg>
                </div>
            </button>

            {/* Dropdown */}
            {open && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-brand-card border border-brand-border rounded-lg shadow-xl z-50 overflow-hidden animate-[slideIn_0.15s_ease-out]">
                    {/* Free Tier option */}
                    <div className="px-1.5 py-1.5 border-b border-brand-border">
                        <button
                            onClick={() => {
                                onSelectModel(FREE_MODEL.id, false);
                                setOpen(false);
                            }}
                            className={`w-full text-left px-2.5 py-2 rounded-md transition-colors cursor-pointer flex items-center justify-between ${!isByokMode
                                    ? "bg-brand-primary/10 text-white"
                                    : "text-brand-muted hover:text-white hover:bg-white/5"
                                }`}
                        >
                            <div>
                                <div className="text-sm">{FREE_MODEL.displayName}</div>
                                <div className="text-[11px] text-brand-muted">
                                    Free tier · 10/day limit
                                </div>
                            </div>
                            <span className="text-[10px] font-semibold bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded">
                                FREE
                            </span>
                        </button>
                    </div>

                    {/* BYOK Models */}
                    {hasByokKey && byokModels.length > 0 && (
                        <div className="px-1.5 py-1.5">
                            <div className="px-2.5 py-1 text-[10px] font-medium text-brand-muted uppercase tracking-wider">
                                Your API Key Models
                            </div>
                            {byokModels.map((model) => (
                                <button
                                    key={model.id}
                                    onClick={() => {
                                        if (!model.available) return;
                                        onSelectModel(model.id, true);
                                        setOpen(false);
                                    }}
                                    disabled={!model.available}
                                    className={`w-full text-left px-2.5 py-2 rounded-md transition-colors flex items-center justify-between ${!model.available
                                            ? "opacity-40 cursor-not-allowed"
                                            : selectedModel === model.id && isByokMode
                                                ? "bg-brand-primary/10 text-white cursor-pointer"
                                                : "text-brand-muted hover:text-white hover:bg-white/5 cursor-pointer"
                                        }`}
                                >
                                    <div className="truncate">
                                        <div className="text-sm">{model.displayName}</div>
                                        {!model.available && (
                                            <div className="text-[11px] text-red-400">
                                                Quota exhausted
                                            </div>
                                        )}
                                    </div>
                                    {model.available ? (
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />
                                    ) : (
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                                    )}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Add API Key prompt */}
                    {!hasByokKey && (
                        <div className="px-1.5 py-1.5">
                            <button
                                onClick={() => {
                                    onOpenSettings();
                                    setOpen(false);
                                }}
                                className="w-full text-left px-2.5 py-2 rounded-md text-brand-link hover:bg-white/5 transition-colors cursor-pointer text-sm"
                            >
                                + Add your API key for more models
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
