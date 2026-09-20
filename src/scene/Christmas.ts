import * as THREE from 'three'

/** Cozy interior / hostile winter exterior. Snow is confined to the window's
 * aperture in world space rather than overlaid over the whole image; it cannot
 * drift through players or the table. All decoration is self-authored geometry,
 * and every light is steady so the festive pass does not reintroduce flashing. */
export class ChristmasTavern {
  readonly root = new THREE.Group()
  readonly treeBounds = new THREE.Box3()
  private snow: THREE.Points
  private snowSeeds: { x: number; y: number; speed: number; drift: number }[] = []
  private snowTexture: THREE.CanvasTexture
  private snowFrame = -1
  constructor() {
    this.root.name = 'christmas-tavern'
    const green = new THREE.MeshStandardMaterial({ color: '#163a2d', roughness: .98 })
    const warm = new THREE.MeshStandardMaterial({ color: '#ffdf9b', emissive: '#ffc678', emissiveIntensity: 4.5, roughness: .5 })
    const gold = new THREE.MeshStandardMaterial({ color: '#c79949', metalness: .65, roughness: .34 })
    const red = new THREE.MeshStandardMaterial({ color: '#822d30', metalness: .12, roughness: .36 })
    const tree = new THREE.Group(); tree.position.set(3.16, 0, -3.45); this.root.add(tree)
    const stand = new THREE.Mesh(new THREE.CylinderGeometry(.24, .31, .22, 12), new THREE.MeshStandardMaterial({ color: '#49352a', roughness: .9 }))
    stand.position.y = .11; tree.add(stand)
    // Layered boughs carry varied silhouettes instead of one perfect toy cone.
    // Small foliage clusters break the edges, while one instanced draw call
    // handles the needles without a per-branch material or runtime asset.
    const needles = new THREE.InstancedMesh(new THREE.BoxGeometry(), green, 1800), dummy = new THREE.Object3D()
    let count = 0
    for (let layer = 0; layer < 10; layer++) {
      const y = .32 + layer * .18, radius = .73 * (1 - layer / 11)
      const bough = new THREE.Mesh(new THREE.ConeGeometry(radius, .48, 14, 1), green)
      bough.position.y = y + .20; bough.rotation.y = layer * .73; tree.add(bough)
      for (let branch = 0; branch < 18; branch++) for (let twig = 0; twig < 8; twig++) {
        const a = branch / 18 * Math.PI * 2 + layer * .73, r = radius * (.30 + twig / 11)
        dummy.position.set(Math.cos(a) * r, y + .08 + (1 - r / radius) * .26, Math.sin(a) * r)
        dummy.rotation.set(.14, a, .16); dummy.scale.set(.095, .047, .095); dummy.updateMatrix(); needles.setMatrixAt(count++, dummy.matrix)
      }
    }
    needles.count = count; tree.add(needles)
    const bulbGeometry = new THREE.SphereGeometry(.012, 8, 6), ornamentGeometry = new THREE.SphereGeometry(.041, 14, 10)
    for (let i = 0; i < 100; i++) {
      const y = .38 + i / 100 * 1.80, a = i * .71, radius = .69 * (1 - (y - .30) / 2.25)
      const bulb = new THREE.Mesh(bulbGeometry, warm); bulb.position.set(Math.cos(a) * radius, y, Math.sin(a) * radius); tree.add(bulb)
      if (i % 4 === 0) {
        const ball = new THREE.Mesh(ornamentGeometry, i % 8 === 0 ? red : gold)
        ball.position.set(Math.cos(a + .24) * (radius + .015), y - .05, Math.sin(a + .24) * (radius + .015)); tree.add(ball)
      }
    }
    const star = new THREE.Shape()
    for (let i = 0; i < 10; i++) {
      const a = Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? .068 : .15
      if (i === 0) star.moveTo(Math.cos(a) * r, Math.sin(a) * r); else star.lineTo(Math.cos(a) * r, Math.sin(a) * r)
    }
    star.closePath()
    const topper = new THREE.Mesh(new THREE.ExtrudeGeometry(star, { depth: .025, bevelEnabled: false }), gold)
    topper.position.y = 2.30; tree.add(topper)
    const glow = new THREE.PointLight('#ffc17b', 4, 4, 2); glow.position.set(2.8, 1.4, -2.9); this.root.add(glow)
    for (const [x, z, width, height, color] of [[-.33, .37, .34, .22, '#713035'], [.17, .36, .28, .34, '#b49a62'], [.40, .17, .24, .17, '#314b3d']] as const) {
      const gift = new THREE.Mesh(new THREE.BoxGeometry(width, height, width * .8), new THREE.MeshStandardMaterial({ color, roughness: .8 }))
      gift.position.set(x, height / 2, z); tree.add(gift)
      const ribbon = new THREE.Mesh(new THREE.BoxGeometry(width + .002, height + .004, .033), gold); ribbon.position.copy(gift.position); tree.add(ribbon)
    }
    // A draped evergreen garland frames the bar, keeping decoration away from
    // faces, board cards and nameplates. Warm bulbs are steady, not blinking.
    const sprigGeometry = new THREE.BoxGeometry(.12, .085, .09)
    for (let i = 0; i < 90; i++) {
      const x = -2.35 + i / 89 * 4.7, y = 2.88 - Math.abs(Math.sin(i / 89 * Math.PI * 3)) * .18
      const sprig = new THREE.Mesh(sprigGeometry, green)
      sprig.position.set(x, y, -4.79); sprig.rotation.z = Math.sin(i * 1.7) * .4; this.root.add(sprig)
      if (i % 3 === 0) { const bulb = new THREE.Mesh(bulbGeometry, warm); bulb.position.set(x, y - .035, -4.73); this.root.add(bulb) }
      if (i % 15 === 0) { const ball = new THREE.Mesh(ornamentGeometry, red); ball.position.set(x, y - .09, -4.74); this.root.add(ball) }
    }
    const wreath = new THREE.Mesh(new THREE.TorusGeometry(.25, .065, 8, 28), green)
    wreath.position.set(0, 3.0, -5.06); this.root.add(wreath)
    const bow = new THREE.Mesh(new THREE.BoxGeometry(.16, .065, .06), red); bow.position.set(0, 2.74, -4.99); this.root.add(bow)
    const canvas = document.createElement('canvas'); canvas.width = canvas.height = 32
    const g = canvas.getContext('2d')!, gradient = g.createRadialGradient(16, 16, 0, 16, 16, 16)
    gradient.addColorStop(0, '#ffffff'); gradient.addColorStop(.5, '#ffffffbb'); gradient.addColorStop(1, '#ffffff00')
    g.fillStyle = gradient; g.fillRect(0, 0, 32, 32); this.snowTexture = new THREE.CanvasTexture(canvas)
    // At the seated camera this aperture is only a few hundred pixels wide.
    // Dense bright particles became television static, not a distant storm.
    // Let snow accumulation and cool light carry winter; motion stays sparse.
    const positions = new Float32Array(84 * 3)
    for (let i = 0; i < 84; i++) {
      const frac = (v: number) => v - Math.floor(v)
      this.snowSeeds.push({ x: frac(Math.sin(i * 12.9) * 43758), y: frac(Math.sin(i * 37.1 + 2) * 23421), speed: .045 + frac(Math.sin(i * 8.7) * 29341) * .07, drift: .028 + i % 7 * .008 })
    }
    const geometry = new THREE.BufferGeometry(); geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    this.snow = new THREE.Points(geometry, new THREE.PointsMaterial({ color: '#aabccb', size: .010, map: this.snowTexture, transparent: true, opacity: .40, depthWrite: false }))
    this.snow.frustumCulled = false; this.root.add(this.snow)
    // Hundreds of decorative bulbs must not mean hundreds of draw calls. Bake
    // static transforms into instances after authoring the tree/garland groups.
    this.root.updateMatrixWorld(true)
    // Preserve the authored tree envelope before static batching moves bulbs
    // out of the group. Diagnostics must measure the actual production tree,
    // not a guessed cone or a group missing its batched ornaments.
    this.treeBounds.setFromObject(tree)
    const batches = new Map<string, THREE.Mesh[]>()
    this.root.traverse(o => {
      if (!(o instanceof THREE.Mesh) || o instanceof THREE.InstancedMesh || Array.isArray(o.material)) return
      const key = o.geometry.uuid + o.material.uuid, batch = batches.get(key) ?? []
      batch.push(o); batches.set(key, batch)
    })
    for (const batch of batches.values()) if (batch.length >= 4) {
      const mesh = new THREE.InstancedMesh(batch[0].geometry, batch[0].material, batch.length)
      batch.forEach((o, i) => { mesh.setMatrixAt(i, o.matrixWorld); o.removeFromParent() })
      mesh.computeBoundingSphere(); this.root.add(mesh)
    }
    this.frame(0, false)
  }
  frame(time: number, reduced: boolean): void {
    const tick = reduced ? 0 : Math.floor(time * 24)
    if (tick === this.snowFrame) return
    this.snowFrame = tick
    const t = reduced ? 0 : time, positions = this.snow.geometry.getAttribute('position') as THREE.BufferAttribute
    this.snowSeeds.forEach((seed, i) => {
      const x = ((seed.x + t * seed.drift + Math.sin(t * .7) * .09) % 1 + 1) % 1
      const y = ((seed.y - t * seed.speed) % 1 + 1) % 1
      positions.setXYZ(i, -4.145 + x * 1.20, 1.04 + y * 1.90, -5.017)
    })
    positions.needsUpdate = true
  }
  dispose(): void { this.snowTexture.dispose() }
}
