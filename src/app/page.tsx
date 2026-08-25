import Image from "next/image";
import Link from "next/link";
import { HomeHero } from "@/components/Hero";
import Stage from "@/components/Stage";
import Rail from "@/components/Rail";
import Counter from "@/components/Counter";
import BookButton from "@/components/BookButton";
import { ArrowLink, SectionHead } from "@/components/ui";
import { ProgramCard, ServiceCard } from "@/components/cards";
import { PROGRAMS } from "@/data/programs";
import { SERVICE_GROUPS } from "@/data/services";
import { REVIEWS } from "@/data/reviews";
import { BRANCHES, PROMO, SITE } from "@/data/site";

const TICKER = [
  "Ручная мойка",
  "Химчистка салона",
  "Керамика",
  "Полировка",
  "Оклейка плёнкой",
  "PDR без покраски",
  "Антидождь",
  "Детейлинг подвески",
  "Предпродажная подготовка",
];

const STEPS = [
  {
    n: "01",
    t: "Запись",
    d: "Онлайн за минуту или звонком. Выбираете время — машина заезжает без очереди.",
  },
  {
    n: "02",
    t: "Приёмка",
    d: "Смотрим состояние вместе с вами и говорим, что реально нужно, а что нет.",
  },
  {
    n: "03",
    t: "Работа",
    d: "Индивидуальный подбор химии под покрытие и загрязнение. Ничего универсального.",
  },
  {
    n: "04",
    t: "Выдача",
    d: "Показываем результат при свете. Не понравилось — переделываем на месте.",
  },
];

