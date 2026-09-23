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
  return name ? saved.filter(key => key.name.trim() === name) : []
}
