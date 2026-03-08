"use client";

import { useState, useEffect } from "react";

interface FreeTierBannerProps {
    hasByokKey: boolean;
}

export default function FreeTierBanner({ hasByokKey }: FreeTierBannerProps) {
    const [used, setUsed] = useState(0);
    const [total] = useState(10);

    useEffect(() => {
        if (hasByokKey) return;
        fetch("/api/usage")
            .then((r) => r.json())
            .then((data) => setUsed(data.used || 0))
            .catch(() => { });
    }, [hasByokKey]);

    if (hasByokKey) {
        return (
            <div className="h-9 bg-brand-primary/5 border-b border-brand-primary/20 flex items-center justify-center px-5 shrink-0">
                <div className="flex items-center gap-2 text-brand-link text-xs font-medium">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                        <polyline points="10 17 15 12 10 7" />
                        <line x1="15" y1="12" x2="3" y2="12" />
                    </svg>
                    <span>BYOK Mode — Unlimited explanations</span>
                </div>
            </div>
        );
    }

    const remaining = total - used;
    const percentage = (used / total) * 100;
    const barColor =
        percentage >= 80 ? "bg-red-400" : percentage >= 50 ? "bg-yellow-400" : "bg-brand-primary";

    return (
        <div className="h-9 bg-brand-card/50 border-b border-brand-border flex items-center justify-between px-5 shrink-0">
            <div className="flex items-center gap-2 text-brand-link text-xs font-medium">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                </svg>
                <span>Free Mode — {remaining} explanations remaining today</span>
            </div>
            <div className="flex-1 mx-8 max-w-xs">
                <div className="h-1.5 bg-brand-border rounded-full overflow-hidden">
                    <div
                        className={`h-full ${barColor} rounded-full transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                    />
                </div>
            </div>
            <span className="text-xs font-medium text-brand-muted tracking-wider">
                {used}/{total} USED
            </span>
        </div>
    );
}
