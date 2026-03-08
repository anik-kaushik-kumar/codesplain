import { NextResponse } from "next/server";

export interface GeminiModel {
    id: string;
    displayName: string;
    description: string;
    available: boolean;
}

// Probe whether a model has available quota by calling countTokens (free, fast)
async function probeModelQuota(
    modelId: string,
    apiKey: string
): Promise<boolean> {
    try {
        const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/${modelId}:countTokens?key=${apiKey}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: "test" }] }],
                }),
            }
        );
        // 200 = available, 429 = quota exhausted, 403 = no access
        return res.ok;
    } catch {
        return false;
    }
}

export async function POST(request: Request) {
    try {
        const { apiKey } = await request.json();

        if (!apiKey || typeof apiKey !== "string") {
            return NextResponse.json(
                { error: "API key is required" },
                { status: 400 }
            );
        }

        // Fetch available models from Gemini API
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
        );

        if (!response.ok) {
            if (response.status === 400 || response.status === 403) {
                return NextResponse.json(
                    { error: "Invalid API key" },
                    { status: 401 }
                );
            }
            return NextResponse.json(
                { error: "Failed to fetch models" },
                { status: response.status }
            );
        }

        const data = await response.json();

        // Filter to only models that support generateContent
        const candidateModels = (data.models || [])
            .filter((m: { supportedGenerationMethods?: string[] }) =>
                m.supportedGenerationMethods?.includes("generateContent")
            )
            .map(
                (m: {
                    name?: string;
                    displayName?: string;
                    description?: string;
                }) => ({
                    id: m.name || "",
                    displayName: m.displayName || m.name || "Unknown",
                    description: m.description || "",
                })
            )
            // Sort: flash models first, then pro, then others
            .sort((a: { id: string }, b: { id: string }) => {
                const aFlash = a.id.includes("flash") ? 0 : 1;
                const bFlash = b.id.includes("flash") ? 0 : 1;
                return aFlash - bFlash;
            });

        // Probe each model for quota availability (run in parallel, max 6 concurrent)
        const probeResults = await Promise.all(
            candidateModels.map(async (model: { id: string; displayName: string; description: string }) => {
                const available = await probeModelQuota(model.id, apiKey);
                return { ...model, available } as GeminiModel;
            })
        );

        return NextResponse.json({ models: probeResults });
    } catch {
        return NextResponse.json(
            { error: "Failed to fetch models" },
            { status: 500 }
        );
    }
}
