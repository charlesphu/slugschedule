import { UserDataContext } from "../layout";
import { useContext } from "react";

export async function getCleanCourseCodes() {
  try {
    // Fetch the JSON file from the public directory
    const response = await fetch("./cseClasses.json");
    const jsonData = await response.json();

    // Map through the classes array and extract codes
    const courseCodes = jsonData.classes.map((course) => {
      // Split the code on '-' and take the first part
      // Then trim any whitespace
      return course.code.split("-")[0].trim();
    });

    // Remove duplicates using Set and convert back to array
    const uniqueCodes = [...new Set(courseCodes)];

    // Sort the codes
    return uniqueCodes.sort();
  } catch (error) {
    console.error("Error loading course codes:", error);
    return [];
  }
}
