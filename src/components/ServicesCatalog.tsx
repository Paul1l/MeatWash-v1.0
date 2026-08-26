"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { SERVICE_GROUPS, money } from "@/data/services";
import BookButton from "./BookButton";

export default function ServicesCatalog() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<string>("all");

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SERVICE_GROUPS.map((g) => ({
      ...g,
      items: q
        ? g.items.filter((i) => i.name.toLowerCase().includes(q))
        : g.items,
    })).filter(
      (g) =>
        g.items.length > 0 && (active === "all" || active === g.slug || q !== ""),
    );
  }, [query, active]);

  const total = groups.reduce((n, g) => n + g.items.length, 0);

  return (
    <>
      {/* controls */}
      <div className="sticky top-[var(--header-h)] z-30 border-b border-line bg-paper">
        <div className="shell flex flex-col gap-2 py-2.5 lg:flex-row lg:items-center lg:gap-8 lg:py-3.5">
          <div className="relative -mx-1 min-w-0 flex-1 overflow-x-auto [mask-image:linear-gradient(to_right,#000_calc(100%-28px),transparent)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex gap-1 px-1">
              {[{ slug: "all", short: "Все" }, ...SERVICE_GROUPS].map((g) => (
                <button
                  key={g.slug}
                  type="button"
                  onClick={() => {
                    setActive(g.slug);
                    setQuery("");
                    if (g.slug !== "all") {
                      document
                        .getElementById(g.slug)
                        ?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }
                  }}
                  className={`relative shrink-0 whitespace-nowrap px-4 py-2.5 text-[13px] font-semibold transition-colors duration-300 ${
                    active === g.slug && !query
                      ? "text-paper"
                      : "text-muted hover:text-ink"
                  }`}
                >
                  {active === g.slug && !query && (
                    <motion.span
                      layoutId="svc-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-ink"
                      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    />
                  )}
                  {g.short}
                </button>
              ))}
            </div>
          </div>

          <div className="relative shrink-0 lg:w-[230px]">
            <svg
              viewBox="0 0 24 24"
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
              fill="none"
              aria-hidden
            >
              <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.6" />
              <path d="m16 16 4.5 4.5" stroke="currentColor" strokeWidth="1.6" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Найти услугу"
              aria-label="Поиск по услугам"
              className="w-full rounded-full border border-line bg-transparent py-2 pl-9 pr-4 text-[15px] outline-none transition-colors placeholder:text-muted focus:border-ink lg:py-2.5"
            />
          </div>
        </div>
      </div>

      {query && (
        <div className="shell pt-8">
          <p className="text-[14px] text-muted">
            Найдено: <span className="text-ink">{total}</span>
          </p>
        </div>
      )}

      {groups.length === 0 && (
        <div className="shell py-24 text-center">
          <p className="text-[18px] font-semibold">Ничего не нашли</p>
          <p className="mt-3 text-[15px] text-muted">
            Попробуйте другое слово — или просто позвоните, подскажем.
          </p>
        </div>
      )}

      {groups.map((g, gi) => (
        <section
          key={g.slug}
          id={g.slug}
          className={`scroll-mt-[168px] md:scroll-mt-[calc(var(--header-h)+68px)] ${gi % 2 === 1 ? "bg-bone" : "bg-paper"}`}
        >
          <div className="shell grid gap-12 py-16 md:grid-cols-[0.85fr_1.15fr] md:gap-16 md:py-20 lg:gap-24">
            <div className="md:sticky md:top-[calc(var(--header-h)+110px)] md:self-start">
              <div
                className="relative aspect-[4/3] overflow-hidden rounded-[28px]"
                data-reveal-mask
              >
                <Image
                  src={g.image}
                  alt={g.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 35vw"
                  className="object-cover"
                />
              </div>
              <h2
                className="display-bold mt-7 text-[clamp(1.7rem,1.2rem+1.8vw,2.6rem)]"
                data-reveal
              >
                {g.title}
              </h2>
              <p
                className="mt-4 max-w-[38ch] text-[15px] leading-relaxed text-muted"
                data-reveal
                style={{ "--reveal-delay": "80ms" } as React.CSSProperties}
              >
                {g.lead}
              </p>
            </div>

            <div>
              <ul className="border-t border-line">
                {g.items.map((item, i) => (
                  <li
                    key={item.name}
                    className="group border-b border-line"
                    data-reveal
                    style={
                      { "--reveal-delay": `${Math.min(i, 8) * 45}ms` } as React.CSSProperties
                    }
                  >
                    <div className="relative flex items-baseline justify-between gap-6 py-5 transition-[padding] duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover:pl-5">
                      <span className="absolute left-0 top-1/2 h-0 w-[3px] -translate-y-1/2 bg-brand transition-[height] duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover:h-[calc(100%-24px)]" />
                      <span className="text-[16px] leading-snug sm:text-[17px]">
                        {item.name}
                      </span>
                      <span className="shrink-0 whitespace-nowrap text-[16px] font-bold tabular-nums sm:text-[17px]">
                        {money(item.price)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-9">
                <BookButton variant="outline" service={g.title}>
                  Записаться на «{g.title.toLowerCase()}»
                </BookButton>
              </div>
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
