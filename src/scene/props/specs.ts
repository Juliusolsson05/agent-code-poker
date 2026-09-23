/** Metres in prop-local coordinates. Factories and grip calibration share this
 * source of truth; changing a rim cannot leave the mouth target fitted to the
 * old glass. Free cosmetic choices never enter the poker ledger or save.
 *
 * Every radius is .036 on purpose. The glass wrap in HandGrips.ts is fitted
 * offline against deformed production skin for ONE lower tumbler profile, and
 * tests/grip-surfaces asserts that every kind shares it. A new drink varies by
 * height, liquid, translucency and garnish (Drinks.ts), never by radius:
 * a wider or stemmed vessel needs its own fitted grip and clearance evidence.
 *
 * `alcoholic`/`strength` live here, not in the effect code, so adding a drink
 * cannot silently leave it out of (or in) the intoxication receipts. The first
 * three alcoholic drinks stay at strength 1: the recorded sip replay in
 * tests/sip-feedback pins their exact tint values. `strength` is a cosmetic
 * "standard sips per sip" weight for the effect's build-up, NOT alcohol content
 * or any real-world measure. `section` only groups the menu. `translucent` picks
 * the alpha liquid path (see Drinks.ts for why most liquids stay opaque). */
export type DrinkSection = 'bar' | 'warm' | 'soft'
export type DrinkSpec = { label: string; note: string; section: DrinkSection; radius: .036; height: number; fill: number; color: string;
  alcoholic: boolean; strength: number; translucent?: boolean }
export const DRINKS = {
  'old-fashioned': { label: 'Old Fashioned', note: 'Whiskey · orange peel · clear ice', section: 'bar', radius: .036, height: .088, fill: .041, color: '#a65518', alcoholic: true, strength: 1 },
  wine: { label: 'Red wine', note: 'A small pour in a stemless glass', section: 'bar', radius: .036, height: .100, fill: .043, color: '#632533', alcoholic: true, strength: 1 },
  'gin-tonic': { label: 'Gin & tonic', note: 'Tall and bright · lime · ice', section: 'bar', radius: .036, height: .124, fill: .094, color: '#cfe0d6', alcoholic: true, strength: .8, translucent: true },
  negroni: { label: 'Negroni', note: 'Bitter red · orange slice · one big cube', section: 'bar', radius: .036, height: .088, fill: .046, color: '#b0261b', alcoholic: true, strength: 1.2 },
  champagne: { label: 'Champagne', note: 'A tall flute-style pour · fine bubbles', section: 'bar', radius: .036, height: .136, fill: .112, color: '#e0c774', alcoholic: true, strength: .8 },
  beer: { label: 'Winter ale', note: 'Golden ale · a soft foam head', section: 'bar', radius: .036, height: .136, fill: .108, color: '#ae7928', alcoholic: true, strength: 1 },
  stout: { label: 'Stout', note: 'Near-black · a thick tan head', section: 'bar', radius: .036, height: .136, fill: .104, color: '#1c120d', alcoholic: true, strength: .8 },
  cider: { label: 'Cider', note: 'Crisp apple · a thin slice on top', section: 'bar', radius: .036, height: .124, fill: .096, color: '#d19a32', alcoholic: true, strength: .6 },
  'mulled-wine': { label: 'Mulled wine', note: 'Spiced red · orange wheel · cinnamon', section: 'warm', radius: .036, height: .100, fill: .068, color: '#5a1426', alcoholic: true, strength: .8 },
  glogg: { label: 'Glögg', note: 'Nordic spiced wine · raisins · almonds', section: 'warm', radius: .036, height: .100, fill: .066, color: '#3f0c1b', alcoholic: true, strength: .9 },
  'hot-toddy': { label: 'Hot toddy', note: 'Whisky · honey · lemon wheel · cinnamon', section: 'warm', radius: .036, height: .100, fill: .070, color: '#c07a24', alcoholic: true, strength: .9 },
  'irish-coffee': { label: 'Irish coffee', note: 'Hot coffee · whiskey · a cream collar', section: 'warm', radius: .036, height: .112, fill: .078, color: '#2a160c', alcoholic: true, strength: .9 },
  eggnog: { label: 'Eggnog', note: 'Creamy · a dusting of nutmeg', section: 'warm', radius: .036, height: .100, fill: .074, color: '#e8d9a8', alcoholic: true, strength: .7 },
  'hot-chocolate': { label: 'Hot chocolate', note: 'Dark cocoa · marshmallow cubes', section: 'warm', radius: .036, height: .100, fill: .074, color: '#4a2716', alcoholic: false, strength: 0 },
  water: { label: 'Water', note: 'Still water · clear ice', section: 'soft', radius: .036, height: .106, fill: .070, color: '#8daca8', alcoholic: false, strength: 0, translucent: true },
  'cranberry-spritz': { label: 'Cranberry spritz', note: 'Alcohol-free · cranberries · rosemary · ice', section: 'soft', radius: .036, height: .124, fill: .094, color: '#b3203d', alcoholic: false, strength: 0, translucent: true },
} as const satisfies Record<string, DrinkSpec>
/** Menu order and headings. Kept beside DRINKS so a new kind cannot be added
 * without a section (the DrinkSpec type requires one) or be left unlisted. */
