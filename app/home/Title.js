export default function Title() {
  return (
    <div className="flex w-[50%] flex-col gap-3">
      <h1 className="text-7xl font-bold text-[var(--text-primary)]">
        Slug Scheduler
      </h1>
      <h2 className="text-3xl font-medium text-[var(--text-primary)]">
        Next quarter&apos;s{" "}
        <span className="font-bold text-[var(--text-primary)] italic">
          perfect{" "}
        </span>
        schedule, just minutes away
      </h2>
    </div>
  );
}
