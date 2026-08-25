import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/Hero";
import ServicesCatalog from "@/components/ServicesCatalog";
import BookButton from "@/components/BookButton";
import { ArrowLink } from "@/components/ui";
import { ALL_SERVICES } from "@/data/services";

export const metadata: Metadata = {
  title: "Услуги и цены",
  description:
    "Полный прайс Meat Wash: химчистка салона, керамика и кварц, полировка, детейлинг узлов, оклейка, PDR, антидождь. Цены открыты — от 400 ₽.",
};

export default function UslugiPage() {
  const min = Math.min(...ALL_SERVICES.map((s) => s.price));

  return (
    <>
      <PageHero
        image="/img/m4-copper.jpg"
        alt="BMW M4 на детейлинг-посте Meat Wash"
        eyebrow="Услуги и цены"
        title="Весь прайс открыт"
        sub={`${ALL_SERVICES.length} позиций по восьми направлениям — от чернения шин за ${min} ₽ до оклейки зон риска. Считайте бюджет до визита.`}
        actions={
          <>
            <BookButton variant="ghost">Записаться</BookButton>
            <ArrowLink href="/programmy" tone="paper">
              Программы мойки
            </ArrowLink>
          </>
        }
      />

      <ServicesCatalog />

      <section className="bg-ink py-20 text-paper md:py-28">
        <div className="shell grid gap-12 md:grid-cols-[1fr_1.1fr] md:items-start">
          <div>
            <p className="eyebrow text-brand-bright" data-reveal>
              Комплексы
            </p>
            <h2
              className="display-bold mt-5 text-[clamp(1.9rem,1.3rem+2.4vw,3.4rem)]"
              data-reveal
              style={{ "--reveal-delay": "60ms" } as React.CSSProperties}
            >
              Собираем под задачу, а не по прайсу
            </h2>
          </div>
          <div
            className="space-y-5 text-[16px] leading-relaxed text-muted-dark sm:text-[17px]"
            data-reveal
            style={{ "--reveal-delay": "120ms" } as React.CSSProperties}
          >
            <p>
              Любую позицию можно добавить к программе мойки. Готовите машину к
              продаже — берите предпродажную подготовку с полировкой. Купили
              новую — кварц или керамику сразу, пока лак нетронутый.
            </p>
            <p>
              Для корпоративных парков считаем отдельно: постоянное окно в
              расписании, консьерж-сервис и единый счёт.
            </p>
            <div className="flex flex-wrap gap-4 pt-3">
              <BookButton variant="outline-light">Обсудить комплекс</BookButton>
              <Link
                href="/detailing"
                className="group inline-flex items-center gap-2.5 py-4 text-[15px] font-semibold text-paper"
              >
                <span className="underline-grow pb-0.5">
                  Детейлинг-центр Технопарк
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
