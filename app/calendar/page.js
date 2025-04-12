"use client";

import { useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";

export default function CalendarPage() {
  const sidebarRef = useRef(null);

  // Initialize draggable events
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
    <div className="flex gap-4 p-4">
      {/* Sidebar */}
      <div ref={sidebarRef} className="w-48 space-y-2 border p-2" id="events">
        <p className="mb-2 font-bold">Draggable Events</p>
        {events.map((event, index) => (
          <div
            key={index}
            className={`fc-event cursor-move rounded ${event.color} px-2 py-1 text-white`}
            data-title={event.title}
            data-start={event.start}
            data-end={event.end}>
            {event.title}
          </div>
        ))}
      </div>

      {/* Calendar */}
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
          eventReceive={(info) => {
            const el = info.draggedEl;

            // Override with original times
            info.event.setStart(el.getAttribute("data-start"));
            info.event.setEnd(el.getAttribute("data-end"));

            // Optionally remove from sidebar
            el.parentNode.removeChild(el);
          }}
          eventDragStop={(info) => {
            const sidebar = document.getElementById("events");

            const sidebarRect = sidebar.getBoundingClientRect();
            const { clientX: x, clientY: y } = info.jsEvent;

            const inSidebar =
              x >= sidebarRect.left &&
              x <= sidebarRect.right &&
              y >= sidebarRect.top &&
              y <= sidebarRect.bottom;
            console.log(inSidebar);
            if (inSidebar) {
              // 1. Remove from calendar
              info.event.remove();

              // 2. Recreate DOM element for sidebar
              const eventEl = document.createElement("div");
              eventEl.innerText = info.event.title;
              eventEl.className =
                "fc-event cursor-move rounded bg-blue-500 px-2 py-1 text-white mb-2";
              eventEl.setAttribute("data-title", info.event.title);
              eventEl.setAttribute(
                "data-start",
                info.event.start.toISOString()
              );
              eventEl.setAttribute("data-end", info.event.end.toISOString());

              sidebar.appendChild(eventEl);

              // 3. Re-init draggable on the new element
              new Draggable(sidebar, {
                itemSelector: ".fc-event",
                eventData: function (eventEl) {
                  return {
                    title: eventEl.getAttribute("data-title"),
                    start: eventEl.getAttribute("data-start"),
                    end: eventEl.getAttribute("data-end"),
                  };
                },
              });
            } else {
              const el = info.draggedEl;

              // Override with original times
              info.event.setStart(el.getAttribute("data-start"));
              info.event.setEnd(el.getAttribute("data-end"));
            }
          }}
        />
      </div>
    </div>
  );
}
