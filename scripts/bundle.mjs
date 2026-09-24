// Сборка dist/js/scene.bundle.js. Страница грузит именно бандл, поэтому правка
// в dist/js/scene.js без пересборки на экран не попадает. Шаг вынесен отдельно,
// чтобы его могли вызвать и optimize.mjs, и проверка свежести бандла в CI.
import {resolve, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {build} from 'esbuild';

export const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

export function bundleScene(outfile = resolve(root, 'dist/js/scene.bundle.js')) {
  return build({
    entryPoints: [resolve(root, 'dist/js/scene.js')],
    outfile,
    bundle: true,
    minify: true,
    format: 'esm',
    target: 'es2022',
    legalComments: 'linked',
    alias: {
      'three/addons': resolve(root, 'dist/vendor/examples/jsm'),
      three: resolve(root, 'dist/vendor/build/three.module.js'),
    },
  });
}

// Прямой вызов: npm run bundle
if (process.argv[1] && resolve(process.argv[1]) === resolve(root, 'scripts/bundle.mjs')) {
  await bundleScene();
  console.log('scene.bundle.js собран');
}
