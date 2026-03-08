import { NextResponse } from "next/server";

export interface GeminiModel {
    id: string;
    displayName: string;
    description: string;
    supportedMethods: string[];
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
        const models: GeminiModel[] = (data.models || [])
            .filter((m: { supportedGenerationMethods?: string[] }) =>
                m.supportedGenerationMethods?.includes("generateContent")
            )
            .map(
                (m: {
                    name?: string;
                    displayName?: string;
                    description?: string;
                    supportedGenerationMethods?: string[];
                }) => ({
                    id: m.name || "",
                    displayName: m.displayName || m.name || "Unknown",
                    description: m.description || "",
                    supportedMethods: m.supportedGenerationMethods || [],
                })
            )
            // Sort: flash models first, then pro, then others
            .sort((a: GeminiModel, b: GeminiModel) => {
                const aFlash = a.id.includes("flash") ? 0 : 1;
                const bFlash = b.id.includes("flash") ? 0 : 1;
                return aFlash - bFlash;
            });

        return NextResponse.json({ models });
    } catch {
        return NextResponse.json(
            { error: "Failed to fetch models" },
            { status: 500 }
        );
    }
}
