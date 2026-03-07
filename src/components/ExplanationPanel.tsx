const sections = [
    {
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
        ),
        label: "Summary",
        color: "text-brand-link",
    },
    {
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
        ),
        label: "Line-by-line explanation",
        color: "text-brand-link",
    },
    {
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
        ),
        label: "Concepts detected",
        color: "text-brand-success",
    },
    {
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
        ),
        label: "Code improvements",
        color: "text-yellow-400",
    },
    {
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
            </svg>
        ),
        label: "Simplified version",
        color: "text-brand-link",
    },
    {
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
        ),
        label: "Example inputs/outputs",
        color: "text-brand-link",
    },
];

export default function ExplanationPanel() {
    return (
        <div className="flex flex-col h-full overflow-y-auto">
            {/* AI Provider selector */}
            <div className="p-4 space-y-3">
                <label className="text-xs font-medium text-brand-muted uppercase tracking-wider">
                    AI Provider
                </label>
                <div className="bg-brand-card border border-brand-border rounded-lg px-3 py-2.5 flex items-center justify-between cursor-pointer hover:border-brand-muted transition-colors">
                    <span className="text-sm text-white">Gemini 3.0 (Google)</span>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-semibold bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded">
                            FREE
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

                {/* Explain Code button */}
                <button className="w-full py-3 bg-brand-primary hover:bg-brand-primary-hover text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2">
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                    </svg>
                    Explain Code
                </button>
            </div>

            {/* Explanation sections */}
            <div className="flex-1 px-4 pb-4 space-y-1">
                {sections.map((section, i) => (
                    <div
                        key={i}
                        className="flex items-center justify-between px-3 py-3 rounded-lg hover:bg-brand-card/50 transition-colors cursor-pointer group"
                    >
                        <div className="flex items-center gap-3">
                            <span className={section.color}>{section.icon}</span>
                            <span className="text-sm text-brand-text group-hover:text-white transition-colors">
                                {section.label}
                            </span>
                        </div>
                        <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="text-brand-muted"
                        >
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-brand-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-brand-success" />
                    <span className="text-xs text-brand-muted">AI ready</span>
                </div>
                <span className="text-xs text-brand-muted">v2.4.0-stable</span>
            </div>
        </div>
    );
}
