"use client";

import React, { useState, useRef } from "react";
import { usePDFToText } from "./hooks/usePDFToText";
import { webscrape } from "./hooks/webscrape";

export default function Home() {
  const [fileName, setFileName] = React.useState("No transcript selected");
  const fileInputRef = useRef(null);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);

      const pdfURL = URL.createObjectURL(file);
      const pdfText = await usePDFToText(pdfURL);
      // console.log("PDF Text: ", pdfText);
      let prompt =
        pdfText + "get all the classes i have taken from this transcript";
      console.log("Prompt: ", prompt);
      sendPrompt(prompt);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleTestAI = async () => {
    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: "This is a hardcoded prompt." }), // Hardcoded prompt
      });

      const data = await response.json();
      console.log("Gemini's Responswwwe:", data);
    } catch (error) {
      console.error("Error calling the API:", error);
    }
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <input
        type="file"
        accept=".pdf"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      <button
        onClick={handleButtonClick}
        className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
      >
        Choose PDF File
      </button>

      <p>{fileName}</p>

      <button
        onClick={handleTestAI} // Call the new function
        className="rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700"
      >
        Test AI
      </button>
    </div>
  );
}