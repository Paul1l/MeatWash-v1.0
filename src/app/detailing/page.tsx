import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/Hero";
import Stage from "@/components/Stage";
import Rail from "@/components/Rail";
import BookButton from "@/components/BookButton";
import { ArrowLink, SectionHead } from "@/components/ui";
import { money } from "@/data/services";
import { BRANCHES } from "@/data/site";

export const metadata: Metadata = {
  title: "Детейлинг-центр",
  description:
    "Детейлинг-центр Meat Wash на Андропова, 8с2: полировка с керамикой, оклейка зон риска, бронирование стекла, детейлинг-химчистка салона, PDR и локальный окрас.",
};

const PILLARS = [
  {
    n: "01",
    t: "Полировка и керамика",
    d: "Снимаем паутинку и риски, закрываем результат двумя слоями керамики — чтобы блеск держался, а не смылся на первой же мойке.",
    price: 40000,
    label: "Полировка кузова + 2 слоя керамики",
  },
  {
    n: "02",
    t: "Оклейка и бронирование",
    d: "Плёнка на зоны риска, фары и лобовое стекло. Защищает от камня и пескоструя там, где кузов страдает первым.",
    price: 30000,
    label: "Бронирование лобового стекла",
  },
  {
    n: "03",
    t: "Детейлинг-химчистка",
    d: "Салон с разбором: сиденья, потолок, пороги, щели. Плюс озонация или сухой туман, чтобы убрать запах, а не замаскировать его.",
    price: 20000,
    label: "Детейлинг-химчистка салона",
  },
  {
    n: "04",
    t: "Кузовной ремонт",
    d: "Локально и без недели простоя: сколы, вмятины без покраски, окрас отдельного элемента, предпродажная подготовка.",
    price: 7000,
    label: "Удаление вмятин PDR",
  },
];

const GALLERY = [
  { src: "/img/studio-bay.jpg", alt: "Бокс детейлинг-центра Meat Wash" },
  { src: "/img/studio-mats.jpg", alt: "Химчистка ковриков паром" },
  { src: "/img/m4-carbon.jpg", alt: "Карбоновый капот после полировки" },
  { src: "/img/wheels.jpg", alt: "Детейлинг дисков" },
  { src: "/img/engine-mini.jpg", alt: "Детейлинг моторного отсека" },
  { src: "/img/interior-geely.jpg", alt: "Салон после химчистки" },
  { src: "/img/m4-rear-plate.jpg", alt: "BMW M4 после детейлинга" },
];

