import { twMerge } from "tailwind-merge";

export default function Container({
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
          className="h-1.5 rounded-md bg-[var(--container-tertiary)]"
          style={{ width: underscoreWidth }}></div>
      </div>

      {/* Container Content */}
      {children}
    </section>
  );
}
