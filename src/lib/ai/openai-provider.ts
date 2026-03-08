// OpenAI provider — direct REST API (no SDK needed)
import { buildExplanationPrompt } from "./prompt";
import type { ExplainRequest, ExplanationResponse } from "./types";

export async function generateOpenAIExplanation(
    request: ExplainRequest,
    modelId?: string
): Promise<ExplanationResponse> {
    const apiKey = request.apiKey;
    if (!apiKey) {
        throw new Error("OpenAI API key is required. Add your key in Settings.");
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
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: modelId || "gpt-4o-mini",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: jsonPrompt },
                ],
                response_format: { type: "json_object" },
                temperature: 0.3,
            }),
        });

        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            const msg = (err as { error?: { message?: string } })?.error?.message || "";
            if (response.status === 401) throw new Error("Invalid OpenAI API key.");
            if (response.status === 429) throw new Error("OpenAI API quota exceeded. Please try again later.");
            if (response.status === 404) throw new Error("Model not found. Please select a different model.");
            throw new Error(msg || "OpenAI API request failed.");
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        if (!content) throw new Error("Empty response from OpenAI.");

        const parsed = JSON.parse(content) as ExplanationResponse;

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
            throw new Error(`OpenAI: ${error.message}`);
        }
        throw new Error("An unexpected error occurred with OpenAI.");
    }
}
