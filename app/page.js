"use client";

import React, { useState, useRef } from "react";
import { usePDFToText } from "./hooks/usePDFToText";

export default function Home() {
  const [fileName, setFileName] = React.useState("No transcript selected");
  const fileInputRef = useRef(null);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);

      const pdfURL = URL.createObjectURL(file);
      try {
        const pdfText = await usePDFToText(pdfURL); // Use usePDFToText to extract text
        console.log("Extracted PDF Text:", pdfText);
        handleTestAI(pdfText); // Pass the extracted text to handleTestAI
      } catch (error) {
        console.error("Error extracting text from PDF:", error);
      }
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleTestAI = async (pdfText) => {
    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pdfText }), // Send the extracted PDF text
      });

      const data = await response.json();
      console.log("Gemini's Response:", data); // Log the response from the server
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
    </div>
  );
}