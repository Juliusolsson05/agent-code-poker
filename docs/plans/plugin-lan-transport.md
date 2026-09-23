# LAN play inside the Agent Code extension

Issue: #17 (host side: Juliusolsson05/agent-code#1147)

## Problem

Inside the extension, the poker server is a loopback-only service. Every
request reaches it through the Agent Code host, and the host dropped
`Authorization` and `Origin`, so create got 403 and every authenticated route
got 401. Through the LAN listener every guest looks like 127.0.0.1. Forwarding
headers alone would therefore let a guest pass the loopback-only
`/api/create`. On top of that, the share line printed a placeholder IP.

## The contract (see agent-code#1147 for the host half)

The host marks each proxied request. `server/http.ts` resolves every request
into one "caller" before any rule runs:

| Arrival | Peer | Host used | Same-origin proof |
|---|---|---|---|
| Direct socket (standalone website) | socket address | `Host` | `Origin === http://<Host>` (unchanged) |
| Loopback + `x-agent-code-transport: lan` | `x-forwarded-for` | `x-forwarded-host` | `Origin === http://<x-forwarded-host>` |
| Loopback + `x-agent-code-transport: service` | loopback (the host player's own frame) | `Host` | the attestation itself |

Rules:

- **Markers only count on a loopback socket.** The standalone `--lan` server
  ignores them from LAN peers.
- **The LAN marker downgrades trust and never upgrades it.** If both markers
  appear, the request is treated as LAN.
- **A LAN caller's Host must be an IP literal.** It must be private or loopback
  IPv4. The listener's port is unknown to the service, so the service cannot
  keep an exact allow-list. The literal rule is the DNS-rebinding defence: a
  rebinding attack needs a hostname.
- **Unchanged rules:** private-IPv4 peers only; loopback-only create (a LAN
  guest's forwarded peer is not loopback); bearer tokens; the 4 KB body cap;
  pause. The server still never answers CORS preflights, and the `service`
  attestation relies on that.
- **Guests supply their own Origin.** `net.fetch` sends no Origin, and the
  server's POST rule needs one. `netFetchTransport` therefore sends the origin
  it dials. That is honest: it is the page origin the guest "is" for this
  table. The same guest also works against the standalone CLI host.
- **Guests dial the bare origin** (found during implementation).
  `privateHostDestination()` returns `http://ip:port/` with a trailing slash,
  so the adapter was requesting `//api/…`, which the exact-path router
  answers with a 404. The adapter now reduces the destination to its origin
  once, and that is also the Origin it sends.

## Share URL

The service `status` request returns the machine's private IPv4 addresses,
reusing `startLanHost`'s interface filter. The runtime command and the view's
Host button both invoke `status` after `expose` and show
`http://<ip>:<exposed port>`. The placeholder is shown only when no private
interface exists.

## Tests

`tests/lan-proxy-contract.test.ts` drives the real `startLanHost` with requests
shaped exactly as the Agent Code proxy and listener send them. The header sets
are copied from the host source, with file references. It covers:

- create, join, start, act, pause and reconnect through both paths;
- a guest through the listener cannot create;
- a forged marker from a non-loopback socket gets no special treatment;
- a hostname forwarded Host is rejected;
- a foreign forwarded Origin is rejected;
- the standalone checks are unchanged.

A transport unit test covers the guest's Origin and the service attestation.
`status` gets a test of its own.

## Docs

Correct the README and AGENTS.md statements that say the extension "has no
network API".

## Verification

`npm run verify`, plus rebuilt `dist/`, `lan-dist/` and `dist-service/`.
Two-device acceptance in the installed app stays with the user.

## Review (security, one round)

- **Markers are read only inside Agent Code.** The server reads them only
  when it runs as the extension's service (`agentCodeHost`, set only by
  `server/service.ts`). The standalone CLI rules are exactly the originals.
- **`lan` needs the listener's own Host.** A `lan` marker is trusted only when
  the raw Host is `127.0.0.1:<own port>`. Before this, a DNS-rebound page
  could attach the marker and skip the exact Host allow-list.
- **Loopback means local-user trust.** A same-machine client that dials the
  listener on 127.x may create the table, like the host computer's browser.
  Any local program can dial loopback.
- **IPv4 only, documented.** The generic listener stays as it is, because
  narrowing it would change policy for every extension service.
- **Manual end-to-end tool:** `testing/manual/agent-code-lan-e2e.mts`.
