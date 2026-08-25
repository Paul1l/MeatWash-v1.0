"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

export default function Rail({
  children,
  className = "",
  dark = false,
  label,
}: {
  children: ReactNode;
  className?: string;
  dark?: boolean;
  label?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState({ start: true, end: false });
  const [progress, setProgress] = useState(0);
  const [ratio, setRatio] = useState(1);

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setState({ start: el.scrollLeft <= 4, end: el.scrollLeft >= max - 4 });
    setProgress(max > 0 ? el.scrollLeft / max : 0);
    setRatio(el.scrollWidth > 0 ? el.clientWidth / el.scrollWidth : 1);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [update]);

  const step = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    const first = el.firstElementChild as HTMLElement | null;
    const w = first ? first.offsetWidth + 24 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * w, behavior: "smooth" });
  };

  const btn = `grid h-12 w-12 place-items-center border transition-all duration-300 disabled:opacity-25 ${
    dark
      ? "border-paper/25 text-paper hover:border-paper hover:bg-paper hover:text-ink"
      : "border-line text-ink hover:border-ink hover:bg-ink hover:text-paper"
  }`;

  return (
    <div className={className}>
      <div
        ref={ref}
        className="rail gap-6 pb-2"
        role="region"
        aria-label={label}
        tabIndex={0}
      >
        {children}
      </div>

      <div className="mt-9 flex items-center gap-6">
        <div className="flex gap-2.5">
          <button
            type="button"
            className={btn}
            onClick={() => step(-1)}
            disabled={state.start}
            aria-label="Назад"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
              <path
                d="M20 12H5m0 0 6-6m-6 6 6 6"
                stroke="currentColor"
                strokeWidth="1.6"
              />
            </svg>
          </button>
          <button
            type="button"
            className={btn}
            onClick={() => step(1)}
            disabled={state.end}
            aria-label="Вперёд"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
              <path
                d="M4 12h15m0 0-6-6m6 6-6 6"
                stroke="currentColor"
                strokeWidth="1.6"
              />
            </svg>
          </button>
        </div>

        <div
          className={`relative h-px flex-1 ${dark ? "bg-paper/20" : "bg-line"}`}
        >
          <span
            className="absolute inset-y-0 left-0 bg-brand"
            style={{
              width: `${Math.max(8, Math.min(100, ratio * 100))}%`,
              transform: `translateX(${progress * (100 / Math.max(0.08, Math.min(1, ratio)) - 100)}%)`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
