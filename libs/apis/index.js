const BASE_URL = process.env.NEXT_PUBLIC_APP_API;

function buildHeaders({ accessToken, guestId } = {}) {
    const headers = {
        "Content-Type": "application/json",
    };
    if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
    } else if (guestId) {
        headers["X-Guest-Id"] = guestId;
    }
    return headers;
}

const extractError = async (response) => {
    try {
        const payload = await response.json();
        return payload?.error || payload?.message || "Request failed";
    } catch (_) {
        return "Request failed";
    }
};

const extractErrorPayload = async (response) => {
    try {
        return await response.json();
    } catch (_) {
        return null;
    }
};

export const getQuotaStatus = async ({ accessToken, guestId } = {}) => {
    const response = await fetch(`${BASE_URL}/quota/status`, {
        method: "GET",
        headers: buildHeaders({ accessToken, guestId }),
    });
    if (!response.ok) return { remaining: 0, limit: 0, used: 0, isGuest: true };
    return response.json();
};

export const chatWithGPT = async (text, identity = {}) => {
    try {
        const response = await fetch(`${BASE_URL}/generateTextOpenAi`, {
            method: "POST",
            headers: buildHeaders(identity),
            body: JSON.stringify({ text }),
        });
        if (!response.ok) {
            const payload = await extractErrorPayload(response);
            if (payload?.error === "QUOTA_EXCEEDED") {
                const err = new Error("QUOTA_EXCEEDED");
                err.code = "QUOTA_EXCEEDED";
                err.remaining = payload?.remaining ?? 0;
                throw err;
            }
            const errorMessage = await extractError(response);
            console.error("Error in chatWithGPT", errorMessage);
            return "Error in chatWithGPT";
        }
        const res = await response.json();
        if (!res?.response) {
            console.error("Error in chatWithGPT", res?.error || "Missing response");
            return "Error in chatWithGPT";
        }
        return res.response;
    } catch (error) {
        if (error?.code === "QUOTA_EXCEEDED") throw error;
        console.error("Error in chatWithGPT",  error.message);
        return "Error in chatWithGPT";
    }
}

export const chatWithDeepSeek = async (text, identity = {}) => {
    try {
        const response = await fetch(`${BASE_URL}/deepseekApiCall`, {
            method: "POST",
            headers: buildHeaders(identity),
            body: JSON.stringify({ text }),
        });
        if (!response.ok) {
            const payload = await extractErrorPayload(response);
            if (payload?.error === "QUOTA_EXCEEDED") {
                const err = new Error("QUOTA_EXCEEDED");
                err.code = "QUOTA_EXCEEDED";
                err.remaining = payload?.remaining ?? 0;
                throw err;
            }
            const errorMessage = await extractError(response);
            console.error("Error in chatWithDeepSeek", errorMessage);
            return "Error in chatWithDeepSeek";
        }
        const res = await response.json();
        if (!res?.response) {
            console.error("Error in chatWithDeepSeek", res?.error || "Missing response");
            return "Error in chatWithDeepSeek";
        }
        return res.response;
    } catch (error) {
        if (error?.code === "QUOTA_EXCEEDED") throw error;
        console.error("Error in chatWithDeepSeek",  error.message);
        return "Error in chatWithDeepSeek";
    }
}

export const chatWithGemini = async (text, identity = {}) => {
    try {
        const response = await fetch(`${BASE_URL}/gaminiApiCall`, {
            method: "POST",
            headers: buildHeaders(identity),
            body: JSON.stringify({ text }),
        });
        if (!response.ok) {
            const payload = await extractErrorPayload(response);
            if (payload?.error === "QUOTA_EXCEEDED") {
                const err = new Error("QUOTA_EXCEEDED");
                err.code = "QUOTA_EXCEEDED";
                err.remaining = payload?.remaining ?? 0;
                throw err;
            }
            const errorMessage = await extractError(response);
            console.error("Error in chatWithGemini", errorMessage);
            return "Error in chatWithGemini";
        }
        const res = await response.json();
        if (!res?.response) {
            console.error("Error in chatWithGemini", res?.error || "Missing response");
            return "Error in chatWithGemini";
        }
        return res.response;
    } catch (error) {
        if (error?.code === "QUOTA_EXCEEDED") throw error;
        console.error("Error in chatWithGemini",  error.message);
        return "Error in chatWithGemini";
    }
}
