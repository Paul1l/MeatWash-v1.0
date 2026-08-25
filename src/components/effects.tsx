"use client";

import { useEffect, useRef, type ReactNode, type CSSProperties } from "react";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  useAnimationFrame,
} from "motion/react";
import {
  useMediaQuery,
  FINE_POINTER,
  REDUCED_MOTION,
} from "@/lib/useMediaQuery";

/* ------------------------------------------------------------------ */
/* Magnetic — pulls the element toward the pointer inside a radius.     */
/* ------------------------------------------------------------------ */

export function Magnetic({
  children,
  strength = 0.34,
  radius = 110,
  className = "",
}: {
  children: ReactNode;
  strength?: number;
  radius?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const x = useSpring(0, { stiffness: 220, damping: 18, mass: 0.35 });
  const y = useSpring(0, { stiffness: 220, damping: 18, mass: 0.35 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      const reach = Math.max(r.width, r.height) / 2 + radius;
      if (dist < reach) {
        x.set(dx * strength);
        y.set(dy * strength);
      } else {
        x.set(0);
        y.set(0);
      }
    };
    const reset = () => {
      x.set(0);
      y.set(0);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", reset);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", reset);
    };
  }, [radius, strength, x, y]);

  return (
    <motion.span
      ref={ref}
      style={{ x, y }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.span>
  );
}

/* ------------------------------------------------------------------ */
/* VelocityMarquee — base drift, pushed and skewed by scroll velocity.  */
/* ------------------------------------------------------------------ */

export function VelocityMarquee({
  children,
  baseSpeed = 34,
  className = "",
}: {
  children: ReactNode;
  baseSpeed?: number;
  className?: string;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const offset = useRef(0);
  const width = useRef(1);
  const x = useMotionValue(0);

  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, {
    stiffness: 200,
    damping: 42,
    mass: 0.4,
  });
  const boost = useTransform(smooth, [-2500, 0, 2500], [-6, 0, 6], {
    clamp: true,
  });
  const skew = useTransform(smooth, [-2500, 0, 2500], [-5, 0, 5], {
    clamp: true,
  });

  useEffect(() => {
    const el = inner.current;
    if (!el) return;
    const measure = () => {
      width.current = el.scrollWidth / 2 || 1;
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useAnimationFrame((_, delta) => {
    const step = ((baseSpeed + Math.abs(boost.get()) * 34) * delta) / 1000;
    offset.current -= step;
    if (offset.current <= -width.current) offset.current += width.current;
    x.set(offset.current);
  });

  return (
    <div ref={wrap} className={`overflow-hidden ${className}`}>
      <motion.div
        ref={inner}
        style={{ x, skewX: skew }}
        className="flex w-max will-change-transform"
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Tilt — 3D tilt with a pointer-tracked spotlight.                     */
/* ------------------------------------------------------------------ */

export function Tilt({
  children,
  className = "",
  max = 7,
  style,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useSpring(0, { stiffness: 200, damping: 22 });
  const ry = useSpring(0, { stiffness: 200, damping: 22 });
  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const fine = useMediaQuery(FINE_POINTER);
  const reduce = useMediaQuery(REDUCED_MOTION);
  const on = fine && !reduce;

  const onMove = (e: React.PointerEvent) => {
    if (!on) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    ry.set((px - 0.5) * max * 2);
    rx.set(-(py - 0.5) * max * 2);
    mx.set(px * 100);
    my.set(py * 100);
  };

  const reset = () => {
    rx.set(0);
    ry.set(0);
  };

  const glow = useTransform(
    [mx, my],
    ([a, b]) =>
      `radial-gradient(420px circle at ${a}% ${b}%, rgba(255,255,255,0.16), transparent 60%)`,
  );

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={{
        rotateX: rx,
        rotateY: ry,
        transformPerspective: 900,
        transformStyle: "preserve-3d",
        ...style,
      }}
      className={`relative ${className}`}
    >
      {children}
      {on && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ backgroundImage: glow }}
        />
      )}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* StackCards — sticky cards that stack and recede as you scroll.       */
/* ------------------------------------------------------------------ */

export function StackCard({
  index,
  total,
  children,
  className = "",
}: {
  index: number;
  total: number;
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.22", "end 0.18"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const opacity = useTransform(scrollYProgress, [0, 0.85, 1], [1, 1, 0.35]);

  return (
    <div
      ref={ref}
      className="sticky"
      style={{
        top: `calc(var(--header-h) + ${28 + index * 22}px)`,
        zIndex: index + 1,
      }}
    >
      <motion.div
        style={{ scale, opacity, transformOrigin: "50% 0%" }}
        className={className}
      >
        {children}
      </motion.div>
      <span className="sr-only">
        Шаг {index + 1} из {total}
      </span>
    </div>
  );
}
