"use client";

import Image from "next/image";
import { useRef, type ReactNode } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useMediaQuery, REDUCED_MOTION, DESKTOP } from "@/lib/useMediaQuery";
import SplitText from "./SplitText";

/**
 * The car arrives filthy and leaves clean, driven entirely by scroll.
 *
 * Four stages cross-fade over a pinned section while the frame pushes in and
 * drifts, so the camera reads as circling the car rather than sitting still.
 * Stages were generated from the studio's own photo of the M5 (Higgsfield,
 * Nano Banana 2) — same bay, same angle, same car, four conditions.
 */

const STAGES = [
  {
    src: "/img/wash-dirty.jpg",
    alt: "BMW M5 покрыт дорожной грязью и реагентом",
    label: "Как приехала",
    caption: "Зимняя соль в порах лака, налёт на порогах и дисках.",
    // fade window and the camera move that plays under it
    at: [0.0, 0.3] as const,
    zoom: [1.18, 1.1] as const,
    pan: [-2.5, -1.2] as const,
  },
  {
    src: "/img/wash-foam.jpg",
    alt: "BMW M5 под слоем активной пены",
    label: "Активная пена",
    caption: "Пена поднимает грязь с лака, не растирая её по кузову.",
    at: [0.22, 0.55] as const,
    zoom: [1.1, 1.05] as const,
    pan: [-1.2, 1.4] as const,
  },
  {
    src: "/img/wash-rinse.jpg",
    alt: "Смыв пены с BMW M5 аппаратом высокого давления",
    label: "Смыв",
    caption: "Вода уходит листом — значит, поверхность действительно чистая.",
    at: [0.47, 0.8] as const,
    zoom: [1.05, 1.02] as const,
    pan: [1.4, 2.2] as const,
  },
  {
    src: "/img/wash-clean.jpg",
    alt: "Чистый BMW M5 после детейлинг-мойки Meat Wash",
    label: "Как уехала",
    caption: "Глубокий цвет, чистые диски, стёкла без разводов.",
    at: [0.72, 1.0] as const,
    zoom: [1.02, 1.0] as const,
    pan: [2.2, 0] as const,
  },
];

export default function WashHero({
  eyebrow,
  lines,
  sub,
  actions,
  meta,
}: {
  eyebrow: string;
  lines: string[];
  sub?: string;
  actions?: ReactNode;
  meta?: ReactNode;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const reduce = useMediaQuery(REDUCED_MOTION);
  const desktop = useMediaQuery(DESKTOP);
  const moveCamera = desktop && !reduce;

  const { scrollYProgress } = useScroll({
    target: wrap,
    offset: ["start start", "end end"],
  });
  const p = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 40,
    mass: 0.3,
  });

  // The copy block fades out as the wash finishes so the clean car stands alone.
  const copyOpacity = useTransform(p, [0, 0.62, 0.82], [1, 1, 0]);
  const copyY = useTransform(p, [0, 0.82], ["0%", "-12%"]);

  return (
    <div ref={wrap} className="relative h-[340svh]">
      <div className="vignette sticky top-0 flex h-[100svh] flex-col justify-end overflow-hidden bg-ink text-paper">
        <div className="absolute inset-0 -z-10">
          {STAGES.map((s, i) => (
            <Stage
              key={s.src}
              stage={s}
              progress={p}
              priority={i === 0}
              moveCamera={moveCamera}
              isFirst={i === 0}
              isLast={i === STAGES.length - 1}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-ink/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/72 via-ink/5 to-transparent" />
        </div>

        <motion.div
          style={{ opacity: copyOpacity, y: copyY }}
          className="shell relative w-full pb-24 pt-40 sm:pb-28 md:pb-32"
        >
          <p className="eyebrow flex items-center gap-3.5 text-paper/85">
            <span className="h-px w-9 bg-brand-bright" />
            {eyebrow}
          </p>

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
            <p className="lead mt-8 max-w-[46ch] text-paper/80">{sub}</p>
          )}
          {actions && (
            <div className="mt-10 flex flex-wrap items-center gap-6">{actions}</div>
          )}
          {meta && (
            <div className="mt-14 border-t border-paper/15 pt-7">{meta}</div>
          )}
        </motion.div>

        <StageCaption progress={p} />
        <Progress progress={p} />
      </div>
    </div>
  );
}

function Stage({
  stage,
  progress,
  priority,
  moveCamera,
  isFirst,
  isLast,
}: {
  stage: (typeof STAGES)[number];
  progress: ReturnType<typeof useSpring>;
  priority: boolean;
  moveCamera: boolean;
  isFirst: boolean;
  isLast: boolean;
}) {
  const [from, to] = stage.at;
  const fade = (to - from) * 0.3;

  // The first stage starts opaque and the last one stays opaque — only the
  // middle stages both arrive and leave.
  const { range, values } = fadeWindow(from, to, fade, isFirst, isLast);
  const opacity = useTransform(progress, range, values, { clamp: true });

  const scale = useTransform(progress, [from, to], [...stage.zoom], {
    clamp: true,
  });
  const x = useTransform(
    progress,
    [from, to],
    stage.pan.map((v) => `${v}%`) as string[],
    { clamp: true },
  );

  return (
    <motion.div
      style={moveCamera ? { opacity, scale, x } : { opacity }}
      className="absolute inset-0 will-change-[opacity,transform]"
    >
      <Image
        src={stage.src}
        alt={stage.alt}
        fill
        priority={priority}
        sizes="100vw"
        className="object-cover object-center"
      />
    </motion.div>
  );
}

/** Fade keyframes for a stage, honouring the open and closing ends. */
function fadeWindow(
  from: number,
  to: number,
  fade: number,
  isFirst: boolean,
  isLast: boolean,
) {
  if (isFirst) return { range: [0, to - fade, to], values: [1, 1, 0] };
  if (isLast) return { range: [from, from + fade, 1], values: [0, 1, 1] };
  return {
    range: [from, from + fade, to - fade, to],
    values: [0, 1, 1, 0],
  };
}

/** Names the stage the viewer is looking at, bottom-right. */
function StageCaption({ progress }: { progress: ReturnType<typeof useSpring> }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden md:block">
      <div className="shell">
        <div className="relative h-[132px]">
          {STAGES.map((s, i) => {
            const [from, to] = s.at;
            const w = fadeWindow(
              from,
              to,
              (to - from) * 0.3,
              i === 0,
              i === STAGES.length - 1,
            );
            return (
              <StageCaptionItem
                key={s.src}
                stage={s}
                progress={progress}
                range={w.range}
                values={w.values}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StageCaptionItem({
  stage,
  progress,
  range,
  values,
}: {
  stage: (typeof STAGES)[number];
  progress: ReturnType<typeof useSpring>;
  range: readonly number[];
  values: readonly number[];
}) {
  const opacity = useTransform(progress, [...range], [...values], {
    clamp: true,
  });
  return (
    <motion.div
      style={{ opacity }}
      className="absolute bottom-8 right-0 max-w-[34ch] text-right"
    >
      <p className="eyebrow text-brand-bright">{stage.label}</p>
      <p className="mt-2.5 text-[15px] leading-relaxed text-paper/75">
        {stage.caption}
      </p>
    </motion.div>
  );
}

/** Thin wash-progress rail along the bottom edge. */
function Progress({ progress }: { progress: ReturnType<typeof useSpring> }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-paper/15">
      <motion.div
        className="h-full w-full origin-left bg-brand"
        style={{ scaleX: progress }}
      />
    </div>
  );
}
