import * as THREE from 'three'
import { VoxelSculpt, anatomyMaterial } from './Voxel'
import { DRINKS, drinkAnchors, type DrinkKind, type DrinkSpec } from './props/specs'
export type { DrinkKind } from './props/specs'

/** Sampled hollow solids, not transparent filled cylinders. Only exposed block
 * faces are emitted. Standard alpha glass avoids transmission render targets;
 * a separate restrained rim keeps the vessel legible in the dark room. Each
 * instance owns resources: replacing it cannot dispose another actor's drink.
 * No per-frame geometry allocation or procedural re-sampling. */
export class TableDrink {
  readonly root = new THREE.Group()
  readonly grip: THREE.Vector3
  readonly rim: THREE.Vector3
  /** `near` names the vessel-local Z side the drinker sits on: +1 for the hero
   * (who faces -Z), -1 for opponents (who face +Z). Only the mouth anchor
   * depends on it. Opponents used to spin the whole vessel π about Y to reach
   * the near rim, which also carried the grip to the inner face (#7); the
   * vessel is round, so its geometry never needed that turn. */
  constructor(readonly kind: DrinkKind = 'old-fashioned', near: 1 | -1 = 1) {
    const spec: DrinkSpec = DRINKS[kind], anchors = drinkAnchors(kind), step = .002
    this.grip = new THREE.Vector3(...anchors.grip); this.rim = new THREE.Vector3(anchors.rim[0], anchors.rim[1], anchors.rim[2] * near)
    this.root.name = `${kind}-drink`
    const radiusAt = (y: number) => spec.radius - .002 * (1 - Math.min(1, y / .030))
    const wall = new VoxelSculpt(step).volume([-spec.radius, step / 2, -spec.radius], [spec.radius, spec.height - .004, spec.radius], (x, y, z) => {
      const radius = radiusAt(y), r = Math.hypot(x, z)
      return r < radius && (y <= .006 || r > radius - .0028)
    }, '#b2c5be')
    const glass = anatomyMaterial(.24); glass.transparent = true; glass.opacity = .23; glass.depthWrite = false
    this.add(wall.mesh(glass), 'block-glass')
    const lip = new VoxelSculpt(step).volume([-spec.radius, spec.height - .002, -spec.radius], [spec.radius, spec.height, spec.radius], (x, _y, z) => {
      const r = Math.hypot(x, z); return r < spec.radius && r > spec.radius - .0025
    }, '#c3c8b9')
    const rimMaterial = anatomyMaterial(.32); rimMaterial.transparent = true; rimMaterial.opacity = .65; rimMaterial.depthWrite = false
    this.add(lip.mesh(rimMaterial), 'block-rim')
    const liquid = new VoxelSculpt(step).volume([-spec.radius, .008, -spec.radius], [spec.radius, spec.fill, spec.radius], (x, y, z) => Math.hypot(x, z) < radiusAt(y) - .0045, spec.color)
    const liquidMaterial = anatomyMaterial(.26)
    // Opaque amber/wine avoids nested alpha sorting through the hand. Only the
    // pale/bright highballs (water, gin & tonic, cranberry spritz) are
    // translucent, and they carry ice/bubbles that must read through the pour.
    if (spec.translucent) {
      liquidMaterial.transparent = true; liquidMaterial.opacity = kind === 'cranberry-spritz' ? .55 : kind === 'gin-tonic' ? .30 : .35
      liquidMaterial.depthWrite = false
    }
    this.add(liquid.mesh(liquidMaterial), 'block-liquid')
    // ONE merged garnish mesh, not one per ice cube/peel/stick. The props test
    // caps a drink at five meshes (a draw call each, times six seats), and one
    // multi-coloured sculpt costs triangles, not submissions. Everything solid
    // stays inside the vessel wall and under the rim: the rim is the mouth
    // contact and the wall radius is the grip, so a garnish poking past either
    // would sit inside the lips or the fingers during the fitted sip.
    const garnish = new VoxelSculpt(.0015)
    const inner = spec.radius - .0055, top = spec.height - .0035
    GARNISH[kind](garnish, { fill: spec.fill, inner, top })
    const garnishMesh = garnish.mesh(anatomyMaterial(.62))
    if (garnishMesh.geometry.getAttribute('position').count) this.add(garnishMesh, 'block-garnish')
    else garnishMesh.geometry.dispose()
    if (STEAMING.has(kind)) {
      // Vapour, not a solid: it may rise above the rim because nothing ever
      // touches it (tests/props excludes `userData.vapour` from the rim/grip
      // bounds on purpose). Coarse 3mm cells keep it soft and cheap; it is
      // drawn after the vessel with no depth write so it never hides the rim.
      const steam = new VoxelSculpt(.003)
      for (const [x, z, phase] of [[-.010, .004, 0], [.009, -.006, 2.1], [.001, .012, 4.2]] as const)
        steam.volume([x - .012, spec.fill + .006, z - .012], [x + .012, spec.height + .030, z + .012], (px, py, pz) => {
          const t = (py - spec.fill) / .05, cx = x + Math.sin(t * 5 + phase) * .005, cz = z + Math.cos(t * 4 + phase) * .004
          return Math.hypot(px - cx, pz - cz) < .0032 * (1 - t * .35)
        }, '#e9e6de')
      const material = anatomyMaterial(1); material.transparent = true; material.opacity = .10; material.depthWrite = false
      const mesh = steam.mesh(material); mesh.userData.vapour = true; mesh.renderOrder = 2
      this.add(mesh, 'block-steam'); this.steam = mesh
    }
  }
  private steam: THREE.Mesh | null = null
  /** Presentation-only drift for vapour. Driven by the Room's paused visual
   * clock, so pause freezes it and reduced motion keeps it still. The opacity
   * breath is 0.2 Hz, far below the 3 Hz photosensitivity bound. */
  frame(time: number, reduced: boolean): void {
    if (!this.steam) return
    this.steam.rotation.y = reduced ? 0 : time * .25
    ;(this.steam.material as THREE.MeshStandardMaterial).opacity = reduced ? .09 : .085 + .025 * Math.sin(time * Math.PI * 2 * .2)
  }
  private add(mesh: THREE.Mesh, name: string): void {
    mesh.name = name; mesh.castShadow = false; mesh.receiveShadow = true; this.root.add(mesh)
  }
  dispose(): void {
    this.root.traverse(o => { if (o instanceof THREE.Mesh) { o.geometry.dispose(); (o.material as THREE.Material).dispose() } })
    this.root.removeFromParent()
  }
}

