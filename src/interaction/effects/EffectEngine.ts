import { DRINKS, TREATS, type DrinkKind, type TreatKind } from '../../scene/props/specs'

/** Receipts come ONLY from the player's InteractionDirector, once per
 * completed sip/consume. Ordering, NPC pose timers and LAN peers have no path
 * in: that is what keeps this a local, cosmetic reaction to the player's own
 * visible action rather than a state anyone else can drive. */
export type CompletedSip = { id: number; actor: 'player'; kind: DrinkKind }
export type CompletedTreat = { id: number; actor: 'player'; kind: TreatKind }
export type EffectSetting = 'off' | 'normal' | 'strong'
export type EffectSource = 'drink' | 'mushroom' | 'lsd'

/** Everything a renderer needs for one frame. Angles are radians, bob metres,
 * uv offsets in [0,1] screen units. All zeros means "bypass entirely". */
export type EffectFrame = {
  /** CSS edge tint. Survives reduced motion: it is a static colour, not motion. */
  tint: { opacity: number; color: string }
  /** Render-camera only. Applied after look yaw/pitch; never to the logical
   * camera that the audio listener and world labels read. */
  sway: { yaw: number; pitch: number; roll: number; bob: number }
  post: { double: [number, number]; hueAngle: number; hueMix: number; saturation: number; warp: number; warpPhase: [number, number]; breath: number }
  active: boolean
}

/** Every oscillator in the engine, in Hz. Kept in one table so the safety test
 * can assert the whole set rather than trusting each call site: motion (sway,
 * bob, warp, breathing) stays ≤0.5 Hz, the band where a slow Sea-of-Thieves
 * lurch reads as woozy rather than as shake. Nothing here approaches the 3 Hz
 * photosensitive flash threshold; hue cycling additionally preserves luminance
 * in the shader (a YIQ chroma rotation), so it is not a luminance flicker. */
export const EFFECT_FREQUENCIES = {
  swayYaw: .11, swayPitch: .15, swayRoll: .19, bob: .27,
  breath: .10, mushroomYaw: .07, lsdYaw: .09, lsdRoll: .13,
  doubleTurn: .05, hue: .04, warpX: .12, warpY: .09,
} as const
/** Roll is the most disorienting axis (it tilts the horizon), so it has an
 * absolute cap independent of how many sources stack. 4° is a visible lean,
 * not a capsizing ship; Strong at full dose reaches it, Normal stays under. */
export const ROLL_CAP = .07
const YAW_CAP = .06, PITCH_CAP = .035, BOB_CAP = .014, DOUBLE_CAP = .014, WARP_CAP = .012

/** Felt-intensity profiles. `onset` is how fast the felt level may climb
 * toward the dose (per second); `decay` is how fast the dose itself fades.
 * Drinks keep DrinkWarmth's exact maths (1/6 per standard sip, 600 s from the
 * cap) because tests/sip-feedback replays a real recording against it. Treats
 * come on slower and linger longer so they read differently from a drink. */
const PROFILES: Record<EffectSource, { onset: number; decay: number; perReceipt: number }> = {
  drink: { onset: 1 / 20, decay: 1 / 600, perReceipt: 1 / 6 },
  mushroom: { onset: 1 / 40, decay: 1 / 480, perReceipt: .5 },
  lsd: { onset: 1 / 60, decay: 1 / 900, perReceipt: .8 },
}
const TINT: Record<EffectSource, string> = { drink: '#ad582b', mushroom: '#b8862b', lsd: '#7a4fb0' }
const hex = (value: string) => [1, 3, 5].map(i => parseInt(value.slice(i, i + 2), 16))
/** Contribution-weighted RGB mix; all-zero weights fall back to drink amber
 * (the colour the tint had before #15), so an idle tint never flickers hue. */
export function blendTint(parts: [string, number][]): string {
  const total = parts.reduce((sum, [, w]) => sum + Math.max(0, w), 0)
  if (!(total > 0)) return TINT.drink
  const rgb = [0, 0, 0]
  for (const [color, weight] of parts) hex(color).forEach((c, i) => { rgb[i] += c * Math.max(0, weight) / total })
  return '#' + rgb.map(c => Math.round(c).toString(16).padStart(2, '0')).join('')
}
const SCALE: Record<EffectSetting, number> = { off: 0, normal: .55, strong: 1 }
const TWO_PI = Math.PI * 2
const clamp = (value: number, limit: number) => Math.max(-limit, Math.min(limit, value))
const wave = (hz: keyof typeof EFFECT_FREQUENCIES, time: number, phase = 0) => Math.sin(TWO_PI * EFFECT_FREQUENCIES[hz] * time + phase)

/** One owner for every cosmetic intoxication channel (#15). It replaces
 * DrinkWarmth's single scalar with per-source dose/level so drinks, mushrooms
 * and LSD can build, overlap and fade independently.
 *
 * Pure on purpose: no Three.js, DOM, timers or wall clock. Room feeds it the
 * paused visual delta and the visual time, so pause freezes it, a replay is
 * deterministic, and a test can drive it without a GPU. It has no reference to
 * props, the ledger or the engine; its only output is an EffectFrame. */
