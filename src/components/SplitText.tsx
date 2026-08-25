"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { useMediaQuery, REDUCED_MOTION } from "@/lib/useMediaQuery";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Per-character mask reveal. Words stay unbroken for wrapping; each character
 * rises out of its own clip so long Cyrillic headlines still read cleanly.
 */
export default function SplitText({
  text,
  className = "",
  delay = 0,
  stagger = 0.018,
  duration = 0.95,
  as: Tag = "span",
  trigger = "view",
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  duration?: number;
  as?: "span" | "h1" | "h2" | "h3" | "p";
  trigger?: "view" | "mount";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -12% 0px" });
  const reduce = useMediaQuery(REDUCED_MOTION);

  const go = reduce || trigger === "mount" || inView;
  const words = text.split(" ");
  let index = 0;

  return (
    <Tag className={className}>
      <span ref={ref as never} className="inline">
        {words.map((word, w) => (
          <span key={`${word}-${w}`} className="inline-block whitespace-nowrap">
            {Array.from(word).map((char) => {
              const i = index++;
              return (
                <span
                  key={i}
                  className="inline-block overflow-hidden align-bottom"
                  style={{ paddingBottom: "0.12em", marginBottom: "-0.12em" }}
                >
                  <motion.span
                    className="inline-block"
                    initial={reduce ? false : { y: "110%" }}
                    animate={go ? { y: "0%" } : { y: "110%" }}
                    transition={{
                      duration,
                      delay: delay + i * stagger,
                      ease: EASE,
                    }}
                  >
                    {char}
                  </motion.span>
                </span>
              );
            })}
            {w < words.length - 1 && <span className="inline-block">&nbsp;</span>}
          </span>
        ))}
      </span>
    </Tag>
  );
}
