"use client";

import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

import { UserDataContext } from "../layout";
import useRemainingClasses from "../hooks/useRemainingClasses";

import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";

const MAX_DEFAULT_COURSES = 4;

function createEventsFromCourse(courseData) {
  const { code, name, schedule } = courseData;
  const { dayAndTime, location } = schedule;

  // Skip if no specific time
  if (dayAndTime === "Not specified") {
    return [];
  }

  // Parse day and time information
  // Example format: "TuTh 08:25AM-10:00AM" or "M 12:00PM-03:00PM"
  const dayMatch = dayAndTime.match(
    /^([MTuWThF]+)\s+(\d+:\d+(?:AM|PM))-(\d+:\d+(?:AM|PM))/
  );

  if (!dayMatch) {
    return [];
  }

  const dayStr = dayMatch[1];
  const startTime = dayMatch[2];
  const endTime = dayMatch[3];

  // Convert days string to array of day codes
  const dayMapping = {
    M: "MO",
    Tu: "TU",
    W: "WE",
    Th: "TH",
    F: "FR",
  };

  const days = [];
  let current = "";

  // Parse the day string (e.g., "TuTh" -> ["TU", "TH"])
  for (let i = 0; i < dayStr.length; i++) {
    current += dayStr[i];
    if (dayMapping[current]) {
      days.push(dayMapping[current]);
      current = "";
    }
  }

  // Create an event for each day
  const events = [];
  const baseDate = "2025-04-14"; // Monday
  const dayOffsets = { MO: 0, TU: 1, WE: 2, TH: 3, FR: 4 };

  // Convert time to 24-hour format
  const convertTo24Hour = (timeStr) => {
    const [time, modifier] = timeStr.split(/(?:AM|PM)/);
    let [hours, minutes] = time.split(":");
    hours = parseInt(hours, 10);

    if (timeStr.includes("PM") && hours < 12) {
      hours += 12;
    }
    if (timeStr.includes("AM") && hours === 12) {
      hours = 0;
    }

    return `${hours.toString().padStart(2, "0")}:${minutes}`;
  };

  const start24 = convertTo24Hour(startTime);
  const end24 = convertTo24Hour(endTime);

  days.forEach((day) => {
    const dayOffset = dayOffsets[day];
    const eventDate = new Date(baseDate);
    eventDate.setDate(eventDate.getDate() + dayOffset);

    const dateStr = eventDate.toISOString().split("T")[0];

    events.push({
      title: `${code} - ${name}`,
      start: `${dateStr}T${start24}:00`,
      end: `${dateStr}T${end24}:00`,
      backgroundColor: generateColorFromString(code),
      extendedProps: {
        location: location,
        instructionMode: schedule.instructionMode,
        courseCode: code,
      },
    });
  });

  return events;
}

// Generate a consistent color based on the course code
function generateColorFromString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const h = hash % 360;
  return `hsl(${h}, 70%, 70%)`;
}

function CourseItem({ courseName, isRecommended }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: courseName,
    });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        zIndex: isDragging ? 5 : 2,
      }}
      {...listeners}
      {...attributes}>
      <button
        className="relative flex h-15 w-40 items-center justify-center rounded-md bg-[var(--container-secondary)]"
        style={{
          scale: isDragging ? 1.05 : 1,
          boxShadow: isDragging
            ? "0 2px 10px rgba(0,0,0,0.15), 0 5px 8px rgba(0,0,0,0.12)"
            : "",
          transition: "scale 0.1s ease-in-out, box-shadow 0.1s ease-in-out",
        }}>
        <p className="text-[1.1rem] font-medium text-[var(--text-primary)]">
          {courseName}
        </p>
        {isRecommended && (
          <img
            className="pointer-events-none absolute top-[-0.3rem] right-[-0.3rem] h-8 w-8 select-none"
            src="Medal.svg"
            alt="Medal"
          />
        )}
      </button>
    </div>
  );
}

