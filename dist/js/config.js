export const STOPS = { hero:0, body:.20, interior:.40, polish:.60, ceramic:.80, final:1 };
export const SERVICES = {
 body: { label:'01 / THE BODY', title:'Мойка кузова', description:'Трёхфазная мойка: предварительная очистка, ручная проработка и финишный уход.', prices:[['Трёхфазная · 30 минут',2150],['Комплексная с воском · 60 минут',2850],['Детейлинг-мойка от реагентов',4950]] },
 interior: { label:'02 / THE INTERIOR', title:'Химчистка салона', description:'Уход за кожей, тканью и алькантарой: от отдельной детали до полной химчистки.', prices:[['Химчистка руля',1000],['Химчистка сиденья',2000],['Детейлинг-химчистка салона',20000]] },
 polish: { label:'03 / THE REFLECTION', title:'Полировка кузова', description:'Восстановление глубины цвета и чистоты отражения. Состав работ подбирается после осмотра автомобиля.', prices:[['Полировка кузова + 2 слоя керамики',40000]] },
 ceramic: { label:'04 / THE PROTECTION', title:'Керамическая защита', description:'Защитное покрытие для лакокрасочной поверхности. Состав и количество слоёв подбираются под автомобиль.', prices:[['Керамическое покрытие кузова',15000]] }
};
export const CAMERA_STOPS = [
 { p:[3.7,1.6,4.4], t:[0,.75,0], f:35 },
 { p:[1.26,.99,2.15], t:[.52,.84,1.73], f:49 },
 { p:[1.12,1.21,-.02], t:[-.11,.85,-.24], f:62 },
 { p:[1.60,1.25,-1.91], t:[.39,.88,-1.23], f:48 },
 { p:[.20,1.12,1.90], t:[.03,.80,1.30], f:45 },
 { p:[3.7,1.6,4.4], t:[0,.75,0], f:35 }
];
export const clamp = (v,a=0,b=1) => Math.min(b,Math.max(a,v));
export const smooth = (v,a,b) => { const x=clamp((v-a)/(b-a)); return x*x*(3-2*x); };

// Примерочная: какая услуга что делает с моделью.
// cam — точка на пути камеры, откуда эффект лучше всего видно;
// остальные поля — доли эффектов, которые складываются при выборе нескольких услуг.
export const SERVICE_VIEW = {
  body:     { cam: .06, wash: 1, gloss: 0,  interior: 0, water: 0 },
  interior: { cam: .42, wash: 0, gloss: 0,  interior: 1, water: 0 },
  polish:   { cam: .62, wash: 0, gloss: 1,  interior: 0, water: 0 },
  ceramic:  { cam: .84, wash: 0, gloss: .6, interior: 0, water: .84 },
};

// Базовое состояние примерочной — грязная нетронутая машина.
export const SERVICE_BASE = { cam: .06, wash: 0, gloss: 0, interior: 0, water: 0 };

// ─────────────────────────────────────────────────────────────────────────────
// Гараж услуг: все работы показываются на одной машине.
//
// SERVICES выше — четыре главы сайта, их количество проверяет check.mjs.
// Здесь список шире: каждая зона — это ракурс плюс набор эффектов, которые
// сцена уже умеет (wash, gloss, interior, water). Камера идёт по той же
// траектории из CAMERA_STOPS, поэтому новый ракурс — это просто своя доля
// пути, а не ещё одна точка: добавлять стопы не нужно.
//
// cam    — где на траектории встать, 0…1
// hold   — сколько секунд держать кадр в режиме показа
// Цены — минимальные из каталога meatwash-content.json.
export const ZONE_GROUPS = [
  { id: 'wash',    title: 'Мойка' },
  { id: 'paint',   title: 'Кузов и лак' },
  { id: 'cabin',   title: 'Салон' },
  { id: 'protect', title: 'Защита' },
];

