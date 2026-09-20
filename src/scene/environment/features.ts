/** Product room features cannot depend on the bundler's DEV bit: standalone
 * LAN and the installed view are production builds too. That gate silently
 * resurrected the pre-fireplace shelf layout and omitted its audio. Diagnostics
 * remain DEV-only; this shared product profile owns both geometry and ambience.
 * Enabling the same room everywhere is not a performance/visual sign-off. */
export const TAVERN_FEATURES=Object.freeze({fireplace:true})
