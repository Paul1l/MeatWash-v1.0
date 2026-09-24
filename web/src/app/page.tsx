import Image from "next/image";
import Link from "next/link";
import WashHero from "@/components/WashHero";
import Stage from "@/components/Stage";
import Rail from "@/components/Rail";
import Counter from "@/components/Counter";
import BookButton from "@/components/BookButton";
import PinnedPrograms from "@/components/PinnedPrograms";
import SplitText from "@/components/SplitText";
import { Tilt, VelocityMarquee, StackCard } from "@/components/effects";
import { ArrowLink, SectionHead } from "@/components/ui";
import { ServiceCard } from "@/components/cards";
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
    d: "Онлайн за минуту или звонком. Выбираете время — машина заезжает в своё окно, без очереди на въезде.",
    img: "/img/entrance.jpg",
    alt: "Въезд на мойку Meat Wash",
  },
  {
    n: "02",
    t: "Приёмка",
    d: "Смотрим состояние вместе с вами и говорим, что реально нужно, а что подождёт. Без попыток дописать в чек лишнее.",
    img: "/img/lounge.jpg",
    alt: "Зона приёмки Meat Wash",
  },
  {
    n: "03",
    t: "Работа",
    d: "Индивидуальный подбор химии под покрытие и загрязнение. Ручная проработка там, где автомат оставляет разводы.",
    img: "/img/process-pressure.jpg",
    alt: "Мойка автомобиля аппаратом высокого давления",
  },
  {
    n: "04",
    t: "Выдача",
    d: "Показываем результат при рабочем свете и на солнце. Не понравилось — переделываем на месте, до выдачи ключей.",
    img: "/img/m4-rear-plate.jpg",
    alt: "BMW M4 после детейлинга",
  },
];

