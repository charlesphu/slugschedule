import { GoogleGenAI } from "@google/genai";
import fs from "fs/promises";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function sendTxtAndPrompt(txtPath, prompt) {
  try {
    const txtContent = await fs.readFile(txtPath, "utf-8");

    // Send the prompt and text content to the Gemini API
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt + txtContent,
      files: [
        {
          name: "sample.txt",
          mimeType: "text/plain",
        },
      ],
    });

    console.log("Gemini Responseeeee:", response.text);
    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error("Error sending text file and prompt to Gemini:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}