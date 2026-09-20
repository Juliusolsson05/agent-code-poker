import * as THREE from 'three'
import { VoxelSculpt, anatomyMaterial } from '../Voxel'
import { ASHTRAY, CIGAR } from './specs'

export function createCigar(): { root: THREE.Group; tip: THREE.Object3D; ember: THREE.MeshStandardMaterial } {
  const root = new THREE.Group(); root.name = 'player-cigar'
  const wrapper = new VoxelSculpt(.0012).volume([CIGAR.minX, -CIGAR.radius, -CIGAR.radius], [CIGAR.maxX, CIGAR.radius, CIGAR.radius],
    (_x, y, z) => y * y + z * z < CIGAR.radius ** 2, '#593b29')
    .paint((x) => x > -.035 && x < -.020, '#b49a58')
    .paint((x) => x > .062, '#797468')
  root.add(wrapper.mesh(anatomyMaterial(.92)))
  const ember = anatomyMaterial(1); ember.emissive.set('#d73910'); ember.emissiveIntensity = .3
  root.add(new VoxelSculpt(.0012).volume([.075, -.0058, -.0058], [.076, .0058, .0058], (_x, y, z) => y * y + z * z < .0058 ** 2, '#762c19').mesh(ember))
  const tip = new THREE.Object3D(); tip.position.set(...CIGAR.tip); root.add(tip)
  return { root, tip, ember }
}

/** The origin is the felt contact plane. A recessed well and two opposed
 * lowered slots support the cigar above collected ash. The old filled cylinder
 * was neither a bowl nor a rest. Cavity and slots belong to one sampled solid. */
export function createAshtray(): THREE.Group {
  const root = new THREE.Group(); root.name = 'block-ashtray'
  const s = ASHTRAY
  const tray = new VoxelSculpt(.002).volume([-s.radius, .001, -s.radius], [s.radius, s.height - .001, s.radius], (x, y, z) => {
    const r = Math.hypot(x, z)
    if (r > s.radius || y > s.floor && r < s.wellRadius) return false
    return !(Math.abs(x) > s.wellRadius && Math.abs(z) < .008 && y > s.notchFloor)
  }, '#797063')
  const material = anatomyMaterial(.46); material.metalness = .48
  const bowl = tray.mesh(material); bowl.name = 'recessed-tray'; root.add(bowl)
  const ash = new VoxelSculpt(.002)
  for (const [x, z] of [[-.015, .004], [.010, -.015], [.006, .017], [-.020, -.012]])
    ash.volume([x - .003, .008, z - .003], [x + .003, .009, z + .003], () => true, '#625b50')
  const dust = ash.mesh(anatomyMaterial(1)); dust.name = 'settled-ash'; root.add(dust)
  return root
}
