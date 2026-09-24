// Сверяет, что закоммиченный dist/js/scene.bundle.js собран из текущего
// dist/js/scene.js. Собирает во временный файл и сравнивает байты.
// Без этой проверки правка в scene.js молча не доезжает до страницы.
import {readFile, mkdtemp, rm} from 'node:fs/promises';
import {resolve, join} from 'node:path';
import {tmpdir} from 'node:os';
import {bundleScene, root} from './bundle.mjs';

const committed = resolve(root, 'dist/js/scene.bundle.js');
const dir = await mkdtemp(join(tmpdir(), 'meatwash-bundle-'));

try {
  const fresh = join(dir, 'scene.bundle.js');
  await bundleScene(fresh);
  const [a, b] = await Promise.all([readFile(committed), readFile(fresh)]);
  if (!a.equals(b)) {
    console.error(
      'FAIL: dist/js/scene.bundle.js отстал от dist/js/scene.js.\n' +
      `Закоммичено ${a.length} байт, из текущего исходника получается ${b.length}.\n` +
      'Выполните `npm run bundle` и закоммитьте обновлённый бандл.'
    );
    process.exit(1);
  }
  console.log('PASS: scene.bundle.js собран из текущего scene.js.');
} finally {
  await rm(dir, {recursive: true, force: true});
}