export class EffectEngine {
  private dose: Record<EffectSource, number> = { drink: 0, mushroom: 0, lsd: 0 }
  private level: Record<EffectSource, number> = { drink: 0, mushroom: 0, lsd: 0 }
  // Separate high-water marks: sips and treats are independent id streams
  // from the director, so a sip #3 must not swallow treat #2.
  private seenSip = 0
  private seenTreat = 0
  private setting: EffectSetting = 'off'
  get currentSetting(): EffectSetting { return this.setting }
  setSetting(setting: EffectSetting): void {
    this.setting = setting
    // Off must be immediate and complete (the "always one click away" escape).
    if (setting === 'off') this.clear()
  }
  private clear(): void { for (const source of ['drink', 'mushroom', 'lsd'] as const) { this.dose[source] = 0; this.level[source] = 0 } }
  private admit(id: number, stream: 'seenSip' | 'seenTreat'): boolean {
    if (!Number.isSafeInteger(id) || id <= this[stream]) return false
    this[stream] = id
    return true
  }
  acceptSip(sip: CompletedSip): void {
    // Record the high-water mark even while Off, so turning the effect on later
    // cannot replay a sip that happened while it was off.
    if (!this.admit(sip.id, 'seenSip') || this.setting === 'off' || sip.actor !== 'player') return
    const spec = DRINKS[sip.kind]
    if (!spec?.alcoholic || !(spec.strength > 0)) return
    this.dose.drink = Math.min(1, this.dose.drink + PROFILES.drink.perReceipt * spec.strength)
  }
  acceptTreat(treat: CompletedTreat): void {
    if (!this.admit(treat.id, 'seenTreat') || this.setting === 'off' || treat.actor !== 'player') return
    const source = TREATS[treat.kind]?.source
    if (!source) return
    this.dose[source] = Math.min(1, this.dose[source] + PROFILES[source].perReceipt)
  }
  /** Visual-clock delta only. Zero/negative/NaN (pause, a clock reset) is a
   * no-op, so a paused table can never fade or build the effect. */
  advance(seconds: number): void {
    if (!Number.isFinite(seconds) || seconds <= 0) return
    for (const source of ['drink', 'mushroom', 'lsd'] as const) {
      const profile = PROFILES[source]
      this.dose[source] = Math.max(0, this.dose[source] - seconds * profile.decay)
      // Felt level climbs toward the dose at the onset rate and never exceeds
      // it: a fading dose pulls the level down with it immediately.
      this.level[source] = Math.min(this.dose[source], this.level[source] + seconds * profile.onset)
    }
  }
  /** Leaving the table ends the night. Keep the receipt high-water marks:
   * re-entering must not replay an old sip. */
  reset(): void { this.clear() }
  /** Legacy edge-warmth opacity for drinks, bit-for-bit DrinkWarmth: the dose
   * (not the slower felt level) so a completed sip is acknowledged at once.
   * Normal/Strong keep the old Subtle/Soft .09/.18 maxima. */
  get drinkTintOpacity(): number { return this.dose.drink * (this.setting === 'strong' ? .18 : this.setting === 'normal' ? .09 : 0) }
  levels(): Readonly<Record<EffectSource, number>> { return { ...this.level } }

  sample(time: number, reduced: boolean): EffectFrame {
    const k = SCALE[this.setting]
    const drink = this.level.drink * k, mushroom = this.level.mushroom * k, lsd = this.level.lsd * k
    // Treat tint follows the felt level (they "come on"); drinks keep the
    // immediate dose tint above. The sum is capped well short of a wash-out.
    const treatTint = (mushroom + lsd) * .16
    const opacity = Math.min(.3, this.drinkTintOpacity + treatTint)
    // Blend the source colours by their current contribution instead of
    // snapping to the leader: as a drink fades and a treat comes on, the edge
    // glides from amber to violet rather than jumping at the crossover.
    const color = blendTint([[TINT.drink, this.drinkTintOpacity], [TINT.mushroom, mushroom * .16], [TINT.lsd, lsd * .16]])
    const tint = { opacity, color }
    const zero: EffectFrame = { tint, sway: { yaw: 0, pitch: 0, roll: 0, bob: 0 },
      post: { double: [0, 0], hueAngle: 0, hueMix: 0, saturation: 0, warp: 0, warpPhase: [0, 0], breath: 0 }, active: false }
    // prefers-reduced-motion: colour tint only. No sway, warp, double image or
    // hue cycling (a slowly changing hue is still motion-like visual change).
    if (reduced || drink + mushroom + lsd <= 0) return zero
    const t = time
    const sway = {
      yaw: clamp(drink * .045 * wave('swayYaw', t) + mushroom * .012 * wave('mushroomYaw', t, 1) + lsd * .010 * wave('lsdYaw', t, 2), YAW_CAP),
      pitch: clamp(drink * .022 * wave('swayPitch', t, 1.3) + mushroom * .016 * wave('breath', t), PITCH_CAP),
      roll: clamp(drink * .075 * wave('swayRoll', t, .5) + lsd * .015 * wave('lsdRoll', t), ROLL_CAP),
      bob: clamp(drink * .008 * wave('bob', t) + mushroom * .010 * wave('breath', t, Math.PI / 2), BOB_CAP),
    }
    const turn = TWO_PI * EFFECT_FREQUENCIES.doubleTurn * t, spread = Math.min(DOUBLE_CAP, drink * .012)
    const post = {
      double: [Math.cos(turn) * spread, Math.sin(turn) * spread * .6] as [number, number],
      hueAngle: TWO_PI * EFFECT_FREQUENCIES.hue * t, hueMix: Math.min(.85, lsd * .85),
      saturation: Math.min(.7, mushroom * .6 + lsd * .25),
      warp: Math.min(WARP_CAP, lsd * .010 + mushroom * .003),
      warpPhase: [TWO_PI * EFFECT_FREQUENCIES.warpX * t, TWO_PI * EFFECT_FREQUENCIES.warpY * t] as [number, number],
      breath: (mushroom * .010 + lsd * .006) * wave('breath', t),
    }
    return { tint, sway, post, active: true }
  }
}
