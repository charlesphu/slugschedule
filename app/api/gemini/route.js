import { sendTxtAndPrompt } from "./utils/geminiHelper";
import path from "path";

export async function POST(request) {
  try {
    const prompt = "this is a pdf that is the transcript of a student. Please parse the pdf for all of the classes that have been taken by a user, and return it in your response as an array. Your response is being returned as a json object so please be mindful of this and do not create any sort of distruptive writing or formatting. I just need your response as an array of taken class codes (e.i CSE20, BIO120, etc.) as a comma separated list." 

    if (!prompt) {
      return new Response(
        JSON.stringify({ success: false, error: "Prompt is required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const txtPath = path.join(process.cwd(),"app", "test-files", "sample.txt");

    const geminiResponse = await sendTxtAndPrompt(txtPath, prompt);

    return new Response(JSON.stringify(geminiResponse), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in route.js:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Failed to process the request.", details: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}