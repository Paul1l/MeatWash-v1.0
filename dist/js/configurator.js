// Гараж услуг: все работы показываются на одной машине.
//
// Выбранные услуги складываются в один облик — мойка убирает грязь, полировка
// поднимает блеск, керамика добавляет каплю, химчистка уводит камеру в салон.
// Камера уезжает к той зоне, которую тронули последней.
//
// Режим показа проигрывает выбранное по очереди: подъезд к зоне, выдержка,
// переход к следующей. Панель при этом можно убрать — в кадре остаётся только
// машина и подпись работы, что и нужно для съёмки роликов услуг.

import { ZONES, ZONE_GROUPS, ZONE_PRESETS, SERVICE_BASE } from './config.js';

const EASE = (x) => 1 - Math.pow(1 - x, 3);
const money = (n) => n.toLocaleString('ru-RU') + ' ₽';
const byId = (id) => ZONES.find((z) => z.id === id);
const FX = ['wash', 'gloss', 'interior', 'water'];
const TRAVEL_IN = 1100;   // подъезд камеры к зоне, работа ещё не сделана
const WORK_IN = 1000;     // работа происходит в кадре
const FILM_LEAD = 900;    // чистая пауза в начале ролика под запись экрана
const FINAL_CAM = 1;      // общий план готовой машины в финале

