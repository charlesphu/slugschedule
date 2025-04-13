import { sendTxtAndPrompt } from "./utils/geminiHelper";

export async function POST(request) {
  try {
    const { requestType, content } = await request.json();
    let prompt = null;

    if (requestType == "pdf") {
      if (!content) {
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
        "classes: (class array)" +
        "GPA: (Student GPA) " +
        "Total Units: (total units) " +
        "Current year: (student year, such as freshman, sophomore, junior, etc. Determine by timeline evident in transcript)" +
        "Current Major: (student major, please make it read and casual, no shorthand language. Like: Computer Science, Biology) " +
        "Short words: (max 20 words) of encouragement based off recently taken classes: (Encouragement)" +
        content;
        console.log("pdf content:", content);
    } else if (requestType == "majorRequirements") {
      if (!content) {
        return new Response(
          JSON.stringify({ success: false, error: "URL text is required." }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
      prompt =
        "This is a parsed link that contains all the major qualification courses for the student. " +
        "Return the courses codes and their course names as an array. Your response is being retruend as a json object, " +
        "so please be mindful of this and do not create any sort of disruptive writing or formatting. " +
        "I just need your response as an array of taken class codes (e.g., CSE20, BIO120, etc.) as a comma-separated list, " +
        "and some additional class information, like credit number and the number of electives a student needs to take. " +
        "Along with that, I want you to make the list of the classes that are ELECTIVES in an array [ ]. Here is my structure idea: " +
        "All classes = [all classes ]" +
        "courses: { class: {code, name, credits} class: {code, name, credits}.... number of electives to take: (number) electives: (electives array) }" +
        content;
    } else if (requestType == "rankings") {
      prompt =
      /*  "This is JSON data for classes that are being offered in the current academic quarter that a student is able to take " +
        "Please reearange the JSON data in order from highest to lowest ranking." +
        "please be mindful that this response will be treated as a JSON object so do not return anything other than a JSON object. Do not drop any existing attributes such as class schedule, every index must have them. Please add an attribute for the top 5 positions to imply it is a 'reccomended' course. such as reccomended: true, only" +
        "for the top 5 classes. Here is the JSON data. " +
        "Do not add any additional information or context to the response. " +
        "Do not create hypothetical classes or any other information" +
        "You must just return the JSON data provided rearranged with the new attribute for the top 5."
        "Only return values from the existing JSON data. Structure the JSON as such:" +
        "Code: string"+
        "Time: (such as TuTh 10:00-11:30)"+
        "name: string"+ **/
        "This is the JSON data for classes that are being offered; " +
        JSON.stringify(content) +
        "Please rearrange this data in order from highest to lowest ranking." +
        "You must just return the JSON data provided rearranged with the new attribute for the top 5."
        "Only return values from the existing JSON data. Structure the JSON as such:" +
        "Code: string"+
        "Time: (such as TuTh 10:00-11:30)"+
        "name: string";
        console.log("Prompt:", prompt);

    }
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