export function coaster(): THREE.Mesh {
  const mesh = new VoxelSculpt(.003).volume([-.051, -.0015, -.051], [.051, .0015, .051], (x, _y, z) =>
    Math.hypot(x, z) < .051, '#4c3527').mesh(anatomyMaterial(.95))
  mesh.name = 'block-leather-coaster'; mesh.castShadow = false; return mesh
}

type Garnish = (sculpt: VoxelSculpt, at: { fill: number; inner: number; top: number }) => void
type V3 = [number, number, number]

/** Sample a shape authored in its own local frame, placed by a rotation and
 * translation, into the one shared garnish sculpt. Sampling the INVERSE
 * transform keeps every block axis-aligned with its neighbours; rotating a
 * separate mesh (the old peel) needed a draw call of its own. */
function placed(sculpt: VoxelSculpt, centre: V3, euler: V3, half: V3, inside: (x: number, y: number, z: number) => boolean, color: string): void {
  const matrix = new THREE.Matrix4().compose(new THREE.Vector3(...centre), new THREE.Quaternion().setFromEuler(new THREE.Euler(...euler)), new THREE.Vector3(1, 1, 1))
  const inverse = matrix.clone().invert(), box = new THREE.Box3(new THREE.Vector3(...half).negate(), new THREE.Vector3(...half)).applyMatrix4(matrix)
  const p = new THREE.Vector3()
  sculpt.volume(box.min.toArray(), box.max.toArray(), (x, y, z) => { p.set(x, y, z).applyMatrix4(inverse); return inside(p.x, p.y, p.z) }, color)
}
const ice = (s: VoxelSculpt, centre: V3, half: number, turn: number) => placed(s, centre, [0, turn, 0], [half, half, half], (x, y, z) =>
  Math.max(0, Math.abs(x) - half * .78) ** 2 + Math.max(0, Math.abs(y) - half * .83) ** 2 + Math.max(0, Math.abs(z) - half * .78) ** 2 < (half * .22) ** 2, '#c4d5cc')
/** A citrus wheel lying in its local XZ plane: rind ring, pith, segment spokes. */
const wheel = (s: VoxelSculpt, centre: V3, euler: V3, radius: number, rind: string, flesh: string) => {
  placed(s, centre, euler, [radius, .0016, radius], (x, _y, z) => Math.hypot(x, z) < radius, rind)
  placed(s, centre, euler, [radius, .0016, radius], (x, _y, z) => Math.hypot(x, z) < radius - .002, '#f1e6bf')
  placed(s, centre, euler, [radius, .0016, radius], (x, _y, z) => {
    const r = Math.hypot(x, z), a = Math.atan2(z, x)
    return r < radius - .0032 && Math.abs(Math.sin(a * 4)) > .22
  }, flesh)
}
/** A rolled bark quill leaning inside the vessel; top stays under the rim. */
const cinnamon = (s: VoxelSculpt, base: V3, tip: V3) => {
  const a = new THREE.Vector3(...base), b = new THREE.Vector3(...tip), axis = b.clone().sub(a), length = axis.length(); axis.normalize()
  const min = a.clone().min(b).subScalar(.005), max = a.clone().max(b).addScalar(.005), p = new THREE.Vector3()
  s.volume(min.toArray(), max.toArray(), (x, y, z) => {
    p.set(x, y, z).sub(a); const t = p.dot(axis)
    return t >= 0 && t <= length && p.addScaledVector(axis, -t).length() < .0036
  }, '#7a4523')
}
const foam = (s: VoxelSculpt, fill: number, inner: number, depth: number, color: string, ripple = .0015) =>
  s.volume([-inner, fill + .001, -inner], [inner, fill + depth + ripple, inner], (x, y, z) =>
    Math.hypot(x, z) < inner && y < fill + depth + ripple * Math.cos(x * 160) * Math.cos(z * 150), color)
