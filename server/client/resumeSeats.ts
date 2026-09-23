import type { SeatKey } from './SeatRecovery'

/** The decision logic behind "Resume saved seat" after a host restart (#24),
 * kept out of client.js so it can be tested without a DOM.
 *
 * `attempt` tries one seat against the host. It resolves 'accepted', resolves
 * 'rejected' when the host answers 401/410 (that seat belongs to a table this
 * host no longer has), and THROWS for anything else: a timeout or a host that
 * is down proves nothing about the seat, so the loop stops with every
 * remaining seat intact. The caller must restore its own connection state
 * when this throws; the first review of #26 caught a timeout leaving the tab
 * holding a borrowed token it never chose. */
export async function resumeSeats(candidates: readonly SeatKey[], attempt: (key: SeatKey) => Promise<'accepted' | 'rejected'>,
  forget: (key: SeatKey) => void): Promise<SeatKey | null> {
  for (const key of candidates) {
    if (await attempt(key) === 'accepted') return key
    forget(key)
  }
  return null
}

/** Seats "Create" may resume when this host already holds a table. Only
 * seats saved under the name the player just typed count as their explicit
 * choice. Auto-claiming any valid seat could put a shared browser's operator
 * into another player's chair with their chips (review of #26). The picker
 * stays the way to choose a different saved player. */
export function seatsForCreate(saved: readonly SeatKey[], typedName: string): SeatKey[] {
  const name = typedName.trim()
  return name ? saved.filter(key => sameName(key.name, name)) : []
}

/** Seats "Resume saved seat" may try: the one the player selected, then only
 * other seats saved under that SAME name (in saved()'s newest-first order).
 *
 * The fallback exists because one player collects several saved seats with
 * the same name across host restarts and cannot tell which one is live (#24).
 * It must not cross identities: the first version appended EVERY saved seat,
 * so selecting Alice's expired seat on a shared browser forgot it and then
 * silently resumed Bob's valid seat, chips and all (#27). A different name is
 * a different person until the player explicitly picks it. Names compare
 * trimmed, exactly like seatsForCreate, so both entry points agree on who
 * "the same player" is. */
export function seatsForResume(selected: SeatKey, saved: readonly SeatKey[]): SeatKey[] {
  return [selected, ...saved.filter(key => key.nonce !== selected.nonce && sameName(key.name, selected.name))]
}

// A saved name is a label, not an identity proof (the host checks only the
// token). It is still the only thing that says which PERSON a seat is for.
function sameName(a: string, b: string): boolean { return a.trim() === b.trim() }
