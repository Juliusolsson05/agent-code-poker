export type SoundKind = 'card' | 'chip' | 'check' | 'turn' | 'win' | 'fold'
export interface PublicSoundFrame {
  hand:number; phase:string; actor:number|null; boardCount?:number
  players:readonly {seat:number;stack:number;bet:number;folded:boolean;action:string}[]
}

/** PokerAudio is the only production consumer. UI adapters project public
 * fields, but cannot choose action sounds: the former callbacks treated every
 * bot decision (including checks/folds) as a chip payment. This is NOT a ledger
 * and must never receive/retain deck or hole cards. No engine/scene imports.
 *
 * Snapshot gaps intentionally remain silent. A reconnect/poll may contain
 * several actions, refunds or an entire street; guessing a burst from the net
 * balance would manufacture events that were never observed. Muted/paused
 * observations still move the baseline so resuming cannot replay old chips. */
export class TableSounds {
  private previous?:{revision:number;frame:PublicSoundFrame}
  reset():void { this.previous=undefined }
  observe(revision:number,frame:PublicSoundFrame,audible:boolean,viewer:number):SoundKind[] {
    const before=this.previous
    if(!Number.isSafeInteger(revision) || before && revision<=before.revision)return []
    this.previous={revision,frame:{hand:frame.hand,phase:frame.phase,actor:frame.actor,boardCount:frame.boardCount,
      players:frame.players.map(p=>({seat:p.seat,stack:p.stack,bet:p.bet,folded:p.folded,action:p.action}))}}
    if(!before || !audible || revision!==before.revision+1)return []
    const old=before.frame,cues:SoundKind[]=[]
    if(frame.hand!==old.hand)cues.push('card')
    else if(frame.phase==='complete' && old.phase!=='complete')cues.push('win')
    else if(frame.boardCount!==undefined && old.boardCount!==undefined && frame.boardCount>old.boardCount)cues.push('card')
    else if(old.phase==='betting' && old.actor!==null){
      const from=old.players.find(p=>p.seat===old.actor),to=frame.players.find(p=>p.seat===old.actor)
      if(from && to){
        if(to.folded && !from.folded)cues.push('fold')
        else if(to.stack<from.stack && to.bet>from.bet)cues.push('chip')
        else if(to.action==='Check' && (frame.actor!==old.actor || to.action!==from.action))cues.push('check')
      }
    }
    if(frame.phase==='betting' && frame.actor===viewer && (old.actor!==viewer || old.phase!=='betting'))cues.push('turn')
    return cues
  }
}
