import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import type { EffectFrame } from '../../interaction/effects/EffectEngine'

/** Cosmetic intoxication pass (#15), run in linear HDR before OutputPass so
 * tone mapping still owns the final look. The shader has NO clock of its own:
 * every phase arrives as a uniform from the pure EffectEngine, which keeps it
 * deterministic, frozen on pause and bounded by the engine's frequency table.
 *  - double: two taps averaged, so overall luminance is preserved (a soft
 *    double image, not a brightening ghost).
 *  - hue: a YIQ chroma rotation leaves Y (luma) untouched; cycling hue is
 *    therefore not a luminance flicker for photosensitivity purposes.
 *  - warp/breath: low-spatial-frequency UV displacement ("walls breathing"),
 *    clamped to the frame so edges never sample garbage. */
const IntoxicationShader = {
  name: 'IntoxicationShader',
  uniforms: {
    tDiffuse: { value: null }, uDouble: { value: new THREE.Vector2() }, uHueAngle: { value: 0 }, uHueMix: { value: 0 },
    uSaturation: { value: 0 }, uWarp: { value: 0 }, uWarpPhase: { value: new THREE.Vector2() }, uBreath: { value: 0 },
  },
  vertexShader: 'varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
  fragmentShader: `
    uniform sampler2D tDiffuse; uniform vec2 uDouble; uniform float uHueAngle, uHueMix, uSaturation, uWarp, uBreath; uniform vec2 uWarpPhase;
    varying vec2 vUv;
    void main() {
      vec2 c = vUv - 0.5;
      vec2 uv = 0.5 + c * (1.0 - uBreath);
      uv += uWarp * vec2(sin(uv.y * 9.4 + uWarpPhase.x), sin(uv.x * 7.5 + uWarpPhase.y));
      uv = clamp(uv, 0.001, 0.999);
      vec4 base = texture2D(tDiffuse, uv);
      vec3 color = mix(base.rgb, texture2D(tDiffuse, clamp(uv + uDouble, 0.001, 0.999)).rgb, step(0.00001, length(uDouble)) * 0.45);
      float y = dot(color, vec3(0.299, 0.587, 0.114));
      vec3 yiq = vec3(y, dot(color, vec3(0.596, -0.274, -0.322)), dot(color, vec3(0.211, -0.523, 0.312)));
      float cs = cos(uHueAngle), sn = sin(uHueAngle);
      vec2 iq = vec2(yiq.y * cs - yiq.z * sn, yiq.y * sn + yiq.z * cs);
      vec3 rotated = vec3(y + 0.956 * iq.x + 0.621 * iq.y, y - 0.272 * iq.x - 0.647 * iq.y, y - 1.106 * iq.x + 1.703 * iq.y);
      color = mix(color, max(rotated, 0.0), uHueMix);
      color = mix(vec3(y), color, 1.0 + uSaturation);
      gl_FragColor = vec4(max(color, 0.0), base.a);
    }`,
}

/** The canvas receives only OutputPass's fullscreen triangle. Its input already
 * contains resolved 4x scene coverage, so multisampling that triangle again
 * spends color/depth storage without improving a hand/card silhouette. The real
 * browser baseline reports canvasAntialias=true/defaultSamples=4. Keep MSAA on
 * the scene target below: removing THAT was the old voxel-shimmer regression.
 * Canonical14-12-39/14-13-19 browser PNGs are byte-identical; a separate actual
 * context readout confirms canvas0 samples. This proves that one fixed view,
 * not an FPS speedup or motion quality on every device. */
export const RENDERER_OPTIONS: THREE.WebGLRendererParameters = { antialias: false, powerPreference: 'high-performance' }

/** One owner for offscreen buffers, output transform and post passes. Room owns
 * scene/clock; this owner cannot see engine state or alter physical animation.
 * The ablation's unstable repeated baseline did not justify changing the look,
 * so retain HDR, restrained bloom and the existing ACES/sRGB output path. */
export class PostProcessing {
  private composer: EffectComposer
  private bloom: UnrealBloomPass
  private output = new OutputPass()
  private effect = new ShaderPass(IntoxicationShader)
  // Force the first resize even when CSS happens to match the seed target;
  // constructor target dimensions are not yet multiplied by renderer DPR.
  private width = -1
  private height = -1
  private ratio: number
  constructor(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.Camera) {
    this.ratio = renderer.getPixelRatio()
    const target = new THREE.WebGLRenderTarget(1100, 800, { type: THREE.HalfFloatType, samples: 4 })
    this.composer = new EffectComposer(renderer, target)
    this.composer.addPass(new RenderPass(scene, camera))
    // Paper/skin never emit into this threshold; only the practicals bloom.
    // Strength .18 → .32 (#8): candles, fairy bulbs and lanterns now halo the
    // way warm bulbs do in a dim room. The threshold, which is what keeps
    // cards and faces out of the bloom, is unchanged.
    this.bloom = new UnrealBloomPass(new THREE.Vector2(1100, 800), .32, .5, 4)
    this.composer.addPass(this.bloom)
    // Disabled passes are skipped by EffectComposer, so a sober frame renders
    // exactly the pre-#15 pipeline (no extra fullscreen draw, no resampling).
    this.effect.enabled = false; this.composer.addPass(this.effect)
    this.composer.addPass(this.output)
  }
  setSize(width: number, height: number, ratio: number): void {
    if (ratio !== this.ratio) { this.ratio = ratio; this.composer.setPixelRatio(ratio) }
    if (width !== this.width || height !== this.height) {
      this.width = width; this.height = height; this.composer.setSize(width, height)
    }
  }
  setBloomEnabled(enabled: boolean): void { this.bloom.enabled = enabled }
  /** Bypass is decided here from the parameters, not trusted from a flag:
   * any all-zero frame (Off, reduced motion, sober, probe) disables the pass. */
  setEffect(post: EffectFrame['post'] | null): void {
    const on = !!post && (post.double[0] !== 0 || post.double[1] !== 0 || post.hueMix > 0 || post.saturation !== 0 || post.warp > 0 || post.breath !== 0)
    this.effect.enabled = on
    if (!on || !post) return
    const u = this.effect.uniforms
    u.uDouble.value.set(...post.double); u.uHueAngle.value = post.hueAngle; u.uHueMix.value = post.hueMix
    u.uSaturation.value = post.saturation; u.uWarp.value = post.warp; u.uWarpPhase.value.set(...post.warpPhase); u.uBreath.value = post.breath
  }
  render(): void { this.composer.render() }
  diagnostics() {
    const target = this.composer.readBuffer
    return { sceneSamples: target.samples, hdr: target.texture.type === THREE.HalfFloatType,
      passCount: this.composer.passes.length, effectEnabled: this.effect.enabled, bloomThreshold: this.bloom.threshold, buffer: [target.width, target.height] }
  }
  dispose(): void {
    // EffectComposer disposes its own two targets/copy pass, NOT added passes.
    // Bloom owns eleven temporary targets; leaving them behind on HMR retains
    // substantial GPU storage even after the canvas had disappeared.
    this.bloom.dispose(); this.effect.dispose(); this.output.dispose(); this.composer.dispose()
  }
}
