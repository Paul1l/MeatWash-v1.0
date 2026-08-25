export const SITE = {
  name: "Meat Wash",
  legalName: "Meat Wash — сеть детейлинг-моек",
  tagline: "Детейлинг-мойка в центре Москвы",
  description:
    "Meat Wash — сеть премиальных детейлинг-моек в Москве. Ручная мойка, химчистка салона, полировка, керамика и оклейка. Онлайн-запись 24/7, закрытый паркинг, рейтинг 5,0 на Яндекс Картах.",
  url: "https://meat-wash.vercel.app",
  booking: "https://n975571.yclients.com",
  rating: 5.0,
  ratingsCount: 292,
  reviewsCount: 228,
} as const;

export type Branch = {
  id: "myasnitskaya" | "tehnopark";
  name: string;
  short: string;
  kind: string;
  address: string;
  addressExtra?: string;
  phone: string;
  phoneHref: string;
  hours: { days: string; time: string }[];
  hoursShort: string;
  metro: { name: string; distance: string }[];
  rating: number;
  ratings: number;
  reviews: number;
  mapUrl: string;
  mapEmbed: string;
  image: string;
  features: string[];
  note: string;
  coords: [number, number];
};

export const BRANCHES: Branch[] = [
  {
    id: "myasnitskaya",
    name: "Meat Wash Мясницкая",
    short: "Мясницкая",
    kind: "Автомойка · Детейлинг",
    address: "Мясницкая ул., 11",
    addressExtra: "Москва, подземный паркинг −1",
    phone: "+7 (930) 035-23-25",
    phoneHref: "+79300352325",
    hours: [
      { days: "Пн — Пт", time: "08:00 — 22:00" },
      { days: "Сб — Вс", time: "09:00 — 22:00" },
    ],
    hoursShort: "Пн–Пт 08:00–22:00 · Сб–Вс 09:00–22:00",
    metro: [
      { name: "Лубянка", distance: "470 м" },
      { name: "Кривоколенный переулок", distance: "230 м" },
    ],
    rating: 5.0,
    ratings: 209,
    reviews: 154,
    mapUrl: "https://yandex.ru/maps/org/meat_wash/191686454110/",
    mapEmbed:
      "https://yandex.ru/map-widget/v1/?ll=37.635500%2C55.762500&z=17&pt=37.635500%2C55.762500%2Cpm2rdm",
    image: "/img/hero-rangerover.jpg",
    features: [
      "2 часа закрытого паркинга",
      "Кофемания прямо над нами",
      "Wi-Fi и зона ожидания",
      "Оплата из машины",
    ],
    note: "Флагман в двух шагах от Лубянки. Оставляете машину — идёте по делам на Мясницкую.",
    coords: [55.7625, 37.6355],
  },
  {
    id: "tehnopark",
    name: "Meat Wash Технопарк",
    short: "Технопарк",
    kind: "Детейлинг-центр",
    address: "просп. Андропова, 8, стр. 2",
    addressExtra: "Москва, ТЦ «Мегаполис», 1 этаж",
    phone: "+7 (932) 491-69-91",
    phoneHref: "+79324916991",
    hours: [{ days: "Пн — Вс", time: "08:00 — 22:00" }],
    hoursShort: "Ежедневно 08:00–22:00",
    metro: [
      { name: "Технопарк", distance: "310 м" },
      { name: "МЦК Технопарк", distance: "330 м" },
    ],
    rating: 5.0,
    ratings: 83,
    reviews: 74,
    mapUrl: "https://yandex.ru/maps/org/meat_wash_tekhnopark/122667992007/",
    mapEmbed:
      "https://yandex.ru/map-widget/v1/?ll=37.664000%2C55.700500&z=17&pt=37.664000%2C55.700500%2Cpm2rdm",
    image: "/img/studio-bay.jpg",
    features: [
      "Полный цикл детейлинга",
      "Оклейка и бронирование",
      "Порошковая покраска дисков",
      "Топливные карты к оплате",
    ],
    note: "Отдельный детейлинг-центр: полировка, керамика, оклейка и кузовной ремонт.",
    coords: [55.7005, 37.664],
  },
];

export const NAV = [
  { href: "/programmy", label: "Программы мойки" },
  { href: "/uslugi", label: "Услуги и цены" },
  { href: "/detailing", label: "Детейлинг" },
  { href: "/adresa", label: "Адреса" },
  { href: "/o-nas", label: "О нас" },
];

export const FEATURES = [
  "Автомойка",
  "Автохимчистка",
  "Детейлинг",
  "Химчистка салона",
  "Предпродажная подготовка",
  "Оклейка машин",
  "Порошковая покраска дисков",
  "Подарочный сертификат",
  "Парковка",
  "Wi-Fi",
  "Кафе",
  "Оплата картой и СБП",
  "Рассрочка",
  "Оплата из машины",
];

export const PROMO = {
  title: "Защитное кварцевое покрытие кузова — в подарок",
  text: "Всем новым клиентам при первом визите. Плюс скидка 500 ₽ на первую мойку.",
  value: "0 ₽",
  was: "2 500 ₽",
};
