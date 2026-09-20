import { SkinnedMesh, Vector3 } from 'three'
import { AnatomicalHand } from '../src/scene/Hand'
import { CIGAR, DRINKS } from '../src/scene/props/specs'

// Offline diagnostic of the ACTUAL production skin. Bone-anchor agreement is
// insufficient: two coincident anchors can still put all fingers in the drink.
const hand = new AnatomicalHand('right', '#ae8165', .0025)
const mesh = hand.root.getObjectByName('articulated-hand-surface') as SkinnedMesh
const positions = mesh.geometry.getAttribute('position'), indices = mesh.geometry.getAttribute('skinIndex')
const groups: number[][] = Array.from({ length: 6 }, () => [])
for (let i = 0; i < positions.count; i++) {
  const bone = indices.getX(i)
  groups[bone === 0 ? 0 : bone >= 13 ? 5 : 1 + Math.floor((bone - 1) / 3)].push(i)
}
function measure(cy: number, cz: number, radius = DRINKS['old-fashioned'].radius) {
  hand.updateSkin()
  return groups.map(vertices => {
    let min = Infinity, sum = 0, inside = 0
    for (const i of vertices) {
      const p = mesh.getVertexPosition(i, new Vector3())
      const d = Math.hypot(p.y - cy, p.z - cz) - radius
      min = Math.min(min, d)
      if (d < 0) { inside++; sum += d * d }
    }
    return { min, inside, sum }
  })
}
hand.pose('glass')
const oldCurls = [[.58, .65, .34], [.65, .72, .38], [.72, .75, .42], [.82, .80, .44]]
hand.fingers.forEach((digit, f) => digit.forEach((bone, j) => { bone.rotation.x = oldCurls[f][j] }))
hand.thumb[0].rotation.set(.45, -.90, -.75); hand.thumb[1].rotation.x = .35; hand.thumb[2].rotation.x = .245
console.log('original', measure(.079, .083))
for (const joints of hand.fingers) joints.forEach((b, i) => { b.rotation.x = [.25, .55, .6][i] })
console.log('proposed', measure(.073, .050))
console.log('tips', hand.tips.map(t => t.getWorldPosition(new Vector3()).toArray()))

// Deterministic offline calibration, never run in the render loop. The desired
// pads live on opposite sides of the vessel, rather than rewarding any nearby
// vertex (which can make a convincing collision statistic and a useless grip).
const cy = .073, cz = .050
for (let digit = 0; digit < 5; digit++) {
  const bones = digit < 4 ? hand.fingers[digit] : hand.thumb
  const vertices = groups[digit + 1], p = new Vector3()
  const targetY = digit < 4 ? cy + .040 : cy - .040
  const targetZ = digit < 4 ? cz + .006 : cz + .006
  const apply = (a: number[]) => {
    if (digit < 4) bones.forEach((b, j) => { b.rotation.x = a[j] })
    else {
      bones[0].rotation.set(a[0], a[1], a[2]); bones[1].rotation.x = a[3]; bones[2].rotation.x = a[3] * .7
    }
    hand.updateSkin()
  }
  const score = (a: number[]) => {
    apply(a)
    let error = 0, clearance = Infinity
    for (const i of vertices) {
      mesh.getVertexPosition(i, p)
      const d = Math.hypot(p.y - cy, p.z - cz) - .036
      clearance = Math.min(clearance, d)
    }
    const tip = digit < 4 ? hand.tips[digit].getWorldPosition(p) : bones[2].localToWorld(p.set(0, .022, 0))
    error += Math.min(0, clearance - .002) ** 2 * 10000
    return error + (tip.y - targetY) ** 2 + (tip.z - targetZ) ** 2 + (digit === 4 ? (tip.x - .005) ** 2 * .15 : 0)
  }
  let best = digit < 4 ? [.20, .40, .50] : [1.2, -.6, -.75, .5]
  let value = score(best)
  for (const step of [.3, .15, .08, .04, .02, .01, .005]) {
    for (let pass = 0; pass < 25; pass++) {
      let improved = false
      for (let j = 0; j < best.length; j++) for (const sign of [-1, 1]) {
        const next = [...best]; next[j] += sign * step
        if (digit < 4 && (next[j] < 0 || next[j] > 1.5)) continue
        if (digit === 4 && j === 3 && (next[j] < 0 || next[j] > 1.5)) continue
        const candidate = score(next)
        if (candidate < value) { best = next; value = candidate; improved = true }
      }
      if (!improved) break
    }
  }
  apply(best)
  console.log('fit', digit, best, value)
}
console.log('fitted', measure(cy, cz))
console.log('clearance-envelope', measure(cy, cz + .0015))
console.log('fitted tips', hand.tips.map(t => t.getWorldPosition(new Vector3()).toArray()), hand.thumb[2].localToWorld(new Vector3(0, .022, 0)).toArray())

hand.pose('cigar')
for (let digit = 0; digit < 2; digit++) {
  const bones = hand.fingers[digit], vertices = groups[digit + 1], p = new Vector3()
  const score = (angles: number[]) => {
    bones.forEach((bone, j) => { bone.rotation.x = angles[j] }); hand.updateSkin()
    let clearance = Infinity
    for (const i of vertices) {
      mesh.getVertexPosition(i, p)
      clearance = Math.min(clearance, Math.hypot(p.y - .120, p.z - .038) - .0062)
    }
    hand.tips[digit].getWorldPosition(p)
    return Math.min(0, clearance - .0015) ** 2 * 10000 + (p.y - .122) ** 2 + (p.z - (digit ? .051 : .025)) ** 2
  }
  let best = digit ? [.4, .6, .4] : [.2, .3, .3], value = score(best)
  for (const step of [.2, .10, .05, .02, .01, .005]) for (let pass = 0; pass < 30; pass++) {
    let improved = false
    for (let j = 0; j < 3; j++) for (const sign of [-1, 1]) {
      const next = [...best]; next[j] += sign * step
      if (next[j] < 0 || next[j] > 1.5) continue
      const candidate = score(next)
      if (candidate < value) { best = next; value = candidate; improved = true }
    }
    if (!improved) break
  }
  score(best); console.log('cigar-fit', digit, best, value)
}
console.log('cigar-clearance', measure(.120, .038, CIGAR.radius))
console.log('cigar tips', hand.tips.map(t => t.getWorldPosition(new Vector3()).toArray()))
