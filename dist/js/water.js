import * as THREE from 'three';
import {smooth} from './config.js';

// Two ray samples per bead follow the actual bonnet. The timeline is reversible.
export function createWater(scene,hood,mobile){
 if(!hood)return {update(){},dispose(){}};
 let seed=11293;const rand=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);
 const ray=new THREE.Raycaster(),down=new THREE.Vector3(0,-1,0),normalMatrix=new THREE.Matrix3().getNormalMatrix(hood.matrixWorld),drops=[];
 const cast=(x,z)=>{ray.set(new THREE.Vector3(x,3,z),down);return ray.intersectObject(hood,false)[0];};
 const limit=mobile?220:380;
 for(let attempt=0;attempt<2000&&drops.length<limit;attempt++){
  const x=(rand()-.5)*1.13,z=.91+rand()*1.05,r=.002+Math.pow(rand(),2)*.006;
  if(drops.some(d=>Math.hypot(d.p.x-x,d.p.z-z)<(d.r+r)*1.6))continue;
  const hit=cast(x,z);if(!hit||hit.point.y>1.2||hit.point.y<.5)continue;
  const finish=cast(x+Math.sign(x)*.055,Math.min(2.05,z+.43));
  drops.push({p:hit.point,n:hit.face.normal.clone().applyMatrix3(normalMatrix).normalize(),end:finish?.point||hit.point.clone().add(new THREE.Vector3(0,-.08,.3)),r,delay:rand()*.28,angle:rand()*Math.PI*2,height:.75+rand()*.25});
 }
 const profile=[],height=.95,radius=(1+height*height)/(2*height),center=height-radius,angle=Math.acos(-center/radius);
 for(let i=0;i<=14;i++){const a=angle*(1-i/14);profile.push(new THREE.Vector2(radius*Math.sin(a),center+radius*Math.cos(a)));}
 const geometry=new THREE.LatheGeometry(profile,24);
 const material=new THREE.MeshPhysicalMaterial({color:'#fff',metalness:0,roughness:.055,transmission:1,ior:1.333,thickness:1,envMapIntensity:2.2,specularIntensity:1.15});
 material.onBeforeCompile=shader=>{
  shader.vertexShader='varying float beadDepth;\n'+shader.vertexShader;
  shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nbeadDepth=length(instanceMatrix[1].xyz);');
  shader.fragmentShader='varying float beadDepth;\n'+shader.fragmentShader;
  shader.fragmentShader=shader.fragmentShader.replace('#include <transmission_fragment>',THREE.ShaderChunk.transmission_fragment.replace('material.thickness = thickness;','material.thickness = thickness * beadDepth;'));
 };
 material.customProgramCacheKey=()=> 'meatwash-beads-v2';
 const mesh=new THREE.InstancedMesh(geometry,material,drops.length);mesh.frustumCulled=false;mesh.visible=false;mesh.name='Hydrophobic water beads';scene.add(mesh);
 const dummy=new THREE.Object3D(),up=new THREE.Vector3(0,1,0);
 return {
  update(progress){
   const amount=smooth(progress,.724,.784),roll=smooth(progress,.804,.88);
   mesh.visible=progress>.72&&progress<.91;if(!mesh.visible)return;
   drops.forEach((d,i)=>{
    const grow=smooth(amount,d.delay,1),slide=smooth(roll,d.delay*.6,.9);
    const scale=d.r*grow*(1-smooth(slide,.6,1));
    dummy.position.copy(d.p).lerp(d.end,slide*slide).addScaledVector(d.n,.0002);
    dummy.quaternion.setFromUnitVectors(up,d.n);dummy.rotateY(d.angle);
    dummy.scale.set(scale,scale*d.height,scale*(1+slide*.6));dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix);
   });mesh.instanceMatrix.needsUpdate=true;
  },
  dispose(){geometry.dispose();material.dispose();scene.remove(mesh);}
 };
}
