import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'

/** The canvas receives only OutputPass's fullscreen triangle. Its input already
 * contains resolved 4x scene coverage, so multisampling that triangle again
 * spends color/depth storage without improving a hand/card silhouette. The real
 * browser baseline reports canvasAntialias=true/defaultSamples=4. Keep MSAA on
 * the scene target below: removing THAT was the old voxel-shimmer regression.
 * This candidate is opt-in in DEV until a valid canonical browser pair passes;
 * Room deliberately retains the established canvas setting in shipped play. */
export const RENDERER_OPTIONS: THREE.WebGLRendererParameters = { antialias: false, powerPreference: 'high-performance' }

/** One owner for offscreen buffers, output transform and post passes. Room owns
 * scene/clock; this owner cannot see engine state or alter physical animation.
 * The ablation's unstable repeated baseline did not justify changing the look,
 * so retain HDR, restrained bloom and the existing ACES/sRGB output path. */
export class PostProcessing {
  private composer: EffectComposer
  private bloom: UnrealBloomPass
  private output = new OutputPass()
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
    this.bloom = new UnrealBloomPass(new THREE.Vector2(1100, 800), .18, .45, 4)
    this.composer.addPass(this.bloom); this.composer.addPass(this.output)
  }
  setSize(width: number, height: number, ratio: number): void {
    if (ratio !== this.ratio) { this.ratio = ratio; this.composer.setPixelRatio(ratio) }
    if (width !== this.width || height !== this.height) {
      this.width = width; this.height = height; this.composer.setSize(width, height)
    }
  }
  setBloomEnabled(enabled: boolean): void { this.bloom.enabled = enabled }
  render(): void { this.composer.render() }
  diagnostics() {
    const target = this.composer.readBuffer
    return { sceneSamples: target.samples, hdr: target.texture.type === THREE.HalfFloatType,
      passCount: this.composer.passes.length, bloomThreshold: this.bloom.threshold, buffer: [target.width, target.height] }
  }
  dispose(): void {
    // EffectComposer disposes its own two targets/copy pass, NOT added passes.
    // Bloom owns eleven temporary targets; leaving them behind on HMR retains
    // substantial GPU storage even after the canvas had disappeared.
    this.bloom.dispose(); this.output.dispose(); this.composer.dispose()
  }
}
