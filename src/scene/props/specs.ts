/** Metres in prop-local coordinates. Factories and grip calibration share this
 * source of truth; changing a rim cannot leave the mouth target fitted to the
 * old glass. Free cosmetic choices never enter the poker ledger or save. */
export const DRINKS = {
  'old-fashioned': { label: 'Old Fashioned', note: 'Whiskey · orange peel · clear ice', radius: .036, height: .088, fill: .041, color: '#a65518' },
  beer: { label: 'Winter ale', note: 'Golden ale · a soft foam head', radius: .036, height: .136, fill: .108, color: '#ae7928' },
  wine: { label: 'Red wine', note: 'A small pour in a stemless glass', radius: .036, height: .100, fill: .043, color: '#632533' },
  water: { label: 'Water', note: 'Still water · clear ice', radius: .036, height: .106, fill: .070, color: '#8daca8' },
} as const
export type DrinkKind = keyof typeof DRINKS
export const isDrinkKind = (value: unknown): value is DrinkKind => typeof value === 'string' && Object.hasOwn(DRINKS, value)
export const drinkAnchors = (kind: DrinkKind) => ({
  // A shared lower tumbler profile makes one physical wrap reusable. Heights
  // differ, so the mouth pose must still be recalibrated for each order.
  grip: [DRINKS[kind].radius, .040, 0] as [number, number, number],
  rim: [0, DRINKS[kind].height, DRINKS[kind].radius] as [number, number, number],
})
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
 * rarer fetch after an interrupted drink left the cigar on the tray. */
export const GESTURE_SECONDS = { drink: 5.35, smoke: 3.6, smokeFromTable: 4.15 } as const
