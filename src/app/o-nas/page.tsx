import type { Metadata } from "next";
import { PageHero } from "@/components/Hero";
import Stage from "@/components/Stage";
import Counter from "@/components/Counter";
import BookButton from "@/components/BookButton";
import { ArrowLink, SectionHead } from "@/components/ui";
import { FEATURES, SITE } from "@/data/site";

export const metadata: Metadata = {
  title: "О нас",
  description:
    "Meat Wash — сеть детейлинг-моек в Москве с рейтингом 5,0 на Яндекс Картах. Ручная работа, подбор химии, честная приёмка и открытый прайс.",
};

const PRINCIPLES = [
  {
    n: "01",
    t: "Не продаём лишнего",
    d: "«Без попыток продать лишние услуги» — самая частая формулировка в отзывах. На приёмке говорим, что нужно машине сейчас, а что подождёт до весны.",
  },
  {
    n: "02",
    t: "Химия под покрытие",
    d: "Индивидуальный подбор состава под лак, пластик и ткань. Универсальное средство «на всё» экономит время мойщику и стоит клиенту лака.",
  },
  {
    n: "03",
    t: "Чистим то, что другим лень",
    d: "Арки, пороги, решётка, щели, подстаканники и кнопки. Разница между мойкой и детейлингом — ровно в этих местах.",
  },
  {
    n: "04",
    t: "Прозрачные цены",
    d: "Полный прайс открыт на сайте. Цена зависит от типа кузова и состояния — но она известна до того, как машина заехала в бокс.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        image="/img/brand-gclass.jpg"
        alt="Mercedes G-Class в боксе Meat Wash"
        eyebrow="О нас"
        title="Мойка, из которой не хочется уезжать"
        sub="Две площадки в Москве, рейтинг 5,0 и 228 развёрнутых отзывов. Мы не делаем ничего экзотического — просто доводим до конца то, что обычно бросают на середине."
        actions={
          <>
            <BookButton variant="ghost">Записаться</BookButton>
            <ArrowLink href="/adresa" tone="paper">
              Адреса
            </ArrowLink>
          </>
        }
      />

      <Stage
        image="/img/process-pressure.jpg"
        alt="Мойка автомобиля аппаратом высокого давления"
        eyebrow="Как мы работаем"
        title={<>Ручная работа там, где автомат оставляет разводы</>}
        ratio="aspect-[4/3]"
        actions={<ArrowLink href="/programmy">Программы мойки</ArrowLink>}
      >
        <p>
          Бесконтактная пена снимает грязь, но не снимает следы дорожной химии,
          битум и металлические вкрапления. Дальше — только руки: мягкая
          рукавица, две ведра, отдельные тряпки под кузов, стёкла и диски.
        </p>
        <p>
          Поэтому у нас нет «мойки за пять минут», зато есть машины, которые
          после выдачи выглядят темнее и глубже по цвету, чем заезжали.
        </p>
      </Stage>

      <section className="bg-ink py-20 text-paper md:py-28">
        <div className="shell">
          <SectionHead
            dark
            eyebrow="Принципы"
            title="Четыре вещи, на которых всё держится"
          />

          <div className="mt-16 grid gap-px border-t border-line-dark bg-line-dark md:grid-cols-2">
            {PRINCIPLES.map((p, i) => (
              <article
                key={p.n}
                className="bg-ink py-10 md:px-10 md:py-12"
              >
                <div
                  data-reveal
                  style={{ "--reveal-delay": `${i * 80}ms` } as React.CSSProperties}
                >
                <span className="font-mono text-[12px] font-medium text-brand-bright">
                  {p.n}
                </span>
                <h3 className="mt-5 text-[clamp(1.35rem,1.1rem+1vw,1.9rem)] font-bold tracking-[-0.035em]">
                  {p.t}
                </h3>
                <p className="mt-4 max-w-[46ch] text-[15px] leading-relaxed text-muted-dark sm:text-[16px]">
                  {p.d}
                </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* numbers */}
      <section className="bg-paper py-20 md:py-28">
        <div className="shell">
          <SectionHead
            eyebrow="Цифры"
            title="Чем это подтверждается"
            text="Данные из карточек обеих организаций на Яндекс Картах."
          />

          <dl className="mt-14 grid gap-px border-t border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {[
              { v: <Counter to={5} decimals={1} />, l: "Средний рейтинг обеих точек" },
              { v: <Counter to={292} />, l: "Оценок клиентов" },
              { v: <Counter to={100} suffix="%" />, l: "Положительных о расположении" },
              { v: <Counter to={338} />, l: "Фотографий работ в картах" },
            ].map((s, i) => (
              <div
                key={i}
                className="bg-paper py-9 sm:pr-8"
              >
                <div
                  data-reveal
                  style={{ "--reveal-delay": `${i * 80}ms` } as React.CSSProperties}
                >
                <dd className="display-bold text-[clamp(2.4rem,1.8rem+2.4vw,4rem)]">
                  {s.v}
                </dd>
                <dt className="mt-3 max-w-[22ch] text-[14px] leading-relaxed text-muted">
                  {s.l}
                </dt>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* features */}
      <section className="bg-bone py-20 md:py-24">
        <div className="shell grid gap-12 md:grid-cols-[1fr_1.3fr]">
          <div>
            <p className="eyebrow text-brand" data-reveal>
              Возможности
            </p>
            <h2
              className="display-bold mt-5 text-[clamp(1.8rem,1.3rem+2vw,3rem)]"
              data-reveal
              style={{ "--reveal-delay": "60ms" } as React.CSSProperties}
            >
              Что есть на площадках
            </h2>
            <p
              className="mt-6 max-w-[34ch] text-[16px] leading-relaxed text-muted"
              data-reveal
              style={{ "--reveal-delay": "120ms" } as React.CSSProperties}
            >
              С животными — можно. Подарочный сертификат — есть. Оплатить, не
              выходя из машины, — тоже.
            </p>
          </div>

          <ul className="flex flex-wrap content-start gap-2.5">
            {FEATURES.map((f, i) => (
              <li
                key={f}
                className="border border-line bg-paper px-4 py-2.5 text-[14px] font-medium"
                data-reveal
                style={
                  { "--reveal-delay": `${Math.min(i, 12) * 40}ms` } as React.CSSProperties
                }
              >
                {f}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Stage
        image="/img/lounge.jpg"
        alt="Зона ожидания Meat Wash"
        eyebrow="Пока вы ждёте"
        title={<>Два часа паркинга и Кофемания этажом выше</>}
        flip
        ratio="aspect-[4/3]"
        actions={
          <>
            <BookButton variant="outline">Записаться</BookButton>
            <ArrowLink href="/adresa">Адреса и время работы</ArrowLink>
          </>
        }
      >
        <p>
          На Мясницкой к любой мойке идут два часа закрытого паркинга — можно
          спокойно уйти по делам в центр и вернуться к готовой машине. В зоне
          ожидания Wi-Fi, вода и кофе.
        </p>
        <p>
          Если ждать некогда — оставьте ключи и заберите машину вечером.
          Рейтинг {SITE.rating.toLocaleString("ru-RU", { minimumFractionDigits: 1 })} набран в том числе на этом.
        </p>
      </Stage>
    </>
  );
}
