// Фавиконы и превью для соцсетей из фирменных SVG логобука.
// Эмблема: охранное поле 1/3 высоты знака (логобук, стр. 20).
// Превью: основной логотип белым на #861A22 (стр. 5), поле — не меньше X.
// Запуск: npm run brand-assets
import {resolve, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import sharp from 'sharp';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const brand = f => resolve(root, 'dist/assets/brand', f);
const out = f => resolve(root, 'dist/assets', f);
const RED = {r: 134, g: 26, b: 34, alpha: 1};

async function emblem(size, file) {
  // Знак 1097×800: вписываем по ширине так, чтобы поле по высоте было ≥ 1/3 X.
  const markH = Math.round(size / (1 + 2 / 3));
  const markW = Math.round(markH * 1097 / 800);
  const w = Math.min(markW, Math.round(size * 0.86));
  const mark = await sharp(brand('Bull_Logo.svg'), {density: 600}).resize({width: w}).png().toBuffer();
  await sharp({create: {width: size, height: size, channels: 4, background: RED}})
    .composite([{input: mark, gravity: 'centre'}]).png().toFile(out(file));
}

async function og() {
  const W = 1200, H = 630;
  const mark = await sharp(brand('Main_Logo.svg'), {density: 300}).resize({height: 430}).png().toBuffer();
  await sharp({create: {width: W, height: H, channels: 4, background: RED}})
    .composite([{input: mark, gravity: 'centre'}]).webp({quality: 88}).toFile(out('img/og-brand.webp'));
}

await emblem(64, 'favicon.png');
await emblem(180, 'apple-touch-icon.png');
await og();
console.log('favicon.png, apple-touch-icon.png, img/og-brand.webp');
