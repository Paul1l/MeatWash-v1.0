import type { Metadata } from "next";
import { PageHero } from "@/components/Hero";
import ProgramsExplorer from "@/components/ProgramsExplorer";
import BookButton from "@/components/BookButton";
import { ArrowLink } from "@/components/ui";

export const metadata: Metadata = {
  title: "Программы мойки",
  description:
    "Пять программ мойки Meat Wash: трёхфазная от 2 150 ₽, комплексная с воском, детейлинг-мойка от реагентов, пакеты «Экстерьер» и «Премиум». Цены по типу кузова.",
};

export default function ProgrammyPage() {
  return (
    <>
      <PageHero
        image="/img/foam-q8.jpg"
        alt="Audi Q8 в активной пене"
        eyebrow="Программы мойки"
        title="От тридцати минут до полного цикла"
        sub="Пять программ, выстроенных по нарастающей: каждая следующая включает всё из предыдущей. Выберите тип кузова — цены пересчитаются."
        actions={
          <>
            <BookButton variant="ghost">Записаться</BookButton>
            <ArrowLink href="/uslugi" tone="paper">
              Дополнительные услуги
            </ArrowLink>
          </>
        }
      />

      <ProgramsExplorer />

      <section className="bg-paper py-20 md:py-24">
        <div className="shell grid gap-10 border-t border-line pt-14 md:grid-cols-[1fr_1.2fr]">
          <h2
            className="text-[clamp(1.5rem,1.1rem+1.6vw,2.4rem)] font-bold tracking-[-0.035em]"
            data-reveal
          >
            Не знаете, что выбрать?
          </h2>
          <div
            className="space-y-5 text-[16px] leading-relaxed text-muted sm:text-[17px]"
            data-reveal
            style={{ "--reveal-delay": "80ms" } as React.CSSProperties}
          >
            <p>
              Приезжайте — посмотрим машину вместе. Мы честно скажем, где хватит
              комплексной мойки, а где действительно нужен детейлинг: например,
              зимой реагент въедается в лак, и обычная пена его не берёт.
            </p>
            <p>
              Состав пакетов может незначительно отличаться в зависимости от
              состояния автомобиля и площадки — точный перечень работ
              согласуем на приёмке.
            </p>
            <div className="pt-3">
              <BookButton variant="outline">Записаться на приёмку</BookButton>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
