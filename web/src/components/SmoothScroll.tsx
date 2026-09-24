"use client";

import { useEffect } from "react";
import Lenis from "lenis";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/** Momentum scrolling. Keeps native scroll position, so IntersectionObserver
 *  and motion's useScroll keep working unchanged. */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // A trackpad already carries OS-level inertia, so stacking a long easing
    // curve on top of it reads as syrup. lerp 0.2 closes a fifth of the
    // remaining distance every frame: it only smooths the steps of a mouse
    // wheel and stays out of the way of everything else.
    const lenis = new Lenis({
      lerp: 0.2,
      smoothWheel: true,
      syncTouch: false,
      touchMultiplier: 1.6,
      wheelMultiplier: 1,
    });

    window.__lenis = lenis;

    let raf = 0;
    const frame = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    // Anchor links keep working through Lenis.
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest?.(
        'a[href^="#"]',
      ) as HTMLAnchorElement | null;
      if (!a) return;
      const id = a.getAttribute("href")?.slice(1);
      if (!id) return;
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el, { offset: -96 });
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(raf);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  return null;
}

export const lockScroll = (locked: boolean) => {
  const l = typeof window !== "undefined" ? window.__lenis : undefined;
  if (!l) return;
  if (locked) l.stop();
  else l.start();
};
