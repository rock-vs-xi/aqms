
import { GoogleGenAI } from "@google/genai";

export const getCreativePrompt = async (username) => {
  try {
    const apiKey = typeof process !== 'undefined' ? process.env.API_KEY : '';
    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a short, intriguing anonymous prompt (max 8 words) that a user would post to get their friends to reply. Example: "Name my three shortcomings", "What's my best feature?", "Tell me a secret about me". Use a friendly tone. Return ONLY the text.`,
      config: {
        temperature: 0.8,
      },
    });
    return response.text?.trim() || "Name my three shortcomings";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Name my three shortcomings";
  }
};
