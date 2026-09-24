"use client";

import Image from "next/image";
import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "motion/react";

/** Full-bleed alternating image/text block with a slow parallax on the media. */
export default function Stage({
  image,
  alt,
  eyebrow,
  title,
  children,
  actions,
  flip = false,
  tone = "paper",
  ratio = "aspect-[4/5]",
}: {
  image: string;
  alt: string;
  eyebrow?: string;
  title: ReactNode;
  children?: ReactNode;
  actions?: ReactNode;
  flip?: boolean;
  tone?: "paper" | "bone" | "ink";
  ratio?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-7%", "7%"]);

  const bg =
    tone === "ink"
      ? "bg-ink text-paper"
      : tone === "bone"
        ? "bg-bone text-ink"
        : "bg-paper text-ink";
  const muted = tone === "ink" ? "text-muted-dark" : "text-muted";

  return (
    <section className={bg}>
      <div className="shell grid items-center gap-12 py-20 md:grid-cols-2 md:gap-20 md:py-28 lg:gap-28">
        <div
          ref={ref}
          className={`relative overflow-hidden rounded-[32px] ${ratio} ${flip ? "md:order-2" : ""}`}
          data-reveal-mask
        >
          <motion.div style={{ y }} className="absolute -inset-y-[8%] inset-x-0">
            <Image
              src={image}
              alt={alt}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </motion.div>
        </div>

        <div className={flip ? "md:order-1" : ""}>
          {eyebrow && (
            <p
              className={`eyebrow ${tone === "ink" ? "text-brand-bright" : "text-brand"}`}
              data-reveal
            >
              {eyebrow}
            </p>
          )}
          <h2
            className="display-bold mt-5 max-w-[14ch] text-[clamp(1.9rem,1.3rem+2.4vw,3.5rem)]"
            data-reveal
            style={{ "--reveal-delay": "60ms" } as React.CSSProperties}
          >
            {title}
          </h2>
          {children && (
            <div
              className={`mt-7 max-w-[48ch] space-y-5 text-[16px] leading-relaxed sm:text-[17px] ${muted}`}
              data-reveal
              style={{ "--reveal-delay": "120ms" } as React.CSSProperties}
            >
              {children}
            </div>
          )}
          {actions && (
            <div
              className="mt-9 flex flex-wrap items-center gap-5"
              data-reveal
              style={{ "--reveal-delay": "180ms" } as React.CSSProperties}
            >
              {actions}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
