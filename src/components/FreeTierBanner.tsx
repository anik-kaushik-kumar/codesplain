export default function FreeTierBanner() {
    const used = 3;
    const total = 10;
    const remaining = total - used;
    const percentage = (used / total) * 100;

    return (
        <div className="h-9 bg-brand-card/50 border-b border-brand-border flex items-center justify-between px-5 shrink-0">
            {/* Left: Label */}
            <div className="flex items-center gap-2 text-brand-link text-xs font-medium">
                <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                </svg>
                <span>
                    Free Mode — {remaining} explanations remaining today
                </span>
            </div>

            {/* Center: Progress bar */}
            <div className="flex-1 mx-8 max-w-xs">
                <div className="h-1.5 bg-brand-border rounded-full overflow-hidden">
                    <div
                        className="h-full bg-brand-primary rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                    />
                </div>
            </div>

            {/* Right: Counter */}
            <span className="text-xs font-medium text-brand-muted tracking-wider">
                {used}/{total} USED
            </span>
        </div>
    );
}
