import * as THREE from 'three'
import { VoxelSculpt } from './Voxel'

/** Opponent-local landmarks, in metres. The opponent faces +Z; the chair seat
 * top is y=.62 (CHAIR_BLOCKS), the chair back's front face is z=-.1725 and the
 * table's hidden skirt block starts about z=.39 in front of the centre seat.
 * These numbers are the contract between body, chair and table. The arm rig
 * (SeatedArm) owns the shoulder joint at x=±.192, y=1.195, z=.025; the body
 * only has to meet it.
 *
 * Why landmarks, not the old single superellipse: one (x/w)^4 barrel with a
 * sine-shaped width could not express a waist narrower than both hips and
 * chest, a flat back, a seat, or a trapezius slope into the shoulder. It
 * rounded off into two flattened ellipsoid "thighs" that read as a blob
 * sitting on two balls (#9). Look-around now shows side seats and the space
 * under the table, so the missing legs and feet had become visible too. */
export const SEATED_BODY = {
  seatY: .62,
  hip: [.092, .70, -.02] as [number, number, number],
  // Thighs rest ON the seat (flattened underside, below) and stay nearly level,
  // with their top under the rail's .755 underside where side seats sit below
  // the rail lip;
  // a first pass sloped them down and cut through the seat's front edge.
  knee: [.100, .635, .335] as [number, number, number],
  // The seat is tall (.62). A real ~.48m lower leg cannot put a flat foot on
  // the floor from a .64 knee, so the heel lifts and only the toes touch down,
  // as people sit on high chairs. Flat feet needed .56m shins (the leggy first
  // capture).
  ankle: [.104, .16, .40] as [number, number, number],
  backZ: -.108,
} as const

type Person = { jacket: string; shirt: string; trousers?: string; tie?: string }

/** Linear interpolation through (y, value) keys. A smooth spline would add
 * nothing visible at 8mm voxels, and linear keys are easy to retune in place. */
function profile(keys: [number, number][], y: number): number {
  if (y <= keys[0][0]) return keys[0][1]
  for (let i = 1; i < keys.length; i++) if (y <= keys[i][0]) {
    const [y0, v0] = keys[i - 1], [y1, v1] = keys[i]
    return THREE.MathUtils.lerp(v0, v1, THREE.MathUtils.smoothstep(y, y0, y1))
  }
  return keys[keys.length - 1][1]
}

// Half-width, front depth and back depth of the JACKETED torso. The waist
// (~.86) is narrower than both pelvis and chest; the back stays nearly flat,
// replacing the old hump that a symmetric depth profile produced.
const WIDTH: [number, number][] = [[.62, .160], [.70, .168], [.80, .152], [.88, .148], [1.00, .162], [1.10, .176], [1.18, .182], [1.26, .176]]
const FRONT: [number, number][] = [[.62, .085], [.70, .100], [.80, .094], [.90, .098], [1.02, .116], [1.12, .122], [1.20, .112], [1.26, .088]]
const BACK: [number, number][] = [[.62, .100], [.70, .104], [.80, .090], [.90, .090], [1.02, .098], [1.12, .102], [1.20, .098], [1.26, .084]]

/** Shoulder line seen from the front: the trapezius falls from the neck base
 * to the acromion instead of the old flat-topped box shoulders. */
const shoulderTop = (x: number) => {
  const a = Math.abs(x)
  return a < .05 ? 1.305 : 1.305 - .068 * Math.min(1, (a - .05) / .14) ** 1.25
}

/** Distance from p to segment ab, plus the 0..1 parameter along it. Used for
 * limbs: tapered capsules follow the bone line, so a thigh that angles slightly
 * down toward the knee has a round cross-section rather than a sheared box. */
function segment(p: THREE.Vector3, a: THREE.Vector3, b: THREE.Vector3): [number, number] {
  const ab = b.clone().sub(a), t = THREE.MathUtils.clamp(p.clone().sub(a).dot(ab) / ab.lengthSq(), 0, 1)
  return [p.distanceTo(a.clone().addScaledVector(ab, t)), t]
}

