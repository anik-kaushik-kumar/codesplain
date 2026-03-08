"use client";

import { useState, useEffect, useCallback } from "react";
import { saveApiKey, loadApiKey, removeApiKey, hasStoredKey } from "@/lib/crypto";

type ConnectionStatus = "not_configured" | "validating" | "connected" | "invalid";
type ProviderTab = "gemini" | "openai" | "anthropic";

const PROVIDERS: { id: ProviderTab; name: string; icon: string; placeholder: string }[] = [
    { id: "gemini", name: "Google Gemini", icon: "✦", placeholder: "Enter your Gemini API key..." },
    { id: "openai", name: "OpenAI", icon: "◎", placeholder: "Enter your OpenAI API key (sk-...)..." },
    { id: "anthropic", name: "Anthropic", icon: "◈", placeholder: "Enter your Anthropic API key (sk-ant-...)..." },
];

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onKeyChange: (provider: ProviderTab, hasKey: boolean, key: string | null) => void;
}

export default function SettingsModal({ isOpen, onClose, onKeyChange }: SettingsModalProps) {
    const [activeTab, setActiveTab] = useState<ProviderTab>("gemini");
    const [keys, setKeys] = useState<Record<ProviderTab, string>>({ gemini: "", openai: "", anthropic: "" });
    const [showKey, setShowKey] = useState(false);
    const [statuses, setStatuses] = useState<Record<ProviderTab, ConnectionStatus>>({
        gemini: "not_configured",
        openai: "not_configured",
        anthropic: "not_configured",
    });

    // Load existing keys on open
    useEffect(() => {
        if (!isOpen) return;
        (async () => {
            for (const p of PROVIDERS) {
                if (hasStoredKey(p.id)) {
                    const key = await loadApiKey(p.id);
                    if (key) {
                        setKeys((prev) => ({ ...prev, [p.id]: key }));
                        setStatuses((prev) => ({ ...prev, [p.id]: "connected" }));
                    }
                } else {
                    setKeys((prev) => ({ ...prev, [p.id]: "" }));
                    setStatuses((prev) => ({ ...prev, [p.id]: "not_configured" }));
                }
            }
        })();
    }, [isOpen]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        if (isOpen) window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [isOpen, onClose]);

    const handleSave = useCallback(async (provider: ProviderTab) => {
        const key = keys[provider].trim();
        if (!key) return;
        setStatuses((prev) => ({ ...prev, [provider]: "validating" }));

        try {
            const res = await fetch("/api/models", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ apiKey: key, provider }),
            });
            if (res.ok) {
                await saveApiKey(provider, key);
                setStatuses((prev) => ({ ...prev, [provider]: "connected" }));
                onKeyChange(provider, true, key);
            } else {
                setStatuses((prev) => ({ ...prev, [provider]: "invalid" }));
            }
        } catch {
            setStatuses((prev) => ({ ...prev, [provider]: "invalid" }));
        }
    }, [keys, onKeyChange]);

    const handleRemove = useCallback(async (provider: ProviderTab) => {
        await removeApiKey(provider);
        setKeys((prev) => ({ ...prev, [provider]: "" }));
        setStatuses((prev) => ({ ...prev, [provider]: "not_configured" }));
        onKeyChange(provider, false, null);
    }, [onKeyChange]);

    if (!isOpen) return null;

    const statusConfig = {
        not_configured: { color: "bg-brand-muted", text: "Not configured" },
        validating: { color: "bg-yellow-400 animate-pulse", text: "Validating..." },
        connected: { color: "bg-green-400", text: "Connected" },
        invalid: { color: "bg-red-400", text: "Invalid key" },
    };

    const currentProvider = PROVIDERS.find((p) => p.id === activeTab)!;
    const { color, text } = statusConfig[statuses[activeTab]];

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-[slideIn_0.2s_ease-out]"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="bg-brand-card border border-brand-border rounded-xl w-full max-w-lg mx-4 shadow-2xl max-h-[85vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-brand-border">
                    <h2 className="text-lg font-semibold text-white">AI Providers</h2>
                    <button onClick={onClose} className="text-brand-muted hover:text-white transition-colors p-1 cursor-pointer">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* Provider Tabs */}
                <div className="flex border-b border-brand-border">
                    {PROVIDERS.map((p) => (
                        <button
                            key={p.id}
                            onClick={() => { setActiveTab(p.id); setShowKey(false); }}
                            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${activeTab === p.id
                                    ? "text-white border-b-2 border-brand-primary bg-brand-primary/5"
                                    : "text-brand-muted hover:text-white"
                                }`}
                        >
                            <span>{p.icon}</span>
                            <span>{p.name}</span>
                            {statuses[p.id] === "connected" && (
                                <div className="w-1.5 h-1.5 rounded-full bg-green-400 ml-1" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="px-6 py-5 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-lg">{currentProvider.icon}</span>
                            <span className="text-white font-medium">{currentProvider.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${color}`} />
                            <span className="text-xs text-brand-muted">{text}</span>
                        </div>
                    </div>

                    {/* API Key Input */}
                    <div className="relative">
                        <input
                            type={showKey ? "text" : "password"}
                            value={keys[activeTab]}
                            onChange={(e) => setKeys((prev) => ({ ...prev, [activeTab]: e.target.value }))}
                            placeholder={currentProvider.placeholder}
                            className="w-full bg-brand-bg border border-brand-border rounded-lg px-3 py-2.5 text-sm text-white placeholder-brand-muted focus:border-brand-primary focus:outline-none transition-colors pr-10"
                        />
                        <button
                            onClick={() => setShowKey(!showKey)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-white transition-colors cursor-pointer"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                {showKey ? (
                                    <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><line x1="1" y1="1" x2="23" y2="23" /></>
                                ) : (
                                    <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>
                                )}
                            </svg>
                        </button>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleSave(activeTab)}
                            disabled={!keys[activeTab].trim() || statuses[activeTab] === "validating"}
                            className="flex-1 bg-brand-primary hover:bg-brand-primary-hover disabled:bg-brand-primary/30 disabled:cursor-not-allowed text-white text-sm font-medium py-2 rounded-lg transition-colors cursor-pointer"
                        >
                            {statuses[activeTab] === "validating" ? "Validating..." : "Save Key"}
                        </button>
                        {statuses[activeTab] === "connected" && (
                            <button
                                onClick={() => handleRemove(activeTab)}
                                className="px-4 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-medium py-2 rounded-lg transition-colors cursor-pointer"
                            >
                                Remove
                            </button>
                        )}
                    </div>

                    {statuses[activeTab] === "invalid" && (
                        <p className="text-xs text-red-400">
                            Could not validate this API key. Please check and try again.
                        </p>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-3 border-t border-brand-border">
                    <p className="text-xs text-brand-muted text-center">
                        🔒 API keys are encrypted and stored locally. They are never sent to our servers.
                    </p>
                </div>
            </div>
        </div>
    );
}
