"use client";

import type { ReactNode } from "react";
import { useBooking } from "./Booking";
import { ArrowIcon } from "./ui";

type Variant = "solid" | "outline" | "outline-light" | "ghost" | "text";
type Size = "sm" | "md" | "lg";

const base =
  "group inline-flex items-center justify-center gap-3 font-semibold tracking-[-0.01em] transition-colors duration-300";

const variants: Record<Variant, string> = {
  solid: "bg-brand text-paper hover:bg-ink",
  outline: "border border-ink text-ink hover:bg-ink hover:text-paper",
  "outline-light":
    "border border-paper/35 text-paper hover:bg-paper hover:text-ink",
  ghost: "bg-paper text-ink hover:bg-brand hover:text-paper",
  text: "text-ink hover:text-brand",
};

const sizes: Record<Size, string> = {
  sm: "px-5 py-3 text-[14px]",
  md: "px-7 py-4 text-[15px]",
  lg: "px-9 py-5 text-[16px]",
};

export default function BookButton({
  children = "Записаться",
  service,
  variant = "solid",
  size = "md",
  className = "",
  arrow = true,
}: {
  children?: ReactNode;
  service?: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  arrow?: boolean;
}) {
  const { open } = useBooking();
  return (
    <button
      type="button"
      onClick={() => open(service)}
      className={`${base} ${variants[variant]} ${
        variant === "text" ? "" : sizes[size]
      } ${className}`}
    >
      {variant === "text" ? (
        <span className="underline-grow pb-0.5">{children}</span>
      ) : (
        children
      )}
      {arrow && <ArrowIcon className="h-4 w-4" />}
    </button>
  );
}
