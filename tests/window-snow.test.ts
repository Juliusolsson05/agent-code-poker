import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { gunzipSync } from 'node:zlib'
import { Matrix4, Points, PointsMaterial, Vector3 } from 'three'
import { ChristmasTavern } from '../src/scene/Christmas'

test('recorded seated camera gets visible-sized snow with unchanged bounded simulation',()=>{
  const raw=JSON.parse(gunzipSync(readFileSync(new URL('../testing/fixtures/experience/poker-evidence-2026-09-20T10-29-18-052Z.json.gz',import.meta.url))).toString())
  const inverse=new Matrix4().fromArray(raw.metadata.scene.camera.world).invert()
  const depth=-new Vector3(-3.55,1.99,-5.017).applyMatrix4(inverse).z
  // Pinned Three points.glsl/WebGLMaterials use size * bufferHeight/2 / depth.
  // This is a projection calculation from a REAL camera, not a GPU measurement
  // or a claim that the candidate has been visually accepted in the browser.
  const projected=(size:number)=>size*raw.metadata.buffer[1]*.5/depth
  assert.ok(projected(.010)<1,'old point size was subpixel at the recorded window')
  const previous=globalThis.document
  globalThis.document={createElement:()=>({getContext:()=>({createRadialGradient:()=>({addColorStop(){}}),fillRect(){}})})} as unknown as Document
  try{
    const decor=new ChristmasTavern(),snow=decor.root.getObjectByName('window-snow') as Points
    const material=snow.material as PointsMaterial,positions=snow.geometry.getAttribute('position')
    assert.ok(projected(material.size)>=3&&projected(material.size)<=6,`snow diameter ${projected(material.size)}buffer pixels`)
    assert.equal(positions.count,84,'visibility must not be bought with higher particle density')
    assert.equal(material.depthWrite,false);assert.equal(snow.castShadow,false)
    const array=positions.array
    decor.frame(1,false);const version=positions.version
    decor.frame(1.02,false);assert.equal(positions.version,version,'no extra upload in same24Hz interval')
    decor.frame(1.05,false);assert.equal(positions.version,version+1)
    decor.frame(900,true);const frozen=positions.array.slice(),reducedVersion=positions.version
    decor.frame(1900,true);assert.equal(positions.version,reducedVersion);assert.deepEqual(positions.array,frozen)
    assert.equal(positions.array,array,'reuse buffer rather than allocate particles every frame')
    const disposed={geometry:0,material:0,texture:0}
    snow.geometry.addEventListener('dispose',()=>disposed.geometry++)
    material.addEventListener('dispose',()=>disposed.material++)
    material.map!.addEventListener('dispose',()=>disposed.texture++)
    decor.dispose();decor.dispose()
    assert.deepEqual(disposed,{geometry:1,material:1,texture:1})
    assert.equal(snow.parent,null,'remove owned snow before shared scene disposal')
    decor.frame(2000,false);assert.equal(positions.version,reducedVersion,'disposed layer must not keep uploading')
  }finally{if(previous)globalThis.document=previous;else delete(globalThis as{document?:Document}).document}
})

test('only Christmas owns window snow; room reads its public diagnostics',()=>{
  const root=new URL('../src/',import.meta.url)
  const consumers=readdirSync(root,{recursive:true}).filter(p=>/\.tsx?$/.test(String(p)))
    .filter(p=>readFileSync(new URL(String(p),root),'utf8').includes("from './environment/WindowSnow'"))
  assert.deepEqual(consumers,['scene/Christmas.ts'])
})
