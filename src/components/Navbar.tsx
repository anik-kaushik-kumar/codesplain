"use client";

interface NavbarProps {
    onSettingsClick: () => void;
}

export default function Navbar({ onSettingsClick }: NavbarProps) {
    return (
        <header className="h-14 border-b border-brand-border bg-brand-bg flex items-center justify-between px-5 shrink-0">
            {/* Left: Logo */}
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 flex items-center justify-center">
                    <img src="/logo.png" className="w-8 h-8 rounded-md" alt="CodeSplain Logo" />
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
                    href="https://github.com/anik-kaushik-kumar/codesplain"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-brand-muted hover:text-white transition-colors"
                >
                    GitHub
                </a>
                <button
                    className="text-sm text-brand-muted hover:text-white transition-colors cursor-pointer"
                    onClick={onSettingsClick}
                >
                    Settings
                </button>
                {/* User avatar placeholder */}
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-primary to-brand-success" />
            </nav>
        </header>
    );
}

