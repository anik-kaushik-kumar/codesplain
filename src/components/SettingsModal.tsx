"use client";

import { useState, useEffect, useCallback } from "react";
import { saveApiKey, loadApiKey, removeApiKey, hasStoredKey } from "@/lib/crypto";

type ConnectionStatus = "not_configured" | "validating" | "connected" | "invalid";

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onKeyChange: (hasKey: boolean, key: string | null) => void;
}

export default function SettingsModal({ isOpen, onClose, onKeyChange }: SettingsModalProps) {
    const [apiKey, setApiKey] = useState("");
    const [showKey, setShowKey] = useState(false);
    const [status, setStatus] = useState<ConnectionStatus>("not_configured");
    const [availableModels, setAvailableModels] = useState<{ id: string; displayName: string; description: string }[]>([]);
    const [selectedModel, setSelectedModel] = useState<string>("");
    const [scanningModels, setScanningModels] = useState(false);

    // Load existing key on mount
    useEffect(() => {
        if (!isOpen) return;
        (async () => {
            if (hasStoredKey("gemini")) {
                setStatus("connected");
                const key = await loadApiKey("gemini");
                if (key) {
                    setApiKey(key);
                    // Load models
                    await scanModels(key);
                }
            } else {
                setStatus("not_configured");
                setApiKey("");
                setAvailableModels([]);
            }
            // Load saved model selection
            const saved = localStorage.getItem("codesplain_selected_model");
            if (saved) setSelectedModel(saved);
        })();
    }, [isOpen]);

    // Close on Escape
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [isOpen, onClose]);

    const scanModels = useCallback(async (key: string) => {
        setScanningModels(true);
        try {
            const res = await fetch("/api/models", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ apiKey: key }),
            });
            if (!res.ok) {
                setAvailableModels([]);
                setScanningModels(false);
                return;
            }
            const data = await res.json();
            setAvailableModels(data.models || []);
            // Auto-select first model if none selected
            if (!selectedModel && data.models?.length > 0) {
                const defaultModel = data.models[0].id;
                setSelectedModel(defaultModel);
                localStorage.setItem("codesplain_selected_model", defaultModel);
            }
        } catch {
            setAvailableModels([]);
        }
        setScanningModels(false);
    }, [selectedModel]);

    const handleSave = async () => {
        if (!apiKey.trim()) return;
        setStatus("validating");
        try {
            // Validate by scanning models
            const res = await fetch("/api/models", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ apiKey: apiKey.trim() }),
            });
            if (res.ok) {
                await saveApiKey("gemini", apiKey.trim());
                setStatus("connected");
                onKeyChange(true, apiKey.trim());
                const data = await res.json();
                setAvailableModels(data.models || []);
                if (data.models?.length > 0 && !selectedModel) {
                    const defaultModel = data.models[0].id;
                    setSelectedModel(defaultModel);
                    localStorage.setItem("codesplain_selected_model", defaultModel);
                }
            } else {
                setStatus("invalid");
            }
        } catch {
            setStatus("invalid");
        }
    };

    const handleRemove = async () => {
        await removeApiKey("gemini");
        setApiKey("");
        setStatus("not_configured");
        setAvailableModels([]);
        setSelectedModel("");
        localStorage.removeItem("codesplain_selected_model");
        onKeyChange(false, null);
    };

    const handleModelSelect = (modelId: string) => {
        setSelectedModel(modelId);
        localStorage.setItem("codesplain_selected_model", modelId);
    };

    if (!isOpen) return null;

    const statusConfig = {
        not_configured: { color: "bg-brand-muted", text: "Not configured" },
        validating: { color: "bg-yellow-400 animate-pulse", text: "Validating..." },
        connected: { color: "bg-green-400", text: "Connected" },
        invalid: { color: "bg-red-400", text: "Invalid key" },
    };

    const { color, text } = statusConfig[status];

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-[slideIn_0.2s_ease-out]"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="bg-brand-card border border-brand-border rounded-xl w-full max-w-lg mx-4 shadow-2xl max-h-[85vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-brand-border">
                    <h2 className="text-lg font-semibold text-white">AI Providers</h2>
                    <button
                        onClick={onClose}
                        className="text-brand-muted hover:text-white transition-colors p-1 cursor-pointer"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="px-6 py-5 space-y-5">
                    {/* Gemini Provider */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-lg">✦</span>
                                <span className="text-white font-medium">Google Gemini</span>
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
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                placeholder="Enter your Gemini API key..."
                                className="w-full bg-brand-bg border border-brand-border rounded-lg px-3 py-2.5 text-sm text-white placeholder-brand-muted focus:border-brand-primary focus:outline-none transition-colors pr-10"
                            />
                            <button
                                onClick={() => setShowKey(!showKey)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-white transition-colors cursor-pointer"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    {showKey ? (
                                        <>
                                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                                            <line x1="1" y1="1" x2="23" y2="23" />
                                        </>
                                    ) : (
                                        <>
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                            <circle cx="12" cy="12" r="3" />
                                        </>
                                    )}
                                </svg>
                            </button>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                            <button
                                onClick={handleSave}
                                disabled={!apiKey.trim() || status === "validating"}
                                className="flex-1 bg-brand-primary hover:bg-brand-primary-hover disabled:bg-brand-primary/30 disabled:cursor-not-allowed text-white text-sm font-medium py-2 rounded-lg transition-colors cursor-pointer"
                            >
                                {status === "validating" ? "Validating..." : "Save Key"}
                            </button>
                            {status === "connected" && (
                                <button
                                    onClick={handleRemove}
                                    className="px-4 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-medium py-2 rounded-lg transition-colors cursor-pointer"
                                >
                                    Remove
                                </button>
                            )}
                        </div>

                        {status === "invalid" && (
                            <p className="text-xs text-red-400">
                                Could not validate this API key. Please check and try again.
                            </p>
                        )}
                    </div>

                    {/* Available Models */}
                    {(availableModels.length > 0 || scanningModels) && (
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-medium text-brand-muted uppercase tracking-wider">
                                    Available Models
                                </label>
                                {scanningModels && (
                                    <div className="flex items-center gap-1.5 text-xs text-brand-muted">
                                        <div className="w-3 h-3 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
                                        Scanning...
                                    </div>
                                )}
                            </div>

                            {availableModels.map((model) => (
                                <button
                                    key={model.id}
                                    onClick={() => handleModelSelect(model.id)}
                                    className={`w-full text-left px-3 py-2.5 rounded-lg border transition-all cursor-pointer ${selectedModel === model.id
                                            ? "border-brand-primary bg-brand-primary/10"
                                            : "border-brand-border/50 bg-brand-bg hover:border-brand-border"
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-white">{model.displayName}</span>
                                        {selectedModel === model.id && (
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand-primary">
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                        )}
                                    </div>
                                    <p className="text-xs text-brand-muted mt-0.5 line-clamp-1">{model.description}</p>
                                </button>
                            ))}
                        </div>
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
