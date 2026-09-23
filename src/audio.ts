import { FireAmbience } from './audio/FireAmbience'
import { TableSounds, type PublicSoundFrame, type SoundKind } from './audio/events/TableSounds'
import { ChipFoley } from './audio/ChipFoley'
import { applyListenerMatrix } from './audio/listener'

// Action sounds are synthesized after a genuine gesture. A modest master gain and
// short envelopes keep six players' actions from becoming an exhausting chorus.
export class PokerAudio {
  private context: AudioContext | null = null
  private master: GainNode | null = null
  muted = false
  private fire?: FireAmbience
  private events = new TableSounds()
  private chips?: ChipFoley
  private effectsLevel=1
  private disposed=false
  private tones=new Map<OscillatorNode,()=>void>()
  // Chat voices get their own bus straight to the destination: the effects
  // master is deliberately quiet (0.18) for chip clicks, which would make
  // speech inaudible under the fire. Master mute still silences it (setMuted),
  // and the effects level does not: turning chip sounds down is not a request
  // to stop hearing friends talk.
  private voiceBus: GainNode | null = null
  private voices=new Map<number,{source:AudioBufferSourceNode;cleanup:()=>void}>()
  private listenerMatrix: ArrayLike<number> | null = null
  // Optional QA hook reports attempted audible cues, not proof of device output.
  onCue?: (kind:SoundKind)=>void
  constructor(fireSource?: string, private firePosition?: readonly number[]) {
    if (fireSource) this.fire = new FireAmbience(new Audio(fireSource))
  }
  setAmbienceActive(active: boolean): void { this.fire?.setActive(active); if(!active)this.stopEffects() }
  setListenerMatrix(matrix: ArrayLike<number>): void {
    // One listener per AudioContext, shared by the hearth and chat voices, so
    // it is driven here rather than only by FireAmbience: a build whose room
    // has no fireplace recording must still place voices correctly. The last
    // matrix is kept so a voice started before the next camera tick is right.
    this.listenerMatrix = matrix
    if (this.context) applyListenerMatrix(this.context, matrix)
  }
  resetEvents():void { this.events.reset() }
  observe(revision:number,frame:PublicSoundFrame,audible:boolean,viewer:number):void {
    for(const cue of this.events.observe(revision,frame,audible,viewer))this.play(cue)
  }
  // Levels are local preferences, not poker saves or host commands. Normal
  // keeps the already quiet maximum; global mute has precedence over both.
  // Changing a slider/select must never grant autoplay permission by itself.
  setLevels(ambience:number,effects:number):void {
    if(Number.isFinite(ambience))this.fire?.setVolume(Math.max(0,Math.min(1,ambience))*.045)
    if(Number.isFinite(effects))this.effectsLevel=Math.max(0,Math.min(1,effects))
    if(!this.effectsLevel)this.stopEffects()
    this.syncGain()
  }
  private syncGain():void {
    if(this.context && this.master)this.master.gain.setTargetAtTime(this.muted?0:.18*this.effectsLevel,this.context.currentTime,.02)
  }
  unlock(): void {
    if (this.muted || this.disposed) return
    try {
      if (!this.context) {
        this.context = new AudioContext()
        this.master = this.context.createGain()
        this.master.gain.value = 0.18*this.effectsLevel
        this.master.connect(this.context.destination)
        this.chips=new ChipFoley(this.context,this.master)
      }
      if (this.firePosition) this.fire?.connectSpatial(this.context, this.firePosition)
      this.fire?.unlock()
      void this.context.resume().catch(() => {})
    } catch { /* Silent play stays available on hosts without audio. */ }
  }
  setMuted(muted: boolean): void {
    this.muted = muted
    this.fire?.setMuted(muted)
    if(muted){this.stopEffects();this.stopVoices()}
    this.syncGain()
  }
  /** Speak one relayed or local chat clip. `position` is the speaker's head
   * in room coordinates (null = this player: in-head, no panner). One voice
   * per speaker: a newer line from the same seat replaces the older one
   * instead of two copies of the same person talking over each other.
   * Resolves false without sound when muted, locked by autoplay policy, or
   * the bytes do not decode — the bubble is always the fallback. */
  async playVoice(bytes: Uint8Array, speaker: number, position: readonly number[] | null): Promise<boolean> {
    const ctx=this.context
    if(!ctx || this.muted || this.disposed || ctx.state!=='running')return false
    let buffer: AudioBuffer
    // decodeAudioData detaches its argument: hand it a copy, never the caller's bytes.
    try { buffer=await ctx.decodeAudioData(bytes.slice().buffer) } catch { return false }
    if(this.context!==ctx || this.muted || this.disposed)return false
    if(!this.voiceBus){this.voiceBus=ctx.createGain();this.voiceBus.gain.value=.85;this.voiceBus.connect(ctx.destination)}
    this.voices.get(speaker)?.cleanup()
    const source=ctx.createBufferSource();source.buffer=buffer
    let panner: PannerNode | null = null
    if(position && position.length===3 && position.every(Number.isFinite)) {
      // Same model as the hearth, closer reference distance: a player across
      // the table is 2–3 m away and should not sound like the far wall.
      panner=ctx.createPanner();panner.panningModel='HRTF';panner.distanceModel='inverse'
      panner.refDistance=1.2;panner.maxDistance=12;panner.rolloffFactor=.5
      panner.positionX.value=position[0];panner.positionY.value=position[1];panner.positionZ.value=position[2]
      if(this.listenerMatrix)applyListenerMatrix(ctx,this.listenerMatrix)
      source.connect(panner);panner.connect(this.voiceBus)
    } else source.connect(this.voiceBus)
    const cleanup=()=>{source.onended=null;try{source.stop()}catch{/* Already ended. */}source.disconnect();panner?.disconnect();if(this.voices.get(speaker)?.source===source)this.voices.delete(speaker)}
    this.voices.set(speaker,{source,cleanup});source.onended=cleanup
    source.start()
    return true
  }
  private stopVoices():void {for(const voice of [...this.voices.values()])voice.cleanup()}
  play(kind: SoundKind): void {
    const ctx = this.context
    if (!ctx || !this.master || this.muted || !this.effectsLevel || this.disposed || ctx.state!=='running') return
    this.onCue?.(kind)
    if(kind==='chip'){this.chips?.play();return}
    const notes = kind === 'win' ? [440, 554, 659, 880] : kind === 'turn' ? [440, 659] : kind === 'fold' ? [150] : kind==='check'?[220]:[360]
    notes.forEach((freq, i) => {
      if(this.tones.size>=12)this.releaseTone(this.tones.keys().next().value!)
      const osc = ctx.createOscillator(); const env = ctx.createGain()
      const at = ctx.currentTime + i * 0.07; const duration = kind === 'win' ? 0.35 : kind==='check'?.035:0.09
      osc.type = kind === 'card' ? 'triangle' : 'sine'
      osc.frequency.setValueAtTime(freq, at)
      osc.frequency.exponentialRampToValueAtTime(freq * 0.65, at + duration)
      env.gain.setValueAtTime(0, at); env.gain.linearRampToValueAtTime(kind==='check'?.1:.3, at + 0.006)
      env.gain.exponentialRampToValueAtTime(0.001, at + duration)
      osc.connect(env); env.connect(this.master!)
      const cleanup=()=>{osc.onended=null;osc.disconnect();env.disconnect();this.tones.delete(osc)}
      this.tones.set(osc,cleanup);osc.onended=cleanup
      osc.start(at); osc.stop(at + duration + 0.02)
    })
  }
  private releaseTone(osc:OscillatorNode):void {
    const cleanup=this.tones.get(osc);if(!cleanup)return
    osc.onended=null;osc.stop();cleanup()
  }
  private stopEffects():void {this.chips?.stop();for(const osc of this.tones.keys())this.releaseTone(osc)}
  dispose(): void {
    if(this.disposed)return
    this.disposed=true;this.stopEffects();this.stopVoices();this.voiceBus?.disconnect();this.voiceBus=null;this.chips?.dispose();this.fire?.dispose();this.master?.disconnect()
    void this.context?.close().catch(() => {});this.context=null;this.master=null
  }
}
