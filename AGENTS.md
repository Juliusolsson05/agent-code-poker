# Agent Code Poker

This is a separate Agent Code API-v2 extension repository. Keep poker rules independent of React, Three.js, timers and host APIs. Rendering projects engine state; it never moves chips.

Write generous WHY comments around rules, lifecycle, persistence and rendering tradeoffs. Preserve deterministic test injection. Bots receive only their own cards and public information, never the deck or opponents’ hands.

Commit production `dist/` artifacts and the dependency lockfile. GitHub installation loads source archives without building. Use the entire pinned SDK Vite preset, bundle all dependencies and inject CSS from the view. No external assets. The view and runtime never open sockets; LAN traffic goes only through Agent Code's permission-gated service, listener and brokered-fetch APIs (see README, LAN inside the extension).

**One recorded exception (user decision 2026-09-23, backlog §5 option 1):** LAN
chat voices. Each player's OWN app calls ElevenLabs text-to-speech
(`https://api.elevenlabs.io`, nothing else) with that player's OWN key and voice
ID. Only `src/voice/` builds those requests. The key never leaves that player's
machine: never to the LAN host, other players, logs, saves, diagnostics or PR
text. In Agent Code the key lives in the host's per-extension secret store and
the call goes through the host broker under the manifest's declared
`networkOrigins` + `net.origins` consent; on the standalone website it lives in
that browser's local storage and the page CSP allows exactly that one origin.
Only finished audio travels, through the LAN host's in-memory relay, and only
while the host has voices switched on. Any further external origin needs a new
explicit decision.

The user subsequently authorized website-first LAN multiplayer. Networking is
confined to the `server/` process: the standalone CLI, or the extension's
declared LAN service, which Agent Code runs on loopback and exposes on the LAN.
Security rules in `server/http.ts` read the resolved caller (`resolveCaller`),
never the raw socket, because in-app requests all arrive from 127.0.0.1. Never
add CORS: it would make the host's `service` marker forgeable. Do not expose Vite/repository files, bypass
the SDK sandbox, add a public relay, or send full GameState to clients. The
LAN website projects the actual3D room. Standalone hosting uses private local
checkpoints by default, with explicit --memory-only for disposable tests; it is
separate from solo saves and still needs actual multiplayer browser acceptance. Commit its
compiled `lan-dist/` as well as the SDK `dist/`. Human dealer is canceled;
hand-animation art is paused. RoomProjection is the single local/remote view
boundary: renderers cannot consume deck/private engine state or invent hidden
card values. Display-seat rotation never changes authenticated wager ownership.

Run `npm run verify` for substantive gameplay changes. Inspect both `/dev/` and `/dev/?production` in a real browser: enter a hand, use legal actions, check held cards/cigar, pause, reload and restore. Inspect motion as well as still images. Browser checks complement actual Electron installation. Do not claim host verification from a standalone preview.
