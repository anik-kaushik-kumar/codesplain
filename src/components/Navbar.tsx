"use client";

export default function Navbar() {
    return (
        <header className="h-14 border-b border-brand-border bg-brand-bg flex items-center justify-between px-5 shrink-0">
            {/* Left: Logo */}
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-md bg-brand-primary/20 flex items-center justify-center">
                    <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-brand-primary"
                    >
                        <polyline points="16 18 22 12 16 6" />
                        <polyline points="8 6 2 12 8 18" />
                    </svg>
                </div>
                <span className="text-white font-semibold text-base tracking-tight">
                    CodeSplain
                </span>
            </div>

            {/* Right: Nav Links */}
            <nav className="flex items-center gap-5">
                <a
                    href="#"
                    className="text-sm text-brand-muted hover:text-white transition-colors"
                >
                    Docs
                </a>
                <a
                    href="#"
                    className="text-sm text-brand-muted hover:text-white transition-colors"
                >
                    GitHub
                </a>
                <button
                    className="text-sm text-brand-muted hover:text-white transition-colors"
                    onClick={() => {
                        /* Settings modal — Phase 5 */
                    }}
                >
                    Settings
                </button>
                {/* User avatar placeholder */}
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-primary to-brand-success" />
            </nav>
        </header>
    );
}
