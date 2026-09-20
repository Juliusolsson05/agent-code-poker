import { closeSync, constants, fchmodSync, fsyncSync, fstatSync, mkdirSync, openSync, readFileSync, renameSync, unlinkSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const LIMIT = 256 * 1024
const absent = (error: unknown) => (error as NodeJS.ErrnoException).code === 'ENOENT'

/** One host owns one local checkpoint. This module knows nothing about poker,
 * credentials or HTTP; its sole consumer must validate the entire document
 * before restoring it. Never serve this directory or import it into a client.
 *
 * Synchronous, bounded writes intentionally serialize the six-seat authority
 * with its durable ACK. Polls do not save. This avoids an await gap in which a
 * second action could observe uncommitted chips. Disk latency still needs real
 * measurement; do not call this free. File fsync + atomic rename + directory
 * fsync cover process interruption, subject to the underlying filesystem.
 *
 * A leftover lock fails closed. We do not infer that a PID is dead and steal
 * its lock: PID reuse and competing stale-lock cleaners can create two ledger
 * owners. Crash-lock recovery remains explicit operator work, not a silent
 * "new table". A normal close releases it without deleting the saved table.
 */
export class CheckpointStore {
  #directory: string
  #lock: number
  #closed = false
  #failed = false
  constructor(directory: string) {
    this.#directory = directory
    mkdirSync(directory, { recursive: true, mode: 0o700 })
    try { this.#lock = openSync(join(directory, 'host.lock'), 'wx', 0o600) }
    catch { throw new Error('Host checkpoint is already owned or locked. Preserve it; check the other host before recovery.') }
    try { writeFileSync(this.#lock, JSON.stringify({ pid: process.pid, version: 1 })); fsyncSync(this.#lock) }
    catch (error) { closeSync(this.#lock); unlinkSync(join(directory, 'host.lock')); throw error }
  }
  load(): unknown {
    this.#assertOpen()
    let fd: number
    try { fd = openSync(join(this.#directory, 'table.json'), constants.O_RDONLY | constants.O_NOFOLLOW) }
    catch (error) { if (absent(error)) return null; throw new Error('Host checkpoint cannot be read; original data preserved.') }
    try {
      const stat = fstatSync(fd)
      if (!stat.isFile() || stat.size > LIMIT) throw new Error('Invalid checkpoint size.')
      return JSON.parse(readFileSync(fd, 'utf8'))
    } catch { this.#failed = true; throw new Error('Invalid host checkpoint; original data preserved.') }
    finally { closeSync(fd) }
  }
  commit(value: unknown): void {
    this.#assertOpen()
    const pending = join(this.#directory, 'table.pending')
    let fd: number | undefined, created = false
    try {
      const bytes = JSON.stringify(value)
      if (bytes === undefined || Buffer.byteLength(bytes) > LIMIT) throw new Error('Invalid checkpoint size.')
      fd = openSync(pending, 'wx', 0o600); created = true
      fchmodSync(fd, 0o600); writeFileSync(fd, bytes); fsyncSync(fd); closeSync(fd); fd = undefined
      renameSync(pending, join(this.#directory, 'table.json')); created = false
      const directory = openSync(this.#directory, constants.O_RDONLY)
      try { fsyncSync(directory) } finally { closeSync(directory) }
    } catch {
      // A rename may already have succeeded when directory fsync fails. Never
      // roll it back or acknowledge; freeze this writer. Recovery reads either
      // the old or new complete snapshot and its matching idempotency record.
      this.#failed = true
      throw new Error('Host checkpoint could not be committed. Hosting is stopped to protect the table.')
    } finally {
      if (fd !== undefined) closeSync(fd)
      if (created) { try { unlinkSync(pending) } catch { /* Keep unknown failure bytes; no recursive cleanup. */ } }
    }
  }
  #assertOpen(): void {
    if (this.#closed || this.#failed) throw new Error('Host checkpoint writer is closed or failed.')
  }
  close(): void {
    if (this.#closed) return
    this.#closed = true; closeSync(this.#lock); unlinkSync(join(this.#directory, 'host.lock'))
  }
}
