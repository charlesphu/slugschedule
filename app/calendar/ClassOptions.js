import { useState } from "react";

import CourseItem from "./CourseItem";
import Container from "./Container";

const MAX_DEFAULT_COURSES = 4;

export default function ClassOptions({ classes = [], loading = false }) {
  const [isShowingAll, setIsShowingAll] = useState(false);

  return (
    <Container title={"Class Options"}>
      {loading && (
        <div className="flex h-full w-full items-center justify-center">
          <div className="mt-5 h-10 w-10 animate-spin rounded-full border-4 border-[var(--text-primary)] border-t-transparent"></div>
        </div>
      )}
      <div
        className={`flex max-h-[50vh] gap-4 ${isShowingAll ? "grid grid-cols-2 overflow-x-hidden overflow-y-auto pt-1.5 pr-2" : "flex-col"}`}
        style={{
          scrollbarColor: "var(--text-primary) var(--container-primary)",
          transition: "all 0.2s ease-in-out",
        }}>
        {classes
          .filter((courseData) => !courseData.hidden)
          .map((courseData, index) => {
            if (!isShowingAll && index >= MAX_DEFAULT_COURSES) return null; // Limit when not showing all
            return (
              <CourseItem
                key={index}
                courseName={courseData.code}
                isRecommended={courseData.recommended} // First two are recommended
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
