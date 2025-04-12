"use client";

import { useEffect, useRef, useContext } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import { UserDataContext } from "../layout";

export default function CalendarPage() {
  const { transcriptData } = useContext(UserDataContext); // Access the context
  const sidebarRef = useRef(null);

  useEffect(() => {
    console.log("Transcript Data from Context:", transcriptData);
  }, [transcriptData]);

  useEffect(() => {
    if (sidebarRef.current) {
      new Draggable(sidebarRef.current, {
        itemSelector: ".fc-event",
        eventData: function (eventEl) {
          return {
            title: eventEl.getAttribute("data-title"),
            start: eventEl.getAttribute("data-start"),
            end: eventEl.getAttribute("data-end"),
          };
        },
      });
    }
  }, []);

  const classes = transcriptData?.classes || []; // Default to an empty array if transcriptData or classes is undefined

  // Example events for the calendar
  const events = [
    {
      title: "Design Review",
      start: "2025-04-14T10:00:00",
      end: "2025-04-14T11:00:00",
      color: "bg-blue-500",
    },
    {
      title: "Client Call",
      start: "2025-04-15T15:00:00",
      end: "2025-04-15T16:00:00",
      color: "bg-green-500",
    },
    {
      title: "Client Test",
      start: "2025-04-15T09:00:00",
      end: "2025-04-15T16:00:00",
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="flex flex-col gap-8 p-4">
      {/* Classes Section */}
      <div>
        <h1 className="text-2xl font-bold">Classes</h1>
        <ul className="list-disc pl-6">
          {classes.map((className, index) => (
            <li key={index} className="text-lg">
              {className}
            </li>
          ))}
        </ul>
      </div>

      {/* Calendar Section */}
      <div className="flex gap-4">
        {/* Sidebar for draggable events */}
        <div ref={sidebarRef} className="w-48 space-y-2 border p-2" id="events">
          <p className="mb-2 font-bold">Draggable Events</p>
          {events.map((event, index) => (
            <div
              key={index}
              className={`fc-event cursor-move rounded ${event.color} px-2 py-1 text-white`}
              data-title={event.title}
              data-start={event.start}
              data-end={event.end}
            >
              {event.title}
            </div>
          ))}
        </div>

        {/* FullCalendar Component */}
        <div className="flex-1">
          <FullCalendar
            plugins={[timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            initialDate="2025-04-14"
            slotMinTime="08:00:00"
            slotMaxTime="22:00:00"
            weekends={false}
            allDaySlot={false}
            headerToolbar={false}
            height="auto"
            editable={true}
            droppable={true}
          />
        </div>
      </div>
    </div>
  );
}