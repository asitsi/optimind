import axios from "axios";
const API = process.env.REACT_APP_API_KEY;
const API_URL = process.env.REACT_APP_API_URL;
const DEEPSEEK_API = process.env.REACT_APP_DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = process.env.REACT_APP_DEEPSEEK_API_URL;

export const chatWithGPT = async (message) => {
  try {
    const response = await axios.post(
      API_URL,
      {
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: message }],
        temperature: 0.7,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API}`,
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Error:", error);
    return "Error connecting to ChatGPT.";
  }
};

export const chatWithDeepSeek = async (message) => {
  try {
    const response = await axios.post(
      DEEPSEEK_API_URL,
      {
        model: "deepseek/deepseek-r1:free",
        messages: [{ role: "user", content: message }],
        temperature: 0.7,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${DEEPSEEK_API}`,
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Error:", error);
    return "Error connecting to Deepseek.";
  }
}