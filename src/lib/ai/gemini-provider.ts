import { GoogleGenerativeAI, type Schema } from "@google/generative-ai";
import { buildExplanationPrompt, RESPONSE_SCHEMA } from "./prompt";
import type { ExplainRequest, ExplanationResponse } from "./types";

export async function generateExplanation(
    request: ExplainRequest,
    modelId?: string
): Promise<ExplanationResponse> {
    // Determine API key: BYOK takes priority, fallback to platform key
    const apiKey = request.apiKey || process.env.GEMINI_API_KEY;

    if (!apiKey) {
        throw new Error(
            "No API key available. Please provide your own key or contact support."
        );
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
        model: modelId?.replace("models/", "") || "gemini-2.0-flash",
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: RESPONSE_SCHEMA as Schema,
        },
    });

    const { systemPrompt, userPrompt } = buildExplanationPrompt(request);

    try {
        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: userPrompt }] }],
            systemInstruction: { role: "system", parts: [{ text: systemPrompt }] },
        });

        const responseText = result.response.text();
        const parsed = JSON.parse(responseText) as ExplanationResponse;

        // Validate all required keys exist
        const requiredKeys = [
            "summary",
            "line_by_line",
            "concepts",
            "improvements",
            "simplified_code",
            "examples",
        ];
        for (const key of requiredKeys) {
            if (!(key in parsed)) {
                throw new Error(`Missing required section: ${key}`);
            }
        }

        return parsed;
    } catch (error) {
        if (error instanceof Error) {
            const msg = error.message.toLowerCase();
            // Check for common API errors
            if (
                msg.includes("api_key_invalid") ||
                msg.includes("permission_denied") ||
                msg.includes("invalid api key")
            ) {
                throw new Error("Invalid API key. Please check your Gemini API key.");
            }
            if (
                msg.includes("quota") ||
                msg.includes("rate") ||
                msg.includes("429") ||
                msg.includes("resource_exhausted")
            ) {
                throw new Error(
                    "API quota exceeded. The free tier limit has been reached. Please try again later or add your own API key in Settings."
                );
            }
            if (msg.includes("not found") || msg.includes("404")) {
                throw new Error("AI model not available. Please try again later.");
            }
            // Generic but clean error
            throw new Error("Failed to generate explanation. Please try again.");
        }
        throw new Error("An unexpected error occurred while generating explanation.");
    }
}
