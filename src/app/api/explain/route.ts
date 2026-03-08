import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { generateExplanation } from "@/lib/ai/gemini-provider";
import { generateOpenAIExplanation } from "@/lib/ai/openai-provider";
import { generateAnthropicExplanation } from "@/lib/ai/anthropic-provider";
import { SECTION_ORDER, type StreamChunk, type ExplainRequest, type ProviderId } from "@/lib/ai/types";
import { isLimitReached, incrementUsage } from "@/lib/usage-tracker";
import { sanitizeCode, detectPromptInjection, checkRateLimit, MAX_CODE_LENGTH } from "@/lib/security";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Validate required fields
        const { code, language, difficulty, apiKey, model, provider } = body as ExplainRequest & { model?: string; provider?: ProviderId };

        if (!code || typeof code !== "string" || code.trim().length === 0) {
            return NextResponse.json(
                { error: "Code is required" },
                { status: 400 }
            );
        }

        if (!language || typeof language !== "string") {
            return NextResponse.json(
                { error: "Language is required" },
                { status: 400 }
            );
        }

        const validDifficulties = ["beginner", "intermediate", "advanced"];
        if (!difficulty || !validDifficulties.includes(difficulty)) {
            return NextResponse.json(
                { error: "Valid difficulty level is required (beginner, intermediate, advanced)" },
                { status: 400 }
            );
        }

        // Security: sanitize input
        const sanitizedCode = sanitizeCode(code);

        if (sanitizedCode.length > MAX_CODE_LENGTH) {
            return NextResponse.json(
                { error: `Code exceeds maximum length of ${MAX_CODE_LENGTH.toLocaleString()} characters` },
                { status: 400 }
            );
        }

        // Security: prompt injection detection
        if (detectPromptInjection(sanitizedCode)) {
            return NextResponse.json(
                { error: "Suspicious input detected. Please submit valid code only." },
                { status: 400 }
            );
        }

        // Get IP for rate limiting and usage tracking
        const headersList = await headers();
        const ip =
            headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
            headersList.get("x-real-ip") ||
            "127.0.0.1";

        // Security: rate limiting (all users)
        const rateCheck = checkRateLimit(ip);
        if (!rateCheck.allowed) {
            return NextResponse.json(
                { error: "Too many requests. Please slow down." },
                {
                    status: 429,
                    headers: { "Retry-After": String(rateCheck.retryAfter || 60) },
                }
            );
        }

        // Free tier limit enforcement
        if (!apiKey) {
            if (isLimitReached(ip)) {
                return NextResponse.json(
                    {
                        error:
                            "Free tier limit reached (10/day). Add your own API key in Settings for unlimited use.",
                    },
                    { status: 429 }
                );
            }

            // Increment usage for free tier
            incrementUsage(ip);
        }

        // Generate explanation — dispatch to correct provider
        const explainRequest: ExplainRequest = {
            code: sanitizedCode,
            language,
            difficulty,
            provider: provider || "gemini",
            apiKey,
        };

        let explanation;
        switch (provider) {
            case "openai":
                explanation = await generateOpenAIExplanation(explainRequest, model);
                break;
            case "anthropic":
                explanation = await generateAnthropicExplanation(explainRequest, model);
                break;
            default:
                explanation = await generateExplanation(explainRequest, model);
        }

        // Stream response section-by-section (ADR-008 order)
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
            async start(controller) {
                try {
                    for (const sectionKey of SECTION_ORDER) {
                        const chunk: StreamChunk = {
                            section: sectionKey,
                            content: explanation[sectionKey],
                            done: false,
                        };
                        controller.enqueue(
                            encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`)
                        );
                        // Small delay between sections for progressive visual effect
                        await new Promise((r) => setTimeout(r, 150));
                    }

                    // Send done signal
                    controller.enqueue(
                        encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`)
                    );
                    controller.close();
                } catch (err) {
                    const errorMsg =
                        err instanceof Error ? err.message : "Stream error";
                    controller.enqueue(
                        encoder.encode(
                            `data: ${JSON.stringify({ error: errorMsg, done: true })}\n\n`
                        )
                    );
                    controller.close();
                }
            },
        });

        return new Response(stream, {
            headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                Connection: "keep-alive",
            },
        });
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Internal server error";

        if (message.includes("Invalid API key")) {
            return NextResponse.json({ error: message }, { status: 401 });
        }
        if (message.includes("quota")) {
            return NextResponse.json({ error: message }, { status: 429 });
        }

        return NextResponse.json({ error: message }, { status: 500 });
    }
}
