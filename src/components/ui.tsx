import Link from "next/link";
import type { ReactNode } from "react";

export function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`shrink-0 transition-transform duration-[600ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1.5 ${className}`}
      aria-hidden="true"
      fill="none"
    >
      <path d="M4 12h15m0 0-6-6m6 6-6 6" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function ArrowLink({
  href,
  children,
  external,
  className = "",
  tone = "ink",
}: {
  href: string;
  children: ReactNode;
  external?: boolean;
  className?: string;
  tone?: "ink" | "paper" | "brand";
}) {
  const color =
    tone === "paper"
      ? "text-paper"
      : tone === "brand"
        ? "text-brand"
        : "text-ink";
  const inner = (
    <>
      <span className="underline-grow pb-0.5">{children}</span>
      <ArrowIcon className="h-4 w-4" />
    </>
  );
  const cls = `group inline-flex items-center gap-2.5 text-[15px] font-semibold tracking-[-0.01em] ${color} ${className}`;

  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer noopener" className={cls}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}

export function Eyebrow({
  children,
  tone = "brand",
  className = "",
}: {
  children: ReactNode;
  tone?: "brand" | "muted" | "paper";
  className?: string;
}) {
  const color =
    tone === "muted"
      ? "text-muted"
      : tone === "paper"
        ? "text-paper/60"
        : "text-brand";
  return (
    <p className={`eyebrow ${color} ${className}`} data-reveal>
      {children}
    </p>
  );
}

export function SectionHead({
  eyebrow,
  title,
  text,
  action,
  dark = false,
  align = "left",
}: {
  eyebrow?: string;
  title: ReactNode;
  text?: ReactNode;
  action?: ReactNode;
  dark?: boolean;
  align?: "left" | "center";
}) {
  return (
    <div
      className={`flex flex-col gap-8 ${
        align === "center"
          ? "items-center text-center"
          : "md:flex-row md:items-end md:justify-between"
      }`}
    >
      <div className={align === "center" ? "max-w-[64ch]" : "md:max-w-[62%]"}>
        {eyebrow && (
          <p
            className={`eyebrow ${dark ? "text-brand-bright" : "text-brand"}`}
            data-reveal
          >
            {eyebrow}
          </p>
        )}
        <h2
          className="display-bold mt-5 max-w-[15ch] text-[clamp(2.1rem,1.4rem+3vw,4.25rem)]"
          data-reveal
          style={{ "--reveal-delay": "60ms" } as React.CSSProperties}
        >
          {title}
        </h2>
        {text && (
          <p
            className={`lead mt-6 max-w-[48ch] ${dark ? "text-muted-dark" : "text-muted"}`}
            data-reveal
            style={{ "--reveal-delay": "120ms" } as React.CSSProperties}
          >
            {text}
          </p>
        )}
      </div>
      {action && (
        <div
          data-reveal
          style={{ "--reveal-delay": "180ms" } as React.CSSProperties}
        >
          {action}
        </div>
      )}
    </div>
  );
}

export function Section({
  children,
  className = "",
  tone = "paper",
  id,
}: {
  children: ReactNode;
  className?: string;
  tone?: "paper" | "bone" | "ink";
  id?: string;
}) {
  const bg =
    tone === "ink"
      ? "bg-ink text-paper"
      : tone === "bone"
        ? "bg-bone text-ink"
        : "bg-paper text-ink";
  return (
    <section id={id} className={`${bg} ${className}`}>
      {children}
    </section>
  );
}