export const DRINK_SECTIONS: { id: DrinkSection; title: string }[] = [
  { id: 'bar', title: 'Spirits, wine & beer' }, { id: 'warm', title: 'Warm' }, { id: 'soft', title: 'Soft' },
]
export type DrinkKind = keyof typeof DRINKS
export const isDrinkKind = (value: unknown): value is DrinkKind => typeof value === 'string' && Object.hasOwn(DRINKS, value)
export const drinkAnchors = (kind: DrinkKind) => ({
  // A shared lower tumbler profile makes one physical wrap reusable. Heights
  // differ, so the mouth pose must still be recalibrated for each order.
  grip: [DRINKS[kind].radius, .040, 0] as [number, number, number],
  rim: [0, DRINKS[kind].height, DRINKS[kind].radius] as [number, number, number],
})
/** Fictional, cosmetic tabletop items for a practice-chips game (#14). No
 * dose, strength or real-world detail is modelled or shown: `source` only
 * picks which visual effect profile a completed consume feeds. The poker
 * engine, bots, saves and LAN authority never import this.
 *
 * `slots` are piece centres in dish-local metres (dish origin on the felt).
 * The director picks slot[remaining - 1], so the reach target is the piece
 * that is actually drawn there, not a shared centre that would teleport a
 * piece the last centimetre into the fingers. Every piece mesh must fit the
 * pinch envelope sphere fitted in HandGrips.ts (checked in tests/props). */
export const TREATS = {
  mushrooms: { label: 'Mushrooms', note: 'A little dish of voxel caps · cosmetic only', source: 'mushroom',
    dish: .034, slots: [[-.012, .0125, .009], [.012, .0125, .007], [0, .0125, -.011]] },
  lsd: { label: 'LSD', note: 'A sugar cube on a saucer · cosmetic only', source: 'lsd',
    dish: .034, slots: [[0, .0096, 0]] },
} as const
export type TreatKind = keyof typeof TREATS
export const isTreatKind = (value: unknown): value is TreatKind => typeof value === 'string' && Object.hasOwn(TREATS, value)
export type OrderKind = DrinkKind | TreatKind

export const CIGAR = { radius: .0062, minX: -.063, maxX: .075, bite: [-.063, .003, 0] as [number, number, number], tip: [.077, 0, 0] as [number, number, number] } as const
export const ASHTRAY = { radius: .060, height: .026, wellRadius: .042, floor: .007, notchFloor: .020, cigarRestY: .0275 } as const

/** Authored gesture lengths in seconds: the ONE source for the hero's state
 * machine (Leisure), the opponents' copies (Human / CigarApproach) and the
 * host's spacing rule (HostTable.leisure). Why they must agree: a player can
 * start their next gesture the moment the previous one ends locally. If a
 * remote copy lasted longer than the local original, back-to-back gestures
 * would queue behind each other on every other screen and drift further per
 * gesture; if the host's spacing were longer than the local length, the host
 * would refuse a gesture the player can already see themselves doing.
 * smoke = cigar already in hand (the normal case); smokeFromTable is the
 * rarer fetch after an interrupted drink left the cigar on the tray.
 * consume (a treat) is LOCAL-ONLY and is listed here only so the hero's state
 * machine has one source; it is never broadcast or spaced by the host. */
export const GESTURE_SECONDS = { drink: 5.35, smoke: 3.6, smokeFromTable: 4.15, consume: 4.1 } as const