export default function Home() {
  return (
    <>
      <HomeHero
        image="/img/hero-rangerover.jpg"
        alt="Range Rover после мойки в Meat Wash на Мясницкой"
        eyebrow="Москва · Мясницкая · Технопарк"
        lines={["Чистим то,", "что другим лень."]}
        sub="Детейлинг-мойка в центре Москвы. Ручная работа, подбор химии под покрытие и два часа закрытого паркинга, пока вы заняты своими делами."
        actions={
          <>
            <BookButton size="lg">Записаться онлайн</BookButton>
            <ArrowLink href="/programmy" tone="paper">
              Программы мойки
            </ArrowLink>
          </>
        }
        meta={
          <dl className="grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-4">
            <div>
              <dt className="eyebrow text-paper/45">Рейтинг</dt>
              <dd className="mt-2 text-[15px] font-semibold">
                {SITE.rating.toLocaleString("ru-RU", { minimumFractionDigits: 1 })} на Яндекс Картах
              </dd>
            </div>
            <div>
              <dt className="eyebrow text-paper/45">Оценок</dt>
              <dd className="mt-2 text-[15px] font-semibold tabular-nums">
                {SITE.ratingsCount}
              </dd>
            </div>
            <div>
              <dt className="eyebrow text-paper/45">Мойка от</dt>
              <dd className="mt-2 text-[15px] font-semibold">30 минут</dd>
            </div>
            <div>
              <dt className="eyebrow text-paper/45">Запись</dt>
              <dd className="mt-2 text-[15px] font-semibold">24/7 онлайн</dd>
            </div>
          </dl>
        }
      />

      {/* ticker */}
      <div className="overflow-hidden border-b border-line bg-paper py-5">
        <div className="marquee-track flex w-max gap-10 whitespace-nowrap">
          {[0, 1].map((pass) => (
            <div key={pass} className="flex gap-10" aria-hidden={pass === 1}>
              {TICKER.map((t) => (
                <span
                  key={t}
                  className="flex items-center gap-10 text-[13px] font-semibold uppercase tracking-[0.18em] text-muted"
                >
                  {t}
                  <span className="h-1 w-1 rounded-full bg-brand" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* programs */}
      <section className="bg-paper py-20 md:py-28">
        <div className="shell">
          <SectionHead
            eyebrow="Программы мойки"
            title={<>Пять программ. От тридцати минут до полного цикла.</>}
            text="Каждая следующая включает предыдущую. Цена зависит от типа кузова — считаем честно, без «сюрпризов» при выдаче."
            action={<ArrowLink href="/programmy">Сравнить программы</ArrowLink>}
          />
        </div>

        <div className="mt-14 md:mt-16">
          <Rail
            className="shell"
            label="Программы мойки"
          >
            {PROGRAMS.map((p, i) => (
              <ProgramCard key={p.slug} program={p} index={i} />
            ))}
          </Rail>
        </div>
      </section>

      {/* process */}
      <section className="bg-bone py-20 md:py-28">
        <div className="shell">
          <SectionHead
            eyebrow="Как это устроено"
            title="Четыре шага, в которых нечего усложнять"
          />

          <div className="mt-14 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <div
                key={s.n}
                className="group bg-bone p-8 transition-colors duration-500 hover:bg-paper lg:p-10"
              >
                <div
                  data-reveal
                  style={{ "--reveal-delay": `${i * 80}ms` } as React.CSSProperties}
                >
                  <span className="text-[13px] font-bold tabular-nums text-brand">
                    {s.n}
                  </span>
                  <h3 className="mt-6 text-[22px] font-bold tracking-[-0.03em]">
                    {s.t}
                  </h3>
                  <p className="mt-4 text-[15px] leading-relaxed text-muted">
                    {s.d}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* services */}
      <section className="bg-paper py-20 md:py-28">
        <div className="shell">
          <SectionHead
            eyebrow="Услуги и цены"
            title="Восемь направлений — от пылесоса до оклейки"
            text="Полный прайс открыт: смотрите цены до визита и собирайте комплекс под свою задачу."
            action={<ArrowLink href="/uslugi">Весь прайс</ArrowLink>}
          />

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICE_GROUPS.map((g, i) => (
              <ServiceCard key={g.slug} group={g} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* stats */}
      <section className="grain relative overflow-hidden bg-ink py-20 text-paper md:py-28">
        <div className="shell relative">
          <div className="grid gap-12 md:grid-cols-[1fr_1.15fr] md:items-end">
            <div>
              <p className="eyebrow text-brand-bright" data-reveal>
                Репутация
              </p>
              <h2
                className="display-bold mt-5 text-[clamp(2rem,1.3rem+2.8vw,4rem)]"
                data-reveal
                style={{ "--reveal-delay": "60ms" } as React.CSSProperties}
              >
                Пятёрка — не маркетинг,
                <br />а среднее по 292 оценкам.
              </h2>
            </div>
            <p
              className="lead text-muted-dark"
              data-reveal
              style={{ "--reveal-delay": "120ms" } as React.CSSProperties}
            >
              Обе точки держат 5,0 на Яндекс Картах. 93% отзывов о качестве
              мойки и обслуживании — положительные, по расположению — 100%.
            </p>
          </div>

          <dl className="mt-16 grid gap-px border-t border-line-dark sm:grid-cols-2 lg:grid-cols-4">
            {[
              { v: <Counter to={5} decimals={1} />, l: "Рейтинг на Яндекс Картах" },
              { v: <Counter to={292} />, l: "Оценок по двум точкам" },
              { v: <Counter to={228} />, l: "Развёрнутых отзыва" },
              { v: <Counter to={2} />, l: "Адреса в Москве" },
            ].map((s, i) => (
              <div
                key={i}
                className="border-line-dark pt-8 sm:pr-8 lg:border-r lg:last:border-r-0"
                data-reveal
                style={{ "--reveal-delay": `${i * 90}ms` } as React.CSSProperties}
              >
                <dd className="display-bold text-[clamp(2.6rem,2rem+2.6vw,4.5rem)]">
                  {s.v}
                </dd>
                <dt className="mt-3 max-w-[22ch] text-[14px] leading-relaxed text-muted-dark">
                  {s.l}
                </dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* branches */}
      <Stage
        image={BRANCHES[0].image}
        alt="Meat Wash на Мясницкой"
        eyebrow="Мясницкая, 11"
        title={<>Флагман в 470 метрах от Лубянки</>}
        actions={
          <>
            <BookButton variant="outline">Записаться сюда</BookButton>
            <ArrowLink href="/adresa#myasnitskaya">Как проехать</ArrowLink>
          </>
        }
      >
        <p>
          Подземный паркинг под домом на Мясницкой. Оставляете машину, два часа
          закрытой парковки уже включены — а сверху Кофемания, если ждать
          хочется с комфортом.
        </p>
        <ul className="grid gap-2.5 pt-2 text-[15px]">
          {BRANCHES[0].features.map((f) => (
            <li key={f} className="flex items-start gap-3">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brand" />
              {f}
            </li>
          ))}
        </ul>
      </Stage>

      <Stage
        image={BRANCHES[1].image}
        alt="Детейлинг-центр Meat Wash Технопарк"
        eyebrow="Андропова, 8с2"
        title={<>Детейлинг-центр полного цикла</>}
        flip
        tone="bone"
        actions={
          <>
            <BookButton variant="outline">Записаться сюда</BookButton>
            <ArrowLink href="/detailing">О детейлинге</ArrowLink>
          </>
        }
      >
        <p>
          Отдельная площадка в ТЦ «Мегаполис» под работы, которым нужно время:
          полировка с керамикой, оклейка зон риска, бронирование стекла,
          порошковая покраска дисков и локальный окрас.
        </p>
        <ul className="grid gap-2.5 pt-2 text-[15px]">
          {BRANCHES[1].features.map((f) => (
            <li key={f} className="flex items-start gap-3">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brand" />
              {f}
            </li>
          ))}
        </ul>
      </Stage>

      {/* reviews */}
      <section className="bg-ink py-20 text-paper md:py-28">
        <div className="shell">
          <SectionHead
            dark
            eyebrow="Отзывы"
            title="Что пишут после выдачи"
            action={
              <ArrowLink
                href={BRANCHES[0].mapUrl}
                external
                tone="paper"
              >
                Читать на Яндекс Картах
              </ArrowLink>
            }
          />
        </div>

        <div className="mt-14">
          <Rail className="shell" dark label="Отзывы клиентов">
            {REVIEWS.map((r, i) => (
              <figure
                key={r.author + r.date}
                className="flex w-[82vw] max-w-[440px] flex-col justify-between border border-line-dark p-8 sm:w-[46vw] lg:w-[30vw]"
                data-reveal
                style={{ "--reveal-delay": `${i * 60}ms` } as React.CSSProperties}
              >
                <div>
                  <div className="flex gap-1 text-brand-bright" aria-label="5 из 5">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <svg
                        key={s}
                        viewBox="0 0 24 24"
                        className="h-3.5 w-3.5"
                        fill="currentColor"
                        aria-hidden
                      >
                        <path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.3 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8L12 2z" />
                      </svg>
                    ))}
                  </div>
                  <blockquote className="mt-6 text-[16px] leading-relaxed text-paper/85">
                    {r.text}
                  </blockquote>
                </div>
                <figcaption className="mt-8 border-t border-line-dark pt-5 text-[13px] text-muted-dark">
                  <span className="text-paper">{r.author}</span> · {r.branch} ·{" "}
                  {r.date}
                </figcaption>
              </figure>
            ))}
          </Rail>
        </div>
      </section>

      {/* promo */}
      <section className="relative isolate overflow-hidden bg-ink text-paper">
        <Image
          src="/img/brand-gclass.jpg"
          alt="Mercedes G-Class в боксе Meat Wash"
          fill
          sizes="100vw"
          className="-z-10 object-cover object-center opacity-45"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/85 to-ink/40" />

        <div className="shell grid gap-10 py-24 md:grid-cols-2 md:items-center md:py-32">
          <div>
            <p className="eyebrow text-brand-bright" data-reveal>
              Новым клиентам
            </p>
            <h2
              className="display-bold mt-5 text-[clamp(2rem,1.3rem+2.8vw,3.9rem)]"
              data-reveal
              style={{ "--reveal-delay": "60ms" } as React.CSSProperties}
            >
              {PROMO.title}
            </h2>
            <p
              className="lead mt-6 max-w-[44ch] text-paper/75"
              data-reveal
              style={{ "--reveal-delay": "120ms" } as React.CSSProperties}
            >
              {PROMO.text}
            </p>
          </div>

          <div
            className="flex flex-col items-start gap-8 md:items-end"
            data-reveal
            style={{ "--reveal-delay": "180ms" } as React.CSSProperties}
          >
            <div className="flex items-baseline gap-4">
              <span className="display-bold text-[clamp(3.5rem,2.5rem+4vw,7rem)] text-brand-bright">
                {PROMO.value}
              </span>
              <span className="text-[20px] font-medium text-paper/40 line-through">
                {PROMO.was}
              </span>
            </div>
            <BookButton variant="ghost" size="lg" service="Кварцевое покрытие в подарок">
              Забрать подарок
            </BookButton>
          </div>
        </div>
      </section>

      {/* quick links */}
      <section className="bg-paper py-16 md:py-20">
        <div className="shell">
          <div className="grid gap-px bg-line sm:grid-cols-3">
          {[
            { href: "/programmy", t: "Программы мойки", d: "Сравнить пять программ и цены по типу кузова" },
            { href: "/uslugi", t: "Услуги и цены", d: "Полный прайс: 45 позиций по восьми направлениям" },
            { href: "/adresa", t: "Адреса и время работы", d: "Мясницкая и Технопарк — как доехать и припарковаться" },
          ].map((l, i) => (
            <Link
              key={l.href}
              href={l.href}
              className="group bg-paper p-8 transition-colors duration-500 hover:bg-bone lg:p-10"
            >
              <div
                className="flex items-start justify-between gap-6"
                data-reveal
                style={{ "--reveal-delay": `${i * 80}ms` } as React.CSSProperties}
              >
                <h3 className="text-[20px] font-bold tracking-[-0.03em]">
                  {l.t}
                </h3>
                <svg
                  viewBox="0 0 24 24"
                  className="mt-1 h-4 w-4 shrink-0 text-brand transition-transform duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1.5"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M4 12h15m0 0-6-6m6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                </svg>
              </div>
              <p
                className="mt-4 max-w-[32ch] text-[15px] leading-relaxed text-muted"
                data-reveal
                style={{ "--reveal-delay": `${i * 80 + 60}ms` } as React.CSSProperties}
              >
                {l.d}
              </p>
            </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
