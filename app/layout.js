"use client";
import "./globals.css";

import { Geist, Geist_Mono } from "next/font/google";
import React, { createContext, useState } from "react";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const UserDataContext = createContext();

export default function RootLayout({ children }) {
  const [transcriptData, setTranscriptData] = useState(null); // State for transcript data

  return (
    <html lang="en">
      <head>
        {/* Only include React-Scan in development */}
        {/* {process.env.NODE_ENV === "development" && (
          <Script
            crossOrigin="anonymous"
            src="//unpkg.com/react-scan/dist/auto.global.js"
          />
        )} */}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <UserDataContext.Provider value={{ transcriptData, setTranscriptData }}>
          {children}
        </UserDataContext.Provider>
      </body>
    </html>
  );
}
