import {readFile,readdir,stat} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import assert from 'node:assert/strict';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..'),dist=resolve(root,'dist');
const html=await readFile(resolve(dist,'index.html'),'utf8');
const ids=new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]));
const failures=[];
for(const [,url] of html.matchAll(/(?:src|href)="([^"]+)"/g)){
 if(/^(https?:|tel:|data:)/.test(url))continue;
 if(url.startsWith('#')){if(!ids.has(url.slice(1)))failures.push(`Missing anchor: ${url}`);continue;}
 try{await stat(resolve(dist,url));}catch{failures.push(`Missing file: ${url}`);}
}
for(const filename of await readdir(resolve(dist,'js'))){
 if(!filename.endsWith('.js'))continue;
 const text=await readFile(resolve(dist,'js',filename),'utf8');
 const result=spawnSync(process.execPath,['--check','--input-type=module'],{input:text,encoding:'utf8'});
 if(result.status!==0)failures.push(`${filename}: ${result.stderr}`);
 for(const [,url] of text.matchAll(/(?:from\s*|import\()['"](\.[^'"]+)['"]/g)){
  try{await stat(resolve(dist,'js',url));}catch{failures.push(`Missing module: ${url}`);}
 }
}
for(const name of ['style.css','cinematic.css','catalog.css']){
 const css=await readFile(resolve(dist,'css',name),'utf8');
 for(const [,url] of css.matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g)){
  try{await stat(resolve(dist,'css',url));}catch{failures.push(`Missing CSS asset: ${url}`);}
 }
}
const content=JSON.parse(await readFile(resolve(dist,'assets/meatwash-content.json')));
assert.equal(content.programs.length,5);
assert.equal(content.bodyTypes.length,4);
assert.equal(content.groups.flatMap(group=>group.items).length,39);
assert.deepEqual(content.programPrices,[[2150,2250,2450,2650],[2850,3150,3450,4250],[4950,5450,5950,6450],[6450,7450,8450,9450],[13950,14950,15950,16950]]);
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
for(const group of content.groups){
 assert(ids.has('price-'+group.id),'Missing price group '+group.id);
 for(const [name,price] of group.items)assert(html.includes(`<dt>${escape(name)}</dt><dd>${price.toLocaleString('ru-RU')} ₽</dd>`),'Missing or stale service '+name);
}
for(const prices of content.programPrices)assert(html.includes(`data-prices="${prices.join(',')}"`),'Stale body-type prices');
assert.equal([...html.matchAll(/data-price-item/g)].length,39);
const config=await import('data:text/javascript;base64,'+Buffer.from(await readFile(resolve(dist,'js/config.js'),'utf8')).toString('base64'));
assert.deepEqual(Object.values(config.STOPS),[0,.2,.4,.6,.8,1]);
assert.equal(config.CAMERA_STOPS.length,6);
assert.deepEqual(config.CAMERA_STOPS[0],config.CAMERA_STOPS[5],'Hero must open on the final Porsche overview');
assert(!/<img[^>]*\ssrc="assets\/img\/hero-hq\.webp"/.test(html),'Photographic hero must not load in normal mode');
assert.equal(Object.keys(config.SERVICES).length,4);
const sourcePrices=new Set([...content.programs.map(x=>x[1]),...content.groups.flatMap(g=>g.items.map(x=>x[1]))]);
for(const service of Object.values(config.SERVICES))for(const [,price] of service.prices)assert(sourcePrices.has(price),'Unsupported price '+price);
assert(html.includes(content.booking),'Real booking link missing');
const model=await readFile(resolve(dist,'assets/porsche-930-optimized.glb'));
const gltf=JSON.parse(model.subarray(20,20+model.readUInt32LE(12)).toString());
assert(gltf.extensionsRequired.includes('EXT_meshopt_compression'));
for(const surface of ['Object_113','Object_9','Object_30'])assert(gltf.nodes.some(node=>node.name===surface),'Missing Porsche surface '+surface);
assert((await readFile(resolve(dist,'js/main.js'),'utf8')).includes("import('./scene.bundle.js')"));
assert.equal(failures.length,0,failures.join('\n'));
console.log('PASS: JS syntax, module paths, local assets, anchors, six camera stops, four services, supplied prices and booking destination.');
