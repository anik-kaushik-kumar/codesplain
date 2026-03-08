"use client";

import { useState, useRef, useEffect } from "react";
import { SUPPORTED_LANGUAGES, type LanguageId } from "@/lib/languages";

interface LanguageSelectorProps {
    value: LanguageId;
    onChange: (language: LanguageId) => void;
}

export default function LanguageSelector({
    value,
    onChange,
}: LanguageSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const current = SUPPORTED_LANGUAGES.find((l) => l.id === value);

    // Close on click outside
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 bg-brand-card border border-brand-border rounded-md px-3 py-1.5 text-sm text-white cursor-pointer hover:border-brand-muted transition-colors"
            >
                <span>{current?.label ?? value}</span>
                <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className={`text-brand-muted transition-transform ${isOpen ? "rotate-180" : ""}`}
                >
                    <polyline points="6 9 12 15 18 9" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-1 w-44 bg-brand-card border border-brand-border rounded-lg shadow-xl z-50 py-1 overflow-hidden">
                    {SUPPORTED_LANGUAGES.map((lang) => (
                        <button
                            key={lang.id}
                            onClick={() => {
                                onChange(lang.id);
                                setIsOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2 text-sm transition-colors ${lang.id === value
                                    ? "text-white bg-brand-primary/20"
                                    : "text-brand-text hover:text-white hover:bg-brand-border/30"
                                }`}
                        >
                            {lang.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
