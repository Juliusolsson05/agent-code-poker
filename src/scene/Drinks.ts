import * as THREE from 'three'

export type DrinkKind = 'old-fashioned' | 'beer' | 'wine' | 'water'

/** All geometry is authored locally. Glass uses a thin double-sided wall, not a
 * solid transparent cylinder: the latter makes ice look embedded in plastic.
 * The drink origin is its contact with the coaster; grip/rim anchors eliminate
 * guessed offsets when transferring it between table and hand. */
export class TableDrink {
  readonly root = new THREE.Group()
  readonly grip = new THREE.Vector3()
  readonly rim = new THREE.Vector3()
  constructor(readonly kind: DrinkKind = 'old-fashioned') {
    this.root.name = `${kind}-drink`
    const glass = new THREE.MeshPhysicalMaterial({ color: '#d4d9d1', roughness: .13, metalness: 0,
      transparent: true, opacity: .25, depthWrite: false, side: THREE.DoubleSide, clearcoat: 1 })
    const radius = kind === 'beer' ? .030 : kind === 'wine' ? .037 : .039
    const height = kind === 'beer' ? .155 : kind === 'wine' ? .095 : .087
    const stem = kind === 'wine' ? .065 : 0
    const wall = new THREE.Mesh(new THREE.CylinderGeometry(radius, kind === 'wine' ? .014 : radius * .91, height, 40, 1, true), glass)
    wall.position.y = stem + height / 2 + .004; this.root.add(wall)
    const base = new THREE.Mesh(new THREE.CylinderGeometry(radius * .92, radius * .92, .007, 40), glass)
    base.position.y = .0035; this.root.add(base)
    if (stem) {
      const stalk = new THREE.Mesh(new THREE.CylinderGeometry(.003, .003, stem, 12), glass); stalk.position.y = stem / 2; this.root.add(stalk)
    }
    const rimMaterial = new THREE.MeshStandardMaterial({ color: '#c3c7bb', metalness: .1, roughness: .2, transparent: true, opacity: .60 })
    const rim = new THREE.Mesh(new THREE.TorusGeometry(radius, .0012, 5, 48), rimMaterial)
    rim.rotation.x = Math.PI / 2; rim.position.y = stem + height + .004; this.root.add(rim)
    const liquidHeight = height * (kind === 'beer' ? .82 : .50)
    const liquid = new THREE.Mesh(new THREE.CylinderGeometry(radius * .86, radius * .82, liquidHeight, 36), new THREE.MeshPhysicalMaterial({
      color: kind === 'old-fashioned' ? '#b26016' : kind === 'beer' ? '#b98a25' : kind === 'wine' ? '#551b23' : '#a1b8b7',
      roughness: .18, transparent: true, opacity: kind === 'water' ? .35 : .87, depthWrite: false, clearcoat: 1,
    }))
    liquid.position.y = stem + .008 + liquidHeight / 2; this.root.add(liquid)
    if (kind === 'old-fashioned' || kind === 'water') {
      const ice = new THREE.Mesh(new THREE.BoxGeometry(.041, .041, .041), new THREE.MeshPhysicalMaterial({ color: '#cfdbd5', roughness: .18, transparent: true, opacity: .57, depthWrite: false, clearcoat: 1 }))
      ice.position.set(.002, .050, -.002); ice.rotation.set(.10, .30, -.08); this.root.add(ice)
    }
    if (kind === 'old-fashioned') {
      // A thin curled ribbon has an orange outside and pale pith inside. A
      // whole orange torus floating above the rim read as a toy garnish.
      const peel = new THREE.Mesh(new THREE.CylinderGeometry(.022, .022, .012, 18, 1, true, -.6, 2.7), new THREE.MeshStandardMaterial({ color: '#dc781d', roughness: .72, side: THREE.DoubleSide }))
      peel.position.set(-.006, .063, .007); peel.rotation.set(.28, .2, .30); this.root.add(peel)
      const pith = new THREE.Mesh(new THREE.CylinderGeometry(.0208, .0208, .010, 18, 1, true, -.6, 2.7), new THREE.MeshStandardMaterial({ color: '#d8bc75', roughness: .88, side: THREE.DoubleSide }))
      pith.position.copy(peel.position); pith.rotation.copy(peel.rotation); this.root.add(pith)
    }
    if (kind === 'beer') {
      const foam = new THREE.Mesh(new THREE.CylinderGeometry(radius * .88, radius * .88, .011, 32), new THREE.MeshStandardMaterial({ color: '#dbd0ae', roughness: 1 }))
      foam.position.y = liquidHeight + .010; this.root.add(foam)
    }
    this.grip.set(0, stem + height * .45, 0); this.rim.set(0, stem + height + .004, radius)
    this.root.traverse(o => { if (o instanceof THREE.Mesh) o.castShadow = false })
  }
}

export function coaster(): THREE.Mesh {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(.053, .053, .003, 40), new THREE.MeshStandardMaterial({ color: '#4c3527', roughness: .95 }))
  mesh.receiveShadow = true; return mesh
}
