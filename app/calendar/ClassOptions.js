import { useState } from "react";

import CourseItem from "./CourseItem";
import Container from "./Container";

const MAX_DEFAULT_COURSES = 4;

export default function ClassOptions({ classes = [] }) {
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