export const ZONES = [
  {
    id: 'three-phase', group: 'wash', title: 'Трёхфазная мойка', from: 2150,
    caption: 'Пена, выдержка, ручная проработка — без кругов на лаке.',
    cam: .04, hold: 3.2,
    fx: { wash: .72, gloss: 0, interior: 0, water: .18 },
  },
  {
    id: 'complex', group: 'wash', title: 'Комплексная с воском', from: 2850,
    caption: 'Кузов, диски и салон за один визит. Финиш горячим воском.',
    cam: .12, hold: 3.2,
    fx: { wash: 1, gloss: .22, interior: 0, water: 0 },
  },
  {
    id: 'reagents', group: 'wash', title: 'Детейлинг от реагентов', from: 4950,
    caption: 'Соль уходит из порогов и арок — туда, куда пена не достаёт.',
    cam: .22, hold: 3.6,
    fx: { wash: 1, gloss: .1, interior: 0, water: .3 },
  },
  {
    id: 'wheels', group: 'wash', title: 'Диски и шины', from: 400,
    caption: 'Диск чистится с внутренней стороны, резина — в чернение.',
    cam: .68, hold: 3.4,
    fx: { wash: 1, gloss: .35, interior: 0, water: 0 },
  },
  {
    id: 'polish', group: 'paint', title: 'Полировка кузова', from: 40000,
    caption: 'Снимаем паутинку — отражение становится ровным.',
    cam: .60, hold: 4.2,
    fx: { wash: 1, gloss: 1, interior: 0, water: 0 },
  },
  {
    id: 'chips', group: 'paint', title: 'Сколы и подкраска', from: 5000,
    caption: 'Точечно по месту, без перекраса всего элемента.',
    cam: .50, hold: 3.2,
    fx: { wash: 1, gloss: .65, interior: 0, water: 0 },
  },
  {
    id: 'headlights', group: 'paint', title: 'Полировка фар', from: 5000,
    caption: 'Мутный поликарбонат снова даёт чёткий пучок света.',
    cam: .14, hold: 3.4,
    fx: { wash: 1, gloss: .8, interior: 0, water: 0 },
  },
  {
    id: 'interior', group: 'cabin', title: 'Химчистка салона', from: 1000,
    caption: 'Ткань, алькантара и кожа — от детали до полной химчистки.',
    cam: .42, hold: 4.0,
    fx: { wash: .9, gloss: .2, interior: 1, water: 0 },
  },
  {
    id: 'leather', group: 'cabin', title: 'Кожа и пластик', from: 2000,
    caption: 'Чистка и питание кожи, восстановление выгоревшего пластика.',
    cam: .46, hold: 3.6,
    fx: { wash: .9, gloss: .3, interior: 1, water: 0 },
  },
  {
    id: 'ceramic', group: 'protect', title: 'Керамическое покрытие', from: 15000,
    caption: 'Вода собирается в каплю и уходит, не оставляя следов.',
    cam: .84, hold: 4.4,
    fx: { wash: 1, gloss: .85, interior: 0, water: 1 },
  },
  {
    id: 'rain', group: 'protect', title: 'Антидождь на стёкла', from: 3000,
    caption: 'На скорости вода срывается со стекла сама.',
    cam: .30, hold: 3.4,
    fx: { wash: 1, gloss: .4, interior: 0, water: .72 },
  },
  {
    id: 'film', group: 'protect', title: 'Оклейка зон риска', from: 10000,
    caption: 'Плёнка туда, где кузов страдает первым: капот, фары, пороги.',
    cam: .18, hold: 3.8,
    fx: { wash: 1, gloss: .55, interior: 0, water: 0 },
  },
];

// Готовые наборы — как ступени тюнинга: собраны из зон выше.
export const ZONE_PRESETS = [
  { id: 'base',    title: 'База',     note: 'Мойка и диски',            zones: ['complex', 'wheels'] },
  { id: 'winter',  title: 'Зима',     note: 'Реагенты и защита стёкол', zones: ['reagents', 'wheels', 'rain'] },
  { id: 'full',    title: 'Полный',   note: 'Кузов, салон, керамика',   zones: ['complex', 'polish', 'interior', 'ceramic'] },
];
