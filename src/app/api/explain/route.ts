import { NextResponse } from "next/server";
import { generateExplanation } from "@/lib/ai/gemini-provider";
import { SECTION_ORDER, type StreamChunk, type ExplainRequest } from "@/lib/ai/types";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Validate required fields
        const { code, language, difficulty, apiKey } = body as ExplainRequest;

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

        // Generate explanation
        const explanation = await generateExplanation({
            code: code.trim(),
            language,
            difficulty,
            provider: "gemini",
            apiKey,
        });

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

        // Map specific errors to HTTP status codes
        if (message.includes("Invalid API key")) {
            return NextResponse.json({ error: message }, { status: 401 });
        }
        if (message.includes("quota")) {
            return NextResponse.json({ error: message }, { status: 429 });
        }

        return NextResponse.json({ error: message }, { status: 500 });
    }
}
