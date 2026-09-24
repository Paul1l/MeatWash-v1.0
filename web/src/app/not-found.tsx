import Link from "next/link";
import { ArrowLink } from "@/components/ui";

export default function NotFound() {
  return (
    <section className="flex min-h-[80svh] items-center bg-ink text-paper">
      <div className="shell">
        <p className="eyebrow text-brand-bright">404</p>
        <h1 className="display-bold mt-6 max-w-[16ch] text-[clamp(2.2rem,1.5rem+3.4vw,4.5rem)]">
          Такой страницы нет — но машина всё ещё грязная
        </h1>
        <div className="mt-10 flex flex-wrap items-center gap-8">
          <Link
            href="/"
            className="group inline-flex items-center gap-3 bg-paper px-7 py-4 text-[15px] font-semibold text-ink transition-colors hover:bg-brand hover:text-paper"
          >
            На главную
          </Link>
          <ArrowLink href="/uslugi" tone="paper">
            Услуги и цены
          </ArrowLink>
        </div>
      </div>
    </section>
  );
}
