export type CarType = "sedan" | "crossover" | "suv" | "van";

export const CAR_TYPES: { id: CarType; label: string; short: string }[] = [
  { id: "sedan", label: "Седан", short: "Седан" },
  { id: "crossover", label: "Кроссовер", short: "Кроссовер" },
  { id: "suv", label: "Внедорожник", short: "Внедорожник" },
  { id: "van", label: "Микроавтобус", short: "Микроавтобус" },
];

export type Program = {
  slug: string;
  index: string;
  name: string;
  kicker: string;
  duration: string;
  summary: string;
  includes: string[];
  price: Record<CarType, number>;
  image: string;
  tone: "light" | "dark";
  featured?: boolean;
};

export const PROGRAMS: Program[] = [
  {
    slug: "trehfaznaya",
    index: "01",
    name: "Трёхфазная",
    kicker: "База",
    duration: "30 минут",
    summary:
      "Быстрая мойка кузова в три фазы: предварительная пена, активная химия, ручная финишная проработка. Когда нужно чисто и без ожидания.",
    includes: [
      "Предварительная бесконтактная пена",
      "Активная пена, выдержка, смыв",
      "Ручная мойка кузова и стёкол",
      "Сушка кузова и обдув зеркал",
      "Мойка ковриков",
    ],
    price: { sedan: 2150, crossover: 2250, suv: 2450, van: 2650 },
    image: "/img/foam-m3-side.jpg",
    tone: "light",
  },
  {
    slug: "kompleksnaya",
    index: "02",
    name: "Комплексная с воском",
    kicker: "Хит",
    duration: "60 минут",
    summary:
      "Наш стандарт: кузов, диски и салон за один визит. Финиш горячим воском даёт глубину цвета и держит блеск между мойками.",
    includes: [
      "Всё из трёхфазной мойки",
      "Покрытие кузова воском",
      "Мойка дисков и колёсных арок",
      "Пылесос салона и багажника",
      "Протирка панели, стёкол изнутри",
    ],
    price: { sedan: 2850, crossover: 3150, suv: 3450, van: 4250 },
    image: "/img/foam-m4.jpg",
    tone: "light",
    featured: true,
  },
  {
    slug: "detailing-reagenty",
    index: "03",
    name: "Детейлинг-мойка от реагентов",
    kicker: "Зима",
    duration: "60 минут",
    summary:
      "Московская зима — это соль в порах лака и белый налёт на пластике. Снимаем реагент с кузова, арок и порогов, возвращаем цвет.",
    includes: [
      "Всё из комплексной мойки",
      "Обезжиривание кузова",
      "Удаление реагента с кузова и арок",
      "Чернение шин",
      "Проработка порогов и решётки",
    ],
    price: { sedan: 4950, crossover: 5450, suv: 5950, van: 6450 },
    image: "/img/niva-dirty.jpg",
    tone: "dark",
  },
  {
    slug: "eksterier",
    index: "04",
    name: "Пакет «Экстерьер»",
    kicker: "Кузов",
    duration: "90 минут",
    summary:
      "Полная реанимация внешнего вида. Убираем то, что не берёт обычная мойка: металлические вкрапления, битум, следы дорожной химии.",
    includes: [
      "Всё из детейлинг-мойки",
      "Удаление металлических вкраплений",
      "Очистка кузова от битума",
      "Обработка уплотнителей силиконом",
      "Антидождь передней полусферы",
      "Защитное кварцевое покрытие",
    ],
    price: { sedan: 6450, crossover: 7450, suv: 8450, van: 9450 },
    image: "/img/foam-q8.jpg",
    tone: "dark",
  },
  {
    slug: "premium",
    index: "05",
    name: "Пакет «Премиум»",
    kicker: "Максимум",
    duration: "120 минут",
    summary:
      "Кузов и салон под ключ. Забираете машину в состоянии, максимально близком к тому, в котором её выдали в салоне.",
    includes: [
      "Всё из пакета «Экстерьер»",
      "Химчистка элементов салона",
      "Озонация или сухой туман",
      "Кондиционер кожи сидений",
      "Восстановление пластика салона",
      "Антидождь всех стёкол",
    ],
    price: { sedan: 13950, crossover: 14950, suv: 15950, van: 16950 },
    image: "/img/studio-reception.jpg",
    tone: "dark",
  },
];

export const priceRange = (p: Program) =>
  `${p.price.sedan.toLocaleString("ru-RU")} — ${p.price.van.toLocaleString("ru-RU")} ₽`;