const dots = (s: VoxelSculpt, points: [number, number][], y: number, size: number, color: string) => {
  for (const [x, z] of points) s.volume([x - size, y - size, z - size], [x + size, y + size, z + size], (px, py, pz) => Math.hypot(px - x, py - y, pz - z) <= size, color)
}
/** Deterministic scatter (no Math.random: drinks must be reproducible between
 * a studio capture and live play). A golden-angle spiral fills the disc. */
const scatter = (count: number, radius: number, turn = 0): [number, number][] =>
  Array.from({ length: count }, (_, i) => { const r = radius * Math.sqrt((i + .5) / count), a = i * 2.39996 + turn; return [Math.cos(a) * r, Math.sin(a) * r] })

const STEAMING = new Set<DrinkKind>(['mulled-wine', 'glogg', 'hot-toddy', 'irish-coffee', 'eggnog', 'hot-chocolate'])

/** Per-kind dressing. Each reads as its drink at seated distance through ONE
 * distinctive silhouette cue (peel, foam, wheel, cream, cubes) plus colour. */
const GARNISH: Record<DrinkKind, Garnish> = {
  'old-fashioned': (s, { fill }) => {
    ice(s, [.002, fill + .005, -.002], .018, .24)
    placed(s, [-.006, .065, .004], [.3, .2, .35], [.024, .005, .024], (x, _y, z) => {
      const a = Math.atan2(z, x), r = Math.hypot(x, z); return a > -.6 && a < 2.1 && r > .019 && r < .023
    }, '#d37a27')
    placed(s, [-.006, .065, .004], [.3, .2, .35], [.024, .005, .024], (x, _y, z) => {
      const a = Math.atan2(z, x), r = Math.hypot(x, z); return a > -.6 && a < 2.1 && r > .019 && r < .0205
    }, '#d7b46c')
  },
  wine: () => {},
  'gin-tonic': (s, { fill, inner }) => {
    ice(s, [-.006, fill - .045, .004], .0115, .5); ice(s, [.007, fill - .022, -.005], .0115, 1.1); ice(s, [-.003, fill - .002, .002], .0115, .2)
    wheel(s, [inner - .012, fill + .004, 0], [0, 0, Math.PI / 2 - .25], .012, '#3f7d2c', '#b9d67a')
    // Tonic bubbles clinging to the inside of a translucent pour.
    for (const [i, [x, z]] of scatter(14, inner - .003, .7).entries()) dots(s, [[x, z]], .014 + (i * .0061) % (fill - .02), .0009, '#eef5ee')
  },
  negroni: (s, { fill }) => {
    ice(s, [0, fill - .006, 0], .017, .6)
    wheel(s, [.013, fill + .006, 0], [0, 0, Math.PI / 2 - .12], .016, '#d86a1c', '#e8903a')
  },
  champagne: (s, { fill, inner }) => {
    // Rising strings of bubbles are what make a flute pour read as sparkling.
    for (const [x, z] of [[-.010, .006], [.008, -.009], [.004, .011], [-.003, -.004]])
      for (let y = .014; y < fill - .003; y += .0065) dots(s, [[x + Math.sin(y * 300) * .0012, z]], y, .0009, '#f6ecc4')
    s.volume([-inner, fill + .0005, -inner], [inner, fill + .003, inner], (x, _y, z) => { const r = Math.hypot(x, z); return r < inner && r > inner - .006 }, '#f4efd9')
  },
  beer: (s, { fill }) => foam(s, fill, .031, .006, '#d9ccb0'),
  stout: (s, { fill, inner }) => {
    foam(s, fill, inner, .012, '#cdb48a', .001)
    s.volume([-inner, fill + .001, -inner], [inner, fill + .004, inner], (x, _y, z) => Math.hypot(x, z) < inner, '#8e6b45')
  },
  cider: (s, { fill, inner }) => {
    placed(s, [.004, fill + .002, .002], [0, .4, 0], [.017, .0017, .017], (x, _y, z) => z > 0 && Math.hypot(x, z) < .016, '#a8322a')
    placed(s, [.004, fill + .002, .002], [0, .4, 0], [.017, .0017, .017], (x, _y, z) => z > .0015 && Math.hypot(x, z) < .0142, '#efe2b0')
    for (const [x, z] of scatter(5, inner - .006, 1.3)) dots(s, [[x, z]], fill - .010 - Math.abs(x) * .6, .0009, '#f2dca0')
  },
  'mulled-wine': (s, { fill, inner, top }) => {
    wheel(s, [-.006, fill + .0025, .004], [.05, 0, .04], .0135, '#d86a1c', '#e9973e')
    cinnamon(s, [.010, .018, -.012], [.016, top, -.016])
    placed(s, [.012, fill + .002, .010], [0, .3, 0], [.007, .0015, .007], (x, _y, z) => { const a = Math.atan2(z, x); return Math.hypot(x, z) < .0065 * (.55 + .45 * Math.abs(Math.cos(a * 4))) }, '#4a2a17')
  },
  glogg: (s, { fill, inner }) => {
    dots(s, scatter(7, inner - .006, .4), fill + .001, .0026, '#2b1810')
    for (const [x, z] of scatter(5, inner - .008, 2.2))
      placed(s, [x, fill + .0015, z], [0, Math.atan2(z, x), 0], [.005, .0015, .003], (px, _y, pz) => (px / .0048) ** 2 + (pz / .0026) ** 2 < 1, '#dcc59b')
  },
  'hot-toddy': (s, { fill, top }) => {
    wheel(s, [.004, fill + .0025, -.003], [-.04, 0, .05], .0135, '#e3c93a', '#f3e48a')
    dots(s, [[.004 + .009, -.003], [.004 - .007, -.003 + .006], [.004, -.003 - .009]], fill + .006, .0012, '#3a2416')
    cinnamon(s, [-.012, .020, .010], [-.017, top, .014])
  },
  'irish-coffee': (s, { fill, inner }) => {
    s.volume([-inner, fill + .001, -inner], [inner, fill + .016, inner], (x, y, z) => Math.hypot(x, z) < inner && y < fill + .014 + .0015 * Math.cos(Math.hypot(x, z) * 180), '#efe6d0')
    s.paint((x, y, z) => y > fill + .012 && ((Math.floor(x * 900) + Math.floor(z * 900)) % 7 === 0), '#8a5a2e')
  },
  eggnog: (s, { fill, inner }) => {
    s.volume([-inner, fill + .001, -inner], [inner, fill + .008, inner], (x, y, z) => { const r = Math.hypot(x, z); return r < inner && y < fill + .004 + .004 * (1 - r / inner) }, '#f3e9c6')
    s.paint((x, _y, z) => ((Math.floor(x * 700) * 7 + Math.floor(z * 700) * 13) % 11 === 0), '#8a5a2e')
  },
  'hot-chocolate': (s, { fill, inner }) => {
    for (const [i, [x, z]] of scatter(6, inner - .008, .9).entries())
      placed(s, [x, fill + .003, z], [.2 * i, i * .8, .15], [.0036, .0036, .0036], () => true, i % 3 === 2 ? '#f2d6d8' : '#f4eee6')
    s.volume([-inner, fill + .0005, -inner], [inner, fill + .0015, inner], (x, _y, z) => Math.hypot(x, z) < inner - .004 && (Math.floor(x * 800) + Math.floor(z * 800)) % 5 === 0, '#2c170c')
  },
  water: (s, { fill }) => ice(s, [.002, fill + .005, -.002], .018, .24),
  'cranberry-spritz': (s, { fill, inner, top }) => {
    ice(s, [-.006, fill - .030, .004], .0115, .5); ice(s, [.006, fill - .006, -.004], .0115, 1.2)
    dots(s, scatter(6, inner - .006, .3), fill + .0005, .0036, '#7d0f22')
    dots(s, [[.009, .010], [-.011, -.006]], fill - .050, .0036, '#7d0f22')
    // Rosemary: a stem with needles, standing against the far wall.
    const stem = (y: number) => [-.012 + (y - .03) * .06, .012] as const
    s.volume([-.020, .030, .004], [.006, top, .020], (x, y, z) => { const [sx, sz] = stem(y); return Math.hypot(x - sx, z - sz) < .0012 }, '#4c5a2c')
    s.volume([-.022, .045, .002], [.008, top, .022], (x, y, z) => {
      const [sx, sz] = stem(y), node = Math.round((y - .045) / .005) * .005 + .045
      return Math.abs(y - node) < .0008 && Math.hypot(x - sx, z - sz) < .0055 && Math.hypot(x - sx, z - sz) > .0012
    }, '#3f6b3a')
  },
}
