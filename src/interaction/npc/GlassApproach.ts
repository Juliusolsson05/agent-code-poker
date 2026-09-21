import { Euler, MathUtils, Quaternion, Vector3 } from 'three'

// One body-local route owns acquisition/release. Human is the only production
// consumer; camera, engine, React and the player's interaction director must not
// import this. Full grip calibration remains in HandGrips, not duplicated here.
// The old rest x=.20 already overlapped tall ale by7.8mm. Move the wrist inward,
// not the coaster or skin, so there is a genuinely clear starting configuration.
export const NPC_REST_WRIST = [.17,.857,.385] as const
export const NPC_REST_ROTATION = [Math.PI/2,0,-.12] as const

export function glassApproach(progress:number,contact:Vector3,rotation:Quaternion,rimY:number) {
  const u=MathUtils.clamp(progress,0,1)
  // Most sip frames are already attached. Do not allocate/interpolate unused
  // route waypoints for those frames; the caller copies this resolved frame.
  if(u===1)return{wrist:contact,rotation,grip:1,phase:'held' as const}
  const rest=new Vector3(...NPC_REST_WRIST)
  const startRotation=new Quaternion().setFromEuler(new Euler(...NPC_REST_ROTATION))
  // A fully formed wrap can move parallel to the vessel axis without its far
  // fingers tunneling through a wall. Forming that wrap next to the vessel was
  // the error: matching the eventual grip anchor said nothing about the sweep.
  // First rise at the clear rest X/Z; rotate/close above the highest rim; only
  // then descend in the unchanged, independently surface-tested full wrap.
  // Reverse this exact corridor after return. No per-frame mesh queries, extra
  // IK clamp, hand scaling, or render-only relocation of the drink is involved.
  const clearanceY=rimY+.19,aboveRest=rest.clone().setY(clearanceY),aboveContact=contact.clone().setY(clearanceY)
  if(u<.3)return{wrist:rest.lerp(aboveRest,MathUtils.smoothstep(u,0,.3)),rotation:startRotation,grip:0,phase:'clear' as const}
  if(u<.7){
    const blend=MathUtils.smoothstep(u,.3,.7)
    return{wrist:aboveRest.lerp(aboveContact,blend),rotation:startRotation.slerp(rotation,blend),grip:blend,phase:'form' as const}
  }
  return{wrist:aboveContact.lerp(contact,MathUtils.smoothstep(u,.7,1)),rotation:rotation.clone(),grip:1,phase:'approach' as const}
}
