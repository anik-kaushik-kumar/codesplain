"use client";

import { DIFFICULTIES, type Difficulty } from "@/lib/languages";

interface DifficultySelectorProps {
    value: Difficulty;
    onChange: (difficulty: Difficulty) => void;
}

export default function DifficultySelector({
    value,
    onChange,
}: DifficultySelectorProps) {
    return (
        <div className="flex items-center rounded-lg border border-brand-border overflow-hidden">
            {DIFFICULTIES.map((d) => (
                <button
                    key={d.id}
                    onClick={() => onChange(d.id)}
                    className={`px-3 py-1.5 text-xs font-medium transition-colors ${d.id === value
                            ? "bg-brand-primary text-white"
                            : "bg-brand-card text-brand-muted hover:text-white"
                        }`}
                >
                    {d.label}
                </button>
            ))}
        </div>
    );
}