export function setupConfigurator({ mount, getScene, onOpen, onClose }) {
  const picked = new Set();
  let frame = 0;
  let from = { ...SERVICE_BASE };
  let to = { ...SERVICE_BASE };
  let live = { ...SERVICE_BASE };   // где кадр находится прямо сейчас
  let startedAt = 0;
  let travel = 900;
  let open = false;

  // Показ
  let show = null;       // { order:[id], index, until, timer }
  let cinema = false;    // панель убрана, остаётся только подпись
  let film = false;      // ролик: из кадра уходит весь интерфейс сайта
  let filmStartedAt = 0;

  mount.innerHTML = `
    <div class="cfg" hidden>
      <div class="cfg__head">
        <p class="cfg__eyebrow">Гараж услуг</p>
        <h3 class="cfg__title">Соберите уход и смотрите на машину</h3>
        <button class="cfg__close" type="button" data-cfg-close aria-label="Закрыть гараж услуг">×</button>
      </div>

      <div class="cfg__presets">
        ${ZONE_PRESETS.map((p) => `
          <button class="cfg__preset" type="button" data-preset="${p.id}">
            <b>${p.title}</b><i>${p.note}</i>
          </button>`).join('')}
      </div>

      <div class="cfg__tabs" role="tablist">
        ${ZONE_GROUPS.map((g, i) => `
          <button class="cfg__tab${i ? '' : ' is-on'}" type="button" role="tab" data-tab="${g.id}">${g.title}</button>`).join('')}
      </div>

      <div class="cfg__scroll">
        ${ZONE_GROUPS.map((g) => `
          <section class="cfg__group" data-group="${g.id}">
            <h4 class="cfg__grouptitle">${g.title}</h4>
            <ul class="cfg__list">
              ${ZONES.filter((z) => z.group === g.id).map((z) => `
                <li>
                  <label class="cfg__item" data-zone="${z.id}">
                    <input type="checkbox" value="${z.id}">
                    <span class="cfg__box" aria-hidden="true"></span>
                    <span class="cfg__text">
                      <b>${z.title}</b>
                      <i>от ${money(z.from)}</i>
                    </span>
                  </label>
                </li>`).join('')}
            </ul>
          </section>`).join('')}
      </div>

      <p class="cfg__total"><span>Итого</span><b data-total>—</b></p>

      <div class="cfg__act">
        <button class="btn btn--fill" type="button" data-book>Записаться</button>
        <button class="btn btn--ghost" type="button" data-show>Показ</button>
        <button class="btn btn--ghost" type="button" data-film>Ролик</button>
        <button class="btn btn--ghost" type="button" data-cfg-reset>Сбросить</button>
      </div>

      <p class="cfg__note">Цены минимальные по каждой работе. Точную стоимость называет мастер после осмотра.</p>
    </div>

    <div class="cfg-stage" hidden aria-live="polite">
      <p class="cfg-stage__title"></p>
      <p class="cfg-stage__caption"></p>
      <p class="cfg-stage__price"></p>
      <div class="cfg-stage__bar"><i></i></div>
      <p class="cfg-stage__hint">Esc — выйти из ролика</p>
    </div>

    <button class="cfg-fold" type="button" data-cinema hidden>Скрыть панель</button>`;

  const panel = mount.querySelector('.cfg');
  panel.dataset.group = ZONE_GROUPS[0].id;
  const stage = mount.querySelector('.cfg-stage');
  const stageTitle = mount.querySelector('.cfg-stage__title');
  const stageCaption = mount.querySelector('.cfg-stage__caption');
  const stagePrice = mount.querySelector('.cfg-stage__price');
  const stageBar = mount.querySelector('.cfg-stage__bar i');
  const cinemaBtn = mount.querySelector('[data-cinema]');
  const total = mount.querySelector('[data-total]');
  const showBtn = mount.querySelector('[data-show]');
  const filmBtn = mount.querySelector('[data-film]');

  const OVERLAYS = '.hero, .hero-bar, .hero__dot, .chapter, .finale, .scene__skip';
  const freezeOverlays = (on) => {
    document.querySelectorAll(OVERLAYS).forEach((el) => { el.inert = on; });
  };

  function target() {
    if (!picked.size) return { ...SERVICE_BASE };
    const acc = { ...SERVICE_BASE, wash: 0, gloss: 0, interior: 0, water: 0 };
    let last = null;
    for (const z of ZONES) {
      if (!picked.has(z.id)) continue;
      for (const k of FX) acc[k] = Math.max(acc[k], z.fx[k]);
      last = z;
    }
    acc.cam = last ? last.cam : SERVICE_BASE.cam;
    // Мойка — основа любого ухода: без неё блеск и капля не читаются.
    if (acc.gloss > 0 || acc.water > 0) acc.wash = Math.max(acc.wash, .85);
    return acc;
  }

  function animate() {
    const scene = getScene();
    if (!scene) return;
    const t = EASE(Math.min(1, (performance.now() - startedAt) / travel));
    for (const k of Object.keys(to)) live[k] = from[k] + (to[k] - from[k]) * t;
    scene.setManual(live);
    if (t < 1) frame = requestAnimationFrame(animate);
    else { frame = 0; from = { ...to }; }
  }

  function retarget(next, ms = 900) {
    if (!getScene()) return;
    // Новый перелёт начинается оттуда, где кадр застали, иначе он дёргается.
    from = { ...live };
    to = { ...target(), ...(next || {}) };
    travel = ms;
    startedAt = performance.now();
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(animate);
  }

  function refreshTotal() {
    total.textContent = picked.size
      ? 'от ' + money([...picked].reduce((s, id) => s + byId(id).from, 0))
      : '—';
    showBtn.disabled = picked.size < 1;
  }

  function syncInputs() {
    panel.querySelectorAll('input[type=checkbox]').forEach((i) => {
      i.checked = picked.has(i.value);
      i.closest('.cfg__item').classList.toggle('is-on', i.checked);
    });
  }

  // ── Показ ──────────────────────────────────────────────────────────────────
  // Одна зона за раз: камера подъезжает, эффекты этой зоны накладываются
  // поверх уже собранного набора, кадр держится, дальше следующая.

  function stopShow(silent) {
    if (!show) return;
    clearTimeout(show.timer);
    clearTimeout(show.beat);
    cancelAnimationFrame(show.raf);
    const wasFilm = show.film;
    show = null;
    stage.hidden = true;
    stage.classList.remove('is-film');
    showBtn.textContent = 'Показ';
    filmBtn.textContent = 'Ролик';
    panel.classList.remove('is-playing');
    if (wasFilm) setFilm(false);
    if (!silent) retarget();
  }

  function stepShow() {
    if (!show) return;
    if (show.index >= show.order.length) {
      // Ролик заканчивается общим планом готовой машины — кадром для финала.
      if (show.film) { retarget({ ...show.look, cam: FINAL_CAM }, 2200); show.index += 1; }
      show.timer = setTimeout(() => stopShow(true), show.film ? 2600 : 0);
      if (!show.film) stopShow();
      return;
    }

    const zone = byId(show.order[show.index]);
    const hold = (zone.hold || 3.4) * 1000;

    stageTitle.textContent = zone.title;
    stageCaption.textContent = zone.caption;
    stagePrice.textContent = 'от ' + money(zone.from);
    stage.hidden = false;

    const base = show.film ? { ...show.look } : target();
    const after = { ...base, cam: zone.cam };
    for (const k of FX) after[k] = Math.max(base[k], zone.fx[k]);

    let span;
    if (show.film) {
      // Ролик идёт в два такта: камера приезжает к зоне, пока работа ещё не
      // сделана, и только потом работа происходит прямо в кадре.
      retarget({ ...base, cam: zone.cam }, TRAVEL_IN);
      show.beat = setTimeout(() => {
        if (!show) return;
        show.look = after;
        retarget(after, WORK_IN);
        show.timer = setTimeout(() => { show.index += 1; stepShow(); }, hold);
      }, TRAVEL_IN);
      span = TRAVEL_IN + WORK_IN + hold;
    } else {
      retarget(after, 1200);
      show.timer = setTimeout(() => { show.index += 1; stepShow(); }, hold + 1200);
      span = hold + 1200;
    }

    const startedStep = performance.now();
    const tick = () => {
      if (!show) return;
      const p = Math.min(1, (performance.now() - startedStep) / span);
      stageBar.style.transform = `scaleX(${p})`;
      if (p < 1) show.raf = requestAnimationFrame(tick);
    };
    cancelAnimationFrame(show.raf);
    show.raf = requestAnimationFrame(tick);
  }

  function startShow() {
    if (!picked.size) return;
    stopShow(true);
    show = { order: ZONES.filter((z) => picked.has(z.id)).map((z) => z.id), index: 0, timer: 0, beat: 0, raf: 0, film: false };
    showBtn.textContent = 'Стоп';
    panel.classList.add('is-playing');
    stepShow();
  }

  // ── Ролик ──────────────────────────────────────────────────────────────────
  // Все работы подряд на одной машине, от грязной до собранной: интерфейс
  // уходит из кадра, остаётся машина и подпись работы. Это и есть заготовка
  // для видео услуг — достаточно включить запись экрана.

  function startFilm() {
    stopShow(true);
    setCinema(false);
    setFilm(true);
    live = { ...SERVICE_BASE };
    from = { ...SERVICE_BASE };
    show = {
      order: ZONES.map((z) => z.id),
      index: 0, timer: 0, beat: 0, raf: 0,
      film: true,
      look: { ...SERVICE_BASE },
    };
    stage.classList.add('is-film');
    filmBtn.textContent = 'Стоп';
    panel.classList.add('is-playing');
    getScene()?.setManual(live);
    // Пауза перед первым тактом: запись экрана успевает начаться на чистом кадре.
    show.beat = setTimeout(() => show && stepShow(), FILM_LEAD);
  }

  // Во время ролика интерфейса в кадре нет, поэтому выход — Esc или щелчок
  // по кадру. Первые полсекунды щелчки не считаем: иначе ролик остановит
  // тот же клик, которым его запустили.
  const onFilmClick = () => { if (performance.now() - filmStartedAt > 600) stopShow(); };

  function setFilm(on) {
    film = on;
    document.body.classList.toggle('cfg-film', on);
    if (on) { filmStartedAt = performance.now(); document.addEventListener('click', onFilmClick); }
    else document.removeEventListener('click', onFilmClick);
  }

  function setCinema(on) {
    cinema = on;
    document.body.classList.toggle('cfg-cinema', on);
    cinemaBtn.textContent = on ? 'Показать панель' : 'Скрыть панель';
  }

  // ── События ────────────────────────────────────────────────────────────────

  panel.addEventListener('change', (e) => {
    const input = e.target;
    if (input.type !== 'checkbox') return;
    if (input.checked) picked.add(input.value); else picked.delete(input.value);
    input.closest('.cfg__item').classList.toggle('is-on', input.checked);
    refreshTotal();
    stopShow(true);
    retarget(input.checked ? { cam: byId(input.value).cam } : undefined);
  });

  panel.addEventListener('click', (e) => {
    const tab = e.target.closest('[data-tab]');
    if (tab) {
      panel.dataset.group = tab.dataset.tab;
      panel.querySelectorAll('[data-tab]').forEach((t) => t.classList.toggle('is-on', t === tab));
      return;
    }

    const preset = e.target.closest('[data-preset]');
    if (preset) {
      const p = ZONE_PRESETS.find((x) => x.id === preset.dataset.preset);
      picked.clear();
      p.zones.forEach((id) => picked.add(id));
      syncInputs();
      refreshTotal();
      stopShow(true);
      retarget({ cam: byId(p.zones[p.zones.length - 1]).cam });
      return;
    }

    if (e.target.closest('[data-show]')) { show ? stopShow() : startShow(); return; }
    if (e.target.closest('[data-film]')) { show && show.film ? stopShow() : startFilm(); return; }
    if (e.target.closest('[data-cfg-close]')) return api.close();

    if (e.target.closest('[data-cfg-reset]')) {
      picked.clear();
      syncInputs();
      refreshTotal();
      stopShow(true);
      retarget();
      return;
    }

    if (e.target.closest('[data-book]') && picked.size) {
      const names = [...picked].map((id) => byId(id).title);
      const sum = [...picked].reduce((s, id) => s + byId(id).from, 0);
      setTimeout(() => {
        const line = document.querySelector('#booking p');
        if (line) line.textContent = 'Вы собрали: ' + names.join(', ') + '. Ориентир — от ' + money(sum) + '. Филиал и время выбираются в онлайн-записи.';
        api.close();
      }, 0);
    }
  });

  cinemaBtn.addEventListener('click', () => setCinema(!cinema));



  const onKey = (e) => {
    if (!open) return;
    if (e.key === 'Escape') {
      if (film) return stopShow();
      if (cinema) return setCinema(false);
      if (show) return stopShow();
      api.close();
    }
    if (e.key === ' ' && picked.size) { e.preventDefault(); show ? stopShow() : startShow(); }
  };

  const api = {
    open() {
      if (open || !getScene()) return;
      open = true;
      panel.hidden = false;
      cinemaBtn.hidden = false;
      document.body.classList.add('cfg-open');
      document.addEventListener('keydown', onKey);
      freezeOverlays(true);
      from = { ...SERVICE_BASE };
      refreshTotal();
      retarget();
      onOpen?.();
    },
    close() {
      if (!open) return;
      open = false;
      stopShow(true);
      setCinema(false);
      setFilm(false);
      panel.hidden = true;
      cinemaBtn.hidden = true;
      stage.hidden = true;
      document.body.classList.remove('cfg-open');
      document.removeEventListener('keydown', onKey);
      freezeOverlays(false);
      cancelAnimationFrame(frame);
      getScene()?.setManual(null);
      onClose?.();
    },
    get isOpen() { return open; },
    film: () => { if (!open) api.open(); startFilm(); },
    selected: () => [...picked],
    destroy() { cancelAnimationFrame(frame); stopShow(true); document.removeEventListener('click', onFilmClick); document.removeEventListener('keydown', onKey); freezeOverlays(false); },
  };
  // ?film в адресе — страница сама открывает гараж и проигрывает все работы
  // без интерфейса. Так снимается ролик: открыл ссылку, включил запись.
  if (new URLSearchParams(location.search).has('film')) {
    const kick = () => { if (!getScene()) return setTimeout(kick, 200); api.film(); };
    setTimeout(kick, 600);
  }

  return api;
}
