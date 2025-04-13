import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

export default function CourseItem({ courseName, isRecommended }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: courseName,
    });

  if (transform) {
    transform.scaleX = 1;
    transform.scaleY = 1;
  }

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        zIndex: isDragging ? 100 : 1,
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
