"use client";

import React, { useContext, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UsePDFToText } from "../hooks/usePDFToText";
import { UserDataContext } from "../layout";
import { useRouter } from "next/navigation";
import { useWebscrape } from "../hooks/webscrape"; // Import the web scraping hook

function UploadArea() {
  const [isFileUploading, setIsFileUploading] = useState(false);
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [isFileProcessing, setIsFileProcessing] = useState(false);

  const { setTranscriptData } = useContext(UserDataContext);
  const router = useRouter();

  const onDrop = async (acceptedFiles) => {
    setIsFileUploading(true);

    const file = acceptedFiles[0];
    const pdfURL = URL.createObjectURL(file);
    const pdfText = await UsePDFToText(pdfURL);

    setIsFileUploaded(true);
    setIsFileProcessing(true);

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
      // setIsFileProcessing(false); // We want the spinner to stay until the routing is done (for now)
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

  const [isDragHovered, setIsDragHovered] = useState(isDragActive);
  useEffect(() => {
    if (isDragActive) {
      setIsDragHovered(true);
    } else {
      // Add a small delay before setting isDragHovered to false
      // This prevents flickering when user is moving the file around
      setTimeout(() => {
        setIsDragHovered(false);
      }, 100); // 150ms delay
    }
  }, [isDragActive]);

  return (
    <div
      className="flex h-60 cursor-pointer flex-col items-center justify-center rounded-md border-4 border-dashed border-[var(--text-primary)] bg-[var(--container-secondary)] p-2"
      {...getRootProps()}
      onClick={() => {
        if (!isFileUploading || isFileUploaded) {
          open();
        }
      }}>
      <input
        {...getInputProps()}
        disabled={isFileUploading || isFileUploaded}
      />
      {isFileUploaded ? (
        <>
          <p className="text-center text-3xl font-bold text-[var(--text-primary)] select-none">
            Transcript Received
          </p>
          {isFileProcessing && (
            <div className="mt-5 h-10 w-10 animate-spin rounded-full border-4 border-[var(--text-primary)] border-t-transparent"></div>
          )}
        </>
      ) : (
        <>
          <p
            className="text-center text-3xl font-bold text-[var(--text-primary)] select-none"
            style={{
              scale: isDragHovered ? 1.3 : 1,
              transition: "scale 0.1s ease-in-out",
            }}>
            {isDragHovered ? "Drop file here..." : "Upload your Transcript"}
          </p>
          {!isDragHovered && (
            <p className="text-center text-xl text-[var(--text-primary)] select-none">
              Drag and Drop or <span className="underline">Click Here</span>
            </p>
          )}
        </>
      )}
    </div>
  );
}

export default function UploadForm() {
  const [isHoveringUpload, setIsHoveringUpload] = useState(false);

  return (
    <section
      className="flex w-[45%] flex-col gap-5 rounded-xl bg-[var(--container-primary)] p-6 shadow-md"
      onMouseEnter={() => setIsHoveringUpload(true)}
      onMouseLeave={() => setIsHoveringUpload(false)}>
      {/* Container Header */}
      <div className="relative flex flex-col gap-2">
        <h3 className="text-2xl font-bold text-[var(--text-primary)]">
          Get Started
        </h3>
        {/* Underscore */}
        <div className="h-1.5 w-[60%] rounded-md bg-[var(--container-secondary)]"></div>
        {/* Vector Image */}
        <img
          className="transition-position absolute top-[-5.65rem] left-0 z-[-1] h-30 w-30 object-contain duration-500 hover:top-[-8rem]"
          style={{
            top: isHoveringUpload ? "-8rem" : "-5.65rem",
          }}
          src={"Slug Book.png"}
          draggable={false}
        />
      </div>

      <UploadArea />
    </section>
  );
}
