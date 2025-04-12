import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request) {
  // console.log("request: ", request);
  const { prompt } = await request.json();
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
  });
  console.log(response.text);
  return new Response(JSON.stringify({ response: response.text }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
