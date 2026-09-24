import Image from "next/image";
import Link from "next/link";
import type { Program } from "@/data/programs";
import type { ServiceGroup } from "@/data/services";
import { money } from "@/data/services";
import { ArrowIcon } from "./ui";

export function ProgramCard({
  program,
  index,
  dark = false,
}: {
  program: Program;
  index: number;
  dark?: boolean;
}) {
  return (
    <Link
      href={`/programmy#${program.slug}`}
      className="group flex w-[78vw] max-w-[420px] flex-col sm:w-[52vw] lg:w-[26vw]"
      data-reveal
      style={{ "--reveal-delay": `${index * 70}ms` } as React.CSSProperties}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-mist">
        <Image
          src={program.image}
          alt={program.name}
          fill
          sizes="(max-width: 640px) 78vw, (max-width: 1024px) 52vw, 26vw"
          className="img-zoom object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/70 to-transparent" />
        <span className="absolute left-5 top-5 rounded-full bg-paper/95 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-ink">
          {program.kicker}
        </span>
        <span className="absolute bottom-5 left-5 text-[13px] font-medium text-paper/90">
          {program.duration}
        </span>
      </div>

      <div className="mt-6 flex flex-1 flex-col">
        <div className="flex min-h-[2.6em] items-baseline justify-between gap-4">
          <h3
            className={`text-[22px] font-bold leading-tight tracking-[-0.03em] ${dark ? "text-paper" : "text-ink"}`}
          >
            {program.name}
          </h3>
          <span
            className={`shrink-0 font-mono text-[12px] ${dark ? "text-muted-dark" : "text-muted"}`}
          >
            {program.index}
          </span>
        </div>
        <p
          className={`mb-5 mt-3 line-clamp-3 text-[15px] leading-relaxed ${dark ? "text-muted-dark" : "text-muted"}`}
        >
          {program.summary}
        </p>
        <div
          className={`mt-auto flex items-center justify-between border-t pt-4 ${dark ? "border-line-dark" : "border-line"}`}
        >
          <span
            className={`text-[15px] font-semibold ${dark ? "text-paper" : "text-ink"}`}
          >
            от {money(program.price.sedan)}
          </span>
          <ArrowIcon
            className={`h-4 w-4 ${dark ? "text-brand-bright" : "text-brand"}`}
          />
        </div>
      </div>
    </Link>
  );
}

export function ServiceCard({
  group,
  index,
}: {
  group: ServiceGroup;
  index: number;
}) {
  const from = Math.min(...group.items.map((i) => i.price));
  return (
    <Link
      href={`/uslugi#${group.slug}`}
      className="group relative block overflow-hidden rounded-[28px] bg-ink text-paper"
      data-reveal
      style={{ "--reveal-delay": `${(index % 4) * 80}ms` } as React.CSSProperties}
    >
      <div className="relative aspect-[3/2] sm:aspect-[4/3]">
        <Image
          src={group.image}
          alt={group.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="img-zoom object-cover opacity-70 transition-opacity duration-700 group-hover:opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
      </div>

      <div className="absolute inset-x-0 bottom-0 p-6 lg:p-7">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h3 className="text-[19px] font-bold leading-tight tracking-[-0.025em] lg:text-[21px]">
              {group.title}
            </h3>
            <p className="mt-2 text-[13px] text-paper/65">
              {group.items.length} услуг · от {money(from)}
            </p>
          </div>
          <ArrowIcon className="mb-1 h-4 w-4 text-brand-bright" />
        </div>
      </div>
    </Link>
  );
}
