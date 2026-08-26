"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CAR_TYPES, PROGRAMS, type CarType } from "@/data/programs";
import { money } from "@/data/services";
import BookButton from "./BookButton";

export default function ProgramsExplorer() {
  const [type, setType] = useState<CarType>("sedan");
  const label = CAR_TYPES.find((c) => c.id === type)!.label;

  return (
    <>
      {/* selector */}
      <div className="sticky top-[var(--header-h)] z-30 border-b border-line bg-paper">
        <div className="shell flex items-center justify-between gap-6 py-3 sm:py-4">
          <span className="eyebrow hidden shrink-0 text-muted sm:block">
            Тип кузова
          </span>
          <div className="-mx-1 min-w-0 flex-1 overflow-x-auto [scrollbar-width:none] sm:flex-none [&::-webkit-scrollbar]:hidden">
            <div className="flex gap-1 px-1">
              {CAR_TYPES.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setType(c.id)}
                  className={`relative shrink-0 px-4 py-2.5 text-[13.5px] font-semibold transition-colors duration-300 sm:px-5 sm:text-[14px] ${
                    type === c.id ? "text-paper" : "text-muted hover:text-ink"
                  }`}
                >
                  {type === c.id && (
                    <motion.span
                      layoutId="car-type-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-ink"
                      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    />
                  )}
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* comparison */}
      <section className="bg-paper py-20 md:py-24">
        <div className="shell">
          <h2
            className="display-bold text-[clamp(1.9rem,1.3rem+2.4vw,3.4rem)]"
            data-reveal
          >
            Сравнение программ
          </h2>
          <p
            className="lead mt-5 max-w-[54ch] text-muted"
            data-reveal
            style={{ "--reveal-delay": "80ms" } as React.CSSProperties}
          >
            Цены указаны для типа кузова «{label.toLowerCase()}». Каждая
            программа включает всё из предыдущей.
          </p>

          {/* mobile: stacked rows */}
          <ul className="mt-10 border-t border-ink md:hidden" data-reveal>
            {PROGRAMS.map((p) => (
              <li key={p.slug} className="border-b border-line">
                <a href={`#${p.slug}`} className="block py-5">
                  <div className="flex items-start justify-between gap-5">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand">
                        {p.kicker}
                      </span>
                      <h3 className="mt-1.5 text-[18px] font-bold leading-tight tracking-[-0.025em]">
                        {p.name}
                      </h3>
                      <p className="mt-1.5 text-[13px] text-muted">
                        {p.duration} · {p.includes.length} пунктов
                      </p>
                    </div>
                    <span className="shrink-0 whitespace-nowrap text-[17px] font-bold tabular-nums">
                      {money(p.price[type])}
                    </span>
                  </div>
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-12 hidden overflow-x-auto md:block" data-reveal>
            <table className="w-full min-w-[720px] border-collapse text-left">
              <thead>
                <tr className="border-b border-ink">
                  <th className="eyebrow pb-4 pr-6 text-muted">Программа</th>
                  <th className="eyebrow pb-4 pr-6 text-muted">Время</th>
                  <th className="eyebrow pb-4 pr-6 text-muted">Что входит</th>
                  <th className="eyebrow pb-4 text-right text-muted">Цена</th>
                </tr>
              </thead>
              <tbody>
                {PROGRAMS.map((p) => (
                  <tr
                    key={p.slug}
                    className="group border-b border-line align-top transition-colors duration-300 hover:bg-bone"
                  >
                    <td className="py-6 pr-6">
                      <a
                        href={`#${p.slug}`}
                        className="text-[18px] font-bold tracking-[-0.025em] transition-colors group-hover:text-brand"
                      >
                        {p.name}
                      </a>
                      <span className="mt-1.5 block text-[12px] font-semibold uppercase tracking-[0.14em] text-brand">
                        {p.kicker}
                      </span>
                    </td>
                    <td className="py-6 pr-6 text-[15px] text-muted">
                      {p.duration}
                    </td>
                    <td className="py-6 pr-6 text-[15px] leading-relaxed text-muted">
                      {p.includes.slice(0, 3).join(" · ")}
                      {p.includes.length > 3 &&
                        ` · ещё ${p.includes.length - 3}`}
                    </td>
                    <td className="py-6 text-right">
                      <AnimatePresence mode="popLayout" initial={false}>
                        <motion.span
                          key={`${p.slug}-${type}`}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.3 }}
                          className="block whitespace-nowrap text-[18px] font-bold tabular-nums"
                        >
                          {money(p.price[type])}
                        </motion.span>
                      </AnimatePresence>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* detail blocks */}
      {PROGRAMS.map((p, i) => {
        const dark = i % 2 === 1;
        return (
          <section
            key={p.slug}
            id={p.slug}
            className={`scroll-mt-[132px] md:scroll-mt-[calc(var(--header-h)+68px)] ${dark ? "bg-ink text-paper" : "bg-bone text-ink"}`}
          >
            <div className="shell grid items-center gap-12 py-20 md:grid-cols-2 md:gap-20 md:py-28">
              <div
                className={`relative aspect-[4/5] overflow-hidden rounded-[32px] ${i % 2 === 1 ? "md:order-2" : ""}`}
                data-reveal-mask
              >
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>

              <div className={i % 2 === 1 ? "md:order-1" : ""}>
                <div className="flex items-center gap-4" data-reveal>
                  <span
                    className={`font-mono text-[12px] font-medium ${dark ? "text-brand-bright" : "text-brand"}`}
                  >
                    {p.index}
                  </span>
                  <span
                    className={`h-px w-10 ${dark ? "bg-line-dark" : "bg-line"}`}
                  />
                  <span className="eyebrow opacity-60">{p.duration}</span>
                </div>

                <h2
                  className="display-bold mt-6 text-[clamp(1.9rem,1.3rem+2.4vw,3.4rem)]"
                  data-reveal
                  style={{ "--reveal-delay": "60ms" } as React.CSSProperties}
                >
                  {p.name}
                </h2>

                <p
                  className={`lead mt-6 ${dark ? "text-muted-dark" : "text-muted"}`}
                  data-reveal
                  style={{ "--reveal-delay": "120ms" } as React.CSSProperties}
                >
                  {p.summary}
                </p>

                <ul
                  className={`mt-9 grid divide-y rounded-[24px] border px-6 ${dark ? "divide-line-dark border-line-dark" : "divide-line border-line"}`}
                  data-reveal
                  style={{ "--reveal-delay": "160ms" } as React.CSSProperties}
                >
                  {p.includes.map((inc) => (
                    <li
                      key={inc}
                      className="flex items-start gap-3 py-3.5 text-[15px]"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className={`mt-1 h-4 w-4 shrink-0 ${dark ? "text-brand-bright" : "text-brand"}`}
                        fill="none"
                        aria-hidden
                      >
                        <path
                          d="M4 12.5l5 5L20 6.5"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        />
                      </svg>
                      {inc}
                    </li>
                  ))}
                </ul>

                <div
                  className={`mt-9 flex flex-wrap items-center justify-between gap-6 border-t pt-7 ${dark ? "border-line-dark" : "border-line"}`}
                  data-reveal
                  style={{ "--reveal-delay": "200ms" } as React.CSSProperties}
                >
                  <div>
                    <span className="eyebrow opacity-55">{label}</span>
                    <p className="mt-2 text-[30px] font-bold tabular-nums tracking-[-0.035em]">
                      {money(p.price[type])}
                    </p>
                  </div>
                  <BookButton
                    variant={dark ? "outline-light" : "solid"}
                    service={`${p.name} · ${label}`}
                  >
                    Записаться
                  </BookButton>
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
}
