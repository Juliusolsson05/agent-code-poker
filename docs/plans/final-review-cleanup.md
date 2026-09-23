# Plan: final-review cleanup

Issues: #27 (two LAN correctness bugs), follow-up #28 (typecheck the LAN
client, deliberately not done here). Source: the Codex final review of `main`
at c967242. This is the last cleanup round: fix these findings, then stop.

## Correctness (#27)

1. **Cancel pending voices.** `ChatVoice` gets a generation counter. It is
   invalidated whenever the host's voices switch is observed off, on `reset()`
   (new table generation, Leave, Forget). Each async path captures the
   generation before its first `await` and rechecks it after every `await`:
   the chat receipt, the ElevenLabs synthesis (before local playback and
   before the relay upload), and the relay clip fetch (before playback).
   `PokerAudio` gets its own counter, bumped by `stopVoices()` (called by mute,
   voices off, reset and dispose), so a decode pending at stop time never
   starts. Two counters, not one, because the audio object does not know about
   chat sessions and the chat object cannot see a decode in flight.
   Tests: fix `tests/voice.test.ts`, which currently expects playback after
   voices-off. Add deferred synthesis, relay-fetch and decode cases that assert
   no playback and no upload after cancellation or reset.
2. **Resume stays with the selected identity.** New `seatsForResume(selected,
   saved)` in `server/client/resumeSeats.ts`, beside `seatsForCreate`: the
   selected seat first, then only seats saved under the same (trimmed) name,
   newest first. `client.js` uses it. Update SeatRecovery's contract comment
   and `docs/plans/lan-seat-recovery.md`, which also never recorded Create's
   same-name restriction.

## Cleanliness

3. Remove `FireAmbience.setListenerMatrix`. Production drives the one Web Audio
   listener through `PokerAudio.setListenerMatrix`. Move the listener
   assertions (camera axes, look-at-hearth, NaN rejection) to a PokerAudio test.
4. Remove the three unused bindings found by `tsc --noUnusedLocals`:
   `Drinks.ts` `inner` (mulled wine), `Hand.ts` `length`, `dev/studio.ts`
   `LeisureAction`.
5. Version 0.3.0 in `package.json`, its lockfile and `agent-code.extension.json`.
   This release adds chat and voices and needs Agent Code ≥ 0.1.3. No tag or
   release.

## Docs

6. `docs/decomposition/poker-backlog-2026-09.md`: status rows 1–8 point at the
   merged PRs. Implemented work is separated from outstanding acceptance
   (installed app, two-device LAN, real-key voice). §5's policy question is
   marked historical: option 1 was chosen and recorded in AGENTS.md.
7. README: remove the stale "not an available multiplayer mode" and "solo bank
   integration is open" claims. PLAN.md: add a current-status section on top
   and mark the older direction (non-LAN focus, "no runtime network calls")
   as historical. Keep the genuine acceptance gaps: listening, devices,
   Electron.

## Verification

`npm run verify`; rebuilt `dist/` and `lan-dist/` committed. If the only diff
in `dist-service/lan-host.mjs` is esbuild's node_modules path comment (the
worktree symlinks another checkout's node_modules), restore it.
