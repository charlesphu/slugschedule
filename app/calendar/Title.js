import { useRouter } from "next/navigation";

export default function Title() {
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
