"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useMediaQuery, DESKTOP } from "@/lib/useMediaQuery";
import { PROGRAMS } from "@/data/programs";
import { money } from "@/data/services";
import Rail from "./Rail";
import { ProgramCard } from "./cards";
import { ArrowIcon } from "./ui";

/**
 * Desktop: the section pins and the card track travels sideways as you scroll.
 * Below lg it degrades to the draggable rail.
 *
 * The scroll-driven track lives in its own component so its useScroll target
 * only exists when that markup is actually mounted.
 */
export default function PinnedPrograms() {
  const pinned = useMediaQuery(DESKTOP);

  if (!pinned) {
    return (
      <div className="mt-14">
        <Rail className="shell" label="Программы мойки">
          {PROGRAMS.map((p, i) => (
            <ProgramCard key={p.slug} program={p} index={i} />
          ))}
        </Rail>
      </div>
    );
  }

  return <PinnedTrack />;
}

function PinnedTrack() {
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    const measure = () => {
      const el = track.current;
      if (!el) return;
      setDistance(Math.max(0, el.scrollWidth - window.innerWidth + 96));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (track.current) ro.observe(track.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: wrap,
    offset: ["start start", "end end"],
  });
  const raw = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  const x = useSpring(raw, { stiffness: 140, damping: 28, mass: 0.4 });
  const barScale = useSpring(scrollYProgress, {
    stiffness: 160,
    damping: 30,
    mass: 0.3,
  });

  return (
    <div ref={wrap} style={{ height: `calc(100vh + ${distance}px)` }}>
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <motion.div
          ref={track}
          style={{ x }}
          className="flex w-max items-stretch gap-8 pl-[clamp(1.25rem,1rem+2.2vw,4.5rem)] pr-24"
        >
          {PROGRAMS.map((p) => (
            <Link
              key={p.slug}
              href={`/programmy#${p.slug}`}
              className="group relative flex h-[62vh] w-[30vw] max-w-[460px] shrink-0 flex-col justify-end overflow-hidden bg-ink"
            >
              <Image
                src={p.image}
                alt={p.name}
                fill
                sizes="32vw"
                className="img-zoom object-cover opacity-80 transition-opacity duration-700 group-hover:opacity-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-transparent" />

              <div className="absolute left-7 top-7 flex items-center gap-3">
                <span className="bg-paper px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-ink">
                  {p.kicker}
                </span>
                <span className="text-[12px] font-semibold text-paper/70">
                  {p.duration}
                </span>
              </div>

              <div className="relative p-7 text-paper">
                <span className="font-mono text-[12px] font-medium text-brand-bright">
                  {p.index}
                </span>
                <h3 className="mt-3 text-[clamp(1.5rem,1.1rem+1vw,2.1rem)] font-bold leading-[1.05] tracking-[-0.035em]">
                  {p.name}
                </h3>
                <p className="mt-3 max-w-[34ch] text-[14px] leading-relaxed text-paper/70">
                  {p.summary}
                </p>
                <div className="mt-6 flex items-center justify-between border-t border-paper/20 pt-4">
                  <span className="text-[16px] font-semibold">
                    от {money(p.price.sedan)}
                  </span>
                  <ArrowIcon className="h-4 w-4 text-brand-bright" />
                </div>
              </div>
            </Link>
          ))}

          <div className="flex w-[26vw] shrink-0 items-center">
            <Link
              href="/programmy"
              className="group flex flex-col gap-5 pl-4 text-ink"
            >
              <span className="eyebrow text-brand">Дальше</span>
              <span className="max-w-[12ch] text-[clamp(1.6rem,1.2rem+1.4vw,2.6rem)] font-bold leading-[1.02] tracking-[-0.04em]">
                Сравнить все программы
              </span>
              <span className="grid h-14 w-14 place-items-center rounded-full border border-ink transition-colors duration-500 group-hover:bg-ink group-hover:text-paper">
                <ArrowIcon className="h-5 w-5" />
              </span>
            </Link>
          </div>
        </motion.div>

        <div className="shell mt-12 flex items-center gap-6">
          <span className="eyebrow text-muted">Прокрутите</span>
          <div className="relative h-px flex-1 bg-line">
            <motion.span
              className="absolute inset-y-0 left-0 w-full origin-left bg-brand"
              style={{ scaleX: barScale }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
