import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function sendTxtAndPrompt(prompt) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
    });

    console.log("Gemini Response:", response.text);
    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error("Error sending prompt to Gemini:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}