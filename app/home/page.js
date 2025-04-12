"use client";

import React, { useState } from "react";

export default function Home() {
  const [isHoveringUpload, setIsHoveringUpload] = useState(false);

  return (
    <div>
      {/* Content */}
      <div className="relative z-1 flex h-screen w-full items-center justify-between p-20">
        {/* Title */}
        <div className="flex w-[50%] flex-col gap-3">
          <h1 className="text-7xl font-bold text-[var(--text-primary)]">
            Slug Scheduler
          </h1>
          <h2 className="text-3xl font-medium text-[var(--text-primary)]">
            Next quarter's{" "}
            <span className="font-bold text-[var(--text-primary)] italic">
              perfect{" "}
            </span>
            schedule, just minutes away
          </h2>
        </div>

        {/* Upload Conainer */}
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
      </div>

      {/* Stickers and Decorations */}
      <div className="pointer-event-none absolute top-0 h-screen w-full select-none">
        <img
          className="absolute top-5 left-20 h-[20%] w-[12%] object-contain"
          src={"Decor 1.png"}
          draggable={false}
        />
        <img
          className="absolute top-2 right-20 h-[20%] w-[7%] object-contain"
          src={"Decor 2.png"}
          draggable={false}
        />
        <img
          className="absolute bottom-2 left-20 z-3 h-[30%] w-[20%] object-contain"
          src={"Slug Draw.png"}
          draggable={false}
        />
        <img
          className="absolute right-20 bottom-2 z-3 h-[30%] w-[20%] object-contain"
          src={"Decor 3.png"}
          draggable={false}
        />
      </div>
    </div>
  );
}
