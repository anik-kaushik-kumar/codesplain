import type { ExplainRequest } from "./types";

export function buildExplanationPrompt(request: ExplainRequest) {
    const difficultyGuide = {
        beginner: `You are explaining to a COMPLETE BEGINNER who has never coded before.
- Use simple everyday analogies (e.g., "a function is like a recipe")
- Avoid jargon — if you must use a technical term, define it immediately
- Be encouraging and patient in tone
- Step through the code line by line as if reading a story
- Assume zero prior knowledge of programming`,

        intermediate: `You are explaining to an INTERMEDIATE developer who knows basics.
- Use standard technical terminology without over-explaining basics
- Focus on patterns, trade-offs, and "why" behind design choices
- Point out common pitfalls and best practices
- Reference relevant design patterns or language idioms`,

        advanced: `You are explaining to an ADVANCED developer reviewing unfamiliar code.
- Be concise and technical — skip obvious explanations
- Focus on performance implications, edge cases, and subtle bugs
- Discuss architectural patterns and their alternatives
- Reference relevant specs, RFCs, or language internals where applicable
- Include complexity analysis where relevant`,
    };

    const systemPrompt = `You are CodeSplain, an expert code explanation AI. Your job is to analyze code and produce clear, educational explanations.

${difficultyGuide[request.difficulty]}

You MUST respond with a valid JSON object containing exactly these 6 keys:
- "summary": A 2-3 sentence overview of what the code does and its purpose
- "line_by_line": A markdown-formatted explanation referencing line numbers (e.g., "**Line 1:** ...")
- "concepts": A bullet list of key programming concepts used in this code
- "improvements": A numbered list of improvement suggestions, each with a brief code example
- "simplified_code": A simpler rewrite of the code that accomplishes the same goal
- "examples": Sample inputs and expected outputs demonstrating how this code would be used

Each value should be a markdown-formatted string. Be thorough but not verbose.`;

    const userPrompt = `Explain this ${request.language} code:

\`\`\`${request.language}
${request.code}
\`\`\``;

    return { systemPrompt, userPrompt };
}

export const RESPONSE_SCHEMA = {
    type: "object" as const,
    properties: {
        summary: {
            type: "string" as const,
            description: "2-3 sentence overview of the code",
        },
        line_by_line: {
            type: "string" as const,
            description:
                "Markdown-formatted line-by-line explanation with line numbers",
        },
        concepts: {
            type: "string" as const,
            description: "Bullet list of programming concepts",
        },
        improvements: {
            type: "string" as const,
            description: "Numbered list of improvement suggestions with code",
        },
        simplified_code: {
            type: "string" as const,
            description: "Simpler rewrite of the code",
        },
        examples: {
            type: "string" as const,
            description: "Sample inputs and expected outputs",
        },
    },
    required: [
        "summary",
        "line_by_line",
        "concepts",
        "improvements",
        "simplified_code",
        "examples",
    ] as const,
};
