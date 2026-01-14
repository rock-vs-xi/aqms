
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getCreativePrompt = async (username: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a fun, intriguing, or funny anonymous question to ask someone named ${username} on an AMA (Ask Me Anything) platform. Keep it short (max 15 words) and engaging. Examples: "What's a secret talent you have?", "If you were a pizza topping, what would you be?", "What's the most embarrassing song in your playlist?". Return ONLY the question text.`,
      config: {
        temperature: 0.9,
        topK: 40,
        topP: 0.95,
      },
    });

    return response.text?.trim() || "Send me something anonymous!";
  } catch (error) {
    console.error("Error fetching Gemini prompt:", error);
    return "What's your biggest secret?";
  }
};
