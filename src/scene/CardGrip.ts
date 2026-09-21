import * as THREE from 'three'
import type { Card } from '../engine/cards'

/** Shared by player, opponents and the close-up inspector. This transform is a
 * contact contract with the cards pose, not an independent decorative offset.
 * Paper sits between the supporting index and opposing thumb; curled fingers
 * stay below its lower edge. Mirroring a left hand must not mirror card print. */
export function createHeldCardFan(texture: (card: Card | null) => THREE.CanvasTexture): { fan: THREE.Group; paper: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>[] } {
  const fan = new THREE.Group(), paper: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>[] = []
  fan.name = 'held-card-fan'; fan.position.set(.002, .124, .0185); fan.rotation.x = .12; fan.scale.x = -1
  for (let i = 0; i < 2; i++) {
    const card = new THREE.Mesh(new THREE.PlaneGeometry(.070, .101), new THREE.MeshBasicMaterial({ map: texture(null), color: '#bcb6aa', side: THREE.DoubleSide }))
    card.position.set((i - .5) * .035, 0, i * .001); card.rotation.z = (i - .5) * -.22
    fan.add(card); paper.push(card)
  }
  return { fan, paper }
}
