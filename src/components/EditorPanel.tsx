export default function EditorPanel() {
    return (
        <div className="flex flex-col h-full">
            {/* Toolbar placeholder */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-brand-border">
                <div className="flex items-center gap-3">
                    {/* Language selector placeholder */}
                    <div className="flex items-center gap-2 bg-brand-card border border-brand-border rounded-md px-3 py-1.5 text-sm text-white">
                        <span>TypeScript</span>
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

                <div className="flex items-center gap-3">
                    {/* Format button */}
                    <button className="flex items-center gap-1.5 text-xs text-brand-muted hover:text-white transition-colors">
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
                            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                        </svg>
                        Format
                    </button>
                    {/* Copy button */}
                    <button className="flex items-center gap-1.5 text-xs text-brand-muted hover:text-white transition-colors">
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
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                        Copy
                    </button>
                </div>
            </div>

            {/* Editor area placeholder */}
            <div className="flex-1 flex items-center justify-center bg-brand-bg">
                <div className="text-center">
                    <div className="text-brand-border text-6xl font-mono mb-4">
                        {"</>"}
                    </div>
                    <p className="text-brand-muted text-sm">
                        Monaco Editor will load here
                    </p>
                    <p className="text-brand-border text-xs mt-1">
                        Phase 2: Editor Integration
                    </p>
                </div>
            </div>
        </div>
    );
}
