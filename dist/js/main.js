import {STOPS,clamp,smooth} from './config.js';
import {setupUI} from './ui.js';
import {setupConfigurator} from './configurator.js';

const $=s=>document.querySelector(s);
const section=$('#scene'),canvas=$('#porsche'),poster=$('.scene__poster'),posterImage=$('.scene__poster img');
const loading=$('.scene__loading');
const hero=$('.hero'),bar=$('.hero-bar'),header=$('#header'),finale=$('.finale');
const chapters=[...document.querySelectorAll('[data-chapter]')],chapterNav=$('.chapter-nav'),skip=$('.scene__skip');
const motion=matchMedia('(prefers-reduced-motion: reduce)'),controller=new AbortController();
const forceStatic=new URLSearchParams(location.search).get('motion')==='reduce';
const state={progress:0};let scene=null,trigger=null,tween=null,staticMode=false,active=-1,destroyed=false;
document.documentElement.dataset.viewport=String(innerWidth);
let lcpObserver;
if('PerformanceObserver' in window&&PerformanceObserver.supportedEntryTypes.includes('largest-contentful-paint')){
 lcpObserver=new PerformanceObserver(list=>{const last=list.getEntries().at(-1);if(last)document.documentElement.dataset.lcpMs=String(Math.round(last.startTime));});
 lcpObserver.observe({type:'largest-contentful-paint',buffered:true});
}
const isMobile=()=>innerWidth<=800&&innerHeight>innerWidth;
const range=()=>Math.max(1,section.offsetHeight-innerHeight);
// Первый экран считается пройденным, когда hero ушёл с экрана или начались главы.
const HERO_EXIT=.7;
// Столько ждём модель и компиляцию шейдеров, прежде чем уйти в статичную версию.
const SCENE_TIMEOUT_MS=25000;

function goToStop(key){
 if(key==='next'){
  if(state.progress>.97)return $('#services').scrollIntoView({behavior:motion.matches?'instant':'smooth'});
  key=Object.keys(STOPS).find(k=>STOPS[k]>state.progress+.06)||'final';
 }
 if(staticMode){const el=key==='hero'?hero:key==='final'?finale:document.querySelector(`[data-chapter="${key}"]`);el?.scrollIntoView({behavior:motion.matches?'instant':'smooth'});return;}
 if(!(key in STOPS))return;
 scrollTo({top:section.offsetTop+range()*STOPS[key],behavior:motion.matches?'instant':'smooth'});
}
// Примерочная живёт поверх сцены и на время работы забирает управление моделью
// у прокрутки: ScrollTrigger при этом остаётся живым, просто мы не даём ему
// перерисовывать машину, пока открыт конфигуратор.
const cfgMount=document.createElement('div');
cfgMount.className='cfg-mount';
section.firstElementChild.append(cfgMount);
const configurator=setupConfigurator({
 mount:cfgMount,
 getScene:()=>scene,
 onOpen:()=>{document.querySelector('[data-cfg-open]')?.setAttribute('aria-expanded','true');},
 // После закрытия состояние слоёв восстанавливаем явно: иначе скрытые главы
 // остаются без inert и ловят фокус.
 onClose:()=>{document.querySelector('[data-cfg-open]')?.setAttribute('aria-expanded','false');apply(state.progress,true);if(scene)scene.update(state.progress,true);},
});
document.addEventListener('click',e=>{
 const open=e.target.closest('[data-cfg-open]');
 if(open){e.preventDefault();configurator.isOpen?configurator.close():configurator.open(open);}
},{signal:controller.signal});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&configurator.isOpen)configurator.close();},{signal:controller.signal});
const cleanupUI=setupUI(goToStop);

