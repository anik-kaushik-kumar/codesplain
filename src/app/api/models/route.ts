import { NextResponse } from "next/server";

export interface ProviderModel {
    id: string;
    displayName: string;
    description: string;
    available: boolean;
    provider: "gemini" | "openai" | "anthropic";
}

// Models to exclude — video, audio, image, embedding, AQA
const EXCLUDED_PATTERNS = [
    /imagen/i,
    /veo/i,
    /video/i,
    /audio/i,
    /image/i,
    /vision/i,
    /embedding/i,
    /aqa/i,
    /learnlm/i,
    /lite/i,
    /tts/i,
    /whisper/i,
    /dall/i,
    /moderation/i,
    /text-embedding/i,
];

function isTextModel(id: string, displayName: string): boolean {
    const combined = `${id} ${displayName}`;
    return !EXCLUDED_PATTERNS.some((p) => p.test(combined));
}

// ─── Gemini Model Discovery ───

async function probeGeminiQuota(modelId: string, apiKey: string): Promise<boolean> {
    try {
        const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/${modelId}:countTokens?key=${apiKey}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contents: [{ parts: [{ text: "test" }] }] }),
            }
        );
        return res.ok;
    } catch {
        return false;
    }
}

async function discoverGeminiModels(apiKey: string): Promise<ProviderModel[]> {
    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );
    if (!response.ok) throw new Error("Invalid Gemini API key");

    const data = await response.json();
    const candidates = (data.models || [])
        .filter((m: { supportedGenerationMethods?: string[] }) =>
            m.supportedGenerationMethods?.includes("generateContent")
        )
        .filter((m: { name?: string; displayName?: string }) =>
            isTextModel(m.name || "", m.displayName || "")
        )
        .map((m: { name?: string; displayName?: string; description?: string }) => ({
            id: m.name || "",
            displayName: m.displayName || m.name || "Unknown",
            description: m.description || "",
        }))
        .sort((a: { id: string }, b: { id: string }) => {
            const aFlash = a.id.includes("flash") ? 0 : 1;
            const bFlash = b.id.includes("flash") ? 0 : 1;
            return aFlash - bFlash;
        });

    const results = await Promise.all(
        candidates.map(async (m: { id: string; displayName: string; description: string }) => ({
            ...m,
            available: await probeGeminiQuota(m.id, apiKey),
            provider: "gemini" as const,
        }))
    );
    return results;
}

// ─── OpenAI Model Discovery ───

async function discoverOpenAIModels(apiKey: string): Promise<ProviderModel[]> {
    const response = await fetch("https://api.openai.com/v1/models", {
        headers: { Authorization: `Bearer ${apiKey}` },
    });
    if (!response.ok) throw new Error("Invalid OpenAI API key");

    const data = await response.json();
    const chatModels = (data.data || [])
        .filter((m: { id: string }) => {
            const id = m.id;
            // Include chat/completion models only
            return (
                (id.startsWith("gpt-") || id.startsWith("o") || id.startsWith("chatgpt-")) &&
                isTextModel(id, id) &&
                !id.includes("instruct") &&
                !id.includes("realtime") &&
                !id.includes("transcribe") &&
                !id.includes("search")
            );
        })
        .map((m: { id: string }) => ({
            id: m.id,
            displayName: m.id
                .replace(/-/g, " ")
                .replace(/\b\w/g, (l: string) => l.toUpperCase()),
            description: "",
            available: true, // If listed, it's available
            provider: "openai" as const,
        }))
        .sort((a: { id: string }, b: { id: string }) => {
            // Prioritise: gpt-4o > gpt-4o-mini > gpt-4 > gpt-3.5
            const order = ["gpt-4o-mini", "gpt-4o", "gpt-4", "chatgpt", "o4", "o3", "o1"];
            const aIdx = order.findIndex((p) => a.id.includes(p));
            const bIdx = order.findIndex((p) => b.id.includes(p));
            return (aIdx === -1 ? 99 : aIdx) - (bIdx === -1 ? 99 : bIdx);
        });

    return chatModels as ProviderModel[];
}

// ─── Anthropic Model Discovery ───

const KNOWN_CLAUDE_MODELS = [
    { id: "claude-sonnet-4-20250514", displayName: "Claude Sonnet 4", description: "Latest balanced model" },
    { id: "claude-3-7-sonnet-20250219", displayName: "Claude 3.7 Sonnet", description: "Balanced speed and intelligence" },
    { id: "claude-3-5-haiku-20241022", displayName: "Claude 3.5 Haiku", description: "Fastest Claude model" },
    { id: "claude-3-5-sonnet-20241022", displayName: "Claude 3.5 Sonnet", description: "Previous generation balanced" },
    { id: "claude-3-opus-20240229", displayName: "Claude 3 Opus", description: "Most capable Claude 3" },
];

async function discoverAnthropicModels(apiKey: string): Promise<ProviderModel[]> {
    // Anthropic doesn't have a list models API — probe known models
    const results = await Promise.all(
        KNOWN_CLAUDE_MODELS.map(async (m) => {
            try {
                const res = await fetch("https://api.anthropic.com/v1/messages", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-api-key": apiKey,
                        "anthropic-version": "2023-06-01",
                    },
                    body: JSON.stringify({
                        model: m.id,
                        max_tokens: 1,
                        messages: [{ role: "user", content: "Hi" }],
                    }),
                });
                return {
                    ...m,
                    available: res.ok || res.status === 200,
                    provider: "anthropic" as const,
                };
            } catch {
                return { ...m, available: false, provider: "anthropic" as const };
            }
        })
    );
    // If all models fail with auth error, throw
    if (results.every((r) => !r.available)) {
        // check if it's actually an auth error
        const testRes = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": apiKey,
                "anthropic-version": "2023-06-01",
            },
            body: JSON.stringify({
                model: "claude-sonnet-4-20250514",
                max_tokens: 1,
                messages: [{ role: "user", content: "Hi" }],
            }),
        });
        if (testRes.status === 401) throw new Error("Invalid Anthropic API key");
    }
    return results;
}

// ─── Route Handler ───

export async function POST(request: Request) {
    try {
        const { apiKey, provider } = await request.json();

        if (!apiKey || typeof apiKey !== "string") {
            return NextResponse.json({ error: "API key is required" }, { status: 400 });
        }

        const providerId = provider || "gemini";
        let models: ProviderModel[];

        switch (providerId) {
            case "openai":
                models = await discoverOpenAIModels(apiKey);
                break;
            case "anthropic":
                models = await discoverAnthropicModels(apiKey);
                break;
            default:
                models = await discoverGeminiModels(apiKey);
        }

        return NextResponse.json({ models });
    } catch (error) {
        const msg = error instanceof Error ? error.message : "Failed to fetch models";
        if (msg.includes("Invalid")) {
            return NextResponse.json({ error: msg }, { status: 401 });
        }
        return NextResponse.json({ error: msg }, { status: 500 });
    }
}