export function sculptSeatedBody(p: Person, options: { female: boolean; seat: number }): VoxelSculpt {
  const body = new VoxelSculpt(.008), scale = options.female ? .92 : 1
  const trousers = p.trousers ?? '#222726'
  // Torso: rounded-rectangle (^2.6) sections. A pure ellipse pinches the
  // shoulders; the old ^4 made a box. The bottom is flat on the seat, with a
  // small edge roll so the jacket hem does not read as a sawn-off block.
  body.volume([-.2, SEATED_BODY.seatY, -.12], [.2, 1.31, .13], (x, y, z) => {
    const w = profile(WIDTH, y) * scale, f = profile(FRONT, y), b = profile(BACK, y)
    const d = z >= 0 ? f : b
    const roll = y < .66 ? (1 - (y - SEATED_BODY.seatY) / .04) * .25 : 0
    return (Math.abs(x) / w) ** 2.6 + (Math.abs(z) / d) ** 2.6 < 1 - Math.max(0, roll) && y < shoulderTop(x / scale)
  }, p.jacket)
  // Deltoid caps sit over the arm rig's shoulder joint. The sleeve begins
  // inside this cap, so raising an arm never exposes a hole at the armpit. The
  // cap's top stays at the trapezius line (~1.237 at the acromion): a first
  // pass centred at 1.205 rose 3cm above it and read as padded shoulders.
  for (const side of [-1, 1]) body.ellipsoid([side * .186 * scale, 1.187, .018], [.058, .05, .068], p.jacket)
  // Shirt shows only inside the jacket's V: from the collar (±.046 at 1.27)
  // down to the button point (0 at .975). Painting keeps the jacket silhouette;
  // the former separate bar ran to the belly and read as a light strip.
  const vHalf = (y: number) => .046 * THREE.MathUtils.clamp((y - .975) / .295, 0, 1)
  body.paint((x, y, z) => z > .04 && y > .975 && Math.abs(x) < vHalf(y), p.shirt)
  if (p.tie) body.paint((x, y, z) => z > .04 && y > .99 && y < 1.265 && Math.abs(x) < .011 + (1.265 - y) * .02 && Math.abs(x) < vHalf(y) - .004, p.tie)
  // Lapels: a band just outside the V, stood slightly proud of the chest. The
  // notch at 1.17 is the one tailoring landmark that makes a jacket read as a
  // jacket at a distance.
  const lapel = new THREE.Color(p.jacket).multiplyScalar(.78).getStyle()
  for (const side of [-1, 1]) body.volume([side < 0 ? -.11 : 0, .97, .06], [side < 0 ? 0 : .11, 1.27, .14], (x, y, z) => {
    const edge = vHalf(y), width = y > 1.17 ? .028 : .038, inner = Math.abs(x) - edge
    // Follow the rounded chest surface at this x, not its centreline depth;
    // otherwise the outer lapel edge floats ahead of the jacket.
    const w = profile(WIDTH, y) * scale, front = profile(FRONT, y) * Math.max(0, 1 - (Math.abs(x) / w) ** 2.6) ** (1 / 2.6)
    return Math.sign(x) === side && inner > 0 && inner < width - (y > 1.155 && y < 1.175 ? .014 : 0) && z < front + .006 && z > front - .012
  }, lapel)
  // Flap pockets and hem: darker strips that break the large front plane.
  for (const side of [-1, 1]) body.paint((x, y, z) => z > .05 && Math.abs(y - .80) < .007 && Math.abs(Math.abs(x) - .095) < .038 && Math.sign(x) === side, lapel)
  body.paint((_x, y) => y < .635, lapel)

  // Seated legs: hip→knee almost horizontal, knee→ankle almost vertical.
  const point = new THREE.Vector3()
  for (const side of [-1, 1]) {
    const hip = new THREE.Vector3(side * SEATED_BODY.hip[0] * scale, SEATED_BODY.hip[1], SEATED_BODY.hip[2])
    const knee = new THREE.Vector3(side * SEATED_BODY.knee[0] * scale, SEATED_BODY.knee[1], SEATED_BODY.knee[2])
    const ankle = new THREE.Vector3(side * SEATED_BODY.ankle[0] * scale, SEATED_BODY.ankle[1], SEATED_BODY.ankle[2])
    const lo = [side < 0 ? -.2 : .01, .02, -.11], hi = [side < 0 ? -.01 : .2, .79, .41]
    body.volume(lo as [number, number, number], hi as [number, number, number], (x, y, z) => {
      point.set(x, y, z)
      // Seated thighs flatten against the seat: squash the cross-section below
      // the bone line so the underside meets y=.62 instead of sinking into it.
      const [, tt] = segment(point, hip, knee), axisY = THREE.MathUtils.lerp(hip.y, knee.y, tt)
      point.y = y < axisY ? axisY + (y - axisY) * 1.5 : y
      const [thigh, t] = segment(point, hip, knee)
      point.y = y
      if (thigh < THREE.MathUtils.lerp(.077, .058, t) * scale) return true
      const [shin, s] = segment(point, knee, ankle)
      // Calf swell sits high on the back of the shin.
      const calf = .047 + .01 * Math.sin(Math.min(1, s / .55) * Math.PI) * (z < knee.z ? 1 : .4)
      return shin < calf * scale
    }, trousers)
    // Shoes: heel under the lifted ankle, toe box resting on the floor, sole
    // flat at y>=.004 so the toe reads as planted rather than hovering.
    const heel = new THREE.Vector3(side * .106 * scale, .105, .385), toe = new THREE.Vector3(side * .108 * scale, .04, .53)
    body.volume([side < 0 ? -.17 : .04, 0, .33], [side < 0 ? -.04 : .17, .16, .58], (x, y, z) => {
      const [d, u] = segment(point.set(x, y, z), heel, toe)
      return d < THREE.MathUtils.lerp(.05, .04, u) && y >= .004
    }, '#17120f')
  }
  return body
}
