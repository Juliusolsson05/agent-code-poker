import { FireAmbience } from './audio/FireAmbience'
import { TableSounds, type PublicSoundFrame, type SoundKind } from './audio/events/TableSounds'
import { ChipFoley } from './audio/ChipFoley'

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
  // Optional QA hook reports attempted audible cues, not proof of device output.
  onCue?: (kind:SoundKind)=>void
  constructor(fireSource?: string, private firePosition?: readonly number[]) {
    if (fireSource) this.fire = new FireAmbience(new Audio(fireSource))
  }
  setAmbienceActive(active: boolean): void { this.fire?.setActive(active); if(!active)this.stopEffects() }
  setListenerMatrix(matrix: ArrayLike<number>): void { this.fire?.setListenerMatrix(matrix) }
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
    if(muted)this.stopEffects()
    this.syncGain()
  }
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
    this.disposed=true;this.stopEffects();this.chips?.dispose();this.fire?.dispose();this.master?.disconnect()
    void this.context?.close().catch(() => {});this.context=null;this.master=null
  }
}