// Единственный писатель состояния шапки: и прокрутка, и главы сцены идут сюда.
function updateChrome(){
 const past=scrollY>innerHeight*HERO_EXIT||state.progress>.05;
 header.classList.toggle('is-solid',past);
 document.body.classList.toggle('is-past-hero',past);
}
function setVisibility(el,amount,interactive=true,force=false){
 el.style.opacity=amount.toFixed(3);
 const hidden=amount<.15;
 if(force||el.getAttribute('aria-hidden')!==String(hidden)){
  el.setAttribute('aria-hidden',String(hidden));
  // Пока открыта примерочная, слои сцены заморожены: inert с них не снимаем.
  el.inert=hidden||!interactive||configurator.isOpen;
 }
}
function apply(progress,force=false){
 const p=clamp(progress);state.progress=p;
 const intro=1-smooth(p,.008,.07);
 setVisibility(hero,intro,true,force);setVisibility(bar,1-smooth(p,.015,.09),true,force);
 canvas.style.opacity=scene?'1':'0';
 const index=Math.min(5,Math.floor(p*5+.5));
 section.firstElementChild.style.setProperty('--shade',String(smooth(p,.06,.15)*(1-smooth(p,.90,.97))));
 for(let i=0;i<chapters.length;i++){
  const center=(i+1)/5,d=Math.abs(p-center);
  const alpha=(1-smooth(d,.06,.10));setVisibility(chapters[i],alpha,true,force);
  chapters[i].style.transform=isMobile()?`translateY(${(1-alpha)*16}px)`:`translateY(calc(-50% + ${(1-alpha)*20}px))`;
 }
 setVisibility(finale,smooth(p,.91,.98),true,force);
 chapterNav.hidden=p<.10||p>.91;skip.classList.toggle('is-visible',p>.09&&p<.94);
 chapterNav.querySelector('i').style.width=`${p*100}%`;
 if(index!==active){
  active=index;
  chapterNav.querySelectorAll('button').forEach((button,i)=>{if(i+1===index)button.setAttribute('aria-current','step');else button.removeAttribute('aria-current');});
 }
 updateChrome();
 if(scene&&!configurator.isOpen&&scrollY<section.offsetTop+section.offsetHeight)scene.update(p);
 section.dataset.progress=p.toFixed(4);
}
function staticExperience(){
 staticMode=true;document.documentElement.classList.add('static-experience');
 // Примерочная работает только поверх живой сцены: в статичном режиме её нет.
 configurator.close();document.body.classList.remove('cfg-ready');
 tween?.kill();trigger?.kill();scene?.dispose();scene=null;
 for(const el of [...chapters,hero,finale]){el.style.opacity='1';el.style.transform='';el.inert=false;el.setAttribute('aria-hidden','false');}
 poster.style.opacity='1';posterImage.style.transform='';
 posterImage.src=posterImage.dataset.staticSrc;loading.hidden=true;
 canvas.style.opacity='0';section.dataset.mode=(motion.matches||forceStatic)?'reduced-motion':'static-fallback';
}
async function start(){
 if(motion.matches||forceStatic||navigator.connection?.saveData){staticExperience();return;}
 if(!window.gsap||!window.ScrollTrigger){staticExperience();return;}
 const {gsap,ScrollTrigger}=window;gsap.registerPlugin(ScrollTrigger);
 tween=gsap.to(state,{progress:1,ease:'none',onUpdate:()=>apply(state.progress),scrollTrigger:{trigger:section,start:'top top',end:'bottom bottom',scrub:1.35,invalidateOnRefresh:true}});
 trigger=tween.scrollTrigger;apply(clamp(scrollY/range()));
 let building=null,timer=0;
 try{
  // Paint the interface first; the opening camera is already the live Porsche scene.
  await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
  const started=performance.now();
  // Fetch the model alongside the scene module, after the hero has painted.
  const preload=document.createElement('link');preload.rel='preload';preload.as='fetch';preload.crossOrigin='anonymous';preload.href='assets/porsche-930-optimized.glb';document.head.append(preload);
  building=import('./scene.bundle.js').then(({createScene})=>createScene(canvas));
  // Модель и компиляция шейдеров не отменяются, поэтому ждём не дольше лимита:
  // дальше показываем статичную версию, а опоздавшую сцену освобождаем.
  const loaded=await Promise.race([building,new Promise((_,reject)=>{timer=setTimeout(()=>reject(new Error(`Сцена не загрузилась за ${SCENE_TIMEOUT_MS} мс`)),SCENE_TIMEOUT_MS);})]);
  clearTimeout(timer);
  section.dataset.loadMs=String(Math.round(performance.now()-started));
  if(destroyed||staticMode||motion.matches){loaded.dispose();return;}
  scene=loaded;loading.hidden=true;section.dataset.mode='webgl';
  document.body.classList.add('cfg-ready');apply(state.progress);
 }catch(error){
  clearTimeout(timer);
  console.warn('Porsche scene unavailable; static service photographs remain available.',error);
  staticExperience();
  building?.then(late=>late.dispose()).catch(()=>{});
 }
}

// Render on camera changes and bounded resize events, rather than a perpetual RAF.
let resizeFrame=0;
addEventListener('resize',()=>{cancelAnimationFrame(resizeFrame);resizeFrame=requestAnimationFrame(()=>{document.documentElement.dataset.viewport=String(innerWidth);scene?.resize();if(!staticMode)apply(state.progress);});},{signal:controller.signal});
addEventListener('scroll',updateChrome,{passive:true,signal:controller.signal});
document.addEventListener('visibilitychange',()=>{if(!document.hidden)scene?.resize();},{signal:controller.signal});
motion.addEventListener('change',()=>{if(motion.matches)staticExperience();else location.reload();},{signal:controller.signal});
canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();staticExperience();},{signal:controller.signal});
addEventListener('pagehide',event=>{if(event.persisted)return;destroyed=true;cancelAnimationFrame(resizeFrame);tween?.kill();trigger?.kill();scene?.dispose();lcpObserver?.disconnect();cleanupUI();configurator.destroy();controller.abort();},{once:true});
document.fonts.ready.then(()=>window.ScrollTrigger?.refresh());
updateChrome();
if(document.readyState==='loading')addEventListener('DOMContentLoaded',start,{once:true});else start();
