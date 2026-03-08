// IP-based free tier usage tracking
// In-memory store (resets on server restart — acceptable for portfolio project)

const DAILY_LIMIT = 10;

interface UsageEntry {
    count: number;
    date: string; // YYYY-MM-DD
}

const usageMap = new Map<string, UsageEntry>();

function today(): string {
    return new Date().toISOString().slice(0, 10);
}

function getEntry(ip: string): UsageEntry {
    const entry = usageMap.get(ip);
    const todayStr = today();

    // Reset if new day
    if (!entry || entry.date !== todayStr) {
        const fresh = { count: 0, date: todayStr };
        usageMap.set(ip, fresh);
        return fresh;
    }

    return entry;
}

export function getUsage(ip: string): {
    used: number;
    limit: number;
    remaining: number;
} {
    const entry = getEntry(ip);
    return {
        used: entry.count,
        limit: DAILY_LIMIT,
        remaining: Math.max(0, DAILY_LIMIT - entry.count),
    };
}

export function incrementUsage(ip: string): {
    used: number;
    remaining: number;
} {
    const entry = getEntry(ip);
    entry.count++;
    usageMap.set(ip, entry);
    return {
        used: entry.count,
        remaining: Math.max(0, DAILY_LIMIT - entry.count),
    };
}

export function isLimitReached(ip: string): boolean {
    const entry = getEntry(ip);
    return entry.count >= DAILY_LIMIT;
}
