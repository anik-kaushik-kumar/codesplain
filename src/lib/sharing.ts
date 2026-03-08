// Shareable explanation links using URL-encoded state

interface ShareState {
    c: string; // code
    l: string; // language
    d: string; // difficulty
}

export function encodeShareState(
    code: string,
    language: string,
    difficulty: string
): string {
    const state: ShareState = { c: code, l: language, d: difficulty };
    // Use btoa with URI encoding for URL-safe base64
    return encodeURIComponent(btoa(unescape(encodeURIComponent(JSON.stringify(state)))));
}

export function decodeShareState(
    encoded: string
): { code: string; language: string; difficulty: string } | null {
    try {
        const json = decodeURIComponent(escape(atob(decodeURIComponent(encoded))));
        const state = JSON.parse(json) as ShareState;
        if (!state.c || !state.l || !state.d) return null;
        return { code: state.c, language: state.l, difficulty: state.d };
    } catch {
        return null;
    }
}

export function generateShareUrl(state: {
    code: string;
    language: string;
    difficulty: string;
}): string {
    const encoded = encodeShareState(state.code, state.language, state.difficulty);
    return `${window.location.origin}?s=${encoded}`;
}
