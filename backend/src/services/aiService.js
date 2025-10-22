import { GoogleGenAI } from "@google/genai";
import env from "../config/config.js";

const ai = new GoogleGenAI({ apiKey: env.API_KEY });
const model = 'gemini-2.5-flash';

const buildGeminiHistory = (messages) => {
    return messages.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
    }));
};

/**
 * Gets a chat response from the Gemini API.
 * @param {Array<object>} messages - The conversation history.
 * @returns {Promise<string>} - The assistant's response text.
 */
export const getAiResponse = async (messages) => {
    try {
        const history = buildGeminiHistory(messages.slice(0, -1)); 
        const lastMessage = messages[messages.length - 1];

        const chat = ai.chats.create({
            model,
            history: history,
        });
        
        const result = await chat.sendMessage({ message: lastMessage.content });
        return result.text;
    } catch (err) {
        console.error("Gemini API error in getAiResponse:", err);
        throw new Error("Failed to get response from AI");
    }
};


export const generateTitle = async (userPrompt, modelResponse) => {
    try {
        const prompt = `Based on the following conversation, create a short, concise title (3-5 words).
        User: "${userPrompt}"
        Assistant: "${modelResponse}"
        
        Title:`;

        const response = await ai.models.generateContent({
            model,
            contents: prompt,
        });

        let title = response.text.trim().replace(/["']/g, '');
        if (title.toLowerCase().startsWith('title:')) {
            title = title.substring(6).trim();
        }
        return title;
    } catch (err) {
        console.error("Gemini API error in generateTitle:", err);
        return "New Chat"; 
    }
};
