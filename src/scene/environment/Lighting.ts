import { Group, HemisphereLight, PointLight, RectAreaLight, SpotLight } from 'three'

export const TAVERN_EXPOSURE = 1.1

/** Warm practicals, quiet winter fill. A strong blue hemisphere and large
 * frontal area light made the room uniformly lit and flattened the faces.
 * Lower the undirected fill, keep the soft table key, and let amber back-bar
 * bounce separate the silhouettes. This is one authored lighting rig rather
 * than unrelated exposure/color tweaks spread across room construction.
 *
 * Second pass (#8, "boring and soulless"): the first rig still gave faces,
 * felt and walls one shared brightness. Card rooms read as a pool of warm
 * light over the felt with the room falling away into firelight and candles,
 * so: the hemisphere fill drops to about half, the frontal area fill halves,
 * the key narrows into a defined pool, the window turns cooler for blue/amber
 * contrast, and a low felt bounce lifts faces from below the way a lit table
 * does in life. The practicals in SurroundDecor/Fireplace carry the rest.
 *
 * Only the table key shadows. Christmas bulbs are emissive instances plus one
 * bounded aggregate bounce, not dozens of point lights/shadow render passes.
 * Tone mapping remains global: cards stay ordinary non-emissive paper. */
export function createTavernLighting(): Group {
  const root = new Group(); root.name = 'tavern-lighting'
  root.add(new HemisphereLight('#d8c2a6', '#1a110b', .19))
  // Steeper key: from behind the player's shoulder (-.65, 3.05, 1.2) it lit
  // every opponent face-on, which is exactly what made them flat. From over
  // the table's near edge, brows and cheekbones shade downward like under a
  // real pendant, while the player-side area fill keeps eyes readable.
  const key = new SpotLight('#ffd29e', 27, 12, .9, .62, 1.6)
  key.name = 'table-pendant-key'; key.position.set(-.35, 3.1, .55); key.target.position.set(0, .82, -.35)
  key.castShadow = true; key.shadow.mapSize.set(2048, 2048); key.shadow.bias = -.00008; key.shadow.normalBias = .013
  root.add(key, key.target)
  const fill = new RectAreaLight('#ffe0ba', .55, 4, 2)
  fill.name = 'soft-player-side-bounce'; fill.position.set(0, 2.15, 2.9); fill.lookAt(0, 1.15, -.4); root.add(fill)
  // The winter blue comes from the actual window, not a bright invisible light
  // halfway across the room. The warm bar bounce is motivated by shelf strips.
  // The felt bounce sits just above the cloth: dim, short-ranged and tinted by
  // the green felt, so it lifts chins and hands without reading as a lamp.
  for (const [name, color, power, x, y, z, range] of [
    ['window-fill', '#7f9cd0', 3.4, -3.55, 2.05, -4.65, 4.8],
    ['back-bar-bounce', '#ffb070', 11, .3, 2.15, -3.4, 7],
    ['felt-bounce', '#cfd6a0', .75, 0, .98, -.15, 2.3],
  ] as const) {
    const light = new PointLight(color, power, range, 1.5); light.name = name
    light.position.set(x, y, z); root.add(light)
  }
  return root
}
