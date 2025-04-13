import fetch from "node-fetch";
import * as cheerio from "cheerio";
import { writeFileSync } from "fs";

const ENDPOINT = "https://pisa.ucsc.edu/cs9/prd/sr9_2013/index.php";
const RESULTS_PER_PAGE = "2500"; // Number of results per page
async function fetchPage(startAt) {
  const formData = new URLSearchParams({
    action: "results",
    rec_dur: RESULTS_PER_PAGE, // Keep at 25 as this is what the system expects
    rec_start: startAt.toString(), // Convert to string for URLSearchParams
    "binds[:term]": "2252",
    "binds[:reg_status]": "all",
    "binds[:subject]": "",
    "binds[:catalog_nbr_op]": "=",
    "binds[:catalog_nbr]": "",
    "binds[:title]": "",
    "binds[:instr_name_op]": "=",
    "binds[:instructor]": "",
    "binds[:ge]": "",
    "binds[:crse_units_op]": "=",
    "binds[:crse_units_from]": "",
    "binds[:crse_units_to]": "",
    "binds[:crse_units_exact]": "",
    "binds[:days]": "",
    "binds[:times]": "",
    "binds[:acad_career]": "",
  });

  try {
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36",
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.text();
  } catch (error) {
    console.error("Error fetching page:", error);
    throw error;
  }
}

async function getClasses() {
  try {
    const classes = [];
    let startAt = 1;
    let hasMoreResults = true;

    while (hasMoreResults) {
      // Add delay between requests
      if (startAt > 1) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }

      console.log(`Fetching courses ${startAt} to ${startAt + 24}...`);

      const html = await fetchPage(startAt);
      const $ = cheerio.load(html);

      const courseElements = $(".panel.panel-default.row");
      console.log("Course elements found:", courseElements.length);

      // Add logging to track progress
      console.log(`Current page results: ${courseElements.length}`);
      console.log(`Total results found so far: ${classes.length}`);
      console.log(`Has more results: ${hasMoreResults}`);

      if (courseElements.length === 0) {
        console.log("No more courses found.");
        hasMoreResults = false;
        continue;
      }

      courseElements.each((_, el) => {
        const find = (selector) => $(el).find(selector);

        // Extract code and name
        const titleElement = find("h2 a");
        const titleText = titleElement.text().trim();
        const [code, ...nameParts] = titleText.split(/\u00A0\u00A0\u00A0/);
        const name = nameParts.join(" ").trim();

        if (!code || !name) return;

        // Extract day and time information
        const dayAndTime = find(
          ".panel-body .row > div:nth-child(3) > div:nth-child(2)"
        )
          .text()
          .replace("Day and Time:", "")
          .trim();

        // Extract location
        const location = find(
          ".panel-body .row > div:nth-child(3) > div:nth-child(1)"
        )
          .text()
          .replace("Location:", "")
          .trim();

        // Extract instruction mode
        const instructionMode = find(".hide-print b").text().trim();

        // Extract enrollment info
        // const enrollmentText = find(".panel-body .row > div:nth-child(4)")
        //   .text()
        //   .trim();
        // let enrolled = 0,
        //   capacity = 0;
        // const enrollmentMatch = enrollmentText.match(/(\d+) of (\d+)/);
        // if (enrollmentMatch) {
        //   enrolled = parseInt(enrollmentMatch[1]);
        //   capacity = parseInt(enrollmentMatch[2]);
        // }

        classes.push({
          code: code.trim(),
          name,
          schedule: {
            dayAndTime: dayAndTime || "Not specified",
            location: location || "Not specified",
            instructionMode: instructionMode || "Not specified",
          },
          // enrollment: {
          //   enrolled,
          //   capacity,
          // },
        });
      });

      // Check if there's a next page by looking at the bottom navigation
      const resultsInfo = $('td[align="right"]').text().trim();
      const totalResults = parseInt(resultsInfo.match(/of (\d+)/)?.[1] || "0");
      console.log(`Total results: ${totalResults}`);
      if (startAt + courseElements.length >= totalResults) {
        hasMoreResults = false;
        console.log("Reached the end of results.");
      } else {
        startAt += RESULTS_PER_PAGE; // Move to next page
      }

      console.log(
        `Found ${courseElements.length} courses on this page. Total so far: ${classes.length}`
      );
    }

    // Add metadata to the final output
    const output = {
      metadata: {
        totalClasses: classes.length,
      },
      classes: classes,
    };

    return output;
  } catch (error) {
    console.error("Error in getClasses:", error);
    throw error;
  }
}

// Run the scraper

getClasses()
  .then((output) => {
    // Pretty print the results
    console.log("\nFound classes:");
    // output.classes.forEach((cls) => {
    //   console.log("\n-------------------");
    //   console.log(`Course: ${cls.code}`);
    //   console.log(`Name: ${cls.name}`);
    //   console.log(`Time: ${cls.schedule.dayAndTime}`);
    //   console.log(`Location: ${cls.schedule.location}`);
    //   console.log(`Mode: ${cls.schedule.instructionMode}`);
    //   console.log(
    //     `Enrollment: ${cls.enrollment.enrolled}/${cls.enrollment.capacity}`
    //   );
    // });
    console.log("\n-------------------");
    console.log(`Total number of classes: ${output.classes.length}`);

    // Save to a file with metadata
    writeFileSync("classes.json", JSON.stringify(output, null, 2));
    console.log("\nResults have been saved to classes.json");
  })
  .catch((error) => {
    console.error("Scraper failed:", error);
  });
