"use client";
// import { useState } from "react";
import FullCalendar from "@fullcalendar/react";

import timeGridPlugin from "@fullcalendar/timegrid";
export default function CalendarPage() {
  const events = [
    {
      title: "Morning Standup",
      start: "2025-04-14T09:00:00",
      end: "2025-04-14T09:30:00",
    },
    {
      title: "Team Meeting",
      start: "2025-04-15T10:00:00",
      end: "2025-04-15T11:00:00",
    },
    {
      title: "Project Work",
      start: "2025-04-16T13:00:00",
      end: "2025-04-16T17:00:00",
    },
  ];

  return (
    <div className="min-h-screen p-4">
      <FullCalendar
        plugins={[timeGridPlugin]}
        initialView="timeGridWeek"
        initialDate="2025-04-14"
        slotMinTime="08:00:00"
        slotMaxTime="22:00:00"
        allDaySlot={false}
        height="auto"
        headerToolbar={false}
        weekends={false}
        events={events}
      />
    </div>
  );
}
