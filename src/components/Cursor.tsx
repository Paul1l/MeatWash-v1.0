"use client";

import { useEffect, useRef, useState } from "react";
import {
  useMediaQuery,
  FINE_POINTER,
  REDUCED_MOTION,
} from "@/lib/useMediaQuery";

type Mode = "idle" | "link" | "drag" | "view";

const LABEL: Record<Mode, string> = {
  idle: "",
  link: "",
  drag: "листай",
  view: "смотреть",
};

/**
 * A ring that trails the real cursor — the native pointer stays visible and
 * pixel-accurate, so nothing ever feels laggy. The ring inverts what's under
 * it (mix-blend-mode: difference), so it reads on white and black sections
 * alike. Desktop + fine pointer only.
 */
export default function Cursor() {
  const ring = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<Mode>("idle");
  const [visible, setVisible] = useState(false);
  const fine = useMediaQuery(FINE_POINTER);
  const reduce = useMediaQuery(REDUCED_MOTION);
  const enabled = fine && !reduce;

  useEffect(() => {
    if (!enabled) return;

    const target = { x: innerWidth / 2, y: innerHeight / 2 };
    const soft = { ...target };
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      setVisible(true);

      const el = e.target as HTMLElement | null;
      if (!el || !el.closest) return;
      if (el.closest("[data-cursor='drag']")) setMode("drag");
      else if (el.closest("[data-cursor='view']")) setMode("view");
      else if (el.closest("a, button, input, [role='button']")) setMode("link");
      else setMode("idle");
    };

    const onLeave = () => setVisible(false);

    const frame = () => {
      raf = requestAnimationFrame(frame);
      soft.x += (target.x - soft.x) * 0.3;
      soft.y += (target.y - soft.y) * 0.3;
      if (ring.current) {
        ring.current.style.transform = `translate3d(${soft.x}px, ${soft.y}px, 0) translate(-50%, -50%)`;
      }
    };
    raf = requestAnimationFrame(frame);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled]);

  if (!enabled) return null;

  const label = LABEL[mode];
  const big = mode === "drag" || mode === "view";

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-[200] hidden lg:block ${
        visible ? "opacity-100" : "opacity-0"
      } transition-opacity duration-300`}
    >
      <div
        ref={ring}
        className="absolute left-0 top-0 grid place-items-center rounded-full border border-paper/70 transition-[width,height,background-color,border-color] duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] mix-blend-difference"
        style={{
          width: big ? 86 : mode === "link" ? 44 : 22,
          height: big ? 86 : mode === "link" ? 44 : 22,
          backgroundColor: big ? "rgba(255,255,255,0.92)" : "transparent",
          borderColor: big ? "transparent" : "rgba(255,255,255,0.7)",
        }}
      >
        {label && (
          <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink mix-blend-normal">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
