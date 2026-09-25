// Отсев файлов, которые опубликованная страница не запрашивает. Работает
// только на копии dist у раннера перед upload-pages-artifact: в репозитории
// файлы остаются, они нужны `npm run optimize` (исходный GLB, ttf, логобук).
//
// Удаляются только пути из списка ниже и только если ни одной ссылки на имя
// файла нет в HTML, CSS, JS и credits.html выкладки.
//
// Запуск: node scripts/prune-deploy.mjs [папка]   (по умолчанию dist)
import {readdir, readFile, stat, rm} from 'node:fs/promises';
import {resolve, dirname, join, relative, basename} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(process.argv[2] || join(root, 'dist'));

// Исходники и варианты, которые страница не грузит.
const FILES = [
  'assets/porsche-930.glb',                 // страница берёт porsche-930-optimized.glb
  // Логобук: на странице используются Horizontal_Logo.svg и Main_Logo_black.svg.
  'assets/brand/Bull_Logo.png',
  'assets/brand/Bull_Logo.svg',
  'assets/brand/Bull_Logo_black.png',
  'assets/brand/Bull_Logo_black.svg',
  'assets/brand/Bull_Logo_red.png',
  'assets/brand/Bull_Logo_red.svg',
  'assets/brand/Horizontal_Logo.png',
  'assets/brand/Horizontal_Logo_black.png',
  'assets/brand/Horizontal_Logo_black.svg',
  'assets/brand/Horizontal_Logo_red.png',
  'assets/brand/Horizontal_Logo_red.svg',
  'assets/brand/Main_Logo.png',
  'assets/brand/Main_Logo.svg',
  'assets/brand/Main_Logo_black.png',
  'assets/brand/Main_Logo_red.png',
  'assets/brand/Main_Logo_red.svg',
  // Шрифты подключаются в WOFF2; ttf нужен только для пересборки.
  'assets/fonts/arsenal-sc-bold.ttf',
  'assets/fonts/arsenal-sc-regular.ttf',
  'assets/fonts/manrope.ttf',
  // Картинки, оставшиеся от прошлых версий макета.
  'assets/img/hero.webp',
  'assets/img/loc-myasnitskaya.webp',
  'assets/img/loc-technopark.webp',
  'assets/img/thumb-body.webp',
  'assets/img/thumb-interior.webp',
  'assets/img/thumb-polish.webp',
];

// Исходники three: нужны сборке бандла, но странице — только если остался importmap.
const DIRECTORIES = ['vendor/build', 'vendor/examples'];

async function collect(dir) {
  const out = [];
  for (const entry of await readdir(dir, {withFileTypes: true})) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...await collect(full));
    else out.push(full);
  }
  return out;
}

const all = await collect(dist);
const readable = all.filter(file => /\.(html|css|js|mjs|txt|xml)$/i.test(file));
const sources = await Promise.all(readable.map(file => readFile(file, 'utf8')));
const text = sources.join('\n');
const mentioned = name => text.includes(name);

let removed = 0, bytes = 0;

for (const entry of FILES) {
  const file = resolve(dist, entry);
  let size;
  try { size = (await stat(file)).size; } catch { continue; }
  if (mentioned(basename(entry))) { console.log(`оставлен (есть ссылка): ${entry}`); continue; }
  await rm(file);
  removed++; bytes += size;
  console.log(`удалён ${entry} — ${size} байт`);
}

for (const entry of DIRECTORIES) {
  const dir = resolve(dist, entry);
  try { await stat(dir); } catch { continue; }
  if (mentioned('importmap') || mentioned(entry)) { console.log(`оставлен (есть ссылка): ${entry}`); continue; }
  const files = await collect(dir);
  const sizes = await Promise.all(files.map(file => stat(file).then(info => info.size)));
  const total = sizes.reduce((sum, size) => sum + size, 0);
  await rm(dir, {recursive: true});
  removed += files.length; bytes += total;
  console.log(`удалён каталог ${entry} — ${files.length} файлов, ${total} байт`);
}

console.log(`Из выкладки ${relative(root, dist) || dist} убрано ${removed} файлов, ${bytes} байт.`);
