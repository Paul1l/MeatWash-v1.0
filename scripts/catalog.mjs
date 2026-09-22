import {readFile,writeFile} from 'node:fs/promises';
const root=new URL('../',import.meta.url);
const d=JSON.parse(await readFile(new URL('dist/assets/meatwash-content.json',root),'utf8'));
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=n=>n.toLocaleString('ru-RU')+' ₽';
const number=n=>String(n+1).padStart(2,'0');
export function renderCatalog(){return `
<section class="catalog" id="services" aria-labelledby="catalog-title">
 <div class="catalog__heading"><div><p class="eyebrow">MEATWASH / CAR CARE</p><h2 id="catalog-title">Искусство ухода.<br>В деталях.</h2></div><p>Пять программ мойки и весь спектр детейлинга. Выберите уход под состояние автомобиля — от регулярной мойки до восстановления и защиты.</p></div>
 <div class="catalog__section" id="programs">
  <div class="catalog__aside"><span class="eyebrow">01 / WASH</span><h3>Программы<br> мойки</h3><p>Каждая следующая программа включает предыдущую.</p></div>
  <div class="catalog__content"><fieldset class="body-types"><legend>Тип кузова</legend>${d.bodyTypes.map((type,i)=>`<label><input type="radio" name="body-type" value="${i}"${i===0?' checked':''}><span>${escape(type)}</span></label>`).join('')}</fieldset>
   <p class="catalog__selection" id="body-price-label" aria-live="polite">Цены для типа кузова: Седан</p>
   ${d.programs.map(([name,price,time,description],i)=>`<details class="catalog__entry program-entry" id="program-${i}"><summary><span class="catalog__number">${number(i)}</span><span class="catalog__name">${escape(name)}</span><span class="catalog__time">${escape(time)}</span><span class="catalog__price" data-program-price data-prices="${d.programPrices[i].join(',')}">${money(price)}</span><span class="catalog__toggle" aria-hidden="true">+</span></summary><div class="catalog__expanded"><p>${escape(description)}</p><ul class="program-includes">${d.programIncludes[i].map(item=>`<li>${escape(item)}</li>`).join('')}</ul><button class="btn btn--ghost" type="button" data-book>Записаться <span aria-hidden="true">↗</span></button></div></details>`).join('\n')}
   <p class="catalog__note">Состав программы уточняется на приёмке с учётом состояния автомобиля и выбранной площадки.</p>
  </div>
 </div>
 <div class="catalog__section" id="price-list">
  <div class="catalog__aside"><span class="eyebrow">02 / DETAILING</span><h3>Услуги<br> и цены</h3><p>39 работ в восьми направлениях. Дополните программу мойки или запишитесь на отдельную услугу.</p><a class="link-arrow" href="#locations">Выбрать локацию ↗</a></div>
  <div class="catalog__content">${d.groups.map((group,i)=>`<details class="catalog__entry service-group" id="price-${escape(group.id)}"><summary><span class="catalog__number">${number(i)}</span><span class="catalog__name">${escape(group.title)}</span><span class="catalog__count">${group.items.length} поз.</span><span class="catalog__toggle" aria-hidden="true">+</span></summary><div class="catalog__expanded"><p>${escape(group.desc)}</p><dl class="catalog__prices">${group.items.map(([name,price])=>`<div data-price-item><dt>${escape(name)}</dt><dd>${money(price)}</dd></div>`).join('')}</dl><button class="btn btn--ghost" type="button" data-book>Записаться <span aria-hidden="true">↗</span></button></div></details>`).join('\n')}
   <div class="catalog__extra"><span>Порошковая покраска дисков<small>Детейлинг-центр Технопарк</small></span><button type="button" class="link-arrow" data-book>Уточнить стоимость ↗</button></div>
   <p class="catalog__note">Стоимость зависит от типа кузова и состояния автомобиля. Итоговый объём и цену согласуем перед работой. Не является публичной офертой.</p>
  </div>
 </div>
 <div class="catalog__concierge"><div><p class="eyebrow">INDIVIDUAL CARE</p><h3>Под вашу задачу.</h3><p>Комплекс перед продажей, защита нового автомобиля или регулярный уход за автопарком. Для корпоративных клиентов — индивидуальный расчёт, консьерж-сервис и единый счёт.</p></div><button class="btn btn--fill" type="button" data-book>Обсудить уход ↗</button></div>
</section>
`}
const page=new URL('dist/index.html',root),html=await readFile(page,'utf8');
const start='<!-- CATALOG:START -->',end='<!-- CATALOG:END -->';
if(!html.includes(start)||!html.includes(end))throw new Error('Catalog markers missing');
const output=html.slice(0,html.indexOf(start)+start.length)+renderCatalog()+html.slice(html.indexOf(end));
await writeFile(page,output);
console.log('Rendered 5 wash programs, 20 body prices and 39 services.');
