const BASE_URL = "https://diadoc-api.kontur.ru";
const TIMEOUT = 15_000;
const MAX_RETRIES = 3;
let cachedToken = null;
export async function authenticate() {
    if (cachedToken)
        return cachedToken;
    const clientId = process.env.DIADOC_CLIENT_ID;
    const apiKey = process.env.DIADOC_API_KEY;
    const login = process.env.DIADOC_LOGIN;
    const password = process.env.DIADOC_PASSWORD;
    if (!clientId || !apiKey) {
        throw new Error("DIADOC_CLIENT_ID and DIADOC_API_KEY are required.");
    }
    if (!login || !password) {
        throw new Error("DIADOC_LOGIN and DIADOC_PASSWORD are required.");
    }
    const response = await fetch(`${BASE_URL}/V3/Authenticate`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "ddauth_api_client_id": clientId,
        },
        body: JSON.stringify({ login, password }),
    });
    if (!response.ok) {
        throw new Error(`Diadoc authentication failed: HTTP ${response.status}`);
    }
    const token = await response.text();
    cachedToken = token;
    return token;
}
export function clearToken() {
    cachedToken = null;
}
function getHeaders(token) {
    const clientId = process.env.DIADOC_CLIENT_ID;
    return {
        "Authorization": `DiadocAuth ddauth_api_client_id=${clientId},ddauth_token=${token}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
    };
}
export async function diadocGet(path, params = {}) {
    const token = await authenticate();
    const query = new URLSearchParams(params);
    const url = `${BASE_URL}${path}${query.toString() ? "?" + query.toString() : ""}`;
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), TIMEOUT);
        try {
            const response = await fetch(url, {
                headers: getHeaders(token),
                signal: controller.signal,
            });
            clearTimeout(timer);
            if (response.ok)
                return response.json();
            if (response.status === 401) {
                clearToken();
                throw new Error("Diadoc: authentication expired. Re-authenticate.");
            }
            if ((response.status === 429 || response.status >= 500) && attempt < MAX_RETRIES) {
                const delay = Math.min(1000 * 2 ** (attempt - 1), 8000);
                await new Promise(r => setTimeout(r, delay));
                continue;
            }
            throw new Error(`Diadoc HTTP ${response.status}: ${response.statusText}`);
        }
        catch (error) {
            clearTimeout(timer);
            if (error instanceof DOMException && error.name === "AbortError" && attempt < MAX_RETRIES)
                continue;
            throw error;
        }
    }
    throw new Error("Diadoc: all retry attempts exhausted");
}
export async function diadocPost(path, body, params = {}) {
    const token = await authenticate();
    const query = new URLSearchParams(params);
    const url = `${BASE_URL}${path}${query.toString() ? "?" + query.toString() : ""}`;
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), TIMEOUT);
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: getHeaders(token),
                body: JSON.stringify(body),
                signal: controller.signal,
            });
            clearTimeout(timer);
            if (response.ok)
                return response.json();
            if (response.status === 401) {
                clearToken();
                throw new Error("Diadoc: authentication expired.");
            }
            if ((response.status === 429 || response.status >= 500) && attempt < MAX_RETRIES) {
                const delay = Math.min(1000 * 2 ** (attempt - 1), 8000);
                await new Promise(r => setTimeout(r, delay));
                continue;
            }
            throw new Error(`Diadoc HTTP ${response.status}: ${response.statusText}`);
        }
        catch (error) {
            clearTimeout(timer);
            if (error instanceof DOMException && error.name === "AbortError" && attempt < MAX_RETRIES)
                continue;
            throw error;
        }
    }
    throw new Error("Diadoc: all retry attempts exhausted");
}
//# sourceMappingURL=client.js.map