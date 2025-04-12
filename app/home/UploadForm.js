"use client";

import React, { useState } from "react";

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

      {/* Upload Form */}
      <div className="flex h-60 cursor-pointer flex-col items-center justify-center rounded-md border-4 border-dashed border-[var(--text-primary)] bg-[var(--container-secondary)] p-2">
        <p className="text-center text-3xl font-bold text-[var(--text-primary)]">
          Upload your Transcript
        </p>
        <p className="text-center text-xl text-[var(--text-primary)]">
          Drag and Drop or <span className="underline">Click Here</span>
        </p>
      </div>
    </section>
  );
}
