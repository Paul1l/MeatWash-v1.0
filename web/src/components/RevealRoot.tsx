"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Single global observer for scroll reveals.
 * Any element (server or client) can opt in with `data-reveal` / `data-reveal-mask`
 * and an optional `--reveal-delay` custom property.
 */
export default function RevealRoot() {
  const pathname = usePathname();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const SELECTOR = "[data-reveal], [data-reveal-mask]";

    if (reduce) {
      document.querySelectorAll<HTMLElement>(SELECTOR).forEach((el) => {
        if (el.hasAttribute("data-reveal")) el.dataset.reveal = "in";
        if (el.hasAttribute("data-reveal-mask")) el.dataset.revealMask = "in";
      });
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          if (el.hasAttribute("data-reveal")) el.dataset.reveal = "in";
          if (el.hasAttribute("data-reveal-mask")) el.dataset.revealMask = "in";
          io.unobserve(el);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
    );

    const scan = () => {
      document.querySelectorAll<HTMLElement>(SELECTOR).forEach((el) => {
        if (el.dataset.reveal === "in" || el.dataset.revealMask === "in") return;
        io.observe(el);
      });
    };

    scan();

    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [pathname]);

  return null;
}
