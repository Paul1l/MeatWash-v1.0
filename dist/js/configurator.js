// Примерочная: услуги выбираются галочками, и машина на экране меняется.
// Мойка убирает грязь, полировка поднимает блеск, керамика добавляет капли,
// химчистка уводит камеру в салон. Эффекты складываются — как в конфигураторе.

import { SERVICES, SERVICE_VIEW, SERVICE_BASE } from './config.js';

const KEYS = ['body', 'interior', 'polish', 'ceramic'];
const EASE = (x) => 1 - Math.pow(1 - x, 3);
const money = (n) => n.toLocaleString('ru-RU') + ' ₽';

// Минимальная цена услуги — её и показываем в счёте.
const priceOf = (key) => Math.min(...SERVICES[key].prices.map(([, p]) => p));

export function setupConfigurator({ mount, getScene, onOpen, onClose }) {
  const picked = new Set();
  const abort = new AbortController(), options = { signal: abort.signal };
  let frame = 0;
  let from = { ...SERVICE_BASE };
  let to = { ...SERVICE_BASE };
  let startedAt = 0;
  let open = false;
  let opener = null;

  // Разметка панели собирается элементами: названия и цены услуг попадают
  // в textContent, а не в строку разметки.
  const make = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };

  const panel = make('div', 'cfg');
  panel.id = 'cfg-panel';
  panel.hidden = true;
  panel.tabIndex = -1;

  const head = make('div', 'cfg__head');
  head.append(make('p', 'cfg__eyebrow', 'Примерочная'), make('h3', 'cfg__title', 'Соберите уход и смотрите на машину'));
  const closeButton = make('button', 'cfg__close', '×');
  closeButton.type = 'button';
  closeButton.setAttribute('data-cfg-close', '');
  closeButton.setAttribute('aria-label', 'Закрыть примерочную');
  head.append(closeButton);

  const list = make('ul', 'cfg__list');
  for (const key of KEYS) {
    const item = make('label', 'cfg__item');
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.value = key;
    const box = make('span', 'cfg__box');
    box.setAttribute('aria-hidden', 'true');
    const text = make('span', 'cfg__text');
    text.append(make('b', '', SERVICES[key].title), make('i', '', 'от ' + money(priceOf(key))));
    item.append(input, box, text);
    const row = document.createElement('li');
    row.append(item);
    list.append(row);
  }

  const totalRow = make('p', 'cfg__total');
  const total = make('b', '', '—');
  total.setAttribute('data-total', '');
  totalRow.append(make('span', '', 'Итого'), total);

  const act = make('div', 'cfg__act');
  const bookButton = make('button', 'btn btn--fill', 'Записаться');
  bookButton.type = 'button';
  bookButton.setAttribute('data-book', '');
  const resetButton = make('button', 'btn btn--ghost', 'Сбросить');
  resetButton.type = 'button';
  resetButton.setAttribute('data-cfg-reset', '');
  act.append(bookButton, resetButton);

  panel.append(head, list, totalRow, act,
    make('p', 'cfg__note', 'Цены минимальные по каждой услуге. Точную стоимость называет мастер после осмотра.'));
  mount.replaceChildren(panel);

  const OVERLAYS = '.hero, .hero-bar, .chapter, .finale, .scene__skip';
  const freezeOverlays = (on) => {
    document.querySelectorAll(OVERLAYS).forEach((el) => { el.inert = on; });
  };

  function target() {
    if (!picked.size) return { ...SERVICE_BASE };
    const acc = { ...SERVICE_BASE, wash: 0, gloss: 0, interior: 0, water: 0 };
    let last = null;
    for (const k of KEYS) {
      if (!picked.has(k)) continue;
      const v = SERVICE_VIEW[k];
      acc.wash = Math.max(acc.wash, v.wash);
      acc.gloss = Math.max(acc.gloss, v.gloss);
      acc.interior = Math.max(acc.interior, v.interior);
      acc.water = Math.max(acc.water, v.water);
      last = v;
    }
    // Камера смотрит туда, что выбрали последним.
    acc.cam = last ? last.cam : SERVICE_BASE.cam;
    // Мойка идёт в основе любого ухода: без неё блеск не читается.
    if (acc.gloss > 0 || acc.water > 0) acc.wash = Math.max(acc.wash, .85);
    return acc;
  }

  function animate() {
    const scene = getScene();
    if (!scene) return;
    const t = EASE(Math.min(1, (performance.now() - startedAt) / 900));
    const now = {};
    for (const k of Object.keys(to)) now[k] = from[k] + (to[k] - from[k]) * t;
    scene.setManual(now);
    if (t < 1) frame = requestAnimationFrame(animate);
    else { frame = 0; from = { ...to }; }
  }

  function retarget(nextCam) {
    const scene = getScene();
    if (!scene) return;
    to = target();
    if (nextCam !== undefined) to.cam = nextCam;
    startedAt = performance.now();
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(animate);
  }

  function refreshTotal() {
    const sum = [...picked].reduce((s, k) => s + priceOf(k), 0);
    total.textContent = picked.size ? 'от ' + money(sum) : '—';
    // Собранный набор уезжает в окно записи тем же путём, что и остальные
    // кнопки: через data-book-context, без дописывания текста после открытия.
    if (picked.size) bookButton.dataset.bookContext = [...picked].map((k) => SERVICES[k].title).join(', ') + ' · ориентир от ' + money(sum);
    else delete bookButton.dataset.bookContext;
  }

  panel.addEventListener('change', (e) => {
    const input = e.target;
    if (input.type !== 'checkbox') return;
    if (input.checked) picked.add(input.value); else picked.delete(input.value);
    input.closest('.cfg__item').classList.toggle('is-on', input.checked);
    refreshTotal();
    retarget(input.checked ? SERVICE_VIEW[input.value].cam : undefined);
  }, options);

  panel.addEventListener('click', (e) => {
    // «Записаться» обрабатывает общий интерфейс: панель только уходит с экрана,
    // состав уже лежит в data-book-context кнопки.
    if (e.target.closest('[data-book]')) return api.close();
    if (e.target.closest('[data-cfg-close]')) return api.close();
    if (!e.target.closest('[data-cfg-reset]')) return;
    picked.clear();
    panel.querySelectorAll('input[type=checkbox]').forEach((i) => {
      i.checked = false;
      i.closest('.cfg__item').classList.remove('is-on');
    });
    refreshTotal();
    retarget();
  }, options);

  const api = {
    open(button) {
      if (open || !getScene()) return;
      open = true;
      opener = button || document.querySelector('[data-cfg-open]');
      panel.hidden = false;
      document.body.classList.add('cfg-open');
      freezeOverlays(true);
      from = { ...SERVICE_BASE };
      retarget();
      onOpen?.();
      panel.focus();
    },
    close() {
      if (!open) return;
      // Сначала снимаем флаг: восстановление слоёв в onClose смотрит на него.
      open = false;
      panel.hidden = true;
      document.body.classList.remove('cfg-open');
      freezeOverlays(false);
      cancelAnimationFrame(frame);
      getScene()?.setManual(null);
      onClose?.();
      opener?.focus();
      opener = null;
    },
    get isOpen() { return open; },
    selected: () => [...picked],
    destroy() { abort.abort(); cancelAnimationFrame(frame); freezeOverlays(false); },
  };
  return api;
}
