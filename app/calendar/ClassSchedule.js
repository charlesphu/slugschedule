import { useDroppable } from "@dnd-kit/core";
import { useState } from "react";

import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";

import Container from "./Container";

export default function ClassSchedule({
  calendarEvents = [],
  handleRemoveEvent = () => {},
}) {
  const [isHoveringUpload, setIsHoveringUpload] = useState(false);
  const { setNodeRef } = useDroppable({
    id: "calendar-drop-area",
  });

  return (
    <Container
      title={"Class Schedule"}
      className="relative"
      onMouseEnter={() => setIsHoveringUpload(true)}
      onMouseLeave={() => setIsHoveringUpload(false)}>
      {/* Vector Image */}
      <img
        className="-0 absolute right-[8rem] z-[-1] h-30 w-30 object-contain duration-500"
        src={"Slug Book.png"}
        draggable={false}
        style={{
          top: isHoveringUpload ? "-6.5rem" : "-4.2rem",
          transition: "top 500ms ease-in-out",
        }}
      />

      {/* Calendar Section */}
      <div ref={setNodeRef} className="h-[22.5rem] w-[35rem] overflow-y-hidden">
        <FullCalendar
          plugins={[timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          initialDate="2025-04-14"
          slotMinTime="08:00:00"
          slotMaxTime="21:00:00"
          slotDuration="01:00:00"
          slotLabelInterval="02:00:00"
          weekends={false}
          allDaySlot={false}
          headerToolbar={{
            left: "",
            center: "",
            right: "",
          }}
          height="100%"
          editable={true}
          droppable={true}
          dayHeaderContent={(
            arg // Get rid of the default date format to show only weekday
          ) => arg.date.toLocaleDateString("en-US", { weekday: "short" })}
          events={calendarEvents}
          eventContent={(eventInfo) => {
            return (
              <div className="relative h-full overflow-hidden p-1">
                <button
                  className="absolute top-0 right-0 h-full w-full cursor-pointer"
                  onClick={() => {
                    handleRemoveEvent(eventInfo.event.extendedProps.courseCode);
                  }}
                />
                <div className="truncate text-sm font-medium">
                  {eventInfo.event.title}
                </div>
                {eventInfo.event.extendedProps.location && (
                  <div className="truncate text-xs text-ellipsis opacity-70">
                    {eventInfo.event.extendedProps.location}
                  </div>
                )}
              </div>
            );
          }}
        />
      </div>
    </Container>
  );
}
