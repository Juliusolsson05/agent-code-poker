import type { SceneState } from '../presentation/RoomProjection'

export const CHIP_VALUES = [500, 100, 25, 5, 1]
export type PhysicalChip = { id: number; value: number; account: string; origin?: number }

/** A persistent physical inventory, separate from the authoritative game ledger.
 * Re-decomposing every amount after every action was visually wrong: making a
 * 20-chip call caused unrelated stacks to disappear and "change" flew back from
 * the pot. Here actual chip identities move between accounts. Change is made at
 * the source stack, and every unaffected chip survives the transaction. */
export class ChipLedger {
  private inventory: PhysicalChip[] = []
  private nextId = 1
  private previous: SceneState | null = null
  private amount(account: string): number { return this.inventory.filter(c => c.account === account).reduce((n, c) => n + c.value, 0) }
  private transfer(from: string, to: string, amount: number): void {
    if (amount > this.amount(from)) throw new Error(`Visual chip transfer exceeds ${from}.`)
    while (amount > 0) {
      const candidates = this.inventory.filter(c => c.account === from).sort((a, b) => b.value - a.value || b.id - a.id)
      const exact = candidates.find(c => c.value <= amount)
      if (exact) { exact.account = to; amount -= exact.value; continue }
      const chip = candidates.at(-1)!
      const smaller = CHIP_VALUES[CHIP_VALUES.indexOf(chip.value) + 1]
      if (!smaller) throw new Error('A one-chip unit cannot be split.')
      this.inventory = this.inventory.filter(c => c.id !== chip.id)
      for (let i = 0; i < chip.value / smaller; i++) this.inventory.push({ id: this.nextId++, value: smaller, account: from, origin: chip.origin ?? chip.id })
    }
  }
  sync(state: SceneState): PhysicalChip[] {
    const targets = state.players.flatMap(p => [{ account: `bank:${p.seat}`, amount: p.stack }, { account: `bet:${p.seat}`, amount: p.bet }])
    targets.push({ account: 'pot', amount: state.players.reduce((n, p) => n + p.committed - p.bet, 0) })
    const old = this.previous
    // React may reproject the same decision after layout/fullscreen changes.
    // That is neither a new transaction nor a restore: preserve the physical
    // identities and any in-flight slides instead of rebuilding every stack.
    if (old && state.revision === old.revision && state.dealId === old.dealId &&
      targets.every(({ account, amount }) => this.amount(account) === amount)) {
      this.previous = state
      return this.inventory.map(c => ({ ...c }))
    }
    // A mounted room first paints a ready table, then asynchronously receives
    // the saved hand. That can skip dozens of decisions. Only adjacent engine
    // revisions are transactions; restore/HMR/replacement snapshots must seed
    // their entire visual inventory instead of spending a nonexistent old pot.
    const reset = !old || state.revision !== old.revision + 1 || state.initialTotal !== old.initialTotal ||
      state.handNumber < old.handNumber || state.handNumber > old.handNumber + 1 ||
      state.handNumber === old.handNumber && state.dealId !== old.dealId
    if (reset) {
      this.inventory = []
      for (const { account, amount } of targets) {
        let remaining = amount
        for (const value of CHIP_VALUES) {
          if (value === 500 && amount <= 3000 && account !== 'pot') continue
          while (remaining >= value) { this.inventory.push({ id: this.nextId++, value, account }); remaining -= value }
        }
      }
    } else {
      if (state.phase === 'complete' || state.street !== old.street) {
        for (const p of state.players) this.transfer(`bet:${p.seat}`, 'pot', this.amount(`bet:${p.seat}`))
      }
      for (const p of state.players) {
        const bank = `bank:${p.seat}`, bet = `bet:${p.seat}`, difference = this.amount(bank) - p.stack
        if (difference > 0) this.transfer(bank, bet, difference)
        else if (difference < 0) {
          const refund = Math.min(-difference, this.amount(bet))
          this.transfer(bet, bank, refund)
          this.transfer('pot', bank, -difference - refund)
        }
      }
    }
    for (const { account, amount } of targets) if (this.amount(account) !== amount) throw new Error(`Visual ${account} diverged from poker ledger.`)
    this.previous = state
    return this.inventory.map(c => ({ ...c }))
  }
}