export default function DetailingPage() {
  const b = BRANCHES[1];

  return (
    <>
      <PageHero
        image="/img/studio-reception.jpg"
        alt="Ресепшн детейлинг-центра Meat Wash"
        eyebrow="Технопарк · Андропова, 8с2"
        title="Детейлинг-центр"
        sub="Отдельная площадка под работы, которым нужно время и свет: полировка, керамика, оклейка, кузовной ремонт и химчистка с разбором салона."
        actions={
          <>
            <BookButton variant="ghost" service="Детейлинг-центр Технопарк">
              Записаться
            </BookButton>
            <ArrowLink href="/adresa#tehnopark" tone="paper">
              Как проехать
            </ArrowLink>
          </>
        }
      />

      <Stage
        image="/img/foam-bmw-bay.jpg"
        alt="Автомобиль в пене в боксе детейлинг-центра"
        eyebrow="Подход"
        title={<>Работаем не «на поток», а на результат</>}
        tone="bone"
        ratio="aspect-[4/5]"
        actions={<ArrowLink href="/uslugi">Прайс детейлинга</ArrowLink>}
      >
        <p>
          Это самая частая фраза в отзывах — и она про метод. Одна машина —
          один мастер и его время. Химию подбираем под конкретное покрытие:
          мягкий японский лак и немецкий двухкомпонентный ведут себя по-разному,
          и универсального средства для них не существует.
        </p>
        <p>
          Результат показываем при рабочем свете и на солнце. Если что-то не
          устраивает — переделываем на месте, до выдачи.
        </p>
      </Stage>

      {/* pillars */}
      <section className="bg-ink py-20 text-paper md:py-28">
        <div className="shell">
          <SectionHead
            dark
            eyebrow="Направления"
            title="Четыре направления детейлинга"
            text="Каждое можно взять отдельно или собрать в один заезд — так дешевле и быстрее, чем приезжать четыре раза."
          />

          <div className="mt-16 grid gap-px border-t border-line-dark bg-line-dark md:grid-cols-2">
            {PILLARS.map((p, i) => (
              <article
                key={p.n}
                className="group bg-ink p-8 transition-colors duration-500 hover:bg-ink-2 lg:p-12"
              >
                <div
                  data-reveal
                  style={{ "--reveal-delay": `${i * 80}ms` } as React.CSSProperties}
                >
                <span className="font-mono text-[12px] font-medium text-brand-bright">
                  {p.n}
                </span>
                <h3 className="mt-6 text-[clamp(1.4rem,1.1rem+1.1vw,2rem)] font-bold tracking-[-0.035em]">
                  {p.t}
                </h3>
                <p className="mt-4 max-w-[42ch] text-[15px] leading-relaxed text-muted-dark sm:text-[16px]">
                  {p.d}
                </p>
                <div className="mt-8 flex items-end justify-between gap-6 border-t border-line-dark pt-6">
                  <span className="max-w-[24ch] text-[13px] leading-snug text-muted-dark">
                    {p.label}
                  </span>
                  <span className="shrink-0 text-[22px] font-bold tabular-nums">
                    {money(p.price)}
                  </span>
                </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* gallery */}
      <section className="bg-paper py-20 md:py-28">
        <div className="shell">
          <SectionHead
            eyebrow="Галерея"
            title="Работы и площадка"
            action={
              <ArrowLink href={b.mapUrl} external>
                Ещё 217 фото на Яндекс Картах
              </ArrowLink>
            }
          />
        </div>

        <div className="mt-14">
          <Rail className="shell" label="Галерея детейлинг-центра">
            {GALLERY.map((g, i) => (
              <figure
                key={g.src}
                data-cursor="view"
                className="group relative aspect-[3/4] w-[72vw] max-w-[380px] overflow-hidden bg-mist sm:w-[40vw] lg:w-[24vw]"
                data-reveal
                style={{ "--reveal-delay": `${i * 60}ms` } as React.CSSProperties}
              >
                <Image
                  src={g.src}
                  alt={g.alt}
                  fill
                  sizes="(max-width: 640px) 72vw, (max-width: 1024px) 40vw, 24vw"
                  className="img-zoom object-cover"
                />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/85 to-transparent p-5 text-[13px] text-paper opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  {g.alt}
                </figcaption>
              </figure>
            ))}
          </Rail>
        </div>
      </section>

      {/* location strip */}
      <section className="bg-bone py-16 md:py-20">
        <div className="shell grid gap-10 md:grid-cols-3">
          <div data-reveal>
            <p className="eyebrow text-muted">Адрес</p>
            <p className="mt-4 text-[18px] font-semibold leading-snug">
              {b.address}
            </p>
            <p className="mt-1.5 text-[15px] text-muted">{b.addressExtra}</p>
          </div>
          <div
            data-reveal
            style={{ "--reveal-delay": "80ms" } as React.CSSProperties}
          >
            <p className="eyebrow text-muted">Время работы</p>
            <p className="mt-4 text-[18px] font-semibold">{b.hoursShort}</p>
            <p className="mt-1.5 text-[15px] text-muted">
              {b.metro.map((m) => `${m.name} — ${m.distance}`).join(" · ")}
            </p>
          </div>
          <div
            className="flex flex-col items-start gap-4"
            data-reveal
            style={{ "--reveal-delay": "160ms" } as React.CSSProperties}
          >
            <a
              href={`tel:${b.phoneHref}`}
              className="text-[22px] font-bold tabular-nums tracking-[-0.03em] transition-colors hover:text-brand"
            >
              {b.phone}
            </a>
            <BookButton variant="outline" service="Детейлинг-центр Технопарк">
              Записаться
            </BookButton>
          </div>
        </div>
      </section>
    </>
  );
}
