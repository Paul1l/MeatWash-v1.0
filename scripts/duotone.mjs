// Винно-сепийный дуотон из презентации бренда (слайд 08, логобук стр. 27–28):
// тени уходят в чёрно-винный, средние тона — в фирменный #861A22 с медью,
// света — в тёплый кремовый. Исходники не перезаписываются: рядом кладётся
// файл с суффиксом -wine, страница ссылается на него.
// Запуск: npm run duotone
import {resolve, dirname, parse} from 'node:path';
import {fileURLToPath} from 'node:url';
import sharp from 'sharp';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const img = f => resolve(root, 'dist/assets/img', f);

// Карта тонов: позиция по яркости → цвет.
const STOPS = [
  [0.00, [6, 1, 2]],
  [0.30, [58, 9, 13]],
  [0.52, [134, 26, 34]],   // #861A22
  [0.74, [188, 96, 60]],
  [1.00, [247, 228, 208]],
];

const LUT = new Uint8Array(256 * 3);
for (let i = 0; i < 256; i++) {
  const t = i / 255;
  let k = 0;
  while (k < STOPS.length - 2 && t > STOPS[k + 1][0]) k++;
  const [t0, c0] = STOPS[k], [t1, c1] = STOPS[k + 1];
  const u = Math.min(1, Math.max(0, (t - t0) / (t1 - t0)));
  for (let c = 0; c < 3; c++) LUT[i * 3 + c] = Math.round(c0[c] + (c1[c] - c0[c]) * u);
}

export const FILES = [
  'service-interior-640.webp', 'service-interior-1280.webp',
  'service-polish-640.webp', 'service-polish-1280.webp',
  'service-protection-640.webp', 'service-protection-1280.webp',
  'about-restored-800.webp', 'about-restored-1448.webp',
  'studio-myasnitskaya-640.webp', 'studio-myasnitskaya-1200.webp',
  'studio-technopark-640.webp', 'studio-technopark-1200.webp',
  'hero-hq.webp', 'body.webp', 'card-interior.webp', 'card-polish.webp', 'card-ceramic.webp',
];

export const wineName = f => parse(f).name + '-wine.webp';

async function toWine(file) {
  const {data, info} = await sharp(img(file))
    .greyscale()
    .normalise({lower: 1, upper: 99})
    .raw()
    .toBuffer({resolveWithObject: true});
  const out = Buffer.alloc(info.width * info.height * 3);
  for (let p = 0; p < data.length; p++) {
    const v = data[p] * 3;
    out[p * 3] = LUT[v]; out[p * 3 + 1] = LUT[v + 1]; out[p * 3 + 2] = LUT[v + 2];
  }
  await sharp(out, {raw: {width: info.width, height: info.height, channels: 3}})
    .webp({quality: 80})
    .toFile(img(wineName(file)));
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const only = process.argv.slice(2);
  for (const f of only.length ? only : FILES) {
    await toWine(f);
    console.log('wine:', wineName(f));
  }
}
