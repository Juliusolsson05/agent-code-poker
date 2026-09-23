/** `code` and `at` are optional labels, not credentials: the host checks only
 * the token. They exist because a browser outlives tables. Without them every
 * saved seat read as just "Bigj", in storage order, and after a host restart
 * the player could not tell the live seat from ones for tables that no longer
 * exist (#24). Legacy entries simply lack them. */
export type SeatKey = { token: string; nonce: string; name: string; code?: string; at?: number }
type StoragePort = Pick<Storage, 'length' | 'key' | 'getItem' | 'setItem' | 'removeItem'>
const CURRENT = 'poker-lan-connection-test-v1'
const PREFIX = 'poker-lan-saved-seat-v1:'
function parse(raw: string | null, legacy = false): SeatKey | null {
  if (!raw || raw.length > 2048) return null
  try {
    const value = JSON.parse(raw)
    const name = legacy && value?.name === undefined ? 'Saved player' : value?.name
    if (!value || typeof value.token !== 'string' || !/^(?:[A-Za-z0-9_-]{43})?$/.test(value.token) ||
      typeof value.nonce !== 'string' || !/^[a-f0-9]{64}$/.test(value.nonce) || typeof name !== 'string' ||
      !name.trim() || name.length > 96 || /[\p{Cc}\p{Cf}]/u.test(name)) return null
    const key: SeatKey = { token: value.token, nonce: value.nonce, name }
    // Optional labels fail closed individually: a malformed label is dropped,
    // never allowed to invalidate an otherwise good credential.
    if (typeof value.code === 'string' && /^[A-F0-9]{10}$/.test(value.code)) key.code = value.code
    if (typeof value.at === 'number' && Number.isFinite(value.at) && value.at > 0) key.at = Math.floor(value.at)
    return key
  } catch { return null }
}

/** Browser credential persistence, not admission or seat authority. A saved
 * name is only a label; the host authenticates its random token. current() may
 * resume this tab, but saved() NEVER changes it. The caller must offer an
 * explicit choice before recovering a closed tab's credential.
 *
 * Each seat gets its own localStorage entry. A shared array with read/modify/
 * write would let two admitted tabs erase each other's recovery keys. Neither
 * malformed data nor storage denial authorizes clearing another save. Lazy
 * Storage getters also catch browsers that throw just accessing localStorage.
 * No engine, network, DOM or renderer dependency is allowed here.
 */
export class SeatRecovery {
  constructor(private session: () => StoragePort, private local: () => StoragePort) {}
  current(): SeatKey | null {
    try { return parse(this.session().getItem(CURRENT), true) } catch { return null }
  }
  saved(): SeatKey[] {
    try {
      const local = this.local(), result: SeatKey[] = []
      for (let i = 0; i < Math.min(local.length, 4096) && result.length < 64; i++) {
        const name = local.key(i)
        if (!name?.startsWith(PREFIX)) continue
        const value = parse(local.getItem(name))
        if (value?.token && name === PREFIX + value.nonce) result.push(value)
      }
      // Newest first: after a restart the live seat is almost always the one
      // saved most recently. Legacy entries without a time sort last.
      return result.sort((a, b) => (b.at ?? 0) - (a.at ?? 0))
    } catch { return [] }
  }
  save(value: SeatKey, remember: boolean): boolean {
    const validated = parse(JSON.stringify(value))
    if (!validated) return false
    let ok = true
    try { this.session().setItem(CURRENT, JSON.stringify(validated)) } catch { ok = false }
    if (remember && validated.token) {
      try { this.local().setItem(PREFIX + validated.nonce, JSON.stringify(validated)) } catch { ok = false }
    }
    return ok
  }
  forget(value: SeatKey): boolean {
    let ok = true
    try {
      const current = parse(this.session().getItem(CURRENT), true)
      if (current?.nonce === value.nonce && current.token === value.token) this.session().removeItem(CURRENT)
    } catch { ok = false }
    try {
      const local = this.local(), saved = parse(local.getItem(PREFIX + value.nonce))
      if (saved?.token === value.token) local.removeItem(PREFIX + value.nonce)
    } catch { ok = false }
    return ok
  }
}
