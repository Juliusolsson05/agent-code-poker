import * as THREE from 'three'
import type { SceneState } from '../presentation/RoomProjection'
import { ChipLedger } from './ChipLedger'
import { TABLE } from './Table'

type Token = { key: string; denomination: number; group: string; start: THREE.Vector3; target: THREE.Vector3; current: THREE.Vector3; born: number; delay: number }
const DENOMINATIONS = [500, 100, 25, 5, 1]
const COLORS = ['#373138', '#3b536f', '#456d55', '#883f35', '#b7ad97']

/** A projection of the actual chip ledger, not randomly sized decorations.
 * Bankrolls, live street bets and previously collected pot chips are disjoint.
 * Stable token identities survive state updates; a bet travels from a stack,
 * a street collects bets, and settlement travels back to the winners. */
export class ChipField {
  readonly root = new THREE.Group()
  private tokens = new Map<string, Token>()
  private meshes = new Map<number, THREE.InstancedMesh>()
  private textures: THREE.CanvasTexture[] = []
  private ledger = new ChipLedger()
  private geometry = new THREE.CylinderGeometry(.026, .026, .0055, 32)
  private dummy = new THREE.Object3D()

  constructor(private seats: [number, number][], maxAnisotropy = 1) {
    DENOMINATIONS.forEach((denomination, i) => {
      // Inspection magnifies this printed face, while the seated camera sees
      // it at a grazing angle. More ink texels address the first problem;
      // anisotropic mip sampling addresses the second without inflating the
      // entire HDR framebuffer. Keep only five shared faces, not one per chip.
      const top = document.createElement('canvas'); top.width = top.height = 256; const g = top.getContext('2d')!
      g.scale(2, 2)
      g.fillStyle = COLORS[i]; g.fillRect(0, 0, 128, 128)
      for (let stripe = 0; stripe < 8; stripe++) {
        const a = stripe * Math.PI / 4
        g.save(); g.translate(64, 64); g.rotate(a); g.fillStyle = '#d4c7aa'; g.fillRect(-6, -64, 12, 17); g.restore()
      }
      g.beginPath(); g.arc(64, 64, 39, 0, Math.PI * 2); g.fillStyle = '#bbae91'; g.fill()
      g.strokeStyle = COLORS[i]; g.lineWidth = 2; g.beginPath(); g.arc(64, 64, 34, 0, Math.PI * 2); g.stroke()
      g.fillStyle = '#292924'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = 'bold 28px Georgia'; g.fillText(String(denomination), 64, 65)
      const topTexture = new THREE.CanvasTexture(top); topTexture.colorSpace = THREE.SRGBColorSpace
      topTexture.anisotropy = Math.max(1, Math.min(8, maxAnisotropy)); this.textures.push(topTexture)
      const edge = document.createElement('canvas'); edge.width = 128; edge.height = 8; const e = edge.getContext('2d')!
      e.fillStyle = COLORS[i]; e.fillRect(0, 0, 128, 8); e.fillStyle = '#d0c0a1'
      for (let j = 0; j < 8; j++) e.fillRect(j * 16 + 4, 1, 5, 6)
      const edgeTexture = new THREE.CanvasTexture(edge); edgeTexture.colorSpace = THREE.SRGBColorSpace; this.textures.push(edgeTexture)
      const side = new THREE.MeshStandardMaterial({ map: edgeTexture, roughness: .7, color: '#bdbdbd' })
      const cap = new THREE.MeshStandardMaterial({ map: topTexture, roughness: .75, color: '#bdbdbd' })
      const mesh = new THREE.InstancedMesh(this.geometry, [side, cap, cap], 512)
      mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage); mesh.count = 0; mesh.frustumCulled = false; mesh.castShadow = true; mesh.receiveShadow = true
      this.meshes.set(denomination, mesh); this.root.add(mesh)
    })
  }
  printDiagnostics(): { width: number; height: number; anisotropy: number }[] {
    return this.textures.map(texture => ({ width: texture.image.width, height: texture.image.height, anisotropy: texture.anisotropy }))
  }
  private anchor(group: string): THREE.Vector3 {
    const y = TABLE.feltY + .0055 / 2
    if (group === 'pot') return new THREE.Vector3(0, y, -.36)
    const [kind, seatText] = group.split(':'), seat = Number(seatText), [x, z] = this.seats[seat]
    if (kind === 'bet') return new THREE.Vector3(x * .46, y, z * .28)
    return seat === 0 ? new THREE.Vector3(.52, y, .70) : new THREE.Vector3(x * .72 + .10, y, z * .61)
  }
  update(state: SceneState, now = performance.now() / 1000): void {
    const next = new Map<string, Token>(), indices = new Map<string, number>()
    const inventory = this.ledger.sync(state).sort((a, b) => a.id - b.id)
    for (const chip of inventory) {
      const key = String(chip.id), group = chip.account, column = DENOMINATIONS.indexOf(chip.value), pileKey = `${group}:${chip.value}`
      const index = indices.get(pileKey) ?? 0; indices.set(pileKey, index + 1)
      const target = this.anchor(group)
      // Fixed denomination lanes prevent a disappearing pile from shifting all
      // its neighbors sideways. Heights touch exactly: felt + half chip + stack.
      target.x += (column - 2) * .060
      target.z += Math.floor(index / 12) * .060 * (target.z > 0 ? -1 : 1)
      target.y += index % 12 * .0055
      const before = this.tokens.get(key)
      if (before && before.group === group && before.target.distanceToSquared(target) < .00000001) { next.set(key, before); continue }
      const ancestor = chip.origin === undefined ? undefined : this.tokens.get(String(chip.origin))
      const start = before?.current.clone() ?? ancestor?.current.clone() ?? target.clone()
      next.set(key, { key, denomination: chip.value, group, target, start, current: start.clone(), born: now,
        delay: before && before.group !== group ? Math.min(.22, index * .015) : 0 })
    }
    this.tokens = next
  }
  frame(now: number, reduced: boolean): void {
    const counts = new Map(DENOMINATIONS.map(n => [n, 0]))
    for (const token of this.tokens.values()) {
      const t = reduced ? 1 : THREE.MathUtils.clamp((now - token.born - token.delay) / .75, 0, 1), smooth = 1 - (1 - t) ** 3
      token.current.lerpVectors(token.start, token.target, smooth)
      // These are constrained felt slides, not ballistic hops. Pitching each
      // chip independently made stacks intersect the felt and one another.
      // Friction-like deceleration plus vertical settling preserves contact.
      this.dummy.position.copy(token.current); this.dummy.rotation.set(0, Number(token.key) * 1.3, 0); this.dummy.scale.setScalar(1); this.dummy.updateMatrix()
      const index = counts.get(token.denomination)!
      if (index < 512) this.meshes.get(token.denomination)!.setMatrixAt(index, this.dummy.matrix)
      counts.set(token.denomination, index + 1)
    }
    for (const [denomination, mesh] of this.meshes) { mesh.count = Math.min(512, counts.get(denomination)!); mesh.instanceMatrix.needsUpdate = true }
  }
  dispose(): void { this.textures.forEach(t => t.dispose()) }
}
