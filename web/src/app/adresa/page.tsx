import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/Hero";
import BookButton from "@/components/BookButton";
import { ArrowLink } from "@/components/ui";
import { BRANCHES } from "@/data/site";

export const metadata: Metadata = {
  title: "Адреса и время работы",
  description:
    "Две площадки Meat Wash в Москве: Мясницкая, 11 (Лубянка) и Андропова, 8с2 (Технопарк). Время работы, телефоны, парковка и схема проезда.",
};

export default function AdresaPage() {
  return (
    <>
      <PageHero
        image="/img/parking-signage.jpg"
        alt="Въезд на автомойку Meat Wash в подземном паркинге"
        eyebrow="Адреса"
        title="Две точки в Москве"
        sub="Мойка в центре на Мясницкой и детейлинг-центр у Технопарка. Обе — с парковкой и заездом прямо с улицы."
        compact
      />

      {BRANCHES.map((b, i) => (
        <section
          key={b.id}
          id={b.id}
          className={i % 2 === 1 ? "bg-bone" : "bg-paper"}
        >
          <div className="shell py-20 md:py-28">
            <div className="grid items-stretch gap-12 md:grid-cols-2 md:gap-16 lg:gap-24">
              <div
                className={`relative aspect-[4/3] overflow-hidden rounded-[32px] md:aspect-auto md:min-h-[560px] ${i % 2 === 1 ? "md:order-2" : ""}`}
                data-reveal-mask
              >
                <Image
                  src={b.image}
                  alt={b.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>

              <div className={i % 2 === 1 ? "md:order-1" : ""}>
                <p className="eyebrow text-brand" data-reveal>
                  {b.kind}
                </p>
                <h2
                  className="display-bold mt-5 text-[clamp(1.9rem,1.3rem+2.4vw,3.4rem)]"
                  data-reveal
                  style={{ "--reveal-delay": "60ms" } as React.CSSProperties}
                >
                  {b.short}
                </h2>

                <p
                  className="lead mt-6 max-w-[42ch] text-muted"
                  data-reveal
                  style={{ "--reveal-delay": "100ms" } as React.CSSProperties}
                >
                  {b.note}
                </p>

                <dl
                  className="mt-10 grid divide-y divide-line rounded-[24px] border border-line px-6"
                  data-reveal
                  style={{ "--reveal-delay": "140ms" } as React.CSSProperties}
                >
                  <Row
                    label="Адрес"
                    value={
                      <>
                        {b.address}
                        {b.addressExtra && (
                          <span className="mt-1 block text-[14px] text-muted">
                            {b.addressExtra}
                          </span>
                        )}
                      </>
                    }
                  />
                  <Row
                    label="Время работы"
                    value={
                      <span className="flex flex-col gap-1">
                        {b.hours.map((h) => (
                          <span key={h.days} className="flex gap-3">
                            <span className="w-[76px] shrink-0 text-muted">
                              {h.days}
                            </span>
                            <span className="tabular-nums">{h.time}</span>
                          </span>
                        ))}
                      </span>
                    }
                  />
                  <Row
                    label="Метро"
                    value={
                      <span className="flex flex-col gap-1">
                        {b.metro.map((m) => (
                          <span key={m.name}>
                            {m.name}{" "}
                            <span className="text-muted">— {m.distance}</span>
                          </span>
                        ))}
                      </span>
                    }
                  />
                  <Row
                    label="Телефон"
                    value={
                      <a
                        href={`tel:${b.phoneHref}`}
                        className="tabular-nums transition-colors hover:text-brand"
                      >
                        {b.phone}
                      </a>
                    }
                  />
                  <Row
                    label="Рейтинг"
                    value={
                      <>
                        {b.rating.toLocaleString("ru-RU", { minimumFractionDigits: 1 })}{" "}
                        <span className="text-muted">
                          · {b.ratings} оценок · {b.reviews} отзыва
                        </span>
                      </>
                    }
                  />
                </dl>

                <ul
                  className="mt-8 flex flex-wrap gap-2"
                  data-reveal
                  style={{ "--reveal-delay": "180ms" } as React.CSSProperties}
                >
                  {b.features.map((f) => (
                    <li
                      key={f}
                      className="rounded-full border border-line px-3.5 py-2 text-[13px] text-muted"
                    >
                      {f}
                    </li>
                  ))}
                </ul>

                <div
                  className="mt-10 flex flex-wrap items-center gap-5"
                  data-reveal
                  style={{ "--reveal-delay": "220ms" } as React.CSSProperties}
                >
                  <BookButton service={b.name}>Записаться сюда</BookButton>
                  <ArrowLink href={b.mapUrl} external>
                    Маршрут на Яндекс Картах
                  </ArrowLink>
                </div>
              </div>
            </div>

            <div
              className="mt-14 aspect-[16/10] w-full overflow-hidden rounded-[32px] border border-line bg-mist sm:aspect-[21/9]"
              data-reveal
            >
              <iframe
                src={b.mapEmbed}
                title={`Карта: ${b.name}`}
                className="h-full w-full"
                loading="lazy"
                allowFullScreen
              />
            </div>
          </div>
        </section>
      ))}

      <section className="bg-ink py-20 text-paper md:py-24">
        <div className="shell grid gap-12 md:grid-cols-[1fr_1.1fr]">
          <div>
            <p className="eyebrow text-brand-bright" data-reveal>
              Перед визитом
            </p>
            <h2
              className="display-bold mt-5 text-[clamp(1.8rem,1.3rem+2vw,3rem)]"
              data-reveal
              style={{ "--reveal-delay": "60ms" } as React.CSSProperties}
            >
              Три вещи, которые стоит знать
            </h2>
          </div>
          <div
            className="grid gap-3"
            data-reveal
            style={{ "--reveal-delay": "120ms" } as React.CSSProperties}
          >
            {[
              {
                t: "Записывайтесь заранее",
                d: "Онлайн-запись открыта круглосуточно. С записью машина заезжает в своё окно, без очереди.",
              },
              {
                t: "Парковка включена",
                d: "На Мясницкой — два часа закрытого паркинга в подарок к мойке. У Технопарка парковка при ТЦ.",
              },
              {
                t: "Оплата — как удобно",
                d: "Карта, СБП, QR, наличные, безнал и рассрочка. На Мясницкой можно оплатить, не выходя из машины.",
              },
            ].map((x) => (
              <div key={x.t} className="rounded-[24px] border border-line-dark bg-ink p-7">
                <h3 className="text-[17px] font-bold tracking-[-0.02em]">
                  {x.t}
                </h3>
                <p className="mt-3 max-w-[54ch] text-[15px] leading-relaxed text-muted-dark">
                  {x.d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function Row({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="grid gap-1 py-5 sm:grid-cols-[150px_1fr] sm:gap-6">
      <dt className="eyebrow pt-1 text-muted">{label}</dt>
      <dd className="text-[16px] leading-relaxed">{value}</dd>
    </div>
  );
}
