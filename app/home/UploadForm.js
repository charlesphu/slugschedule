"use client";

import React, { useContext, useState } from "react";
import { useDropzone } from "react-dropzone";
import { usePDFToText } from "../hooks/usePDFToText";
import { UserDataContext } from "../layout";
import { useRouter } from "next/navigation";
import { useWebscrape } from "../hooks/webscrape"; // Import the web scraping hook

function UploadArea() {
  const { setTranscriptData } = useContext(UserDataContext);
  const [isFileUploading, setIsFileUploading] = useState(false);
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const router = useRouter();

  const onDrop = async (acceptedFiles) => {
    setIsFileUploading(true);

    const file = acceptedFiles[0];
    const pdfURL = URL.createObjectURL(file);
    const pdfText = await usePDFToText(pdfURL);

    try {
      console.log("Extracted PDF Text:", pdfText);

      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pdfText,
          requestType: "pdf",
        }),
      });

      const data = await response.json();
      console.log("Transcript data: ", data);

      if (data.success) {
        // Extract the text field and parse it as JSON
        const rawText = data.data.candidates[0].content.parts[0].text;
        const jsonText = JSON.parse(rawText.replace(/```json\n|\n```/g, "")); // Remove code block markers and parse JSON

        // Update the context with the parsed JSON object
        setTranscriptData(jsonText);

        // Reroute to /calendar
        router.push("/calendar");
      } else {
        console.error("Error from API:", data.error);
      }
    } catch (error) {
      console.error("Error processing the file:", error);
    } finally {
      setIsFileUploaded(true);
      setIsFileUploading(false);
    }
    await handleScrapeAndSendToGemini();
  };

  const handleScrapeAndSendToGemini = async () => {
    const url =
     "https://catalog.ucsc.edu/en/current/general-catalog/academic-units/baskin-engineering/computer-science-and-engineering/computer-science-bs/";

    try {
      // Scrape both URLs
      const scrapedHTML = await useWebscrape(url);
      console.log("Combined Scraped HTML:", scrapedHTML);

      // Send the combined scraped data to Gemini
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pdfText: scrapedHTML, // Reusing pdfText field for simplicity
          requestType: "majorRequirements",
        }),
      });

      const data = await response.json();
      console.log("Gemini Response for Scraped Data:", data);
    } catch (error) {
      console.error("Error scraping URLs or sending to Gemini:", error);
    }
  };

  const { getRootProps, getInputProps, open, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "application/pdf": [],
    },
    maxSize: 5242880,
    disabled: isFileUploading || isFileUploaded,
  });

  return (
    <div
      className="flex h-60 cursor-pointer flex-col items-center justify-center rounded-md border-4 border-dashed border-[var(--text-primary)] bg-[var(--container-secondary)] p-2"
      {...getRootProps()}
      onClick={() => {
        if (!isFileUploading || isFileUploaded) {
          open();
        }
      }}
    >
      <input
        {...getInputProps()}
        disabled={isFileUploading || isFileUploaded}
      />
      {isFileUploaded ? (
        <p className="text-center text-3xl font-bold text-[var(--text-primary)] select-none">
          Transcript Received
        </p>
      ) : (
        <>
          <p className="text-center text-3xl font-bold text-[var(--text-primary)] select-none">
            {isDragActive ? "Drop file here..." : "Upload your Transcript"}
          </p>
          {!isDragActive && (
            <p className="text-center text-xl text-[var(--text-primary)] select-none">
              Drag and Drop or <span className="underline">Click Here</span>
            </p>
          )}
        </>
      )}
    </div>
  );
}

export default UploadArea;