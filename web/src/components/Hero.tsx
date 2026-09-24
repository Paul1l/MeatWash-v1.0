"use client";

import Image from "next/image";
import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import WaterCanvas from "./WaterCanvas";
import SplitText from "./SplitText";

const EASE = [0.16, 1, 0.3, 1] as const;

export function HomeHero({
  image,
  alt,
  eyebrow,
  lines,
  sub,
  actions,
  meta,
}: {
  image: string;
  alt: string;
  eyebrow: string;
  lines: string[];
  sub?: string;
  actions?: ReactNode;
  meta?: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.07]);

  return (
    <div
      ref={ref}
      className="vignette relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden bg-ink text-paper"
    >
      <motion.div style={{ y, scale }} className="absolute inset-0 -z-10">
        <Image
          src={image}
          alt={alt}
          fill
          priority
          sizes="100vw"
          className="scale-[1.04] object-cover"
        />
        <div className="absolute inset-0">
          <WaterCanvas src={image} className="absolute inset-0" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-ink/25" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/78 via-transparent to-transparent" />
      </motion.div>

      <motion.div
        style={{ opacity }}
        className="shell relative w-full pb-24 pt-40 sm:pb-28 md:pb-32"
      >
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: EASE }}
          className="eyebrow flex items-center gap-3.5 text-paper/85"
        >
          <span className="h-px w-9 bg-brand-bright" />
          {eyebrow}
        </motion.p>

        <h1 className="display mt-6 max-w-[19ch] text-[clamp(2.9rem,1.6rem+6.4vw,8rem)]">
          {lines.map((line, i) => (
            <SplitText
              key={line}
              text={line}
              trigger="mount"
              delay={0.42 + i * 0.16}
              stagger={0.022}
              duration={1.05}
              className="block"
            />
          ))}
        </h1>

        {sub && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.95, duration: 0.85, ease: EASE }}
            className="lead mt-8 max-w-[46ch] text-paper/80"
          >
            {sub}
          </motion.p>
        )}

        {actions && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.08, duration: 0.85, ease: EASE }}
            className="mt-10 flex flex-wrap items-center gap-6"
          >
            {actions}
          </motion.div>
        )}

        {meta && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.35, duration: 0.9 }}
            className="mt-14 border-t border-paper/15 pt-7"
          >
            {meta}
          </motion.div>
        )}
      </motion.div>

      <motion.div
        style={{ opacity }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
        className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center"
      >
        <span className="flex h-10 w-6 items-start justify-center rounded-full border border-paper/30 p-1.5">
          <motion.span
            className="block h-1.5 w-1.5 rounded-full bg-paper/80"
            animate={{ y: [0, 12, 0], opacity: [1, 0.2, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.div>
    </div>
  );
}

export function PageHero({
  image,
  alt,
  eyebrow,
  title,
  sub,
  actions,
  align = "left",
  compact = false,
}: {
  image: string;
  alt: string;
  eyebrow: string;
  title: string;
  sub?: string;
  actions?: ReactNode;
  align?: "left" | "center";
  compact?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);

  return (
    <div
      ref={ref}
      className={`vignette relative isolate flex overflow-hidden bg-ink text-paper ${
        compact ? "min-h-[62svh]" : "min-h-[78svh]"
      } ${align === "center" ? "items-center justify-center text-center" : "items-end"}`}
    >
      <motion.div style={{ y }} className="absolute inset-0 -z-10">
        <Image
          src={image}
          alt={alt}
          fill
          priority
          sizes="100vw"
          className="scale-105 object-cover"
        />
        <div className="absolute inset-0">
          <WaterCanvas src={image} drops={0.65} className="absolute inset-0" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/35" />
      </motion.div>

      <div
        className={`shell w-full pb-14 pt-36 sm:pb-20 ${
          align === "center" ? "flex flex-col items-center" : ""
        }`}
      >
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22, duration: 0.7, ease: EASE }}
          className={`eyebrow flex items-center gap-3.5 text-paper/85 ${
            align === "center" ? "justify-center" : ""
          }`}
        >
          <span className="h-px w-9 bg-brand-bright" />
          {eyebrow}
        </motion.p>

        <SplitText
          as="h1"
          text={title}
          trigger="mount"
          delay={0.32}
          stagger={0.02}
          className={`display-bold mt-5 text-[clamp(2.4rem,1.5rem+4.4vw,5.5rem)] ${
            align === "center" ? "max-w-[18ch]" : "max-w-[16ch]"
          }`}
        />

        {sub && (
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.62, duration: 0.8, ease: EASE }}
            className="lead mt-7 max-w-[52ch] text-paper/80"
          >
            {sub}
          </motion.p>
        )}

        {actions && (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.76, duration: 0.8, ease: EASE }}
            className="mt-9 flex flex-wrap items-center gap-6"
          >
            {actions}
          </motion.div>
        )}
      </div>
    </div>
  );
}
