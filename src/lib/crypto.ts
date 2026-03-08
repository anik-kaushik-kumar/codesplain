// Encrypted API key storage using Web Crypto API
// Keys are AES-GCM encrypted in localStorage, encryption key stored in IndexedDB
// NEVER log, store server-side, or send keys to analytics

const DB_NAME = "codesplain_crypto";
const STORE_NAME = "keys";
const CRYPTO_KEY_ID = "master_key";

// ─── IndexedDB helpers ───

function openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);
        request.onupgradeneeded = () => {
            request.result.createObjectStore(STORE_NAME);
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function getFromIDB(key: string): Promise<CryptoKey | null> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readonly");
        const store = tx.objectStore(STORE_NAME);
        const request = store.get(key);
        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => reject(request.error);
    });
}

async function putToIDB(key: string, value: CryptoKey): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);
        const request = store.put(value, key);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

// ─── Crypto key management ───

async function getMasterKey(): Promise<CryptoKey> {
    const existing = await getFromIDB(CRYPTO_KEY_ID);
    if (existing) return existing;

    const key = await crypto.subtle.generateKey(
        { name: "AES-GCM", length: 256 },
        false, // not extractable
        ["encrypt", "decrypt"]
    );
    await putToIDB(CRYPTO_KEY_ID, key);
    return key;
}

// ─── Encrypt / Decrypt ───

export async function encryptKey(plainKey: string): Promise<string> {
    const masterKey = await getMasterKey();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoded = new TextEncoder().encode(plainKey);

    const ciphertext = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        masterKey,
        encoded
    );

    const payload = {
        iv: Array.from(iv),
        ct: Array.from(new Uint8Array(ciphertext)),
    };
    return btoa(JSON.stringify(payload));
}

export async function decryptKey(encrypted: string): Promise<string> {
    const masterKey = await getMasterKey();
    const payload = JSON.parse(atob(encrypted));
    const iv = new Uint8Array(payload.iv);
    const ciphertext = new Uint8Array(payload.ct);

    const decrypted = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv },
        masterKey,
        ciphertext
    );

    return new TextDecoder().decode(decrypted);
}

// ─── localStorage API key management ───

const KEY_PREFIX = "codesplain_key_";

export async function saveApiKey(
    provider: string,
    apiKey: string
): Promise<void> {
    const encrypted = await encryptKey(apiKey);
    localStorage.setItem(`${KEY_PREFIX}${provider}`, encrypted);
}

export async function loadApiKey(
    provider: string
): Promise<string | null> {
    const encrypted = localStorage.getItem(`${KEY_PREFIX}${provider}`);
    if (!encrypted) return null;
    try {
        return await decryptKey(encrypted);
    } catch {
        // Corrupted or key changed — remove it
        localStorage.removeItem(`${KEY_PREFIX}${provider}`);
        return null;
    }
}

export async function removeApiKey(provider: string): Promise<void> {
    localStorage.removeItem(`${KEY_PREFIX}${provider}`);
}

export function hasStoredKey(provider: string): boolean {
    return localStorage.getItem(`${KEY_PREFIX}${provider}`) !== null;
}
