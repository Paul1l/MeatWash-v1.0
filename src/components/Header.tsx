"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { BRANCHES, NAV, SITE } from "@/data/site";
import { Wordmark } from "./Logo";
import { useBooking } from "./Booking";
import { ArrowIcon } from "./ui";
import { lockScroll } from "./SmoothScroll";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menu, setMenu] = useState(false);
  const lastY = useRef(0);
  const pathname = usePathname();
  const { open } = useBooking();

  // Close the overlay when the route changes (adjust-state-on-prop-change pattern).
  const [renderedPath, setRenderedPath] = useState(pathname);
  if (renderedPath !== pathname) {
    setRenderedPath(pathname);
    setMenu(false);
  }

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      setHidden(y > 320 && y > lastY.current && !menu);
      lastY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [menu]);

  useEffect(() => {
    document.documentElement.classList.toggle("no-scroll", menu);
    lockScroll(menu);
    return () => {
      document.documentElement.classList.remove("no-scroll");
      lockScroll(false);
    };
  }, [menu]);

  const solid = scrolled || menu;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[transform,background-color,border-color] duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] ${
          hidden ? "-translate-y-full" : "translate-y-0"
        } ${
          solid
            ? "border-b border-line bg-paper/95 backdrop-blur-md"
            : "border-b border-transparent bg-transparent"
        }`}
        style={{ height: "var(--header-h)" }}
      >
        <div className="shell flex h-full items-center justify-between gap-8">
          <Link
            href="/"
            aria-label="Meat Wash — на главную"
            className={`text-[17px] transition-colors duration-300 sm:text-[19px] ${
              solid ? "text-ink" : "text-paper"
            }`}
          >
            <Wordmark />
          </Link>

          <nav className="hidden items-center gap-9 lg:flex">
            {NAV.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative text-[14px] font-semibold tracking-[-0.01em] transition-colors duration-300 ${
                    solid ? "text-ink" : "text-paper"
                  } ${active ? "" : "opacity-80 hover:opacity-100"}`}
                >
                  <span className="underline-grow pb-1">{item.label}</span>
                  {active && (
                    <span className="absolute -bottom-0.5 left-0 h-px w-full bg-brand" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={`tel:${BRANCHES[0].phoneHref}`}
              className={`hidden text-[14px] font-semibold tabular-nums transition-colors duration-300 xl:block ${
                solid ? "text-ink hover:text-brand" : "text-paper hover:text-brand-bright"
              }`}
            >
              {BRANCHES[0].phone}
            </a>

            <button
              type="button"
              onClick={() => open()}
              className="group hidden items-center gap-2.5 bg-brand px-5 py-3 text-[14px] font-semibold text-paper transition-colors duration-300 hover:bg-ink sm:inline-flex"
            >
              Записаться
              <ArrowIcon className="h-3.5 w-3.5" />
            </button>

            <button
              type="button"
              onClick={() => setMenu((v) => !v)}
              aria-label={menu ? "Закрыть меню" : "Открыть меню"}
              aria-expanded={menu}
              className={`relative grid h-11 w-11 place-items-center transition-colors duration-300 lg:hidden ${
                solid ? "text-ink" : "text-paper"
              }`}
            >
              <span className="sr-only">Меню</span>
              <span
                className={`absolute h-px w-6 bg-current transition-transform duration-500 [transition-timing-function:cubic-bezier(0.76,0,0.24,1)] ${
                  menu ? "rotate-45" : "-translate-y-[5px]"
                }`}
              />
              <span
                className={`absolute h-px w-6 bg-current transition-transform duration-500 [transition-timing-function:cubic-bezier(0.76,0,0.24,1)] ${
                  menu ? "-rotate-45" : "translate-y-[5px]"
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menu && (
          <motion.div
            className="fixed inset-0 z-40 bg-paper lg:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          >
            <div
              className="shell flex h-full flex-col justify-between overflow-y-auto pb-10"
              style={{ paddingTop: "calc(var(--header-h) + 24px)" }}
            >
              <nav className="flex flex-col">
                {NAV.map((item, i) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.18 + i * 0.06,
                      duration: 0.6,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="border-b border-line"
                  >
                    <Link
                      href={item.href}
                      className="flex items-center justify-between py-5 text-[clamp(1.6rem,1.1rem+2.4vw,2.6rem)] font-bold tracking-[-0.035em]"
                    >
                      {item.label}
                      <ArrowIcon className="h-5 w-5 text-brand" />
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="mt-10 flex flex-col gap-4"
              >
                <button
                  type="button"
                  onClick={() => {
                    setMenu(false);
                    open();
                  }}
                  className="group inline-flex items-center justify-between bg-brand px-6 py-5 text-[16px] font-semibold text-paper"
                >
                  Записаться онлайн
                  <ArrowIcon className="h-4 w-4" />
                </button>
                <div className="grid gap-3 sm:grid-cols-2">
                  {BRANCHES.map((b) => (
                    <a
                      key={b.id}
                      href={`tel:${b.phoneHref}`}
                      className="border border-line px-5 py-4"
                    >
                      <span className="eyebrow text-muted">{b.short}</span>
                      <span className="mt-2 block text-[15px] font-semibold tabular-nums">
                        {b.phone}
                      </span>
                    </a>
                  ))}
                </div>
                <p className="text-[13px] text-muted">
                  {SITE.tagline}. Рейтинг {SITE.rating.toLocaleString("ru-RU", { minimumFractionDigits: 1 })} на Яндекс
                  Картах.
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
