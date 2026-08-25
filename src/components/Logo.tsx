type MarkProps = { className?: string };

export function Mark({ className = "" }: MarkProps) {
  return (
    <svg
      viewBox="0 0 57 40"
      aria-hidden="true"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* droplet stem */}
      <path
        d="M11 3.5C13.2 12.6 15 20 15 27.8A7 7 0 0 1 1 27.8C1 20 8 12 11 3.5Z"
        fill="currentColor"
      />
      {/* arch 1 */}
      <path
        d="M20 32.5V26a6 6 0 0 1 12 0v6.5"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="round"
      />
      {/* arch 2 */}
      <path
        d="M40 32.5V26a6 6 0 0 1 12 0v6.5"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Wordmark({
  className = "",
  stacked = false,
}: {
  className?: string;
  stacked?: boolean;
}) {
  return (
    <span
      className={`inline-flex font-extrabold lowercase tracking-[-0.055em] ${
        stacked ? "items-start gap-[0.34em]" : "items-center gap-[0.36em]"
      } ${className}`}
    >
      <Mark
        className={stacked ? "mt-[0.06em] h-[0.72em] w-auto" : "h-[0.78em] w-auto"}
      />
      <span
        className={
          stacked
            ? "flex flex-col leading-[0.84]"
            : "flex gap-[0.24em] leading-none"
        }
      >
        <span>meat</span>
        <span>wash</span>
      </span>
    </span>
  );
}

export default function Logo({ className = "" }: MarkProps) {
  return <Wordmark className={className} />;
}
