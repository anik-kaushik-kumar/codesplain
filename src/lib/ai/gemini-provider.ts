import { GoogleGenerativeAI, type Schema } from "@google/generative-ai";
import { buildExplanationPrompt, RESPONSE_SCHEMA } from "./prompt";
import type { ExplainRequest, ExplanationResponse } from "./types";

export async function generateExplanation(
    request: ExplainRequest
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
        model: "gemini-2.0-flash",
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
            // Check for common API errors
            if (
                error.message.includes("API_KEY_INVALID") ||
                error.message.includes("PERMISSION_DENIED")
            ) {
                throw new Error("Invalid API key. Please check your Gemini API key.");
            }
            if (error.message.includes("QUOTA_EXCEEDED")) {
                throw new Error(
                    "API quota exceeded. Please try again later or use your own API key."
                );
            }
            throw error;
        }
        throw new Error("An unexpected error occurred while generating explanation.");
    }
}
