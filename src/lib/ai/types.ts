// The 6 explanation sections in streaming order (ADR-008)
export type SectionKey =
    | "summary"
    | "line_by_line"
    | "concepts"
    | "improvements"
    | "simplified_code"
    | "examples";

export const SECTION_ORDER: SectionKey[] = [
    "summary",
    "line_by_line",
    "concepts",
    "improvements",
    "simplified_code",
    "examples",
];

export const SECTION_LABELS: Record<SectionKey, string> = {
    summary: "Summary",
    line_by_line: "Line-by-line explanation",
    concepts: "Concepts detected",
    improvements: "Code improvements",
    simplified_code: "Simplified version",
    examples: "Example inputs/outputs",
};

export interface ExplanationResponse {
    summary: string;
    line_by_line: string;
    concepts: string;
    improvements: string;
    simplified_code: string;
    examples: string;
}

export interface ExplainRequest {
    code: string;
    language: string;
    difficulty: "beginner" | "intermediate" | "advanced";
    provider: "gemini";
    apiKey?: string; // BYOK — per-request, never stored server-side
}

export type StreamChunk = {
    section: SectionKey;
    content: string;
    done: boolean;
};
