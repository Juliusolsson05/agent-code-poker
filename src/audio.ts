import { FireAmbience } from './audio/FireAmbience'

// Action sounds are synthesized after a genuine gesture. A modest master gain and
// short envelopes keep six players' actions from becoming an exhausting chorus.
export class PokerAudio {
  private context: AudioContext | null = null
  private master: GainNode | null = null
  muted = false
  private fire?: FireAmbience
  constructor(fireSource?: string) {
    if (fireSource) this.fire = new FireAmbience(new Audio(fireSource))
  }
  setAmbienceActive(active: boolean): void { this.fire?.setActive(active) }
  unlock(): void {
    if (this.muted) return
    this.fire?.unlock()
    try {
      if (!this.context) {
        this.context = new AudioContext()
        this.master = this.context.createGain()
        this.master.gain.value = 0.18
        this.master.connect(this.context.destination)
      }
      void this.context.resume().catch(() => {})
    } catch { /* Silent play stays available on hosts without audio. */ }
  }
  setMuted(muted: boolean): void {
    this.muted = muted
    this.fire?.setMuted(muted)
    if (this.context && this.master) this.master.gain.setTargetAtTime(muted ? 0 : 0.18, this.context.currentTime, 0.02)
  }
  play(kind: 'card' | 'chip' | 'turn' | 'win' | 'fold'): void {
    const ctx = this.context
    if (!ctx || !this.master || this.muted) return
    const notes = kind === 'win' ? [440, 554, 659, 880] : kind === 'turn' ? [440, 659] : kind === 'chip' ? [1100, 1450] : kind === 'fold' ? [150] : [360]
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator(); const env = ctx.createGain()
      const at = ctx.currentTime + i * 0.07; const duration = kind === 'win' ? 0.35 : 0.09
      osc.type = kind === 'card' ? 'triangle' : 'sine'
      osc.frequency.setValueAtTime(freq, at)
      osc.frequency.exponentialRampToValueAtTime(freq * 0.65, at + duration)
      env.gain.setValueAtTime(0, at); env.gain.linearRampToValueAtTime(0.3, at + 0.006)
      env.gain.exponentialRampToValueAtTime(0.001, at + duration)
      osc.connect(env); env.connect(this.master!)
      osc.start(at); osc.stop(at + duration + 0.02)
      osc.onended = () => { osc.disconnect(); env.disconnect() }
    })
  }
  dispose(): void { this.fire?.dispose(); void this.context?.close().catch(() => {}); this.context = null; this.master = null }
}