function Container({
  title,
  className,
  children,
  underscoreWidth = "60%",
  onMouseEnter,
  onMouseLeave,
}) {
  return (
    <section
      className={twMerge(
        "flex flex-col gap-5 rounded-xl bg-[var(--container-primary)] p-6 shadow-md",
        className
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}>
      {/* Container Header */}
      <div className="relative flex flex-col gap-2">
        <h3 className="text-2xl font-bold text-[var(--text-primary)]">
          {title}
        </h3>
        {/* Underscore */}
        <div
          className="h-1.5 rounded-md bg-[var(--container-secondary)]"
          style={{ width: underscoreWidth }}></div>
      </div>

      {/* Container Content */}
      {children}
    </section>
  );
}

function Title() {
  const router = useRouter();
  return (
    <div className="absolute top-10 z-5 w-full items-center text-center">
      <button
        className="cursor-pointer"
        onClick={() => {
          router.push("/");
        }}>
        <h1 className="text-5xl font-bold text-[var(--text-primary)]">
          Slug Scheduler
        </h1>
      </button>
    </div>
  );
}

function ClassOptions({ classes = [] }) {
  const [isShowingAll, setIsShowingAll] = useState(false);

  return (
    <Container
      title={"Class Options"}
      underscoreWidth={isShowingAll ? "50%" : "100%"}>
      <div
        className={`flex max-h-[50vh] gap-4 ${isShowingAll ? "grid grid-cols-2 overflow-x-hidden overflow-y-auto pt-1.5 pr-2" : "flex-col"}`}
        style={{
          scrollbarColor: "var(--text-primary) var(--container-primary)",
          transition: "all 0.2s ease-in-out",
        }}>
        {classes.map((courseData, index) => {
          if (!isShowingAll && index >= MAX_DEFAULT_COURSES) return null; // Limit when not showing all
          return (
            <CourseItem
              key={index}
              courseName={courseData.code}
              isRecommended={index < 2} // First two are recommended
            />
          );
        })}
      </div>

      {/* Show All Button */}
      <button
        className="flex h-10 w-full cursor-pointer items-center justify-center rounded-md bg-[var(--text-primary)]"
        onClick={() => {
          setIsShowingAll(!isShowingAll);
        }}>
        <p className="text-[1.3rem] font-medium text-[var(--container-primary)]">
          {isShowingAll ? "Show Less" : "Show All"}
        </p>
      </button>
    </Container>
  );
}

function ClassSchedule({ calendarEvents = [] }) {
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
              <div className="h-full overflow-hidden p-1">
                <div className="text-sm font-medium">
                  {eventInfo.event.title}
                </div>
                {eventInfo.event.extendedProps.location && (
                  <div className="truncate text-xs opacity-70">
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

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [remainingClasses, setRemainingClasses] = useState([]);

  const userDataContext = useContext(UserDataContext);
  const router = useRouter();

  useEffect(() => {
    // Reroute to home page if no user data is found
    if (
      !userDataContext ||
      !userDataContext.transcriptData ||
      !userDataContext.transcriptData.classes
    ) {
      router.push("/");
    } else {
      useRemainingClasses(userDataContext.transcriptData.classes)
        .then((res) => {
          // Ensure res is an array before setting state
          setRemainingClasses(res);
          console.log(res);
        })
        .catch((err) => {
          console.error("Error fetching remaining classes:", err);
          setRemainingClasses([]);
        });
    }
  }, [userDataContext]);

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (over && over.id === "calendar-drop-area") {
      // Find the course data based on the dragged item ID (courseName)
      const courseData = remainingClasses.find(
        (course) => course.code === active.id
      );

      if (courseData) {
        // Add the course as a new calendar event
        addCourseToCalendar(courseData);
      }
    }
  };

  const addCourseToCalendar = (courseData) => {
    // Parse the day and time information from course schedule
    const { schedule } = courseData;
    if (
      schedule.dayAndTime === "Not specified" ||
      schedule.instructionMode === "Asynchronous Online"
    ) {
      // Handle async courses or those without specific times
      alert(`${courseData.code} is asynchronous or has no specified time`);
      return;
    }

    // Create calendar events from the course data
    const newEvents = createEventsFromCourse(courseData);
    setEvents((prev) => [...prev, ...newEvents]);
  };

  return (
    <div className="relative h-screen w-full">
      {/* Title */}
      <Title />

      {/* Content */}
      <div className="relative z-1 flex h-screen w-full items-center justify-center gap-12 pt-20">
        <DndContext id="calendar-dnd" onDragEnd={handleDragEnd}>
          <ClassOptions classes={remainingClasses} />
          <ClassSchedule calendarEvents={events} />
        </DndContext>
      </div>

      {/* Stickers and Decorations */}
      <div className="pointer-event-none absolute top-0 h-screen w-full select-none">
        <img
          className="absolute top-5 left-10 h-[20%] w-[12%] object-contain"
          src={"Decor 1.png"}
          alt="Decoration"
          draggable={false}
        />
        <img
          className="absolute top-2 right-20 h-[20%] w-[7%] object-contain"
          src={"Decor 2.png"}
          alt="Decoration"
          draggable={false}
        />
        <img
          className="absolute right-10 bottom-2 z-3 h-[30%] w-[10%] object-contain"
          src={"Decor 4.png"}
          alt="Decoration"
          draggable={false}
        />
        <img
          className="absolute bottom-2 left-10 h-[30%] w-[10%] object-contain"
          src={"Decor 5.png"}
          alt="Decoration"
          draggable={false}
        />
      </div>
    </div>
  );
}
