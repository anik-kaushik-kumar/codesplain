// Anthropic/Claude provider — direct REST API (no SDK needed)
import { buildExplanationPrompt } from "./prompt";
import type { ExplainRequest, ExplanationResponse } from "./types";

export async function generateAnthropicExplanation(
    request: ExplainRequest,
    modelId?: string
): Promise<ExplanationResponse> {
    const apiKey = request.apiKey;
    if (!apiKey) {
        throw new Error("Anthropic API key is required. Add your key in Settings.");
    }

    const { systemPrompt, userPrompt } = buildExplanationPrompt(request);

    const jsonPrompt = `${userPrompt}

IMPORTANT: You MUST respond with ONLY a valid JSON object (no markdown, no code fences) containing exactly these 6 keys:
- "summary": A 2-3 sentence overview
- "line_by_line": Markdown-formatted line-by-line explanation
- "concepts": Bullet list of programming concepts
- "improvements": Numbered list of improvement suggestions with code
- "simplified_code": Simpler rewrite of the code
- "examples": Sample inputs and expected outputs`;

    try {
        const response = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": apiKey,
                "anthropic-version": "2023-06-01",
            },
            body: JSON.stringify({
                model: modelId || "claude-sonnet-4-20250514",
                max_tokens: 4096,
                system: systemPrompt,
                messages: [{ role: "user", content: jsonPrompt }],
            }),
        });

        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            const msg = (err as { error?: { message?: string } })?.error?.message || "";
            if (response.status === 401) throw new Error("Invalid Anthropic API key.");
            if (response.status === 429) throw new Error("Anthropic API quota exceeded. Please try again later.");
            if (response.status === 404) throw new Error("Model not found. Please select a different model.");
            throw new Error(msg || "Anthropic API request failed.");
        }

        const data = await response.json();
        const textBlock = data.content?.find(
            (b: { type: string }) => b.type === "text"
        );
        const content = textBlock?.text;
        if (!content) throw new Error("Empty response from Anthropic.");

        // Try to extract JSON from response (Claude sometimes wraps in markdown)
        let jsonStr = content;
        const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (jsonMatch) jsonStr = jsonMatch[1];

        const parsed = JSON.parse(jsonStr.trim()) as ExplanationResponse;

        // Validate
        const requiredKeys = ["summary", "line_by_line", "concepts", "improvements", "simplified_code", "examples"];
        for (const key of requiredKeys) {
            if (!(key in parsed)) {
                throw new Error(`Missing required section: ${key}`);
            }
        }

        return parsed;
    } catch (error) {
        if (error instanceof Error) {
            if (error.message.includes("Invalid") || error.message.includes("quota") || error.message.includes("not found")) {
                throw error;
            }
            throw new Error(`Anthropic: ${error.message}`);
        }
        throw new Error("An unexpected error occurred with Anthropic.");
    }
}
