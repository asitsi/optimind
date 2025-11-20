const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const chatWithGPT = async (text) => {
    try {
        const response = await fetch(`${BASE_URL}/generateTextOpenAi`, {
            method: "POST",
            body: JSON.stringify({ text }),
        });
        const res = await response.json();
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
        const res = await response.json();
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
        const res = await response.json();
        return res.response;
    } catch (error) {
        console.error("Error in chatWithGemini",  error.message);
        return "Error in chatWithGemini";
    }
}
