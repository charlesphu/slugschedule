"use client";
import React from "react";
import { sendPrompt } from "./hooks/aiPrompt";
export default function Home() {
  return (
    <button
      onClick={() => sendPrompt("what is 900 +180")}
      style={{
        all: "unset",
        cursor: "pointer",
        padding: "10px",
        border: "1px solid black",
        backgroundColor: "#f0f0f0",
      }}>
      click me!
    </button>
  );
}
