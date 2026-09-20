# Agent Code Poker

A standalone Agent Code extension: six-seat No-Limit Texas Hold’em in a seated, near-first-person dark bar. Characters are procedurally sculpted from fine voxels. All chips are free practice currency; five local opponents only use their own cards and public information.

## Development

Node 22.12 or newer. Run `npm ci`, then `npm run dev`. Open [the live preview](http://127.0.0.1:5191/dev/). Changes hot-reload. `npm run verify` checks rules, scene invariants, TypeScript and production packaging. After building, `/dev/?production` loads the shipped view bundle rather than source.

The preview stores a separate local-browser save. It does not read installed Agent Code saves. To test installation, load this repository folder in Agent Code’s extension settings and run **Play Agent Code Poker**. Production `dist/` is committed because GitHub installation does not build source archives.

## Playing

Use the on-screen actions and raise sizing controls. **F** folds, **C** checks/calls, **M** toggles sound, **Esc** pauses, and **S** raises your cigar for a puff. Typing in a field does not trigger gameplay shortcuts. Opponents keep card backs facing you until a public showdown. The active hand saves after every decision. Losing focus pauses the table; returning does not silently resume betting.

**Drinks ▾** opens a compact free menu: Old Fashioned, winter ale, red wine or water. **D** sips the current drink. Ordering is available only once your hand has finished its current action; it replaces the glass on your coaster and never spends chips. Drink selection is cosmetic and resets to Old Fashioned on reload, without changing the saved poker hand. Grips remain under visual refinement.

Hold **Space** while the table is focused to lean over your cards and chips; release to look up. The **Cards & chips** button toggles the same view without holding a key. Buttons and inputs retain normal Space behavior. Inspection does not pause betting or reveal opponents' cards. The website fills the browser and offers a fullscreen button; Agent Code host fullscreen is deferred.

The public community cards stay in a compact **bottom-right** readout throughout
the hand, with empty slots for undealt streets. It does not expose private cards
or need an inspection toggle. Narrow layouts lift it above the betting row.

## Boundaries

Folded cards settle face-down on the felt and remain until the next hand.
Restoring a save restores those discards without replaying a throw. Dealer
collection is planned separately; the engine still owns every chip balance.

This is an evolving visual/gameplay implementation, not a finished realism benchmark. WebGL2 is required. The camera is desktop seated perspective, not headset/WebXR support. There is no multiplayer, real money, remote service or downloaded runtime asset. Blinds stay at 10/20 with a moving button. Bots sample equity and have different risk profiles; they are not a solver or a claim of professional-level play.

`src/engine/` owns the ledger and legal decisions; `src/scene/` projects state into cards, chips, voxel humans and first-person hands; `src/App.tsx` owns controls, pacing and storage. Rendering never changes chip balances. Keep WHY comments beside these invariants. Full Electron-host verification is separate from the browser preview.

## Visual evidence workflow

Mouse-look candidate: add `&look` to a source QA URL. Left-drag the scene,
press **R** or the header's **Recenter view** button to face forward, and use
Settings → Mouse-look to turn it off for this session. Inspection temporarily
centers the view; drinks/cigar wait for centering. Menus and pause cancel a
pending request. This is **development-only pending real drag/comfort checks**;
ordinary source play and the shipped bundle retain the verified camera.

`/dev/?qa=my-check&stats&record` isolates a QA save and enables a bounded local
trace recorder. Record evidence, exercise the real controls, capture views, then
save the trace. It records public actions, transforms and frame timings—not deck
or hole-card values—and never uploads telemetry. `/dev/?studio&seat=1` inspects
the actual production rig from four angles with a scrubbed timeline and exact
time input. Select **Player drink grip**, **Drink**, time **2.6** to inspect hand
and glass together. Studio poses are controlled inspections, not recordings of
live gameplay. `npx tsx testing/audit-grip.ts` runs an offline calibration aid;
the stronger triangle-envelope tests, not its sampled fit, guard runtime grips.
**Player contact rig** includes both sleeves and table props; its optional
orange dot marks the shared authored lip landmark, not a rendered head.
Confirm downloaded evidence exists before leaving a session: browsers may
block subsequent automatic downloads. A missing export is not retained proof.
The recorder's **Wide room** / **Seated view** controls inspect actual furniture
and decor placement without moving actors or changing the normal player camera.
In a fresh QA lobby, **Profile render cost** runs a 40-second fixed-view A/B/A/B
comparison (2s warmup + 8s measurement per window) and downloads raw JSON. Keep
the tab visible without changing its size or entering a hand. Add `&gpu` for
optional sparse asynchronous GPU queries; these are separate from CPU submission
and can perturb timing. Ordinary play caps the 3D buffer at 2.5M pixels while
retaining 4x MSAA; HTML controls stay at native browser resolution. This limits
fullscreen render cost but does not guarantee 60 FPS.

**Isolate render passes** records five 10-second windows (baseline, no bloom,
no shadows, direct render, baseline). These are diagnostic omissions, not quality
presets. Repeated-baseline drift above 25% rejects comparison; passing that guard
alone is not a performance guarantee. **Capture fixed view** samples the real
rig's resting pose at time12. `&resolved-canvas-aa` opts into removing redundant
canvas MSAA for a paired image experiment; normal/shipped play retains it until
that comparison is valid. The scene target always retains4xMSAA.

The current failing baseline and provenance live in `testing/fixtures/experience/`;
these are not approved visual goldens. The staged plan is
`docs/decomposition/poker-experience.md`. Passing math tests does not close its
visual, contact, performance or production-preview acceptance gates.
