"use client";

import { useCallback, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { UserDataContext } from "../layout";

import fetchRemainingClasses from "../hooks/fetchRemainingClasses";
import { suggestRecs } from "../hooks/suggestRecs";

import { DndContext } from "@dnd-kit/core";

import Title from "./Title";

import ClassOptions from "./ClassOptions";
import ClassSchedule from "./ClassSchedule";

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
      editable: false,
      draggable: false,
      startEditable: false,
      durationEditable: false,
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

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [remainingClasses, setRemainingClasses] = useState([]);

  const userDataContext = useContext(UserDataContext);
  const router = useRouter();

  const [isLoadingRecommendation, setIsLoadingRecommendation] = useState(false);

  useEffect(() => {
    if (
      !userDataContext ||
      !userDataContext.transcriptData ||
      !userDataContext.transcriptData.classes
    ) {
      router.push("/");
    } else {
      setIsLoadingRecommendation(true);
      fetchRemainingClasses(userDataContext.transcriptData.classes)
        .then((res) => {
          // setRemainingClasses(res);
          suggestRecs(res).then((classes) => {
            const rawText = classes.data.candidates[0].content.parts[0].text;
            const cleanedText = rawText.replace(/```json|```/g, "").trim();
            try {
              // Mark the first four classes as recommended
              const parsedData = JSON.parse(cleanedText);
              parsedData.forEach((course, index) => {
                if (index < 4) {
                  course.recommended = true;
                }
              });

              setIsLoadingRecommendation(false);
              setRemainingClasses(parsedData);
            } catch (error) {
              console.error(
                "Error parsing JSON:",
                error,
                "Cleaned text:",
                cleanedText
              );
            }
          });
        })
        .catch((err) => {
          console.error("Error fetching remaining classes:", err);
          setRemainingClasses([]);
        });
    }
  }, [userDataContext]);

  const handleDragEnd = useCallback(
    (event) => {
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
    },
    [remainingClasses]
  );

  const addCourseToCalendar = useCallback((courseData) => {
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
    let newEvents = createEventsFromCourse(courseData);

    // Update events and make sure the new events are unique
    setEvents((prev) => {
      const existingCourseCodes = new Set(
        prev.map((event) => event.extendedProps.courseCode)
      );

      return [
        ...prev,
        ...newEvents.filter(
          (event) => !existingCourseCodes.has(event.extendedProps.courseCode)
        ),
      ];
    });

    // Remove the course from the remaining classes by setting hidden
    setRemainingClasses((prev) => {
      return prev.map((course) => {
        if (course.code === courseData.code) {
          return { ...course, hidden: true };
        }
        return course;
      });
    });
  }, []);

  const removeCourseFromCalendar = useCallback((courseCode) => {
    // Remove the course from the calendar events
    setEvents((prev) => {
      return prev.filter(
        (event) => event.extendedProps.courseCode !== courseCode
      );
    });

    // Add the course back to the remaining classes by removing hidden
    setRemainingClasses((prev) => {
      return prev.map((course) => {
        if (course.code === courseCode) {
          return { ...course, hidden: false };
        }
        return course;
      });
    });
  }, []);

  return (
    <div className="relative h-screen w-full">
      {/* Title */}
      <Title />

      {/* Content */}
      <div className="relative z-1 flex h-screen w-full items-center justify-center gap-12 pt-20">
        <DndContext id="calendar-dnd" onDragEnd={handleDragEnd}>
          <ClassOptions
            classes={remainingClasses}
            loading={isLoadingRecommendation}
          />
          <ClassSchedule
            calendarEvents={events}
            handleRemoveEvent={removeCourseFromCalendar}
          />
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
