import { closeSync, constants, fchmodSync, fsyncSync, fstatSync, lstatSync, mkdirSync, openSync, readFileSync, renameSync, unlinkSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { randomUUID } from 'node:crypto'
import { DatabaseSync } from 'node:sqlite'

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
 * SQLite supplies an OS-managed EXCLUSIVE lease, held for this owner's whole
 * lifetime in a separate EMPTY database. No poker state lives there. Unlike a
 * PID file, the OS releases this lock on SIGKILL without guessing at stale PIDs.
 * See sqlite.org/lockingv3.html. Never delete/replace the lease inode, and use
 * local disk, not a network share whose lock semantics may differ. The JSON
 * checkpoint stays the only ledger. Node22.13 LTS/24+ provides node:sqlite;
 * some supported versions emit its experimental warning, which we keep visible.
 */
export class CheckpointStore {
  #directory: string
  #lock: DatabaseSync
  #closed = false
  #failed = false
  constructor(directory: string) {
    this.#directory = directory
    mkdirSync(directory, { recursive: true, mode: 0o700 })
    // Old experimental writers use a different protocol. Even a stale legacy
    // file must not be stolen by the new protocol while an old host may run.
    try { lstatSync(join(directory, 'host.lock')); throw new Error('Host checkpoint is already owned by a legacy writer; preserve its lock.') }
    catch (error) { if (!absent(error)) throw error }
    const lease = join(directory, 'host-lease.sqlite')
    try { writeFileSync(lease, '', { flag: 'wx', mode: 0o600 }) }
    catch (error) { if ((error as NodeJS.ErrnoException).code !== 'EEXIST') throw error }
    const stat = lstatSync(lease)
    if (!stat.isFile() || stat.isSymbolicLink() || (stat.mode & 0o077) !== 0) throw new Error('Invalid private host checkpoint lease.')
    // Do not open/close an ordinary descriptor on an existing lease: POSIX
    // closing any descriptor for an inode can drop that process's file locks.
    // SQLite coordinates its own connections; lstat above does not open it.
    this.#lock = new DatabaseSync(lease)
    try { this.#lock.exec('BEGIN EXCLUSIVE') }
    catch { this.#lock.close(); throw new Error('Host checkpoint is already owned or locked. Close the other host before retrying.') }
    try {
      const pending = join(directory, 'table.pending')
      let staged
      try { staged = lstatSync(pending) } catch (error) { if (!absent(error)) throw error }
      if (staged) {
        if (!staged.isFile() || staged.isSymbolicLink() || staged.size > LIMIT || (staged.mode & 0o077) !== 0) throw new Error('Unknown checkpoint staging entry.')
        // Only the published table.json was acknowledged. Preserve interrupted
        // bytes for investigation, never promote a partial/unacknowledged bet.
        renameSync(pending, join(directory, `interrupted-${randomUUID()}.json`))
      }
    } catch { this.#lock.close(); throw new Error('Host checkpoint staging cannot be recovered; original data preserved.') }
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
    this.#closed = true; this.#lock.close()
  }
}
