import Link from "next/link";
import { BRANCHES, NAV, SITE } from "@/data/site";
import { SERVICE_GROUPS } from "@/data/services";
import { Wordmark } from "./Logo";
import BookButton from "./BookButton";
import { ArrowIcon } from "./ui";

export default function Footer() {
  const year = 2026;

  return (
    <footer className="bg-ink text-paper">
      <div className="shell">
        {/* CTA */}
        <div className="grid gap-10 border-b border-line-dark py-16 md:grid-cols-[1.2fr_1fr] md:items-end md:py-24">
          <div>
            <p className="eyebrow text-brand-bright" data-reveal>
              Запись 24/7
            </p>
            <h2
              className="display-bold mt-5 text-[clamp(2.2rem,1.4rem+3.4vw,4.5rem)]"
              data-reveal
              style={{ "--reveal-delay": "60ms" } as React.CSSProperties}
            >
              Отдайте машину
              <br />
              людям, которым не лень.
            </h2>
          </div>
          <div
            className="flex flex-col items-start gap-6"
            data-reveal
            style={{ "--reveal-delay": "140ms" } as React.CSSProperties}
          >
            <p className="text-[15px] leading-relaxed text-muted-dark">
              Выберите удобное время онлайн или позвоните — подскажем программу
              под состояние машины и уложимся в ваше окно.
            </p>
            <BookButton variant="ghost" size="lg">
              Записаться онлайн
            </BookButton>
          </div>
        </div>

        {/* columns */}
        <div className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4 lg:py-20">
          <div>
            <Link href="/" className="inline-block text-[26px]">
              <Wordmark />
            </Link>
            <p className="mt-6 max-w-[30ch] text-[14px] leading-relaxed text-muted-dark">
              Сеть детейлинг-моек в Москве. Ручная мойка, химчистка, полировка,
              керамика и оклейка.
            </p>
            <div className="mt-7 flex items-center gap-2.5">
              <span className="text-[26px] font-bold leading-none tracking-[-0.04em]">
                {SITE.rating.toLocaleString("ru-RU", { minimumFractionDigits: 1 })}
              </span>
              <div className="text-[12px] leading-tight text-muted-dark">
                <span className="block text-paper">Яндекс Карты</span>
                {SITE.ratingsCount} оценки · {SITE.reviewsCount} отзыва
              </div>
            </div>
          </div>

          <div>
            <p className="eyebrow text-muted-dark">Разделы</p>
            <ul className="mt-6 flex flex-col gap-3.5">
              {NAV.map((n) => (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    className="group inline-flex items-center gap-2 text-[15px] text-paper/85 transition-colors hover:text-paper"
                  >
                    <span className="underline-grow pb-0.5">{n.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow text-muted-dark">Услуги</p>
            <ul className="mt-6 flex flex-col gap-3.5">
              {SERVICE_GROUPS.slice(0, 6).map((g) => (
                <li key={g.slug}>
                  <Link
                    href={`/uslugi#${g.slug}`}
                    className="group inline-flex items-center gap-2 text-[15px] text-paper/85 transition-colors hover:text-paper"
                  >
                    <span className="underline-grow pb-0.5">{g.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow text-muted-dark">Адреса</p>
            <ul className="mt-6 flex flex-col gap-7">
              {BRANCHES.map((b) => (
                <li key={b.id}>
                  <p className="text-[15px] font-semibold">{b.short}</p>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-muted-dark">
                    {b.address}
                    <br />
                    {b.hoursShort}
                  </p>
                  <a
                    href={`tel:${b.phoneHref}`}
                    className="mt-2 inline-block text-[15px] font-semibold tabular-nums transition-colors hover:text-brand-bright"
                  >
                    {b.phone}
                  </a>
                  <a
                    href={b.mapUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="group mt-2 flex items-center gap-2 text-[13px] text-muted-dark transition-colors hover:text-paper"
                  >
                    <span className="underline-grow pb-0.5">
                      Открыть на Яндекс Картах
                    </span>
                    <ArrowIcon className="h-3.5 w-3.5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-line-dark py-8 text-[13px] text-muted-dark sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {SITE.legalName}
          </p>
          <p className="max-w-[62ch] sm:text-right">
            Не является публичной офертой. Стоимость зависит от типа кузова и
            состояния автомобиля — уточняйте при записи.
          </p>
        </div>
      </div>
    </footer>
  );
}
