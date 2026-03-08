"use client";

import { useState, useCallback } from "react";
import type { SectionKey, StreamChunk } from "@/lib/ai/types";
import { SECTION_ORDER } from "@/lib/ai/types";

type Sections = Partial<Record<SectionKey, string>>;

interface UseExplainReturn {
    explain: (code: string, language: string, difficulty: string) => Promise<void>;
    sections: Sections;
    isLoading: boolean;
    error: string | null;
    activeSection: SectionKey | null;
}

export function useExplain(): UseExplainReturn {
    const [sections, setSections] = useState<Sections>({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeSection, setActiveSection] = useState<SectionKey | null>(null);

    const explain = useCallback(
        async (code: string, language: string, difficulty: string) => {
            // Reset state
            setSections({});
            setError(null);
            setIsLoading(true);
            setActiveSection(SECTION_ORDER[0]);

            try {
                const response = await fetch("/api/explain", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        code,
                        language,
                        difficulty,
                        provider: "gemini",
                    }),
                });

                if (!response.ok) {
                    const data = await response.json();
                    throw new Error(data.error || `Request failed (${response.status})`);
                }

                const reader = response.body?.getReader();
                if (!reader) throw new Error("No response stream");

                const decoder = new TextDecoder();
                let buffer = "";

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    buffer += decoder.decode(value, { stream: true });

                    // Parse SSE lines
                    const lines = buffer.split("\n\n");
                    buffer = lines.pop() || ""; // Keep incomplete data in buffer

                    for (const line of lines) {
                        const trimmed = line.trim();
                        if (!trimmed.startsWith("data: ")) continue;

                        try {
                            const json = JSON.parse(trimmed.slice(6));

                            if (json.error) {
                                setError(json.error);
                                setIsLoading(false);
                                setActiveSection(null);
                                return;
                            }

                            if (json.done === true && !json.section) {
                                // Final done signal
                                setIsLoading(false);
                                setActiveSection(null);
                                return;
                            }

                            const chunk = json as StreamChunk;
                            setSections((prev) => ({
                                ...prev,
                                [chunk.section]: chunk.content,
                            }));

                            // Advance active section to next
                            const currentIdx = SECTION_ORDER.indexOf(chunk.section);
                            if (currentIdx < SECTION_ORDER.length - 1) {
                                setActiveSection(SECTION_ORDER[currentIdx + 1]);
                            } else {
                                setActiveSection(null);
                            }
                        } catch {
                            // Skip malformed JSON
                        }
                    }
                }

                setIsLoading(false);
                setActiveSection(null);
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : "An unexpected error occurred"
                );
                setIsLoading(false);
                setActiveSection(null);
            }
        },
        []
    );

    return { explain, sections, isLoading, error, activeSection };
}
