type EnvelopeOrder = { generation: string; observation: number }
type RequestStamp = Readonly<{ epoch: number; version: number; generation?: string }>

/** A discarded request is neither a failed current connection nor an ACK.
 * The UI must not show its error, restore its view, or retry its wager. */
export class ObsoleteResponse extends Error {}

/** Browser-only arbitration, consumed solely by client.js. No credentials,
 * poker state, fetch, renderer or storage belongs here: the server owns truth;
 * this owner only decides whether a completion still belongs to this tab.
 *
 * A credential string is not a lifetime. Forget followed by Resume can reuse
 * the same key while an old request is still pending. Epochs seal that hole.
 * Poker revisions also cannot order pause/resume (which don't move chips),
 * hence the separate server process generation and observation counter.
 */
export class ResponseOrder {
  #epoch = 0
  #version = 0
  #head: EnvelopeOrder | undefined

  begin(): RequestStamp {
    return { epoch: this.#epoch, version: this.#version, generation: this.#head?.generation }
  }
  reset() { this.#epoch++; this.#version = 0; this.#head = undefined }
  current(request: RequestStamp) { return request.epoch === this.#epoch }
  failureCurrent(request: RequestStamp) {
    // Errors without an envelope have no server ordering metadata. They may
    // disable controls only if nothing newer has demonstrated live authority
    // since they began. This also covers fetch timeouts and JSON decode errors.
    return this.current(request) && request.version === this.#version
  }
  accept(request: RequestStamp, next: EnvelopeOrder) {
    if (!this.current(request) || typeof next.generation !== 'string' || !next.generation ||
      !Number.isSafeInteger(next.observation) || next.observation < 1) return false
    const head = this.#head
    if (head && (next.generation === head.generation
      ? next.observation <= head.observation
      : request.generation !== head.generation)) return false
    // Only a request begun in the current generation can introduce its
    // successor. Concurrent requests may then advance that successor, but a
    // late pre-restart response cannot return us to its older generation.
    this.#head = { generation: next.generation, observation: next.observation }
    this.#version++
    return true
  }
}
