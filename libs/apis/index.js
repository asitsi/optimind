const BASE_URL = process.env.NEXT_PUBLIC_APP_API;

const extractError = async (response) => {
    try {
        const payload = await response.json();
        return payload?.error || payload?.message || "Request failed";
    } catch (_) {
        return "Request failed";
    }
};

export const chatWithGPT = async (text) => {
    try {
        const response = await fetch(`${BASE_URL}/generateTextOpenAi`, {
            method: "POST",
            body: JSON.stringify({ text }),
        });
        if (!response.ok) {
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
        console.error("Error in chatWithGPT",  error.message);
        return "Error in chatWithGPT";
    }
}

export const chatWithDeepSeek = async (text) => {
    try {
        const response = await fetch(`${BASE_URL}/deepseekApiCall`, {
            method: "POST",
            body: JSON.stringify({ text }),
        });
        if (!response.ok) {
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
        console.error("Error in chatWithDeepSeek",  error.message);
        return "Error in chatWithDeepSeek";
    }
}

export const chatWithGemini = async (text) => {
    try {
        const response = await fetch(`${BASE_URL}/gaminiApiCall`, {
            method: "POST",
            body: JSON.stringify({ text }),
        });
        if (!response.ok) {
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
        console.error("Error in chatWithGemini",  error.message);
        return "Error in chatWithGemini";
    }
}
