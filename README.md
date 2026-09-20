# Agent Code Poker

A standalone Agent Code extension: six-seat No-Limit Texas Hold’em in a seated, near-first-person dark bar. Characters are procedurally sculpted from fine voxels. All chips are free practice currency; five local opponents only use their own cards and public information.

## Development

Node22 LTS (22.13+) or24+. Run `npm ci`, then `npm run dev`. Open [the live preview](http://127.0.0.1:5191/dev/). Changes hot-reload. `npm run verify` checks rules, scene invariants, TypeScript and production packaging. After building, `/dev/?production` loads the shipped view bundle rather than source. The standalone host uses Node's built-in SQLite only for an OS-managed ownership lease; some supported Node versions emit its experimental warning.

The preview stores a separate local-browser save. It does not read installed Agent Code saves. To test installation, load this repository folder in Agent Code’s extension settings and run **Play Agent Code Poker**. Production `dist/` is committed because GitHub installation does not build source archives.

## Playing

Use the compact on-screen actions or keyboard. **F** folds, **C** checks/calls,
and **B** opens wager sizing. Arrows change one chip; **Shift + arrows** change
one big blind. **1–4** select minimum, half-pot, pot or all-in. **Enter** confirms
the visible draft with table focus; **Esc** cancels it before pausing. Cancel
discards the amount. Focused buttons keep native Enter/Space behavior, so Enter
on a preset only selects that preset. No typing or slider is required.
**M** toggles sound and **S** raises your cigar. Text fields do not trigger
gameplay shortcuts. Opponents keep card backs facing you until public showdown.
The active hand saves after every decision. Losing focus pauses the table;
returning does not silently resume betting.

**Bank** keeps a busted solo player at the same table: borrow 2,000 fictional
chips between hands, then explicitly confirm. Debt has no interest or real-money
value and saves with the table. Repay 500 or up to your available debt/stack
between hands. Canceling never moves chips; a failed save pauses play and Retry
saves the same transfer. Old saves migrate without changing their chips. Starting
a new table explicitly ends that practice room, its history and its debt.

**Drinks ▾** opens a compact free menu: Old Fashioned, winter ale, red wine or water. **D** sips the current drink. Ordering is available only once your hand has finished its current action; it replaces the glass on your coaster and never spends chips. Drink selection is cosmetic and resets to Old Fashioned on reload, without changing the saved poker hand. Grips remain under visual refinement.

Solo **Settings → Drink effect** selects Off, Subtle or Soft edge warmth. It
builds only after completed player alcoholic sips—not orders, NPC drinks or
water. This is cosmetic, not a blood-alcohol simulation: no blur, sway or rules
changes. Six sips cap it; it fades over ten active minutes from the cap, freezes
when paused and resets on leaving/reload. Off clears it immediately. The setting
lasts until reload. The LAN adapter currently leaves this optional effect off.

Hold **Space** while the table is focused to lean over your cards and chips; release to look up. The **Cards & chips** button toggles the same view without holding a key. Buttons and inputs retain normal Space behavior. Inspection does not pause betting or reveal opponents' cards. The website fills the browser and offers a fullscreen button; Agent Code host fullscreen is deferred.

The public community cards stay in a compact **bottom-right** readout throughout
the hand, with empty slots for undealt streets. It does not expose private cards
or need an inspection toggle. Narrow layouts lift it above the betting row.

## Boundaries

Folded cards settle face-down on the felt and remain until the next hand.
Restoring a save restores those discards without replaying a throw; the next
hand clears them. The human-dealer experiment was rejected because its seating
layout did not work well and has been removed. The poker button and dealing
rules remain unchanged; the engine still owns every chip balance.

This is an evolving visual/gameplay implementation, not a finished realism benchmark. WebGL2 is required. The camera is desktop seated perspective, not headset/WebXR support. The extension remains solo; the standalone LAN website is an integration candidate, not a verified multiplayer release. There is no real money or public remote service. Blinds stay at 10/20 with a moving button. Bots sample equity and have different risk profiles; they are not a solver or a claim of professional-level play.

`src/engine/` owns the ledger and legal decisions; `src/scene/` projects state into cards, chips, voxel humans and first-person hands; `src/App.tsx` owns controls, pacing and storage. Rendering never changes chip balances. Keep WHY comments beside these invariants. Full Electron-host verification is separate from the browser preview.

`src/session/` is the isolated LAN foundation, not an available multiplayer mode.
`HostTable` owns six seats and the engine; `view.ts` explicitly projects public
data plus the viewer's private cards. Mid-hand arrivals reserve a bot seat for
the next deal. Principal-bound actions reject stale/duplicate wagers; disconnect
permits host bot control without transferring the seat. Never send the solo
app's full `GameState` or cast a redacted view back into one.

### Experimental 3D LAN website

The normal browser lobby now has **Play with friends · LAN**, opening a separate
Host/Join setup page while keeping the solo tab. This is navigation, not a server
launcher: explicitly start the standalone host, then paste its printed URL.
Names/codes are entered on that host, never forwarded in URLs. The link is
website-only and hidden in the installed extension. The rejected standalone LAN
theme is being replaced by shared original header, seat labels, pot, board and
stack/status components and the original styles. Full live LAN UI parity remains
an acceptance gate; this is not permission for a separate redesign.

`npm run build` compiles both the extension and `lan-dist/`. `npm run lan`
starts the separate, persistent3D multiplayer candidate at
`http://127.0.0.1:5192/`. It does not modify solo saves.
Create a table on the host computer, then share its lobby
code. `npm run lan -- --lan` explicitly enables private-LAN connections and
prints the host IP URLs; guests must first open one of those URLs, then enter
the code and a name. Address-free discovery is not implemented. HTTP is not
encrypted: use a trusted LAN, never port-forward or publicly deploy this host.

Six seats are maintained by the host, with NPCs filling unclaimed seats. Arrivals
during a hand wait for the next deal without receiving the old NPC cards.
Tab-scoped credentials resume the same seat after reload. Opt into **Remember my
seat on this browser** before joining, or use the table-menu equivalent. A new
tab offers **Resume saved seat**, never automatic takeover; close the previous
tab first. Use the same host URL. Shared-device users should Leave or Forget
their saved key. Storage denial shows a warning without discarding the live
connection. Guest absence permits bot fallback after15 seconds; host absence
suspends the table. A process restart restores the private host checkpoint and
requires explicit host resume. Leaving as host ends the table for everyone.
Clear an ended connection explicitly; network errors never create a replacement
table. `--memory-only` opts into a disposable host that loses its room on stop.
**Table menu** shows
the code/roster and host pause/end controls. The host deals the next hand.
Betting uses the shared keyboard tray (F/C/B, arrows, presets1–4, Enter/Esc),
and Space inspects only your allowed cards. Each viewer occupies the near seat;
opponent models follow stable authority identities, not their display slot.
The LAN room also exposes **S** for cigar, **D** for the current drink and a
compact **Drinks** menu with the same free block-built choices as solo play.
These use the existing local contact owner, not networking or poker actions.
Typing, menus, inspection, waiting admission and paused/disconnected tables
block new leisure requests. Orders do not count as sips or cause intoxication.
Remote human drink/gesture synchronization is not implemented yet; opponent
ambient gestures are still presentation-only, not evidence of a remote action.
The table menu includes a **Practice bank** candidate: busted players may
borrow2,000 fictional chips between hands, with explicit confirmation and
matching debt. Repay500 or the available maximum between hands; no interest,
cash or purchases. Debt follows the authenticated player through reconnects
and host restart, not the chair. Leaving does not erase debt; ending the entire
room ends its fictional ledger. Transfers use the same durable, duplicate-safe
command stream as wagers. Old host checkpoints migrate with zero debt and
unchanged chips. Solo bank integration and live multi-client bank acceptance
remain open; passing HTTP tests is not browser verification.
Actual recovery/two-browser3D acceptance and separate-device
LAN acceptance remain open. Starting a LAN game INSIDE the installed extension,
without a terminal, is now required for release. The current SDK has no
network-hosting API and does not load this standalone server. The proposed
permission-gated Agent Code transport requires separately authorized host/SDK
work; terminal hosting is a development adapter, not the final experience.

The CLI stores its private checkpoint in ignored `.poker-lan/` on local disk.
It contains private cards and credentials: never share, serve, export or commit
that directory. A SQLite EXCLUSIVE lease prevents concurrent owners and releases
on process death; it stores no poker ledger. Interrupted staging bytes are
preserved as private `interrupted-*.json` files, never promoted to accepted bets.
Corrupt data, failed writes or legacy experimental `host.lock` files fail closed;
preserve them and investigate rather than deleting them to create a new table.
Use local disk, not network shares. Normal shutdown preserves a checkpoint;
explicit host Leave persists an ended-session tombstone. Solo saves are untouched.
Actual multi-browser recovery remains an acceptance gate, despite passing
isolated HTTP and deliberate child-process kill tests.

`src/presentation/RoomProjection.ts` is the room's only reconciliation layer.
Local/remote inputs become explicit visible/hidden/absent card views and rotated
display accounts; Cards/Chips never receive the private engine deck. All wagers
still use authenticated authority, never a rotated seat number. Both compiled
artifact directories are committed; no source/Vite routes are served over LAN.

## Visual evidence workflow

Keyboard betting now uses one shared draft tray in normal source, shipped and
LAN play. `/dev/?qa=keyboard&record&stats` isolates evidence capture; no betkeys
flag is needed. No chips move until confirmation or F/C. Pause/menu/revision
changes discard the draft. Raw09-55-42 input evidence preserves the original
cancel/reopen all-in bug as a negative control for the regression test.

The fireplace now uses one shared feature profile in source, shipped and LAN
builds; production no longer silently restores the old shelf layout. For isolated
recording use `/dev/?qa=fireplace&record&stats&look`. This enlarged
back-wall hearth is offset between the center and right-center guests;
the shorter left bar is authored beside it with complete shelf ends. The hearth
has mantel greenery, stockings and layered block flames, pending final visual/performance acceptance.
It includes the Creator Assets CC0 fire recording, starts after a gesture and
stops for pause/mute/hidden views. A quiet HRTF source follows the hearth's world
position and actual camera orientation, including look/inspection; no flat
duplicate playback. See `src/assets/audio/README.md` for provenance.
Source and shipped browser checks confirm the visible fireplace and retained
original controls, action/inspection/pause/restore. LAN live visual parity,
listening quality and measured performance acceptance remain open. The bundled
recording increases the production bundle; this is not a performance sign-off.

Mouse-look: left-drag the scene in normal source or shipped play,
press **R** or the header's **Recenter view** button to face forward, and use
Settings → Mouse-look to turn it off for this session. Inspection temporarily
centers the view; drinks/cigar wait for centering. Menus and pause cancel a
pending request. Hovering never steers the view, and betting controls do not
capture camera drags. This changes no poker rules or hand/prop poses.

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
