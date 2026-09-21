import { Matrix4, SkinnedMesh, Vector2, Vector3 } from 'three'
import type { AnatomicalHand } from '../src/scene/Hand'

// Offline surface check. Clip each real deformed skin triangle to the vessel's
// finite height, then measure its projected edges AND interior. Vertex-only
// checks miss a face bridging through the glass; an infinite cylinder wrongly
// rejects the deliberately above-rim approach. No runtime collision queries.
export function skinVesselGap(hand:AnatomicalHand, handToVessel:Matrix4, radius:number, height:number):number {
  hand.updateSkin()
  const mesh=hand.root.getObjectByName('articulated-hand-surface') as SkinnedMesh
  const index=mesh.geometry.index!
  let minimum=Infinity
  const clip=(input:Vector3[],boundary:number,above:boolean)=>{
    const output:Vector3[]=[]
    for(let i=0;i<input.length;i++){
      const a=input[i],b=input[(i+1)%input.length],insideA=above?a.y>=boundary:a.y<=boundary,insideB=above?b.y>=boundary:b.y<=boundary
      if(insideA)output.push(a)
      if(insideA!==insideB)output.push(a.clone().lerp(b,(boundary-a.y)/(b.y-a.y)))
    }
    return output
  }
  for(let i=0;i<index.count;i+=3){
    let poly=Array.from({length:3},(_,j)=>mesh.getVertexPosition(index.getX(i+j),new Vector3()).applyMatrix4(handToVessel))
    poly=clip(clip(poly,-.001,true),height+.001,false)
    if(poly.length<3)continue
    const points=poly.map(p=>new Vector2(p.x,p.z))
    const cross=points.map((p,j)=>p.cross(points[(j+1)%points.length]))
    if(cross.every(x=>x>1e-14)||cross.every(x=>x< -1e-14))minimum=Math.min(minimum,-radius)
    for(let j=0;j<points.length;j++){
      const a=points[j],edge=points[(j+1)%points.length].clone().sub(a)
      const t=Math.max(0,Math.min(1,-a.dot(edge)/(edge.lengthSq()||1)))
      minimum=Math.min(minimum,edge.multiplyScalar(t).add(a).length()-radius)
    }
  }
  return minimum
}
