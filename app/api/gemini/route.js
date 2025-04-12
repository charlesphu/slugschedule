import { sendTxtAndPrompt } from "./utils/geminiHelper";

export async function POST(request) {
  try {
    const { requestType, pdfText } = await request.json();
    console.log("im here");
    let prompt = null;

    if (requestType == "pdf") {
      if (!pdfText) {
        return new Response(
          JSON.stringify({ success: false, error: "PDF text is required." }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
      prompt =
        "This is a pdf that is the transcript of a student. " +
        "Please parse the pdf for all of the classes that have been taken by a user, " +
        "and return it in your response as an array. Your response is being returned as a json object " +
        "so please be mindful of this and do not create any sort of disruptive writing or formatting. " +
        "I just need your response as an array of taken class codes (e.g., CSE20, BIO120, etc.) as a comma-separated list, " +
        "and some additional student information. Structure your response like this as json data: " +
        "classes: (class array)"+
        "GPA: (Student GPA) " +
        "Total Units: (total units) " + 
        "Current year: (student year, such as freshman, sophomore, junior, etc. Determine by timeline evident in transcript)" +
        "Current Major: (student major, please make it read and casual, no shorthand language. Like: Computer Science, Biology) " +
        "Short words: (max 20 words) of encouragement based off recently taken classes: (Encouragement)" +
        pdfText;
        } else if (request == "majorRequirements") {
      let urlText = null;
      prompt =
        "Please parse this to find all the course names and codes: " + urlText;
        }
        console.log("reust type:", requestType);
    const geminiResponse = await sendTxtAndPrompt(prompt);

    return new Response(JSON.stringify(geminiResponse), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in route.js:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Failed to process the request.",
        details: error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
