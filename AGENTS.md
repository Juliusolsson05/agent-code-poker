# Agent Code Poker

This is a separate Agent Code API-v2 extension repository. Keep poker rules independent of React, Three.js, timers and host APIs. Rendering projects engine state; it never moves chips.

Write generous WHY comments around rules, lifecycle, persistence and rendering tradeoffs. Preserve deterministic test injection. Bots receive only their own cards and public information, never the deck or opponents’ hands.

Commit production `dist/` artifacts and the dependency lockfile. GitHub installation loads source archives without building. Use the entire pinned SDK Vite preset, bundle all dependencies and inject CSS from the view. No external assets or runtime networking.

The user subsequently authorized website-first LAN multiplayer. Networking is
confined to the explicitly launched standalone `server/` process; the shipped
extension still has no network API. Do not expose Vite/repository files, bypass
the SDK sandbox, add a public relay, or send full GameState to clients. The
connection-test lobby is disposable and separate from solo saves, not the final
3D multiplayer interface. Human dealer is canceled; hand-animation art is paused.

Run `npm run verify` for substantive gameplay changes. Inspect both `/dev/` and `/dev/?production` in a real browser: enter a hand, use legal actions, check held cards/cigar, pause, reload and restore. Inspect motion as well as still images. Browser checks complement actual Electron installation. Do not claim host verification from a standalone preview.
