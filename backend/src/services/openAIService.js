import axios from "axios";
import env from "../config/config";

export const getOpenAIApiResponse = async (messages) => {
    try {
        const response = await axios.post("https://api.openai.com/v1/chat/completions",
            { model: "gpt-4o-mini", messages },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${env.OPENAI_API_KEY}`
                }
            }
        );
        return response.data.choices[0].message.content;
    } catch (err) {
        console.error("OpenAI API error:", err.response?.data || err.message);
        throw new Error("Failed to get response");
    }
}