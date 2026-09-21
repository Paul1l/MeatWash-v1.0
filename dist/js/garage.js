import * as THREE from 'three';

// A single environment capture supplies warm physical reflections without an HDR download.
export async function buildGarage(scene,renderer) {
 const texture=await new THREE.TextureLoader().loadAsync('./assets/img/garage.webp');
 texture.colorSpace=THREE.SRGBColorSpace;
 const environment=new THREE.Scene();
 environment.background=new THREE.Color('#211712');
 const room=new THREE.Mesh(new THREE.BoxGeometry(18,10,22),new THREE.MeshBasicMaterial({color:'#241b16',side:THREE.BackSide}));
 room.position.y=3;environment.add(room);
 function softbox(x,y,z,w,h,power,rx=0,ry=0){
  const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({color:new THREE.Color('#fff0d9').multiplyScalar(power),side:THREE.DoubleSide}));
  m.position.set(x,y,z);m.rotation.set(rx,ry,0);environment.add(m);
 }
 softbox(-2,4,1, .32,7,6,Math.PI/2,.2);
 softbox(2.7,3.7,-1,.22,6,4,Math.PI/2,-.2);
 softbox(5,2,0,.55,3,3,0,-Math.PI/2);
 softbox(-5,2,-3,.45,2,2.5,0,Math.PI/2);
 const envPhoto=new THREE.Mesh(new THREE.PlaneGeometry(18,10),new THREE.MeshBasicMaterial({map:texture}));envPhoto.position.set(0,3,-7);environment.add(envPhoto);
 const generator=new THREE.PMREMGenerator(renderer),target=generator.fromScene(environment,.025,.1,40);
 scene.environment=target.texture;scene.environmentIntensity=.88;
 generator.dispose();environment.traverse(o=>{o.geometry?.dispose();if(o.material)o.material.dispose();});

 const wall=new THREE.Mesh(new THREE.PlaneGeometry(25,13.65),new THREE.MeshBasicMaterial({map:texture,color:'#aca29b'}));
 wall.position.set(-2,.35,-7);wall.name='Private garage background';scene.add(wall);
 const panelMaterial=new THREE.MeshStandardMaterial({color:'#24140e',roughness:.65});
 const side=new THREE.Mesh(new THREE.PlaneGeometry(22,9),panelMaterial);side.position.set(-10,4,0);side.rotation.y=Math.PI/2;scene.add(side);
 for(let z=-10;z<=10;z+=1.3){
  const beam=new THREE.Mesh(new THREE.BoxGeometry(.08,7,.055),new THREE.MeshStandardMaterial({color:'#3c291b',metalness:.2,roughness:.5}));beam.position.set(-9.95,3.5,z);scene.add(beam);
 }
 const floorTexture=makeFloor();
 const floor=new THREE.Mesh(new THREE.PlaneGeometry(60,60),new THREE.MeshStandardMaterial({color:'#100d0b',roughness:.32,metalness:.18,bumpMap:floorTexture,bumpScale:.0015,roughnessMap:floorTexture}));
 floor.rotation.x=-Math.PI/2;floor.position.y=.103;floor.receiveShadow=true;scene.add(floor);
 const hemisphere=new THREE.HemisphereLight('#eed9bc','#1c110c',.65);scene.add(hemisphere);
 const key=new THREE.DirectionalLight('#fff0d9',.95);key.position.set(3,6,4);key.castShadow=true;
 key.shadow.mapSize.set(1024,1024);Object.assign(key.shadow.camera,{left:-4,right:4,top:4,bottom:-4,near:.5,far:18});key.shadow.normalBias=.025;key.shadow.bias=-.0003;scene.add(key);
 const fill=new THREE.DirectionalLight('#e8c6a2',.6);fill.position.set(-4,2,3);scene.add(fill);
 const rim=new THREE.DirectionalLight('#ffdeb2',.65);rim.position.set(1,4,-4);scene.add(rim);
 const cabin=new THREE.PointLight('#ffe8ca',1,3,2);cabin.position.set(.1,1.8,0);scene.add(cabin);
 const reflectionLight=new THREE.PointLight('#fff1dc',1.5,5,2);reflectionLight.position.set(2,2,-1);scene.add(reflectionLight);
 const shadowTexture=makeShadow();
 const contact=new THREE.Mesh(new THREE.PlaneGeometry(3.6,5.8),new THREE.MeshBasicMaterial({map:shadowTexture,transparent:true,opacity:.9,depthWrite:false}));
 contact.rotation.x=-Math.PI/2;contact.position.y=.108;scene.add(contact);
 return {reflectionLight,dispose(){target.dispose();texture.dispose();floorTexture.dispose();shadowTexture.dispose();}};
}
function makeShadow(){
 const c=document.createElement('canvas');c.width=c.height=128;const ctx=c.getContext('2d');
 const g=ctx.createRadialGradient(64,64,10,64,64,64);g.addColorStop(0,'rgba(0,0,0,1)');g.addColorStop(.5,'rgba(0,0,0,.9)');g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.fillRect(0,0,128,128);return new THREE.CanvasTexture(c);
}
function makeFloor(){
 const c=document.createElement('canvas');c.width=c.height=256;const ctx=c.getContext('2d');ctx.fillStyle='#959595';ctx.fillRect(0,0,256,256);
 let seed=431;const pixels=ctx.createImageData(256,256);
 for(let i=0;i<pixels.data.length;i+=4){seed=(seed*1664525+1013904223)>>>0;const shade=145+Math.floor(seed/4294967296*20);pixels.data[i]=pixels.data[i+1]=pixels.data[i+2]=shade;pixels.data[i+3]=255;}ctx.putImageData(pixels,0,0);
 const texture=new THREE.CanvasTexture(c);texture.wrapS=texture.wrapT=THREE.RepeatWrapping;texture.repeat.set(24,24);return texture;
}
