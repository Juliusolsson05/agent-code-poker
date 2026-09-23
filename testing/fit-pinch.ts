// Offline calibration aid for the treat pinch (#14), like audit-grip.ts. It
// searches thumb/index angles on the REAL deformed hand skin for a pad-to-pad
// pinch around a sphere; the result is copied into Hand.ts/HandGrips.ts and
// then guarded by tests/grip-surfaces, not by this sampled search.
import { SkinnedMesh, Triangle, Vector3 } from 'three'
import { AnatomicalHand } from '../src/scene/Hand'

export function pinchClearance(hand: AnatomicalHand, centre: Vector3, radius: number): number[] {
  hand.updateSkin()
  const skin = hand.root.getObjectByName('articulated-hand-surface') as SkinnedMesh
  const index = skin.geometry.index!, bones = skin.geometry.getAttribute('skinIndex')
  const minima = Array(6).fill(Infinity), t = new Triangle(), q = new Vector3()
  for (let i = 0; i < index.count; i += 3) {
    skin.getVertexPosition(index.getX(i), t.a); skin.getVertexPosition(index.getX(i + 1), t.b); skin.getVertexPosition(index.getX(i + 2), t.c)
    const bone = bones.getX(index.getX(i)), group = bone === 0 ? 0 : bone >= 13 ? 5 : 1 + Math.floor((bone - 1) / 3)
    minima[group] = Math.min(minima[group], t.closestPointToPoint(centre, q).distanceTo(centre) - radius)
  }
  return minima
}

if (process.argv[1]?.endsWith('fit-pinch.ts')) {
  const radius = Number(process.argv[2] ?? .0092)
  const hand = new AnatomicalHand('right', '#ae8165', .0025)
  let best: any = null
  const rnd = (a: number, b: number) => a + Math.random() * (b - a)
  for (let n = 0; n < 4000; n++) {
    const idx = [rnd(.2, 1.0), rnd(.2, 1.0), rnd(.0, .8)], thumb: [number, number, number] = [rnd(-1.2, .3), rnd(.2, 1.6), rnd(-.2, .9)], splay = rnd(-1.2, .4)
    hand.fingers[0].forEach((b, j) => { b.rotation.x = idx[j]; b.rotation.z = j ? 0 : -.02 })
    // others curled out of the way, like the cigar pose's ring/little fingers
    const others = [[.9, 1.0, .6], [1.0, 1.05, .6], [1.05, 1.05, .6]]
    for (let f = 1; f < 4; f++) hand.fingers[f].forEach((b, j) => { b.rotation.x = others[f - 1][j]; b.rotation.z = j ? 0 : [.01, .045, .09][f - 1] })
    hand.thumb[0].rotation.set(thumb[1], thumb[0], splay); hand.thumb[1].rotation.x = thumb[2]; hand.thumb[2].rotation.x = thumb[2] * .7
    hand.updateSkin()
    const a = hand.tips[0].getWorldPosition(new Vector3()), b = hand.thumb[2].localToWorld(new Vector3(0, .018, 0))
    const centre = a.clone().add(b).multiplyScalar(.5)
    const gaps = pinchClearance(hand, centre, radius)
    const minGap = Math.min(...gaps), score = (minGap < .0012 ? 10 + (.0012 - minGap) * 1000 : 0) + Math.max(0, gaps[1] - .0012) * 300 + Math.max(0, gaps[5] - .0012) * 300
    if (!best || score < best.score) best = { score, idx, thumb, splay, centre: centre.toArray(), gaps: gaps.map(g => +(g * 1000).toFixed(2)) }
  }
  console.log(JSON.stringify(best))
}
