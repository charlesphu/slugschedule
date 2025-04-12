"use client";

import React from "react";
import { sendPrompt } from "./hooks/aiPrompt";

export default function Home() {
  return (
    <button
      onClick={() => {
        sendPrompt("Hello");
      }}>
      Hello World
    </button>
  );
}
