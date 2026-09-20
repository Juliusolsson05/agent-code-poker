# Agent Code Poker

A standalone Agent Code extension: six-seat No-Limit Texas Hold’em in a seated, near-first-person dark bar. Characters are procedurally sculpted from fine voxels. All chips are free practice currency; five local opponents only use their own cards and public information.

## Development

Node 22.12 or newer. Run `npm ci`, then `npm run dev`. Open [the live preview](http://127.0.0.1:5191/dev/). Changes hot-reload. `npm run verify` checks rules, scene invariants, TypeScript and production packaging. After building, `/dev/?production` loads the shipped view bundle rather than source.

The preview stores a separate local-browser save. It does not read installed Agent Code saves. To test installation, load this repository folder in Agent Code’s extension settings and run **Play Agent Code Poker**. Production `dist/` is committed because GitHub installation does not build source archives.

## Playing

Use the on-screen actions and raise sizing controls. **F** folds, **C** checks/calls, **M** toggles sound, **Esc** pauses, and **S** raises your cigar for a puff. Typing in a field does not trigger gameplay shortcuts. Opponents keep card backs facing you until a public showdown. The active hand saves after every decision. Losing focus pauses the table; returning does not silently resume betting.

**Drinks ▾** opens a compact free menu: Old Fashioned, winter ale, red wine or water. **D** sips the current drink. Ordering is available only once your hand has finished its current action; it replaces the glass on your coaster and never spends chips. Drink selection is cosmetic and resets to Old Fashioned on reload, without changing the saved poker hand. Grips remain under visual refinement.

Hold **Space** while the table is focused to lean over your cards and chips; release to look up. The **Cards & chips** button toggles the same view without holding a key. Buttons and inputs retain normal Space behavior. Inspection does not pause betting or reveal opponents' cards. The website fills the browser and offers a fullscreen button; Agent Code host fullscreen is deferred.

## Boundaries

This is an evolving visual/gameplay implementation, not a finished realism benchmark. WebGL2 is required. The camera is desktop seated perspective, not headset/WebXR support. There is no multiplayer, real money, remote service or downloaded runtime asset. Blinds stay at 10/20 with a moving button. Bots sample equity and have different risk profiles; they are not a solver or a claim of professional-level play.

`src/engine/` owns the ledger and legal decisions; `src/scene/` projects state into cards, chips, voxel humans and first-person hands; `src/App.tsx` owns controls, pacing and storage. Rendering never changes chip balances. Keep WHY comments beside these invariants. Full Electron-host verification is separate from the browser preview.

## Visual evidence workflow

`/dev/?qa=my-check&stats&record` isolates a QA save and enables a bounded local
trace recorder. Record evidence, exercise the real controls, capture views, then
save the trace. It records public actions, transforms and frame timings—not deck
or hole-card values—and never uploads telemetry. `/dev/?studio&seat=1` inspects
the actual production rig from four angles with a scrubbed timeline. Studio
poses are controlled inspections, not recordings of live gameplay.

The current failing baseline and provenance live in `testing/fixtures/experience/`;
these are not approved visual goldens. The staged plan is
`docs/decomposition/poker-experience.md`. Passing math tests does not close its
visual, contact, performance or production-preview acceptance gates.
