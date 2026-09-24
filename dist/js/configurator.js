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
  let frame = 0;
  let from = { ...SERVICE_BASE };
  let to = { ...SERVICE_BASE };
  let startedAt = 0;
  let open = false;

  mount.innerHTML = `
    <div class="cfg" hidden>
      <div class="cfg__head">
        <p class="cfg__eyebrow">Примерочная</p>
        <h3 class="cfg__title">Соберите уход и смотрите на машину</h3>
        <button class="cfg__close" type="button" data-cfg-close aria-label="Закрыть примерочную">×</button>
      </div>
      <ul class="cfg__list">
        ${KEYS.map((k) => `
          <li>
            <label class="cfg__item">
              <input type="checkbox" value="${k}">
              <span class="cfg__box" aria-hidden="true"></span>
              <span class="cfg__text">
                <b>${SERVICES[k].title}</b>
                <i>от ${money(priceOf(k))}</i>
              </span>
            </label>
          </li>`).join('')}
      </ul>
      <p class="cfg__total">
        <span>Итого</span>
        <b data-total>—</b>
      </p>
      <div class="cfg__act">
        <button class="btn btn--fill" type="button" data-book>Записаться</button>
        <button class="btn btn--ghost" type="button" data-cfg-reset>Сбросить</button>
      </div>
      <p class="cfg__note">Цены минимальные по каждой услуге. Точную стоимость называет мастер после осмотра.</p>
    </div>`;

  const panel = mount.querySelector('.cfg');
  const OVERLAYS = '.hero, .hero-bar, .hero__dot, .chapter, .finale, .scene__skip';
  const freezeOverlays = (on) => {
    document.querySelectorAll(OVERLAYS).forEach((el) => { el.inert = on; });
  };
  const total = mount.querySelector('[data-total]');

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
    if (!picked.size) { total.textContent = '—'; return; }
    total.textContent = 'от ' + money([...picked].reduce((s, k) => s + priceOf(k), 0));
  }

  panel.addEventListener('change', (e) => {
    const input = e.target;
    if (input.type !== 'checkbox') return;
    if (input.checked) picked.add(input.value); else picked.delete(input.value);
    input.closest('.cfg__item').classList.toggle('is-on', input.checked);
    refreshTotal();
    retarget(input.checked ? SERVICE_VIEW[input.value].cam : undefined);
  });

  // «Записаться» из примерочной уносит собранный набор в окно записи.
  // Диалог открывает общий обработчик интерфейса, поэтому состав дописываем
  // следующим тиком, когда он уже подставил свой текст.
  panel.addEventListener('click', (e) => {
    if (!e.target.closest('[data-book]') || !picked.size) return;
    const names = [...picked].map((k) => SERVICES[k].title);
    const sum = [...picked].reduce((s, k) => s + priceOf(k), 0);
    setTimeout(() => {
      const line = document.querySelector('#booking p');
      if (line) line.textContent = 'Вы собрали: ' + names.join(', ') + '. Ориентир — от ' + money(sum) + '. Филиал и время выбираются в онлайн-записи.';
      api.close();
    }, 0);
  });

  panel.addEventListener('click', (e) => {
    if (e.target.closest('[data-cfg-close]')) return api.close();
    if (!e.target.closest('[data-cfg-reset]')) return;
    picked.clear();
    panel.querySelectorAll('input[type=checkbox]').forEach((i) => {
      i.checked = false;
      i.closest('.cfg__item').classList.remove('is-on');
    });
    refreshTotal();
    retarget();
  });

  const api = {
    open() {
      if (open || !getScene()) return;
      open = true;
      panel.hidden = false;
      document.body.classList.add('cfg-open');
      freezeOverlays(true);
      from = { ...SERVICE_BASE };
      retarget();
      onOpen?.();
    },
    close() {
      if (!open) return;
      open = false;
      panel.hidden = true;
      document.body.classList.remove('cfg-open');
      freezeOverlays(false);
      cancelAnimationFrame(frame);
      getScene()?.setManual(null);
      onClose?.();
    },
    get isOpen() { return open; },
    selected: () => [...picked],
    destroy() { cancelAnimationFrame(frame); freezeOverlays(false); },
  };
  return api;
}
