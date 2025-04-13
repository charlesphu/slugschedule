"use client";
import { useContext } from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";

const MAX_DEFAULT_COURSES = 4;
const TEST_COURSES = [
  {
    code: "BIOE 120 - 01",
    name: "Marine Botany",
    schedule: {
      dayAndTime: "TuTh 08:25AM-10:00AM",
      location: "LEC: CoastBio 110",
      instructionMode: "In Person",
    },
    enrollment: {
      enrolled: 98,
      capacity: 95,
    },
  },
  {
    code: "BIOE 120L - 01",
    name: "Marine Botany Lab",
    schedule: {
      dayAndTime: "W 10:30AM-01:30PM",
      location: "LAB: Lg Discovery 128",
      instructionMode: "In Person",
    },
    enrollment: {
      enrolled: 25,
      capacity: 24,
    },
  },
  {
    code: "BIOE 120L - 02",
    name: "Marine Botany Lab",
    schedule: {
      dayAndTime: "W 02:15PM-05:15PM",
      location: "LAB: Lg Discovery 128",
      instructionMode: "In Person",
    },
    enrollment: {
      enrolled: 24,
      capacity: 23,
    },
  },
  {
    code: "BIOE 120L - 03",
    name: "Marine Botany Lab",
    schedule: {
      dayAndTime: "Th 10:30AM-01:30PM",
      location: "LAB: Lg Discovery 128",
      instructionMode: "In Person",
    },
    enrollment: {
      enrolled: 23,
      capacity: 25,
    },
  },
  {
    code: "BIOE 120L - 04",
    name: "Marine Botany Lab",
    schedule: {
      dayAndTime: "Th 02:15PM-05:15PM",
      location: "LAB: Lg Discovery 128",
      instructionMode: "In Person",
    },
    enrollment: {
      enrolled: 26,
      capacity: 24,
    },
  },
  {
    code: "BIOE 121 - 01",
    name: "Plants, Earth, Climate",
    schedule: {
      dayAndTime: "MW 03:25PM-05:00PM",
      location: "LEC: CoastBio 110",
      instructionMode: "In Person",
    },
    enrollment: {
      enrolled: 53,
      capacity: 60,
    },
  },
  {
    code: "BIOE 125 - 01",
    name: "Ecosystems of Calif",
    schedule: {
      dayAndTime: "Not specified",
      location: "LEC: Online",
      instructionMode: "Asynchronous Online",
    },
    enrollment: {
      enrolled: 64,
      capacity: 64,
    },
  },
  {
    code: "BIOE 128L - 01",
    name: "LrgMarineVertebField",
    schedule: {
      dayAndTime: "TuTh 09:00AM-01:00PM",
      location: "FLD: CoastBio 203",
      instructionMode: "In Person",
    },
    enrollment: {
      enrolled: 14,
      capacity: 14,
    },
  },
  {
    code: "BIOE 129 - 01",
    name: "Biol Marine Mammals",
    schedule: {
      dayAndTime: "MW 10:00AM-11:35AM",
      location: "LEC: CoastBio 110",
      instructionMode: "In Person",
    },
    enrollment: {
      enrolled: 125,
      capacity: 112,
    },
  },
  {
    code: "BIOE 129L - 01",
    name: "Marine Mammals Lab",
    schedule: {
      dayAndTime: "M 12:00PM-03:00PM",
      location: "LAB: CoastBio 115",
      instructionMode: "In Person",
    },
    enrollment: {
      enrolled: 36,
      capacity: 31,
    },
  },
  {
    code: "BIOE 129L - 02",
    name: "Marine Mammals Lab",
    schedule: {
      dayAndTime: "Tu 08:30AM-11:30AM",
      location: "LAB: CoastBio 115",
      instructionMode: "In Person",
    },
    enrollment: {
      enrolled: 33,
      capacity: 30,
    },
  },
  {
    code: "BIOE 129L - 03",
    name: "Marine Mammals Lab",
    schedule: {
      dayAndTime: "W 12:00PM-03:00PM",
      location: "LAB: CoastBio 115",
      instructionMode: "In Person",
    },
    enrollment: {
      enrolled: 33,
      capacity: 30,
    },
  },
  {
    code: "BIOE 136 - 01",
    name: "Enviro Physiology",
    schedule: {
      dayAndTime: "MW 01:25PM-03:00PM",
      location: "LEC: CoastBio 110",
      instructionMode: "In Person",
    },
    enrollment: {
      enrolled: 68,
      capacity: 60,
    },
  },
  {
    code: "BIOE 149 - 01",
    name: "Disease Ecology",
    schedule: {
      dayAndTime: "TuTh 10:25AM-12:00PM",
      location: "LEC: CoastBio 110",
      instructionMode: "In Person",
    },
    enrollment: {
      enrolled: 58,
      capacity: 60,
    },
  },
  {
    code: "BIOE 151A - 01",
    name: "Ecol Field Methods",
    schedule: {
      dayAndTime: "Not specified",
      location: "FLD: TBD In Person",
      instructionMode: "In Person",
    },
    enrollment: {
      enrolled: 24,
      capacity: 28,
    },
  },
  {
    code: "BIOE 151B - 01",
    name: "Ecol Fld Mthds Lab",
    schedule: {
      dayAndTime: "Not specified",
      location: "FLD: TBD In Person",
      instructionMode: "In Person",
    },
    enrollment: {
      enrolled: 24,
      capacity: 28,
    },
  },
  {
    code: "BIOE 151C - 01",
    name: "Terrestrial Ecosys",
    schedule: {
      dayAndTime: "Not specified",
      location: "FLD: TBD In Person",
      instructionMode: "In Person",
    },
    enrollment: {
      enrolled: 24,
      capacity: 28,
    },
  },
  {
    code: "BIOE 151D - 01",
    name: "Conserv/Practice",
    schedule: {
      dayAndTime: "Not specified",
      location: "FLD: TBD In Person",
      instructionMode: "In Person",
    },
    enrollment: {
      enrolled: 19,
      capacity: 28,
    },
  },
  {
    code: "BIOE 189F - 01",
    name: "Special Topics: EEB",
    schedule: {
      dayAndTime: "M 03:25PM-05:00PM",
      location: "SEM: CoastBio 203",
      instructionMode: "In Person",
    },
    enrollment: {
      enrolled: 28,
      capacity: 28,
    },
  },
  {
    code: "BIOE 203 - 01",
    name: "Intro Seminar EEB",
    schedule: {
      dayAndTime: "M 10:00AM-12:00PM",
      location: "SEM: CoastBio 203",
      instructionMode: "In Person",
    },
    enrollment: {
      enrolled: 13,
      capacity: 15,
    },
  },
  {
    code: "BIOE 215 - 01",
    name: "Adv Seminar EEB",
    schedule: {
      dayAndTime: "Not specified",
      location: "SEM: TBD In Person",
      instructionMode: "In Person",
    },
    enrollment: {
      enrolled: 1,
      capacity: 0,
    },
  },
  {
    code: "BIOE 281A - 01",
    name: "Appld Marine Ecolog",
    schedule: {
      dayAndTime: "Not specified",
      location: "SEM: TBD In Person",
      instructionMode: "In Person",
    },
    enrollment: {
      enrolled: 2,
      capacity: 15,
    },
  },
  {
    code: "BIOE 281B - 01",
    name: "Molecular Evolution",
    schedule: {
      dayAndTime: "Not specified",
      location: "SEM: TBD In Person",
      instructionMode: "In Person",
    },
    enrollment: {
      enrolled: 3,
      capacity: 15,
    },
  },
  {
    code: "BIOE 281C - 01",
    name: "Physiological Ecol",
    schedule: {
      dayAndTime: "Not specified",
      location: "SEM: TBD In Person",
      instructionMode: "In Person",
    },
    enrollment: {
      enrolled: 6,
      capacity: 15,
    },
  },
  {
    code: "BIOE 281D - 01",
    name: "Global Chng Ecology",
    schedule: {
      dayAndTime: "Not specified",
      location: "SEM: TBD In Person",
      instructionMode: "In Person",
    },
    enrollment: {
      enrolled: 6,
      capacity: 15,
    },
  },
  {
    code: "BIOE 281E - 01",
    name: "Freshwater Ecology",
    schedule: {
      dayAndTime: "Not specified",
      location: "SEM: TBD In Person",
      instructionMode: "In Person",
    },
    enrollment: {
      enrolled: 5,
      capacity: 15,
    },
  },
  {
    code: "BIOE 281G - 01",
    name: "SexualSel/Soci Behav",
    schedule: {
      dayAndTime: "Not specified",
      location: "SEM: TBD In Person",
      instructionMode: "In Person",
    },
    enrollment: {
      enrolled: 3,
      capacity: 15,
    },
  },
  {
    code: "BIOE 281H - 01",
    name: "Comp Marine Phys",
    schedule: {
      dayAndTime: "Not specified",
      location: "SEM: TBD In Person",
      instructionMode: "In Person",
    },
    enrollment: {
      enrolled: 3,
      capacity: 15,
    },
  },
  {
    code: "BIOE 281I - 01",
    name: "DiseaseEco/Population",
    schedule: {
      dayAndTime: "Not specified",
      location: "SEM: TBD In Person",
      instructionMode: "In Person",
    },
    enrollment: {
      enrolled: 2,
      capacity: 15,
    },
  },
  {
    code: "BIOE 281J - 01",
    name: "Evolutionary Genomics",
    schedule: {
      dayAndTime: "Not specified",
      location: "SEM: TBD In Person",
      instructionMode: "In Person",
    },
    enrollment: {
      enrolled: 3,
      capacity: 15,
    },
  },
  {
    code: "BIOE 281K - 01",
    name: "Plant Evolution",
    schedule: {
      dayAndTime: "Not specified",
      location: "SEM: TBD In Person",
      instructionMode: "In Person",
    },
    enrollment: {
      enrolled: 3,
      capacity: 15,
    },
  },
  {
    code: "BIOE 281M - 01",
    name: "Population Genomics",
    schedule: {
      dayAndTime: "Not specified",
      location: "SEM: TBD In Person",
      instructionMode: "In Person",
    },
    enrollment: {
      enrolled: 0,
      capacity: 15,
    },
  },
  {
    code: "BIOE 281N - 01",
    name: "Marine Vert Ecology",
    schedule: {
      dayAndTime: "Not specified",
      location: "SEM: TBD In Person",
      instructionMode: "In Person",
    },
    enrollment: {
      enrolled: 3,
      capacity: 15,
    },
  },
  {
    code: "BIOE 281O - 01",
    name: "PlantWaterRelations",
    schedule: {
      dayAndTime: "Not specified",
      location: "SEM: TBD In Person",
      instructionMode: "In Person",
    },
    enrollment: {
      enrolled: 2,
      capacity: 15,
    },
  },
];

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
          className={`w-[${underscoreWidth}] h-1.5 rounded-md bg-[var(--container-secondary)]`}></div>
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

function ClassOptions() {
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
        {TEST_COURSES.map((courseData, index) => {
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

function ClassSchedule() {
  const [isHoveringUpload, setIsHoveringUpload] = useState(false);

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
      <div className="h-[22.5rem] w-[35rem] overflow-y-hidden">
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
        />
      </div>
    </Container>
  );
}

export default function CalendarPage() {
  return (
    <div className="relative h-screen w-full">
      {/* Title */}
      <Title />

      {/* Content */}
      <div className="relative z-1 flex h-screen w-full items-center justify-center gap-12 pt-20">
        <DndContext>
          <ClassOptions />
          <ClassSchedule />
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
