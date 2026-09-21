import { readFileSync } from 'node:fs'
import { gunzipSync } from 'node:zlib'
import { Matrix4, Quaternion, Euler, SkinnedMesh, Vector3 } from 'three'
import { AnatomicalHand } from '../src/scene/Hand'
import { GLASS_HAND_ROTATION } from '../src/scene/HandGrips'
import { DRINKS, type DrinkKind } from '../src/scene/props/specs'

// Offline diagnosis, NOT a new browser recording. The raw trace supplies real
// wrist/vessel matrices. Legacy Human resets to rest then blends glass fingers;
// infer that blend from its recorded wrist slerp, checking orientation agreement
// before measuring the authored skin. Bone poses were not captured in this old
// trace, so this is a source-assisted reconstruction, not observed mesh vertices.
const trace=JSON.parse(gunzipSync(readFileSync(new URL('./fixtures/experience/poker-evidence-2026-09-20T10-29-18-052Z.json.gz',import.meta.url))).toString())
const hand=new AnatomicalHand('right','#ae8165',.0025)
const mesh=hand.root.getObjectByName('articulated-hand-surface') as SkinnedMesh
const kinds:DrinkKind[]=['old-fashioned','beer','wine','water','old-fashioned','beer']
const rest=new Quaternion().setFromEuler(new Euler(Math.PI/2,0,-.12))
const p=new Vector3(),q=new Quaternion(),scale=new Vector3()
const out:any[]=[]
for(const e of trace.entries.filter((e:any)=>e.kind==='pose'))for(const actor of e.data.people){
  const glass=new Matrix4().fromArray(actor.drink.local),wrist=new Matrix4().fromArray(actor.rightHand.local)
  glass.decompose(p,q,scale)
  const held=q.clone().multiply(new Quaternion(...GLASS_HAND_ROTATION))
  wrist.decompose(p,q,scale)
  const blend=Math.min(1,rest.angleTo(q)/rest.angleTo(held))
  if(blend<.03 || blend>.97)continue
  const residual=rest.clone().slerp(held,blend).angleTo(q)
  if(residual>1e-5)continue
  hand.pose('rest');hand.pose('glass',blend)
  const transform=glass.clone().invert().multiply(wrist), spec=DRINKS[kinds[actor.seat]]
  let deepest=0,inside=0
  for(let i=0;i<mesh.geometry.getAttribute('position').count;i++){
    mesh.getVertexPosition(i,p).applyMatrix4(transform)
    if(p.y<0 || p.y>spec.height)continue
    const depth=spec.radius-Math.hypot(p.x,p.z)
    if(depth>0){inside++;deepest=Math.max(deepest,depth)}
  }
  if(inside)out.push({visualSeconds:e.visualSeconds,seat:actor.seat,blend,inside,deepestMm:deepest*1000})
}
console.log(JSON.stringify({provenance:'source-assisted reconstruction from recorded wrist/glass matrices; not captured skin',violatingSamples:out.length,worst:out.sort((a,b)=>b.deepestMm-a.deepestMm).slice(0,8)},null,2))
