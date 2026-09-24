import {readFile,writeFile,copyFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import {NodeIO,PropertyType} from '@gltf-transform/core';
import {ALL_EXTENSIONS,EXTMeshoptCompression} from '@gltf-transform/extensions';
import {dedup,reorder} from '@gltf-transform/functions';
import {MeshoptEncoder,MeshoptDecoder} from 'meshoptimizer';
import sharp from 'sharp';
import woff2 from 'wawoff2';
import {bundleScene} from './bundle.mjs';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const asset=p=>resolve(root,'dist/assets',p);
await Promise.all([MeshoptEncoder.ready,MeshoptDecoder.ready]);
const io=new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({'meshopt.encoder':MeshoptEncoder,'meshopt.decoder':MeshoptDecoder});
const document=await io.read(asset('porsche-930.glb'));
const originalNodes=document.getRoot().listNodes().map(n=>n.getName());
// Do not simplify or quantize: close-up bodywork keeps its original geometry.
await document.transform(dedup({propertyTypes:[PropertyType.TEXTURE,PropertyType.ACCESSOR]}));
await document.transform(reorder({encoder:MeshoptEncoder,target:'size'}));
for(const texture of document.getRoot().listTextures()){
 if(texture.listParents().every(parent=>parent.propertyType===PropertyType.ROOT))texture.dispose();
}
for(const texture of document.getRoot().listTextures()){
 const input=texture.getImage();
 const compressed=await sharp(input).webp({quality:88,effort:6}).toBuffer();
 if(compressed.length<input.length)texture.setImage(compressed).setMimeType('image/webp');
}
document.createExtension(EXTMeshoptCompression).setRequired(true).setEncoderOptions({method:EXTMeshoptCompression.EncoderMethod.QUANTIZE});
await io.write(asset('porsche-930-optimized.glb'),document);
// Round-trip validation protects the named surfaces used by camera, cabin and water.
const decoded=await io.read(asset('porsche-930-optimized.glb'));
assert.deepEqual(decoded.getRoot().listNodes().map(n=>n.getName()),originalNodes);
for(const [i,mesh] of document.getRoot().listMeshes().entries()){
 const result=decoded.getRoot().listMeshes()[i];
 for(const [p,primitive] of mesh.listPrimitives().entries()){
  for(const semantic of primitive.listSemantics())assert.deepEqual(result.listPrimitives()[p].getAttribute(semantic).getArray(),primitive.getAttribute(semantic).getArray());
  if(primitive.getIndices()){
   const before=primitive.getIndices().getArray(),after=result.listPrimitives()[p].getIndices().getArray();
   assert.equal(after.length,before.length);
   // Meshopt may rotate a triangle's starting index, preserving winding and vertices.
   for(let t=0;t<before.length;t+=3)assert([0,1,2].some(r=>[0,1,2].every(k=>after[t+k]===before[t+(k+r)%3])));
  }
 }
}
for(const font of ['arsenal-sc-bold','arsenal-sc-regular','manrope']){
 await writeFile(asset(`fonts/${font}.woff2`),await woff2.compress(await readFile(asset(`fonts/${font}.ttf`))));
}
await copyFile(resolve(root,'node_modules/meshoptimizer/LICENSE.md'),resolve(root,'dist/vendor/LICENSE-MESHOPT.txt'));
await bundleScene();
const old=(await readFile(asset('porsche-930.glb'))).length,optimized=(await readFile(asset('porsche-930-optimized.glb'))).length;
console.log(`Porsche: ${old} → ${optimized} bytes (${Math.round((1-optimized/old)*100)}% smaller). Geometry round-trip: identical.`);
