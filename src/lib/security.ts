// Security utilities for input validation, sanitization, and rate limiting

export const MAX_CODE_LENGTH = 10_000;

const RATE_LIMIT_WINDOW = 60_000; // 1 minute
const RATE_LIMIT_MAX = 5; // 5 requests per minute per IP

// ─── Input Sanitization ───

export function sanitizeCode(code: string): string {
    return code
        .trim()
        .replace(/\0/g, "") // Strip null bytes
        .slice(0, MAX_CODE_LENGTH); // Enforce max length
}

// ─── Prompt Injection Detection ───

const INJECTION_PATTERNS = [
    /ignore\s+(all\s+)?previous\s+instructions/i,
    /ignore\s+(all\s+)?above\s+instructions/i,
    /disregard\s+(all\s+)?previous/i,
    /you\s+are\s+now\s+a/i,
    /new\s+instructions?\s*:/i,
    /system\s*:\s*you/i,
    /forget\s+(everything|all|your)\s+(you|instructions|rules)/i,
    /override\s+(your|all|the)\s+(instructions|rules|constraints)/i,
    /pretend\s+(you\s+are|to\s+be)/i,
    /act\s+as\s+(if\s+you|a\s+different)/i,
    /\bdo\s+not\s+follow\s+(your|the)\s+(rules|instructions)\b/i,
];

export function detectPromptInjection(code: string): boolean {
    return INJECTION_PATTERNS.some((pattern) => pattern.test(code));
}

// ─── Rate Limiting ───

interface RateLimitEntry {
    timestamps: number[];
}

const rateLimitMap = new Map<string, RateLimitEntry>();

export function checkRateLimit(ip: string): {
    allowed: boolean;
    retryAfter?: number;
} {
    const now = Date.now();
    const entry = rateLimitMap.get(ip) || { timestamps: [] };

    // Remove timestamps outside the window
    entry.timestamps = entry.timestamps.filter(
        (t) => now - t < RATE_LIMIT_WINDOW
    );

    if (entry.timestamps.length >= RATE_LIMIT_MAX) {
        const oldestInWindow = entry.timestamps[0];
        const retryAfter = Math.ceil(
            (oldestInWindow + RATE_LIMIT_WINDOW - now) / 1000
        );
        return { allowed: false, retryAfter };
    }

    entry.timestamps.push(now);
    rateLimitMap.set(ip, entry);
    return { allowed: true };
}