export default function Home() {
  return (
    <>
      <WashHero
        lines={["Чистим то,", "что другим лень."]}
        sub="Детейлинг-мойка в центре Москвы. Ручная работа, подбор химии под покрытие и два часа закрытого паркинга, пока вы заняты своими делами."
        actions={
          <>
            <BookButton size="lg" magnetic>
              Записаться онлайн
            </BookButton>
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
                {SITE.rating.toLocaleString("ru-RU", {
                  minimumFractionDigits: 1,
                })}{" "}
                на Яндекс Картах
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

      {/* velocity ticker */}
      <div className="border-b border-line bg-paper py-6">
        <VelocityMarquee baseSpeed={28}>
          {TICKER.map((t) => (
            <span
              key={t}
              className="flex shrink-0 items-center gap-10 pr-10 text-[13px] font-semibold uppercase tracking-[0.18em] text-muted"
            >
              {t}
              <span className="h-1 w-1 shrink-0 rounded-full bg-brand" />
            </span>
          ))}
        </VelocityMarquee>
      </div>

      {/* programs — pinned horizontal scroll on desktop */}
      <section className="bg-paper pt-20 md:pt-28">
        <div className="shell">
          <SectionHead
            eyebrow="Программы мойки"
            title={<>Пять программ. От тридцати минут до полного цикла.</>}
            text="Каждая следующая включает предыдущую. Цена зависит от типа кузова — считаем честно, без «сюрпризов» при выдаче."
            action={<ArrowLink href="/programmy">Сравнить программы</ArrowLink>}
          />
        </div>

        <div className="mt-12 md:mt-14">
          <PinnedPrograms />
        </div>
      </section>

      {/* process — stacking cards */}
      <section className="bg-bone py-20 md:py-28">
        <div className="shell">
          <SectionHead
            eyebrow="Как это устроено"
            title="Четыре шага, в которых нечего усложнять"
          />

          <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:hidden">
            {STEPS.map((s, i) => (
              <div key={s.n} className="rounded-[28px] border border-line bg-paper p-8">
                <div
                  data-reveal
                  style={
                    { "--reveal-delay": `${i * 80}ms` } as React.CSSProperties
                  }
                >
                  <span className="font-mono text-[12px] font-medium text-brand">
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

          <div className="mt-16 hidden lg:block">
            {STEPS.map((s, i) => (
              <StackCard key={s.n} index={i} total={STEPS.length} className="mb-7">
                <article className="grid min-h-[54vh] grid-cols-[1.1fr_1fr] overflow-hidden rounded-[36px] border border-line bg-paper shadow-[0_-30px_70px_-30px_rgba(11,11,12,0.22)]">
                  <div className="flex flex-col justify-between p-12 xl:p-16">
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-[12px] font-medium text-brand">
                        {s.n}
                      </span>
                      <span className="h-px w-12 bg-line" />
                      <span className="eyebrow text-muted">
                        Шаг {i + 1} из {STEPS.length}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-[clamp(2rem,1.4rem+2vw,3.4rem)] font-bold tracking-[-0.04em]">
                        {s.t}
                      </h3>
                      <p className="mt-6 max-w-[42ch] text-[17px] leading-relaxed text-muted">
                        {s.d}
                      </p>
                    </div>
                  </div>
                  <div className="relative overflow-hidden bg-mist">
                    <Image
                      src={s.img}
                      alt={s.alt}
                      fill
                      sizes="45vw"
                      className="object-cover"
                    />
                  </div>
                </article>
              </StackCard>
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
              <Tilt key={g.slug} className="group" max={6}>
                <ServiceCard group={g} index={i} />
              </Tilt>
            ))}
          </div>
        </div>
      </section>

      {/* stats */}
      <section className="vignette relative overflow-hidden bg-ink py-20 text-paper md:py-28">
        <div className="shell relative">
          <div className="grid gap-12 md:grid-cols-[1fr_1.15fr] md:items-end">
            <div>
              <p className="eyebrow text-brand-bright" data-reveal>
                Репутация
              </p>
              <SplitText
                as="h2"
                text="Пятёрка — не маркетинг, а среднее по 292 оценкам."
                className="display-bold mt-5 block max-w-[15ch] text-[clamp(2rem,1.3rem+2.8vw,4rem)]"
                stagger={0.012}
              />
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

          <dl className="mt-16 grid gap-8 border-t border-line-dark pt-2 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                v: <Counter to={5} decimals={1} />,
                l: "Рейтинг на Яндекс Картах",
              },
              { v: <Counter to={292} />, l: "Оценок по двум точкам" },
              { v: <Counter to={228} />, l: "Развёрнутых отзыва" },
              { v: <Counter to={2} />, l: "Адреса в Москве" },
            ].map((s, i) => (
              <div
                key={i}
                className="border-line-dark pt-8 sm:pr-8 lg:border-r lg:last:border-r-0"
                data-reveal
                style={
                  { "--reveal-delay": `${i * 90}ms` } as React.CSSProperties
                }
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
            <BookButton variant="outline" magnetic>
              Записаться сюда
            </BookButton>
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
            <BookButton variant="outline" magnetic>
              Записаться сюда
            </BookButton>
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
              <ArrowLink href={BRANCHES[0].mapUrl} external tone="paper">
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
                data-cursor="drag"
                className="flex w-[82vw] max-w-[440px] flex-col justify-between rounded-[28px] border border-line-dark p-8 transition-colors duration-500 hover:border-paper/35 sm:w-[46vw] lg:w-[30vw]"
                data-reveal
                style={{ "--reveal-delay": `${i * 60}ms` } as React.CSSProperties}
              >
                <div>
                  <div
                    className="flex gap-1 text-brand-bright"
                    aria-label="5 из 5"
                  >
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
      <section className="vignette relative isolate overflow-hidden bg-ink text-paper">
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
            <SplitText
              as="h2"
              text={PROMO.title}
              className="display-bold mt-5 block max-w-[15ch] text-[clamp(2rem,1.3rem+2.8vw,3.9rem)]"
              stagger={0.012}
            />
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
            <BookButton
              variant="ghost"
              size="lg"
              magnetic
              service="Кварцевое покрытие в подарок"
            >
              Забрать подарок
            </BookButton>
          </div>
        </div>
      </section>

      {/* quick links */}
      <section className="bg-paper py-16 md:py-20">
        <div className="shell">
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              {
                href: "/programmy",
                t: "Программы мойки",
                d: "Сравнить пять программ и цены по типу кузова",
              },
              {
                href: "/uslugi",
                t: "Услуги и цены",
                d: "Полный прайс: 45 позиций по восьми направлениям",
              },
              {
                href: "/adresa",
                t: "Адреса и время работы",
                d: "Мясницкая и Технопарк — как доехать и припарковаться",
              },
            ].map((l, i) => (
              <Link
                key={l.href}
                href={l.href}
                className="group relative overflow-hidden rounded-[28px] border border-line bg-paper p-8 lg:p-10"
              >
                <span className="absolute inset-0 origin-bottom scale-y-0 bg-bone transition-transform duration-[650ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100" />
                <div
                  className="relative flex items-start justify-between gap-6"
                  data-reveal
                  style={
                    { "--reveal-delay": `${i * 80}ms` } as React.CSSProperties
                  }
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
                  className="relative mt-4 max-w-[32ch] text-[15px] leading-relaxed text-muted"
                  data-reveal
                  style={
                    {
                      "--reveal-delay": `${i * 80 + 60}ms`,
                    } as React.CSSProperties
                  }
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
