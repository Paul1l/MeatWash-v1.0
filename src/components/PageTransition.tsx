"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Mark } from "./Logo";

const EASE = [0.76, 0, 0.24, 1] as const;
const COLUMNS = 5;

/**
 * Full-screen column wipe between routes.
 * Internal link clicks are intercepted: cover → navigate → uncover.
 * Anything unusual (new tab, modifier keys, hash, external) falls through
 * to normal navigation.
 */
export default function PageTransition() {
  const [phase, setPhase] = useState<"idle" | "cover" | "uncover">("idle");
  const pathname = usePathname();
  const router = useRouter();
  const pending = useRef<string | null>(null);
  const from = useRef(pathname);

  const cover = useCallback(
    (href: string) => {
      pending.current = href;
      setPhase("cover");
      window.setTimeout(() => {
        router.push(href);
      }, 520);
    },
    [router],
  );

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const a = (e.target as HTMLElement | null)?.closest?.(
        "a",
      ) as HTMLAnchorElement | null;
      if (!a) return;
      if (a.target && a.target !== "_self") return;
      if (a.hasAttribute("download")) return;

      const href = a.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:")) return;
      if (href.startsWith("tel:")) return;

      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname) return;

      e.preventDefault();
      cover(url.pathname + url.search);
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [cover]);

  useEffect(() => {
    if (from.current === pathname) return;
    from.current = pathname;
    pending.current = null;
    window.scrollTo(0, 0);
    setPhase("uncover");
    const t = window.setTimeout(() => setPhase("idle"), 900);
    return () => window.clearTimeout(t);
  }, [pathname]);

  const covering = phase === "cover";
  const showing = phase !== "idle";

  return (
    <AnimatePresence>
      {showing && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-[150]"
          initial={false}
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
        >
          <div className="absolute inset-0 flex">
            {Array.from({ length: COLUMNS }).map((_, i) => (
              <motion.div
                key={i}
                className="h-full flex-1 bg-ink"
                initial={{ scaleY: covering ? 0 : 1 }}
                animate={{ scaleY: covering ? 1 : 0 }}
                style={{ originY: covering ? 1 : 0 }}
                transition={{
                  duration: 0.62,
                  ease: EASE,
                  delay: (covering ? i : COLUMNS - 1 - i) * 0.045,
                }}
              />
            ))}
          </div>

          <motion.div
            className="absolute inset-0 grid place-items-center text-paper"
            initial={{ opacity: 0 }}
            animate={{ opacity: covering ? 1 : 0 }}
            transition={{ duration: 0.35, delay: covering ? 0.28 : 0 }}
          >
            <Mark className="h-8 w-auto animate-pulse" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
