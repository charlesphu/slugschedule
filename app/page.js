"use client";

import React, { useState } from "react";

export default function Home() {
  const [fileName, setFileName] = React.useState("No transcript selected");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const fileInputRef = React.useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
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
        className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700">
        Choose PDF File
      </button>

      <p>{fileName}</p>
    </div>
  );
}
