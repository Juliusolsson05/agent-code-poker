import { Group, HemisphereLight, PointLight, RectAreaLight, SpotLight } from 'three'

export const TAVERN_EXPOSURE = 1.08

/** Warm practicals, quiet winter fill. A strong blue hemisphere and large
 * frontal area light made the room uniformly lit and flattened the faces.
 * Lower the undirected fill, keep the soft table key, and let amber back-bar
 * bounce separate the silhouettes. This is one authored lighting rig rather
 * than unrelated exposure/color tweaks spread across room construction.
 *
 * Only the table key shadows. Christmas bulbs are emissive instances plus one
 * bounded aggregate bounce, not dozens of point lights/shadow render passes.
 * Tone mapping remains global: cards stay ordinary non-emissive paper. */
export function createTavernLighting(): Group {
  const root = new Group(); root.name = 'tavern-lighting'
  root.add(new HemisphereLight('#decab4', '#322218', .35))
  const key = new SpotLight('#ffdfba', 20, 12, .97, .82, 1.6)
  key.name = 'table-pendant-key'; key.position.set(-.65, 3.05, 1.2); key.target.position.set(0, .82, -.30)
  key.castShadow = true; key.shadow.mapSize.set(2048, 2048); key.shadow.bias = -.00008; key.shadow.normalBias = .013
  root.add(key, key.target)
  const fill = new RectAreaLight('#ffe0ba', 1.15, 4, 2)
  fill.name = 'soft-player-side-bounce'; fill.position.set(0, 2.15, 2.9); fill.lookAt(0, 1.15, -.4); root.add(fill)
  // The winter blue comes from the actual window, not a bright invisible light
  // halfway across the room. The warm bar bounce is motivated by shelf strips.
  for (const [name, color, power, x, y, z, range] of [
    ['window-fill', '#91a5c3', 2.4, -3.55, 2.05, -4.65, 4.5],
    ['back-bar-bounce', '#ffba78', 11, .3, 2.15, -3.4, 7],
  ] as const) {
    const light = new PointLight(color, power, range, 1.5); light.name = name
    light.position.set(x, y, z); root.add(light)
  }
  return root
}
