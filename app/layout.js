"use client"; 
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import React, { createContext, useState } from "react";

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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <UserDataContext.Provider value={{ transcriptData, setTranscriptData }}>
          {children}
        </UserDataContext.Provider>
      </body>
    </html>
  );
}