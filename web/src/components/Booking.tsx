"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "motion/react";
import { BRANCHES, SITE } from "@/data/site";
import { lockScroll } from "./SmoothScroll";

type Ctx = { open: (service?: string) => void; close: () => void };
const BookingCtx = createContext<Ctx>({ open: () => {}, close: () => {} });

export const useBooking = () => useContext(BookingCtx);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [service, setService] = useState<string | undefined>();

  const open = useCallback((s?: string) => {
    setService(s);
    setIsOpen(true);
  }, []);
  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    document.documentElement.classList.add("no-scroll");
    lockScroll(true);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.classList.remove("no-scroll");
      lockScroll(false);
    };
  }, [isOpen, close]);

  const value = useMemo(() => ({ open, close }), [open, close]);

  return (
    <BookingCtx.Provider value={value}>
      {children}
      <AnimatePresence>
        {isOpen && <BookingModal service={service} onClose={close} />}
      </AnimatePresence>
    </BookingCtx.Provider>
  );
}

function BookingModal({
  service,
  onClose,
}: {
  service?: string;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label="Запись на мойку"
    >
      <motion.button
        type="button"
        aria-label="Закрыть"
        className="absolute inset-0 cursor-default bg-ink/70 backdrop-blur-[3px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35 }}
        onClick={onClose}
      />
      <motion.div
        className="relative flex max-h-[92svh] w-full max-w-[820px] flex-col overflow-hidden rounded-t-[32px] bg-paper sm:m-6 sm:max-h-[86svh] sm:rounded-[32px]"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 24, opacity: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex shrink-0 items-start justify-between gap-6 border-b border-line px-6 py-6 sm:px-10 sm:py-8">
          <div>
            <p className="eyebrow text-brand">Запись</p>
            <h2 className="mt-3 text-2xl font-bold tracking-[-0.03em] sm:text-3xl">
              Выберите комплекс
            </h2>
            {service && (
              <p className="mt-2 text-sm text-muted">
                Услуга: <span className="text-ink">{service}</span>
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть"
            className="-mr-2 -mt-2 grid h-11 w-11 shrink-0 place-items-center rounded-full text-muted transition-colors hover:text-ink"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
              <path
                d="M5 5l14 14M19 5L5 19"
                stroke="currentColor"
                strokeWidth="1.6"
              />
            </svg>
          </button>
        </div>

        <div className="grid min-h-0 flex-1 divide-y divide-line overflow-y-auto sm:grid-cols-2 sm:divide-x sm:divide-y-0">
          {BRANCHES.map((b) => (
            <div key={b.id} className="bg-paper p-6 sm:p-10">
              <p className="eyebrow text-muted">{b.kind}</p>
              <h3 className="mt-3 text-xl font-bold tracking-[-0.02em]">
                {b.short}
              </h3>
              <p className="mt-1 text-[15px] text-muted">{b.address}</p>
              <p className="mt-1 text-[13px] text-muted">{b.hoursShort}</p>

              <div className="mt-7 flex flex-col gap-2.5">
                <a
                  href={SITE.booking}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group inline-flex items-center justify-between gap-4 rounded-full bg-ink px-5 py-4 text-[15px] font-semibold text-paper transition-colors hover:bg-brand"
                >
                  Записаться онлайн
                  <Arrow />
                </a>
                <a
                  href={`tel:${b.phoneHref}`}
                  className="group inline-flex items-center justify-between gap-4 rounded-full border border-line px-5 py-4 text-[15px] font-semibold transition-colors hover:border-ink"
                >
                  {b.phone}
                  <Arrow />
                </a>
                <a
                  href={`https://wa.me/${b.phoneHref.replace("+", "")}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group inline-flex items-center justify-between gap-4 px-5 py-3 text-[14px] font-medium text-muted transition-colors hover:text-ink"
                >
                  Написать в WhatsApp
                  <Arrow />
                </a>
              </div>
            </div>
          ))}
        </div>

        <p className="shrink-0 border-t border-line px-6 py-5 text-[13px] leading-relaxed text-muted sm:px-10">
          Онлайн-запись работает 24/7. Новым клиентам — защитное кварцевое
          покрытие кузова в подарок.
        </p>
      </motion.div>
    </div>
  );
}

function Arrow() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4 shrink-0 transition-transform duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
      aria-hidden="true"
    >
      <path
        d="M4 12h15m0 0-6-6m6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.6"
        fill="none"
      />
    </svg>
  );
}
