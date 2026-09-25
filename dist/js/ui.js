import { SERVICES } from './config.js';

export function setupUI(goToStop) {
 const abort=new AbortController(), options={signal:abort.signal};
 const $=s=>document.querySelector(s);
 const menu=$('#mobile-menu'), burger=$('#burger'), booking=$('#booking'), details=$('#service-dialog');
 const closeMenu=()=>{ menu.hidden=true; burger.setAttribute('aria-expanded','false'); burger.setAttribute('aria-label','Открыть меню'); document.body.classList.remove('menu-open'); };
 const context=$('#booking-context'), lead=$('#booking-lead'), branches=booking.querySelector('.dialog__branches');
 // Что именно выбрал человек — только текстом, без разметки.
 const setContext=note=>{ context.textContent=note?'Вы выбрали: '+note:''; context.hidden=!note; };
 // Запись: филиал выбирается здесь, потому что у площадок разные компании в yclients.
 const openBooking=(note='')=>{
   closeMenu(); details.close();
   $('#booking-title').textContent='Записаться';
   setContext(note); lead.hidden=true; branches.hidden=false;
   if(!booking.open) booking.showModal();
   branches.querySelector('a')?.focus();
 };
 // Разговор с администратором: телефоны без онлайн-записи.
 const openMembership=(title='')=>{
   closeMenu(); details.close();
   $('#booking-title').textContent=title||'Meatwash Car Care Club';
   setContext(''); lead.hidden=false; branches.hidden=true;
   if(!booking.open) booking.showModal();
 };
 burger.addEventListener('click',()=>{const open=menu.hidden;menu.hidden=!open;burger.setAttribute('aria-expanded',String(open));burger.setAttribute('aria-label',open?'Закрыть меню':'Открыть меню');document.body.classList.toggle('menu-open',open);},options);
 document.querySelector('.body-types')?.addEventListener('change',event=>{
  const input=event.target;if(input.name!=='body-type')return;
  const index=Number(input.value);
  document.querySelectorAll('[data-program-price]').forEach(price=>{price.textContent=Number(price.dataset.prices.split(',')[index]).toLocaleString('ru-RU')+' ₽';});
  $('#body-price-label').textContent='Цены для типа кузова: '+input.closest('label').querySelector('span').textContent;
 },options);
 document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();},options);
 document.addEventListener('pointerdown',function closeOnOutside(e){ if(menu.hidden) return; if(menu.contains(e.target)||burger.contains(e.target)) return; closeMenu(); },options);
 document.addEventListener('click',e=>{
  const control=e.target.closest('a,button'); if(!control)return;
  if(control.hasAttribute('data-book')) return openBooking(control.dataset.bookContext||'');
  if(control.hasAttribute('data-membership')) return openMembership(control.dataset.membership);
  if(control.dataset.service){
   e.preventDefault();
   const service=SERVICES[control.dataset.service]; if(!service)return;
   // «Записаться» из окна услуги уносит её название в выбор филиала.
   details.querySelector('[data-book]').dataset.bookContext=service.title;
   $('#service-all-prices').href='#'+({body:'programs',interior:'price-interior',polish:'price-polish',ceramic:'price-protection'}[control.dataset.service]||'services');
   $('#service-label').textContent=service.label; $('#service-title').textContent=service.title;
   $('#service-description').textContent=service.description;
   $('#service-prices').replaceChildren(...service.prices.map(([name,price])=>{
    const row=document.createElement('div'),dt=document.createElement('dt'),dd=document.createElement('dd');
    dt.textContent=name;dd.textContent=`от ${price.toLocaleString('ru-RU')} ₽`;row.append(dt,dd);return row;
   }));details.showModal();return;
  }
  if(control.dataset.sceneStop){e.preventDefault();closeMenu();goToStop(control.dataset.sceneStop);return;}
  if(control.hasAttribute('data-scroll-next')){goToStop('next');return;}
  const hash=control.getAttribute('href');
  if(hash?.startsWith('#')){const target=document.getElementById(hash.slice(1));if(target){e.preventDefault();closeMenu();details.close();booking.close();if(target.tagName==='DETAILS')target.open=true;target.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});if(!target.matches('a[href],button,input,select,textarea,summary,[tabindex]'))target.setAttribute('tabindex','-1');target.focus({preventScroll:true});history.replaceState(null,'',hash);}}
 },options);
 for(const dialog of [booking,details]) dialog.addEventListener('click',e=>{if(e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();},options);
 const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add('is-in');observer.unobserve(entry.target);}},{threshold:.1});
 document.querySelectorAll('[data-reveal]').forEach(el=>observer.observe(el));
 return ()=>{abort.abort();observer.disconnect();};
}
