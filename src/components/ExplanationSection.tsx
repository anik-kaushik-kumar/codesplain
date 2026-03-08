"use client";

import { useState, useRef, useEffect } from "react";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import type { SectionKey } from "@/lib/ai/types";

interface ExplanationSectionProps {
    sectionKey: SectionKey;
    label: string;
    icon: string;
    color: string;
    content?: string;
    isActive: boolean;
    isPending: boolean;
    index: number;
}

export default function ExplanationSection({
    label,
    icon,
    color,
    content,
    isActive,
    isPending,
    index,
}: ExplanationSectionProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [hasAutoExpanded, setHasAutoExpanded] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);
    const [maxHeight, setMaxHeight] = useState("0px");

    const hasContent = !!content;

    // Auto-expand when content first arrives
    useEffect(() => {
        if (hasContent && !hasAutoExpanded) {
            setIsExpanded(true);
            setHasAutoExpanded(true);
        }
    }, [hasContent, hasAutoExpanded]);

    // Auto-expand when actively streaming
    useEffect(() => {
        if (isActive && !isExpanded) {
            setIsExpanded(true);
        }
    }, [isActive, isExpanded]);

    // Update max-height for animation
    useEffect(() => {
        if (isExpanded && contentRef.current) {
            // Use a timeout to let the DOM update
            const timer = setTimeout(() => {
                if (contentRef.current) {
                    setMaxHeight(contentRef.current.scrollHeight + 100 + "px");
                }
            }, 50);
            return () => clearTimeout(timer);
        } else {
            setMaxHeight("0px");
        }
    }, [isExpanded, content, isActive]);

    const toggleExpand = () => {
        if (hasContent || isActive) {
            setIsExpanded(!isExpanded);
        }
    };

    return (
        <div
            className={`rounded-lg border transition-all duration-300 ${hasContent
                    ? "border-brand-border bg-brand-card/30"
                    : isActive
                        ? "border-brand-primary/40 bg-brand-primary/5"
                        : "border-brand-border/40 bg-transparent"
                }`}
            style={{
                animation: hasContent
                    ? `slideIn 0.3s ease-out ${index * 0.08}s both`
                    : undefined,
            }}
        >
            {/* Header */}
            <button
                onClick={toggleExpand}
                className={`w-full flex items-center justify-between px-3 py-2.5 transition-opacity ${isPending ? "opacity-40" : "opacity-100"
                    } ${hasContent || isActive ? "cursor-pointer" : "cursor-default"}`}
            >
                <div className="flex items-center gap-2.5">
                    <span
                        className={`text-sm ${color} ${isPending ? "animate-[pulse-subtle_2s_ease-in-out_infinite]" : ""}`}
                    >
                        {icon}
                    </span>
                    <span
                        className={`text-sm ${hasContent ? "text-white" : "text-brand-text"}`}
                    >
                        {label}
                    </span>
                </div>
                <div className="flex items-center">
                    {isActive && !hasContent && (
                        <div className="w-3.5 h-3.5 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
                    )}
                    {hasContent && (
                        <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className={`transition-transform duration-200 ${isExpanded
                                    ? "text-brand-muted rotate-90"
                                    : "text-green-400 rotate-0"
                                }`}
                        >
                            {isExpanded ? (
                                <polyline points="6 9 12 15 18 9" />
                            ) : (
                                <polyline points="20 6 9 17 4 12" />
                            )}
                        </svg>
                    )}
                    {!isActive && !hasContent && (
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
                    )}
                </div>
            </button>

            {/* Collapsible Content */}
            <div
                ref={contentRef}
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{ maxHeight }}
            >
                <div className="px-3 pb-3 pt-0">
                    {isActive && !hasContent && (
                        <div className="space-y-2 py-1">
                            {[100, 85, 70].map((width, i) => (
                                <div
                                    key={i}
                                    className="h-3 rounded bg-brand-border/30 animate-[shimmer_1.5s_ease-in-out_infinite]"
                                    style={{
                                        width: `${width}%`,
                                        backgroundSize: "200% 100%",
                                        backgroundImage:
                                            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%)",
                                    }}
                                />
                            ))}
                        </div>
                    )}
                    {hasContent && <MarkdownRenderer content={content} />}
                </div>
            </div>
        </div>
    );
}
