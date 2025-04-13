import { getClasses } from "./utils/scraper.js"

export async function GET(request) {
  console.log("received request:", request);
  try {
    console.log("Starting class scraping...");

    // Call the scraping function
    const result = await getClasses();

    // Optionally save to a file (if needed)
    // const fs = require("fs");
    // fs.writeFileSync('classes.json', JSON.stringify(result, null, 2));

    return new Response(JSON.stringify({ success: true, data: result }), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500 }
    );
  }
}
