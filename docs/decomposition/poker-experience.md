# Poker experience: observed failures → explicit contacts → verified room

## Discoverable website multiplayer — B15–E15 (issue #3)

A: user reports no LAN settings in their browser lobby. Read-only inspection
confirms App has only Take a seat/Return, and actual GET5192 returns the old
Connection test page while current compiled LAN assets implement a3D room.
D: source AND exact-shipped browser previews expose Play with friends in the
lobby. Website-owned admission guidance distinguishes starting a standalone
host from creating its table; guests use its printed private URL then name/code.
No implication that a browser can spawn Node. Existing hosts and saves survive.

| Stage | Produces | Verified by | Why separate | Reality check |
|---|---|---|---|---|
| B15 | Missing-entry/stale-server catalog | Actual source inspection and HTTP5192 old HTML | Code-on-disk is not the serving process | User report plus current process/response |
| C15 | Private host URL contract and website-only boundary | Reject credentials, public destinations, paths/queries/secrets and unsafe protocols | Navigation must not become a scan/proxy or credential handoff | Printed host addresses and explicit synthetic hostile input |
| D15 | Visible lobby entry and Host/Join website flow | Browser-only navigation, explicit startup, preserved solo tab | Extension has no network capability; browser cannot silently start hosting | Existing standalone admission owns name/code/seat |
| E15 | Source/shipped entry and real3D admission | CUA keyboard/links/cancel plus two-viewer gameplay/recovery | Static link tests do not prove multiplayer | Keep browser/LAN/active-host limits visible |

Website navigation carries no seat token, name or room code. Only HTTP loopback
or RFC1918 literal IPv4 host origins are accepted; users paste the exact printed
URL. No DNS guesses or cross-origin health probing. The installed view contains
no network client; a web-only launcher slot is exposed by preview-owned styles.
Do not call the entry complete multiplayer or silently restart old5192. The
later real multi-client and separate-device gates remain required.

## Fictional-chip bank — B14–E14

Implementation checkpoint: C14/D14 and the E14 LAN menu candidate are built.
The recorded scripted bust drives engine/history/conservation tests. Actual
HTTP and filesystem tests cover borrow, restart, duplicate ACK, partial repay
and injected write failure preserving the prior checkpoint without returning a
speculative view. That bank scenario uses an explicitly synthetic private seed;
it is not a browser or Wi-Fi recording. Legacy checkpoint migration preserves
chips with zero debt. Static SSR checks verify disabled offers and fictional
debt disclosure, not confirmation interaction. Full verify147 tests/builds/SDK/
preview pass. Real bank UI/multi-client acceptance and solo integration remain
open. No animations, user saves or active host sessions were changed.

A: pure PokerGame conserves its table total; HostTable persists authenticated
membership and accepted wagers. There is no rebuy. A scripted existing six-seat
all-in hand ended with one12000 stack and five zero stacks; startHand then has
fewer than two funded seats. No completed/busted hand exists in the retained
browser trace corpus, so this new probe is explicitly scripted, not browser use.
D: a busted human can deliberately borrow2000 practice chips between hands,
see debt, repay from winnings between hands, and recover the exact ledger after
reconnect/restart. Neither duplicate commands nor chair replacement mint money
or transfer another person's debt. All original poker privacy/conservation stays.

Product defaults made explicit:2000 matches the starting buy-in; no interest,
cash, purchases or external accounts. Debt is scoped to this room and stable
principal. Leaving does not erase it or give it to the next occupant; ending
the entire room ends its fictional ledger. A bounded outside reserve plus table
chips totals1,000,000, matching the engine's existing numeric ceiling. Repayment
may be partial. At most256 positive-debt identities per room bounds private
checkpoint size; zero debt removes its entry. Hitting a safety limit must show a
reason, never reset the bank. These are implementation defaults, not real loans.

| Stage | Produces | Verified by | Why separate | Reality check |
|---|---|---|---|---|
| B14 | Public scripted bust capture and accounting catalog | Current host runs all-in to settlement; browser absence disclosed | A displayed zero stack is not a new bank authority | Recorded HostTable output, existing real wager corpus |
| C14 | Pure PracticeBank proposals and engine boundary-transfer contracts | Reserve+table conservation, debt sum, partial repayment, failed-command atomicity, restore and hand-history preservation | No renderer mutation or second mutable stack ledger | Recorded settled stacks; corruption/boundaries explicitly injected |
| D14 | Host identity/sequence/checkpoint integration | Real HTTP duplicate/stale/reconnect/crash tests; old checkpoint migration | Chips/debt/receipt must commit together before ACK | Existing actual socket/recovery fixtures plus new recorded bank exchanges |
| E14 | Compact bank controls and full room integration | CUA bust/borrow/repay/reload across clients; solo integration separately accounted | Pure arithmetic cannot prove actionable UI or recovery UX | Actual browser evidence required; current LAN navigation gate remains open |

PracticeBank lives in src/session/bank, consumed only by HostTable once D14 is
connected. It returns a validated next-ledger proposal plus signed table delta;
the engine owns applying a boundary-only transfer. Engine/scene/audio/client
must never import private bank internals. Host validates all before mutating,
then commits engine, bank and accepted command in the same private checkpoint.
No debt identities on wire; own debt/limits and public table amounts suffice.
Solo bank integration must share accounting, not copy the ledger into UI;
its storage migration remains an explicit later integration requirement.

Unknowns: multi-client stale confirmation UX, solo persistence migration,
abandoned-debt display and actual bank-chip
arrival animation. Keep animation art deferred until other features are done.

## Final sequencing correction — features first, animation polish last

The user explicitly requests that once ALL remaining feature work is complete,
we revisit hand animations and all other animations and give them a dedicated
polish pass. The current hand-art pause still applies during multiplayer, bank,
keyboard UI, drinking ownership/intoxication, mouse-look, snow/environment/audio
and remaining non-animation integration. This supersedes any reading that hand
quality was permanently removed from scope. Dealer cancellation is unchanged.

At that final pass: collect fresh actual player/NPC close-ups and motion across
card inspection, exterior glass grips, pickup/sip/return, cigar mouth contact,
dealing/folds/chips and personality beats. Catalog failures before changing
anatomy/coordinates; retain original bad recordings as negative controls. Then
isolated ownership/contact contracts, implementation and source/shipped visual
and performance evidence. Existing mathematical contact tests are not approval
of hand silhouettes or animation quality. Do not revive the rejected dealer.

## LAN room-interaction parity — E13

A: client.js mounts the real PokerRoom, but only exposes inspection/betting.
Room owns tested drink/cigar contact transitions; DrinkMenu and specs already
serve solo. D: LAN players can order the same four block drinks, smoke with S
and sip with D, using the same availability/contact owner and safe keyboard
focus. This does not resume hand art or declare drinking quality accepted.

| Stage | Produces | Verified by | Why separate | Reality check |
|---|---|---|---|---|
| Catalog | Existing UI/Room API inventory and missing LAN controls | Read actual client/index plus retained03-53/04-21 interaction traces | Do not invent a second drink clock or order event ledger | Current LAN markup lacks cigar/drink/menu controls; source screenshots show props |
| Contracts | LAN LeisureControls props and shortcut tests | Static React markup and explicitly synthetic focus/repeat cases | Buttons must not issue wager/network commands or override editing | Existing DrinkMenu semantics and user S/D requests |
| Integration | LAN component wired to Room methods/availability | Build, interaction regressions, source/shipped CUA; LAN CUA remains required | Owner must reject busy/interrupted requests, not UI timeouts | Existing owner tests/recordings; actual LAN browser gate open |

LeisureControls has one runtime consumer, client.js. It may import DrinkMenu and
drink specs, never engine/session authority, fetch, persistence or animation
internals. Client supplies availability and delegates commands to Room. Opening
the drink menu cancels betting drafts; closing returns table focus. Pause/loss,
pending wager, waiting admission, inspection and table menu disable initiation;
existing transitions continue/hold under the same Room clock. No order/smoke/sip
is a wager, consumption event or source of intoxication. Do not add a filter on
button press. Remote human cosmetic events remain a subsequent server-owned
public-event integration contract, not silently faked by this local control UI.

Investigation correction: an initial concern that host-loss left controls live
was disproved by actual scripted HTTP lease expiry. The server already emits
paused=true when hostConnected=false. No host-loss fix is claimed or needed.

Implementation checkpoint: server/client/LeisureControls reuses DrinkMenu/specs;
client delegates requests to Room and listens to availability transitions.
Keyboard handling ignores editing/native controls/repeat/modifiers. Dispatch
rechecks live gating, not stale React props. No new geometry, animation clock,
network command or intoxication. Existing source/shipped extension bytes are
unchanged; LAN compiled assets include the component. TS checks include server
TSX. Three new static markup/synthetic key contracts pass (initial missing-file
red was scaffolding, not a real browser fault), along with full verify136 tests,
both builds, SDK and preview-byte checks. PR currently has no hosted CI checks.

Actual CUA source: water order/sip disables leisure, returns available with
stack2000 unchanged, then call20/inspection/pause/reload restores stack1980/pot180.
Old Fashioned returns on reload as documented; warn/error capture empty. Shipped:
ale order/sip/busy gate observed, but subsequent call timed out and both owned
QA tabs were absent from refreshed browser inventory. Final shipped action/
inspection/reload and console checks remain incomplete for this pass. No
replacement tabs opened to fight that external closure. Session24 manual notes
are not raw recordings/image goldens. Empty5193 was verified410 and exact PID
before graceful replacement with current candidate, preserving its checkpoint
directory; new PID79314. Chrome navigation still ERR_BLOCKED_BY_CLIENT. Active
5192 was untouched. No LAN, Wi-Fi, listening, FPS or Electron acceptance claim.

## Durable multiplayer recovery — B12–E12

### E12 response-ownership substage

A: client.js guards successful envelopes inline, but throws obsolete responses
into an unconditional poll catch. That catch can disable a newly resumed seat.
D: obsolete replies/errors have no UI effects; the latest accepted authority
view owns pause/controls, and switching/forgetting a seat invalidates every old
request, even if the same credential is later resumed. No automatic wager retry.

| Stage | Produces | Verified by | Why separate | Reality check |
|---|---|---|---|---|
| Record/catalog | Public-only envelope metadata for state/pause/resume | Actual isolated HTTP requests; no tokens/cards retained | Observation changes need not change poker revision | Existing server and client inspected; browser gate still open |
| Contracts | ResponseOrder tests before implementation | Actual HTTP envelopes delivered normally and with synthetic reordering | Errors must obey the same owner as views | Delay/seat replacement are injected, not claimed production recordings |
| Implementation | Pure server/client/ResponseOrder module | Epoch, process-generation, observation and obsolete-error tests | Prevent catch/render from re-arbitrating response ownership | Contracts above; single consumer client.js |
| Integration | Client uses owner for every request completion | Full verify, solo source/shipped regression, then actual LAN browser gate | HTTP ordering is not real browser recovery | CUA only; do not bypass Chrome's blocked QA navigation |

Engine/session authority, scene, audio and persistence must not import this
browser-only ordering module. Unknowns remain browser lifecycle/native fetch
cancellation timing and actual multi-tab recovery. Suppressed obsolete requests
are not acknowledged wagers; UI must never invent a receipt or retry them.

Checkpoint: ResponseOrder and client integration now exist. The public-only
lan-response-order.json was captured from an isolated actual HTTP host; it
demonstrates observations1/2/3 while poker revision remains0 across pause/resume.
The first recording attempt omitted the required Origin and failed; it was not
retained as successful behavior. Reordered delivery/restart/seat-reset cases are
explicit injections. Four pre-implementation contracts pass; their initial
missing-module failure was scaffolding, not a reproduced browser fault. Both
fetch/JSON failures and HTTP rejection paths now discard obsolete completions
without setting a newer connection lost. Definitive credential rejection seals
in-flight work; no wager is retried. Single runtime consumer remains client.js.

Full verify133 tests, TypeScript, both builds, SDK and exact-byte preview pass.
CUA source and shipped call20/inspection/pause/reload/return restore stack1980,
pots100/180. Cards/cigar/five opponents/folded backs/bottom-right board inspected;
warning/error captures empty. Browser attachment timeouts recovered by selecting
the existing owned tab. Session23 notes retain these limitations; screenshots
viewed in tool output are not saved goldens. No LAN browser/recovery/Wi-Fi/FPS/
listening/Electron acceptance. Active5192 remains untouched;5193 was empty410.

Latest E12 implementation (supersedes the earlier CLI-gated checkpoint below):
SeatRecovery provides opt-in browser keys, explicit resume/forget and independent
per-seat entries. Denied storage does not throw away a live admission; retry
nonce persists before POST. UI uses names/text and numeric option indices, never
credential values. Synthetic storage tests cover reload/close/denial/multiple
tabs/malformed legacy values; these are not actual browser recovery recordings.

The SQLite OS lease now replaces new PID locks. Both the store-only writer and
the complete actual HTTP host were deliberately SIGKILLed in isolated child
processes; subsequent hosts restore the acknowledged wager/private views and
return duplicate ACK without spending twice. These tests first failed with the
old PID/staging mechanism. Existing disk-fault/permission/ownership tests remain
intact. Legacy locks are preserved/refused. Interrupted regular staging files
are retained under private UUID archive names. Normal CLI now enables private
local checkpoints; --memory-only explicitly requests disposable state. Node22.13
LTS/24+ is recorded in package and lockfile; no added dependency.

Actual LAN-browser acceptance remains open: Chrome again blocks5193. Its old
QA server had no room (410), so only that owned empty server was replaced with
the recovery candidate; active5192 was not touched. The user was asked to open
the isolated QA URL manually; no browser protections were altered. CUA source
initially refused connection because the5191 preview had stopped; absence was
confirmed before restarting npm run dev. Do not confuse these observations with
successful browser recovery, listening, Wi-Fi or performance verification.

Full verification checkpoint:129 tests pass, TypeScript, extension/LAN builds,
2 SDK contracts and exact-byte preview. Source CUA call76, inspection, pause,
reload/return restores hand1/stack1924/pot1224. Shipped call60 restores hand1/
stack1940/pot200. Held props and settled folded backs inspected; captured warn/
error logs empty. Session22 notes are manual observations, not raw LAN recordings
or image goldens. Actual LAN recovery/play, Wi-Fi, listening/FPS and Electron
remain open. The previous interrupted turn changed authoritative code and
produced passing isolated tests: progress, not a wait or a no-progress turn.

E12 client slice contract: keep the current credential tab-scoped, with an
explicit, explained opt-in to remember a seat in this browser. A fresh tab lists
saved names but never automatically claims one; Resume is a deliberate action
with a close-the-old-tab warning. Use one storage entry per seat to avoid two
tabs overwriting a shared credential array. Forget removes only the selected
local key; leaving revokes host ownership before local cleanup. Storage denial
must not strand an admitted player behind an exception. Preserve the admission
nonce before sending so a lost response can be retried after reload. Credentials
never become option values, URLs or diagnostics. `SeatRecovery` is isolated under
server/client and consumed only by client.js; it has no network/engine/renderer
imports. Existing HTTP admission/retry and CUA reload evidence are the substrate;
new storage-denial/closed-tab/cross-tab probes are labeled synthetic until a real
CUA session is captured. Tests precede implementation. Normal CLI stays gated.

E12 ownership revision: the exclusive PID file is a safe refusal, but cannot
provide automatic crash recovery without unsafe stale-lock guessing. Replace
new ownership with a long-lived SQLite EXCLUSIVE transaction used only as an
OS-released lease, not as another poker ledger. The atomic JSON checkpoint
remains the source of truth. Node's built-in sqlite avoids a native package;
supported Node becomes22.13 LTS or24+, and its experimental warning is disclosed.
SQLite locking reference: https://www.sqlite.org/lockingv3.html; Node API/version
reference: https://nodejs.org/api/sqlite.html. One host consumes the lease through
CheckpointStore. A child-process SIGKILL test must demonstrate that a competing
writer is refused while alive and may restore after death. This is deliberate
crash injection, not a production recording. No filesystem lock file is stolen.
Legacy host.lock still refuses startup to protect older running writers. Under
the acquired lease, preserve an interrupted regular table.pending file as a
private uniquely named archive; never promote an unacknowledged partial write.
Unknown directories/symlinks remain errors. Existing disk-fault tests stay intact.

A: `HostTable` owns private state and last accepted command, but `server/http.ts`
loses all of it on close. Client credentials live only in sessionStorage.
D: restarting the explicit host preserves one authoritative six-seat ledger;
returning clients reclaim their own seat and an acknowledged wager never repeats.
This does not migrate or terminate the active memory-only5192 session.

| Stage | Produces | Verified by | Why separate | Reality check |
|---|---|---|---|---|
| B12 | Recovery catalog with restart observation and owner inventory | Scripted loopback restart before/after; retained public wagers | Browser reload success does not imply server recovery | Actual HTTP create/read/close/new host returns200 then410; session20 reload notes |
| C12 | Host-only checkpoint contracts and isolated tests | Replay retained wager/fold recording, recover at each step, duplicate ACK and invalid snapshots | Engine, seat and idempotency state must be one transaction | Existing05-52 recording; new corruption/retry cases explicitly synthetic |
| D12 | Versioned validated checkpoint and private atomic file store | Real temporary filesystem replacement/failure/permissions and ownership tests | Never let renderer or wire API consume a private save | C12 contracts; storage faults are deliberate injection, not observed crashes |
| E12 | Host commit-before-ACK plus explicit client seat recovery | Actual HTTP restart/retry/end, then CUA two-client restart and privacy checks | Disk, response ordering and client lifecycle cannot arbitrate separately | New observed HTTP/browser evidence required; no Wi-Fi inference |

Isolate disk mechanics in `server/persistence/`, consumed only by the host.
Checkpoint methods on HostTable are explicitly private-storage APIs, never DTOs;
Room/client/engine cannot import the store. Validation rejects corruption and
preserves bytes, rather than silently replacing money or identities. Restore
disconnects all members and the host resumes explicitly. End-session persists
an empty tombstone; closing the process is not ending the table. Duplicate wager
fingerprints survive recovery. No credentials/private checkpoints in fixtures,
diagnostics, URLs, Git or public responses.

Unknowns: process-crash lock cleanup versus concurrent writers, disk failure
after replacement, old response arrival across server generations, browser
storage denial and deliberate seat takeover across tabs. Resolve these before
enabling durability in the normal CLI; do not advertise recovery from an
isolated checkpoint test. All tests use temporary directories, never user saves.
Hand art remains paused; dealer canceled. User waived the plan-approval stop.

B12–D12 implementation checkpoint: explicit private export/restore validates
six-seat membership, chip state and canonical last-command fingerprints as one
document. Recovery invalidates live leases and stale intents, without discarding
duplicate ACK identity. The retained nine public wager/fold states replay across
recovery for every viewer. Initial missing-method/module failures were test
scaffolding, not recorded real-world crashes. New corruption/retry tests are
labeled synthetic. No private fixture is retained.

`server/persistence/CheckpointStore.ts` is consumed only by the host. Files use
0600 permissions, exclusive staging, fsync/rename/directory-fsync, bounded reads
and exclusive ownership. A write fault poisons the writer; API responses become
503 without publishing speculative cards/chips. The host's optional
`checkpointDirectory` path passes actual loopback restart/admission/private-view/
retry/end checks in temporary directories. Normal CLI is NOT enabled yet.
Synchronous saves serialize the small authority before ACK; ordinary unchanged
polls do not write. Disk latency remains unmeasured, not performance acceptance.

E12 remains open: interrupted processes can leave `host.lock` or `table.pending`.
These deliberately fail closed rather than stealing a possibly live writer or
deleting uncertain data. Resolve safe operator recovery before normal CLI
integration. Browser credentials are still tab-scoped; implement an explicit
saved-seat recovery choice, storage-denial handling and cross-tab warnings next.
A public process generation now distinguishes reset response counters from
late pre-restart polls; it carries no private checkpoint content. Real browser
restart/order and two-client play remain required, not inferred from HTTP tests.

Full verify:121 tests, TypeScript, extension/LAN builds,2 SDK and exact-byte
preview pass. Source/shipped CUA call, inspection, pause and restore pass with
held props and folded backs visible. Manual session21 notes retain values and
debugger-timeout recovery; screenshots were inspected, not saved as goldens.
Active5192 session remains untouched. No Wi-Fi, FPS, listening or Electron proof.

## Full multiplayer integration — restarted loop, B11–E11

A: `HostTable` and bounded HTTP transport return private-view DTOs, while Room,
Cards and ChipLedger still expect full local GameState. D: the actual3D room
projects only public facts plus the local player's allowed cards, with six
stable authority IDs and a separate symmetric display rotation. Never invent
hidden Card values or cast a viewer DTO back to GameState.

| Stage | Produces | Verified by | Why separate | Reality check |
|---|---|---|---|---|
| B11 | Renderer input catalog and retained public traces | Enumerate deck/seat/hole consumers and missing network evidence | Existing renderer has private-state assumptions invisible in HTTP tests | Actual04-02 folds and05-52 wager/pose recordings; session19 CUA |
| C11 | Presentation snapshot contracts and pre-implementation tests | Recorded balances/folds for all6 rotations; synthetic hidden/queued/showdown/reset cases labeled | Stable authority seats must not become action seat IDs | Retained raw traces unchanged; real HTTP checks remain separate |
| D11 | One RoomProjection boundary consumed by PokerRoom | Renderer/cards/chips use minimal explicit state, no deck or fake faces; duplicate/missed revisions safe | No renderer-local arbitration between local and remote truth | C11 and existing folded-card/chip regressions |
| E11 | Standalone3D website client and compiled asset allowlist | Two CUA clients join/name/play, own-card visibility, relative seats, pause/reconnect; source/shipped regressions | A diagnostic lobby is not the requested experience | Real browser recordings; separate-device test remains separately labeled |

Presentation-only rotations also map actor/button/results and chip accounts;
wire actions continue using authenticated identity, never rotated seat IDs.
RoomProjection alone may import local GameState and the public TableView type;
Cards/Chips/ChipLedger must not import session authority or engine GameState.
An opaque local deal generation preserves reset semantics without copying the
private deck into presentation. Hidden cards are a count, visible cards explicit
values. Waiting joiners cannot inspect the replaced NPC's hand.

Unknowns: network revision gaps versus animation replay, stable avatar identity
across different seat rotations, client asset CSP/bundling, host tab visibility
versus connectivity, persistence and ended-session recovery. Existing renderer
geometry and hand art are not redesigned by this stage. This is the user's
requested boundary change, not permission to weaken recorded fold/chip tests.

D11 implemented: opaque deal generation, explicit card visibility and one
relative-seat projection feed the same Cards/ChipLedger/Room used by solo play.
Four contracts replay recorded public wagers/folds across all6 views and label
new queued/showdown/reset tests synthetic. Existing card/chip assertions were
preserved, with inputs migrated through the real adapter. No fabricated deck or
hole values enter the remote renderer. The initial missing-module failure is
scaffolding, not a reproduced real-world networking bug.

E11 integration candidate: compiled `lan-dist/` is served by an exact flat asset
allowlist. The website creates the actual PokerRoom with viewer-relative actor,
button, chips, cards and identity-stable authored bodies (including seat0).
Shared BettingControls supply legal sizing/keys/confirmation, not a second
client ledger. Network loss disables wagering; hidden tabs retain heartbeat
while rendering sleeps. An injected-clock actual HTTP test completes a hand
through6 distinct clients and checks private card kinds and every visual chip
account. This does not prove browser rendering, latency or Wi-Fi behavior.

Browser acceptance remains open: the isolated new5193 QA tab was blocked by
Chrome (ERR_BLOCKED_BY_CLIENT). The old5192 host has an active session and was
not restarted; user was asked asynchronously whether that disposable session
may be ended. No protection was disabled or alternate automation substituted.
Durable host/client recovery, actual multi-client3D observations and any
remaining interaction/visibility failures must be addressed before moving on
from full multiplayer. A compiled candidate is not production acceptance.

Verification checkpoint: full `npm run verify` passes112 tests, TypeScript,
extension and LAN builds,2 SDK contracts and exact-byte preview. The LAN bundle
is about1.03MB uncompressed/322KB gzip; Vite reports its normal large-chunk warning.
This size is not a frame-rate measurement. CUA source and shipped regressions
both call48, inspect, pause, reload and restore hand1/stack1952/pot126. Held
cards/cigar and settled folded backs visible; captured warn/errors empty.
`session-20-observations.json` retains manual notes, not raw traces/goldens.

## Release scope and priority — continuation17

The user confirms the whole agreed list is the remaining production scope and
asks to start with biggest-impact items. The latest correction removes the
human dealer entirely. Priority: LAN/player identity and relative
seats, fictional bank/rebuys, finish keyboard controls, drinking/exterior glass
contact and actual-sip-only intoxication, then audio/snow/remaining visual and
performance acceptance. This supersedes the previous keyboard-first ordering;
unfinished evidence gates remain open, not discarded. Hand-animation art stays
paused. No automatic merge, public relay, real money or host-repo edits.

24. Restore the previously requested **larger, clearly visible window snow**.
    User says it is still effectively invisible. Existing count84/24Hz/reused
    buffer is a cost boundary, not visibility acceptance. Actual source canvas
   07-03-07-036Z-29.367.png again shows tiny faint specks. Compare same-window
    crops and motion before/after size/contrast changes, keep occlusion by
    mullions and confined aperture, and measure larger-sprite overdraw rather
    than claiming unchanged performance from unchanged point count.

### Rejected experiment — human dealer removed from scope

The user explicitly canceled the dealer after seeing the live candidate:
**the dealer did not work well.** It crowded the middle and stranded/clipped a
guest at the left edge. The source capture at07-11-28-202Z and the user's
screenshot are rejection evidence, not approved visual goldens. Geometric
clearance tests had passed the first candidate but did not establish good
composition; the tighter attempt also failed station/contact contracts.

Remove the presenter, dealer-specific seat/cup positions, static deck and its
experimental departure origin, and experiment-only tests. This is cancellation
of the feature, not weakening failing tests to approve it. Restore Room, Human
and Cards to the committed pre-experiment implementation. Keep all existing
poker/button/card-flight behavior and the six playing seats. Do not reintroduce
a dealer, plan dealer collection, or count dealer acceptance as a release gate.
All older dealer requests in the historical log below are superseded. D5 now
retains only mouse-look; hand-animation work remains paused.

Removal verification: the three experimental source edits revert byte-for-byte
to the committed implementation; production bundles are unchanged after rebuild.
`npm run verify` passes92 tests, TypeScript/build,2 SDK contracts and the exact-
byte production HTTP check. Attempting to reattach the isolated source CUA tab
timed out; no fresh visual or production-browser acceptance is claimed for this
removal. Existing visual/performance gates remain open.

## Continuation18 — LAN authority and private-view boundary first

### Continuation19 transport slice — explicit standalone website host

Implementation checkpoint: D10 exists in `server/http.ts` with exact static
allowlist, private-peer/Host/Origin checks, admission nonce retry, bearer-bound
commands, monotonic response observations, 4KiB bodies and bounded rates/sockets.
`server/client/` is explicitly a disposable connection test, not final game UI.
It exports bounded public metadata, excluding codes/tokens/names/card values;
ended credentials have explicit local cleanup, while transient failures retain
the seat. Four actual HTTP-socket integration tests cover admission/private
views, hostile/malformed requests, action binding/pause/leases/reconnect and
rate bounds. These are scripted loopback clients, not Wi-Fi/browser recordings.

Full verify passes107 tests, TypeScript/build,2 SDK artifact checks and exact
production-byte check. Production bundles and lockfile remain unchanged. E10
is still open: Chrome blocked the new5192 URL with ERR_BLOCKED_BY_CLIENT; no
security setting was changed and no alternate automation was used. Source
regression via CUA passed call20, inspection, pause and reload (hand1, stack1980,
pot90). Screenshot shows five symmetric guests, held cards/cigar and hearth;
console warn/error capture was empty. Images viewed in tool output are not
retained golden fixtures, and this is not animation-quality/FPS acceptance.
Shipped preview also passed call20, inspection, pause and reload after CUA
reattachment: hand1/stack1980/pot100 restored; held cards/cigar visible, no captured
warn/errors. Fireplace remains absent in production by its existing gate.
`session-19-observations.json` retains these manual notes, not fabricated raw data.

A: verified HostTable owns six-seat authority and redacted SessionView; the
installed extension SDK exposes no network listener. D: an explicitly launched
Node host serves a same-origin connection-test lobby and bounded JSON API. Host
creates a table/name and shares a code; other clients enter names/code and see
their own cards only. This is a diagnostic integration surface, not a second
final game UI. Keep `/dev/`, solo saves, extension bundles and host repo intact.

| Stage | Produces | Verified by | Why separate | Reality check |
|---|---|---|---|---|
| B10 | Catalog of existing authority plus bounded public-only HTTP/client observations | No tokens/codes/private cards in diagnostics; missing LAN events labeled unrecorded | Prior solo recordings cannot prove sockets/authentication | D9 actual public wager replay; pinned SDK; new connection-test capture |
| C10 | HTTP admission/auth/lifecycle integration contracts | Real loopback clients, forged origins/hosts, oversized/malformed requests, full seats and retries | Rendering cannot be the authority or privacy filter | Scripted actual HTTP, explicitly not real Wi-Fi or user traffic |
| D10 | `server/` HTTP owner and `server/client/` disposable connection-test UI | Same-origin/token checks, bounded body/rate/socket cost, one HostTable consumer, pause/lease/shutdown | No raw engine snapshots or filesystem/dev-server exposure | C10, then actual CUA host/join/reload |
| E10 | Retained browser diagnostics + two-client observations | Code join, distinct identities/private views, legal actions, host pause/loss and reconnect | Two in-process objects do not verify browser behavior | CUA-created isolated loopback tabs; real separate-device LAN still open |

Use the built-in Node HTTP server (no custom WebSocket framing or dependency)
and serialized500ms client polling; actions remain revision/sequence guarded.
Serve only an exact static file allowlist, not the repo or Vite dev server.
Default bind is loopback. `--lan` is an explicit opt-in private-network launch;
never change firewall/router rules. LAN users first open the printed host URL,
then enter the lobby code. Code-only discovery without a host address is not
implemented; do not imply that a browser can discover arbitrary LAN servers.
Restrict Host/Origin to exact advertised local IP origins, no wildcard CORS,
no tokens in URLs/cookies/logs. Host creation is loopback-only; joining requires
a random code; per-client random bearer tokens bind subsequent requests.
Creation/join retries use a client-held high-entropy nonce to avoid duplicate
seats after a lost response. Bound requests4KiB, rates, connections and timeouts.

Connection-test sessions are memory-only and clearly labeled disposable: host
process exit ends them; never silently mint a replacement on connection error.
Browser reload resumes its token from tab-scoped sessionStorage. After15s without
heartbeat, disconnected guests are bot-controlled; host absence suspends all
advancement until reconnect. Host pause also blocks human wagers. Explicit
leave revokes credentials; the HostTable boundary rule still controls seat reuse.
No real money/bank integration yet. HTTP is unencrypted: trusted private LAN
only, not public hosting or a claim of security against network eavesdroppers.
Authentication, browser behavior and durable hosting acceptance stay separate.
Reference: Node's official HTTP/crypto documentation for server timeouts,
connection cleanup and random credential generation; installed Node22+ remains
the supported baseline, not new APIs specific to the current latest release.

C9/D9 checkpoint: HostTable and the explicit view projection now exist, with
eleven tests. Nine actual public-game records replay unchanged for all six
viewer seats. New admission, hidden-card noninterference, stale/duplicate input,
disconnect, complete-versus-new-deal and side-pot cases are explicitly synthetic.
Tests were authored before implementation; their initial missing-module failure
is not evidence of a reproduced real networking bug. The negative control shows
why serializing an existing full local snapshot is unsafe. No tests weakened.
Default host shuffle uses Web Crypto separately from bot randomness. Production
and solo App do not import this layer; real authentication/transport is still
required before claiming a secure or playable LAN session.

Actual solo regression observations are recorded in
`testing/fixtures/experience/session-18-observations.json` (manual CUA notes,
not a raw trace or image fixture). Source call20/stack1980 and inspection passed
before the capture/pause batch timed out; no new export survived. Production
call76, inspection, pause and reload restored hand1/stack1924/pot1012/Call597;
captured warn/error log was empty. Screenshots were inspected in tool output,
not saved as goldens. No source-restoration, LAN, listening, FPS or Electron claim.

Final continuation18 verification: `npm run verify` passes103 tests,
TypeScript/build,2 SDK artifact checks and exact-byte production preview. The
shipped dist and lockfile are unchanged because the host layer is not imported
by the solo view. Worktree review found no engine/scene/UI mutation.

Next transport constraint, verified against the installed pinned SDK README
(Lifetime and communication): network APIs are not exposed to extensions.
Do not bypass the extension sandbox or patch Agent Code. Implement/test the
website-first host as an explicit standalone process in this repository; keep
extension LAN hosting deferred until a supported API exists. Browser code cannot
open a listening TCP socket. Lobby-code discovery, same-origin client delivery,
authentication, bounded payloads/rate limits, lifecycle and private wire-state
captures need their own staged contract before exposing LAN access. This is an
integration limitation, not a reason to abandon the authorized web game.

A: App currently owns PokerGame, saves full GameState and runs bots/timers; Room
receives that complete state. That is a trusted local pipeline, NOT a network
message. Existing actual05-52 public-action trace supplies a raise500, calls and
folds; it intentionally has no deck/private cards or network admission events.
D: one host owns the engine; exactly six stable seats, humans replace bots,
each authenticated viewer receives only public data and their own private hand.
No dealer. No local-save migration or listener in this first isolated slice.

| Stage | Produces | Verified by | Why separate | Reality check |
|---|---|---|---|---|
| B9 | Existing raw public trace + LAN boundary catalog | Preserve raw hash/order, enumerate actual player/action/phase fields and missing cases | Local full-state rendering must not be mislabeled network-safe | Actual05-52 recorded table; App/GameState inspected; no real LAN recording yet |
| C9 | Explicit client DTO and admission/action contracts in src/session | Test recorded public wager replay for each viewer before implementation; adversarial new scenarios labeled synthetic | Privacy cannot depend on hiding a received card mesh | Actual trace for ledger; injected synthetic hidden cards for noninterference tests |
| D9 | HostTable, private viewer projection and stable seat mapping | Six seats, queued mid-hand joins, authenticated seat binding, stale/duplicate rejection, safe bot takeover, no mutable references or private deck keys | HostTable alone consumes projection; future transport consumes HostTable, never PokerGame snapshots | C9 replay + explicitly synthetic joins/disconnects; no LAN claim |
| E9 | Real transport and multi-client browser integration | Two clients, names, bot substitution, self-relative views, reconnect/host loss and no hidden wire values | In-process tests cannot prove discovery, sockets, rendering or LAN security | Future CUA recordings + captured public protocol metadata; no credentials/private cards recorded |

Safe default for this slice: reserve a free bot seat immediately but grant human
control/private cards only at the next hand. A queued viewer sees no old NPC
hand, including at completed showdown. Disconnected humans keep their reserved
seat; a host bot may act until the same authenticated principal reconnects.
Explicit leave releases to bots at the next boundary, never to another human
mid-hand. Host authority and authentication are distinct: the future transport
must mint unguessable credentials and resolve the principal, not trust a seat
number sent by a client. Revision and per-principal sequence guards prevent
late or duplicated packets from repeating a wager. No automatic retries of a
different action under a previously used sequence number.

Forbid engine/bots/scene/audio from importing session internals. A future single
client adapter will map public seat IDs to display positions without constructing
a fake authoritative GameState; no placeholder card values or remapped engine.
Unknowns remain explicit: code-to-host discovery/browser reachability, transport
authentication/limits/lifecycle, disconnect grace UX, durable session storage,
names in structured action history, real relative-seat rendering, and LAN-host
support in the extension. Do not expose a listener or claim multiplayer complete
from this authority slice. The latest explicit LAN request supersedes historical
no-networking boilerplate; no public relay, firewall edits or host-repo changes.

## Latest addition — NPCs grip glass interiors

23. User reports NPC drinking looks wrong because hands grab from **inside**
    the glass instead of around its outside. Preserve as an explicit drinking
    mechanics acceptance requirement, without restarting the paused hand-art/
    animation pass. This is user-observed, not a newly reproduced agent result.
    Record close-up outside/side views of each distinct vessel during pickup,
    lift, sip and return. Catalog the actual inner/outer wall, contact normals,
    palm/thumb/finger geometry and which coordinate frame owns the vessel.
    Require opposing exterior support (thumb versus palm/fingers), no skin in
    the hollow interior or passing through walls, and continuity at transfers.
    Matching anchors or a connected wrist does not prove the grip is external.
    Revisit ownership/local-axis assumptions before changing poses; retain the
    faulty recording as a negative control, then geometry tests plus actual
    NPC motion/image checks. Do not claim existing grip tests close this report.

## D8 keyboard-first betting — continuation16

Checkpoint: `betting-catalog.json` separates real public-action data from derived
engine bounds and synthetic keys. B8 fresh raw key/focus capture is still missing:
CUA created the isolated tab but DOM requests timed out and screenshot reported
browser unavailable. No substitute browser driver or claimed fake recording.
C8 isolated controller + tests and D8 opt-in `&betkeys` UI are implemented to
continue safe local work; **this is provisional, not completion of B8/E8**.
The sole runtime consumer is BettingControls; production and ordinary source
retain existing controls until real native-focus/repeat/layout checks pass.
Wager dispatch synchronously latches within one revision before React updates,
while App/engine preserve authoritative validation/save locks. Pause/menu and
new revisions discard drafts; text editing and native button Enter/Space are
not commandeered. Final integration must delete the old slider path and gate,
not leave two permanent amount owners. No fresh visual/FPS/listening approval.
`npm run verify` passes92 tests, TypeScript/build,2 SDK contracts and the shipped
HTTP preview check. Those are not source/production browser acceptance; the
browser connection became unavailable during continuation16. No new raw export.

**A:** `PokerGame.legal()/act()` own legal amounts and atomic wagers. Current
`App.tsx` offers F/C, a pointer-opened raise popover, number input and range
slider. Actual05-52-49 trace includes the public raise500 and following folds,
but no raw key/focus events; do not label it a keyboard fixture.
**D:** a compact fully keyboard-operable betting tray, with no required typing
or slider. Choose B to open (R already recenters view); arrows adjust, Shift
coarsens,1–4 choose min/half-pot/pot/all-in, Enter confirms, Esc cancels. Preserve
native Enter/Space on focused buttons, text editing, pause and engine validation.

| Stage | Produces | Verified by | Why separate | Reality check |
|---|---|---|---|---|
| B8 | Opt-in betting input trace + current UI capture | Real CUA key sequence and public state before/after; raw export retained | Don't invent focus/keyboard causality from old action logs | User reports slider/typing pain; existing real public raise trace, fresh browser currently times out |
| C8 | Catalog + isolated `src/interaction/betting/` intent/amount contract | Tests written against real recorded legal states/input where available; new boundaries explicitly synthetic | Draft amount must not mutate engine or reconcile legality in multiple UI places | B8 and actual public history; engine supplies bounds |
| D8 | Keyboard controller consumed only by betting UI, then compact tray | Pure bounds/focus/repeat/cancel tests, rendered labels/pointer parity | App keeps execution/save authority; UI never becomes another ledger | C8, no made-up recorded keystrokes |
| E8 | Source/shipped keyboard-only hand recording, restore check, UI screenshots | B/open, fine/coarse/presets/cancel/confirm, blocked turns, pause/menu, saved balances, no double bets | Mock key events aren't browser focus or visual acceptance | Actual CUA isolated saves; Electron separate |

Forbid engine, bots, scene, audio and networking from importing draft/input
internals. `BettingControls` is the sole runtime consumer; App supplies legal
context and executes emitted intents through existing `perform`/persistence.
Unknowns: native key repeat ordering, focused-button Enter, desktop/browser key
differences, tiny layouts, short-all-in state, focus restoration when draft is
closed by a new revision. Keep synthetic adversarial checks labeled, and don't
ship unsafe focus semantics merely because the browser connection is absent.
The user waived approval stops and requested autonomous implementation.

## Authoritative full-list goal

Current implementation checkpoint:85 tests and full `npm run verify` pass after
the authored shorter bar, festive mantel,128-block layered flames and quiet
HRTF crackle change. Live source includes these; release gating remains pending
actual browser/listening/performance acceptance. User confirmed audible fire,
but agent has not auditioned spatial movement. A read-only native screenshot
showed the user's paused blurred table; do not treat it as art approval or click
their active game. Next take a keyboard-only betting recording in isolated QA,
then isolate the amount/key/focus contracts before replacing the current slider.
The existing goal loop remains active; changing its prompt was rejected by the
tool while active. This section is the durable latest full-list scope and
supersedes old loop boilerplate about no networking/planning-only additions.

User now explicitly says to implement the full updated list as the goal.
This supersedes planning-only restrictions below for LAN/player/bank and
keyboard-first UI. Existing exact non-hand feature list plus additions16–22
are active implementation scope. Network architecture still needs staged
contracts and real verification, not an ad-hoc listener or client-trusted deck.
Use fictional bank chips/debt only; hand-animation work stays paused. No host
repo edits, public cloud service or merge authorization. Current next order:
finish authored hearth/spatial audio, keyboard-first betting, then LAN/identity/
seat projection/bank with real multi-client and privacy evidence, while closing
deliberate-look and drinking/intoxication gates. Preserve completed
folded-card/print work and disclose visual/performance/host limitations honestly.

## New UI backlog — keyboard-first betting redesign

22. Rework the betting interface as a whole, not just the existing slider.
    User reports slider/typed money entry is frustrating and wants all betting
    controllable by keybinds. No pointer-only action and no required numeric
    typing for routine bets. Keep optional accessible pointer controls.
    Design visible key hints, legal bet-size presets, fine/coarse keyboard amount
    adjustments, clear selected amount and call/raise totals, deliberate confirm
    and cancel. Exact keys/layout remain a design step, not silently promised.
    Protect text fields/name entry, prevent held-key repeat from submitting
    multiple wagers, and arbitrate menus, inspection, mouse-look, pause and
    existing game shortcuts. Engine remains the sole source of legal amounts.
    Record current betting flow first, then isolated input/focus contracts and
    real keyboard-only hand-play tests before replacing the UI.

Audio follow-up: user heard the quieter 3D fire and asked for a small increase;
raise ambience bus from.035 to.045 (about2.2dB), retaining distance falloff and
HRTF camera-relative positioning. This is not a request to restore loud flat audio.

## Live visibility correction

### User rejects first fireplace art: authored composition, not clipped shelves

User confirms the crackle is audible and requests location-correct 3D audio.
Replace direct stereo media output with one MediaElementSource → HRTF Panner →
ambience gain → master. Fireplace layout owns emitter coordinates; actual
camera matrix owns listener position/forward/up, including deliberate look and
inspection. No screen-space fake pan or second simultaneous playback path.
Test lifecycle, single graph ownership, coordinate orientation and finite input;
browser listening during head turns remains distinct from synthetic tests.

The actual live screenshot shows straight candle-like flame columns and shelf
ends sliced at the hearth bay. Replace the clipping implementation with an
explicit shorter left-bar design (complete cabinet, counter end, uprights,
bottles and stools); no shelf geometry should ever be generated behind the
hearth. Preserve the original room plan as the recorded baseline, not the
candidate's sliced furniture as a golden. Keep the user's enlarged offset bay.

Re-author hearth materials/details: darker varied masonry and timber mantel,
block evergreen, stockings and steady small festive lights; avoid the bright
flat chimney slab. Replace six rigid flame columns with connected tapered
block tongues, independently rising/leaning cores, ember bed and a few bounded
embers in a single instanced batch. Fixed capacity, no alpha particles or new
shadow passes, pause/reduced-motion stability. Test allocations/clearance and
inspect actual frames before claiming better art. CC0 recording is already
downloaded locally; actual audible playback/loop/mix remains an honest open gate.

The user reports no fireplace on ordinary `/dev/`. Code confirms the reason:
both hearth and audio required `&fireplace`. Expose this candidate throughout
source development, without touching saves; production stays gated. Older
source-opt-in checkpoint notes describe the earlier state, not current access.
This visibility fix is not a claim that final framing/listening has passed.

Read-only native CUA screenshot of the user's ordinary `/dev/` after HMR now
confirms the enlarged opening and flames are visible between center and
right-center guests, with intact tree and left bar. No user-table clicks or
save edits were performed for this check. Image was observed in the tool output,
not exported as a golden fixture; current flame art remains an initial block
candidate and audio listening/production verification remain unfinished.

## New feature backlog — LAN table, player identity and practice-chip bank

User explicitly requested these additions to the feature list, not immediate
network implementation. This supersedes the historical *planned scope*
restriction against networking; the current shipped game remains local-only.
Do not start a LAN listener, change host/firewall permissions or add external
services merely because this backlog is recorded. Hands remain paused.

16. **Host/join LAN session:** create a table on the local network, show a lobby
    code, and let another user enter that code to join. No public matchmaking,
    cloud account or Internet relay requested. Transport, code-to-host discovery,
    browser/extension runtime support and host lifecycle need staged design.
17. **Always six playing seats:** humans replace NPC occupants; bots fill all
    remaining seats. No extra seventh player or human dealer. Define
    full-lobby rejection,
    disconnect/reconnect and safe bot takeover before implementation.
18. **Name entry:** enter a display name when entering the lobby; show the right
    name on that player's seat for everyone. Treat names as untrusted plain text,
    with length limits, never markup or identity/authentication secrets.
19. **Player character model:** author a model representing each human player,
    visible to the other participants. Preserve the self-authored block style.
    This does not resume the explicitly paused hand-animation pass or imply
    custom avatar uploads/editor work.
20. **Personal first-person seat:** every client sees themselves at the existing
    local player location. Rotate/remap other players and NPCs for that client's
    view; users need not choose a camera seat. Stable authoritative seat IDs,
    turn order, dealer button, balances and card ownership must remain unchanged
    beneath this presentation mapping. Never rotate the engine itself or expose
    an opponent's private cards because their display slot becomes zero.
21. **Practice-chip bank:** when out of chips, request a rebuy and record chips
    owed to the bank. Interpretation: fictional chips and fictional debt only;
    no real-money payments, lending or purchases. Rebuy amounts, limits,
    repayment and persistence are unresolved product rules, not silently chosen.

### Required decomposition before implementation

- Record the current local lobby/start/restore/bust/rebuy behavior; catalog
  differences rather than claiming multiplayer already works.
- Isolate contracts for stable player/seat identity, per-client seat projection,
  redacted state delivery, host-owned actions, session admission and an explicit
  bank ledger. Add deterministic fixtures for duplicates, stale actions,
  reconnects, full tables, mid-hand joins and name validation.
- Proposed safety rule to evaluate: stage a human-for-bot substitution at a safe
  hand boundary so joining cannot reveal an in-progress NPC hand. Joining must
  not duplicate bankrolls or retroactively change who made a wager.
- One authoritative host owns deck, engine and chip/debt transactions. Clients
  submit validated intentions, not mutable game snapshots. Existing bot privacy
  alone is insufficient for network privacy: send each client only public data
  and its own private cards; never send the full deck to hide it in UI.
- Bank issuance must be explicit accounting (table chips, outside reserve and
  debt), not a rendering adjustment or a relaxation of within-hand conservation.
  Exactly-once rebuy IDs and reconnect/save behavior require tests.
- Implement isolated units before connecting LAN transport; test at least two
  real clients plus NPCs, client-relative seating, concealed hands, host loss,
  reconnect and rebuys. Actual LAN/browser/host evidence is distinct from mocks.

These are additive future stages after the current confirmed list; they do not
erase fireplace/audio, mouse-look, folded-card, lettering or drinking/
actual-sip-only intoxication requirements. No multiplayer/bank work is complete.

## D4 fireplace geometry checkpoint — continuation 15

**Latest user correction supersedes both placements below:** enlarge the hearth
and offset it between the center and right-center guests. Candidate is now 2.21m
wide, centered at back-wall x=1.4 (right of center); shared bay bounds
drive both masonry placement and bar clipping. The actual native-CUA centered
preview showed the central opponent hiding the fire, confirming why mere
collision clearance is insufficient. No hand animation changes.

Creator Assets' YouTube fireplace loop is now acquired from its official
download endpoint. CC0 provenance and byte checksum live beside the MP3.
Source-only candidate playback uses one gesture-unlocked streaming media
element, pause/mute/focus gates and explicit disposal. Lifecycle tests are
synthetic; listening quality and shipped playback are not yet verified.

Final automated checkpoint: `npm run verify` passes83 tests, TypeScript/build,
two SDK packaging checks and exact-byte HTTP preview. Fresh browser checks did
not reach production: extension connection failed, and native QA was interrupted
when focus returned to the user's ordinary game. Do not operate that tab. The
earlier centered source view and hand entry were observed in CUA only, not
exported as new golden files. No proof of actual drag, latest offset visibility,
audio quality, seamless loop or FPS improvement. Continue those gates,
drinking/intoxication and chip audio; do not resume paused hand-animation work.

**User correction:** the hearth must be centered on the main back wall behind
the center guest, not in the side bay. Supersedes the placement below. Split
the back bar/counter/shelves around a 1.64m central bay; preserve the original
recorded plan as a negative control showing the intersections a simple move
would create. Test the derived production plan and unchanged outer furniture,
and retain actual visual acceptance as open. User requests YouTube fire audio;
verify an explicit reuse license and bundle locally with provenance before use.

Hands remain paused. CUA cannot reconnect to the owned camera QA tab, so the
mouse-look candidate stays development-only. Continue the independently
testable fireplace slice, without treating geometry tests as visual approval.

- Recording/catalog: reuse the actual 03-21-27 room-block capture and corrected
  04-36-26 decor capture. They establish the existing room, not a fire recording.
  The left rear bay is empty; do not move furniture to make a fireplace fit.
- Isolated contract: author a side-facing block hearth in that bay, test its
  complete rendered bounds against those recorded obstacles and oriented
  chairs, including positive clearance except intentional floor support.
  Test stable geometry/material allocation, bounded flame updates, reduced
  motion, no shadow light, and deterministic pause via the room visual clock.
- Implementation: one vertex-colored masonry/log batch, one instanced opaque
  block-flame batch, one bounded warm point light. No particle sprites, runtime
  assets, wall-clock timers, hand edits or poker-state access. New light cost
  is explicit; no claim of improved frame rate.
- Integration: initially source-only `&fireplace`, with recorder bounds and
  counts. Inspect seated/mouse-look/inspection views, source and production,
  and capture measured costs before enabling by default. Licensed fire audio
  remains its own unfinished asset/provenance/listening gate.

## Current user scope — supersedes older goal-loop boilerplate

The user explicitly narrowed active work to this exact list. Keep older sections
as evidence/history, not permission to resume their omitted work:

1. Stop hand-animation work; focus on the other features.
2. Folded NPC cards land face-down on the table and remain visible.
3. Fix low-resolution chip lettering.
4. Canceled: human dealer did not work well; removed from plan and game.
5. Deliberate mouse-look, with performance efficiency.
10. Intoxication only after actually drinking, never ordering/selecting.
11. Proper player/NPC drinking mechanics without resuming hand-animation work.
12. Add a tavern fireplace.
13. Excellent natural fire crackling using licensed recordings.
14. Satisfying realistic chip audio.
15. Include these in staged decomposition and implement autonomously.

Numbering intentionally preserves the user's list; missing numbers are not
inferred requirements. Board placement, snow and general lighting additions
are not active new tasks here. Preserve already-working features. Fireplace
lighting may support its own presentation, not reopen an unrelated room pass.
The existing engine/privacy, save safety, testing, committed bundles and no-merge
constraints remain in force. Hand/contact art is deferred, not approved.

Status: Stage B baseline captured; C/D1 hero ownership/connected reach implemented
and replayed through actual production bones. Fresh source recording confirms
bounded reach and safe interrupted return. D2 block props and safe ordering are
implemented/browser-checked; D3 decor clearances and warm-room candidate are
verified against production geometry and seated/wide browser views. Grip and
character art, transition ownership and final quality/performance remain open.
The September 20 scope addition below makes NPC/player drinking, cigar-to-lip
contact, an optional intoxication filter, a fireplace and high-quality fire/chip
audio explicit unfinished acceptance gates.
Latest feedback also reopens overall hand naturalness and requests a dedicated
deliberate mouse-look and readable chip/table lettering (D5/D6); dealer canceled.
Scope: issue #1, `feat/voxel-poker`. Anatomy/Christmas art remains provisional,
not an accepted visual baseline. No automatic merge.

Method: Julius explicitly requested `Juliusolsson05/staged-decomposition`, read at
`001b71068cc975b038fb780a367103a8f3f19fa8`. This repository is below its normal
LOC threshold; applying it is intentional because the user requested it and the
repeated contact/appearance patches have not produced a coherent experience.
The user explicitly requested plans followed by autonomous implementation, so
the skill's approval pause is waived, not its evidence or stage boundaries.

## A — concrete starting point

`src/engine/` and its existing rule tests provide the ledger/legal-action source
of truth. `src/scene/Table.ts` provides the current felt geometry. Neither implies
that the room, contacts, motion or appearance is correct. Engine output remains
read-only to graphics; bots never receive another player's private cards.

`FirstPerson.ts`, `Human.ts`, `Arm.ts`, `Drinks.ts`, `Christmas.ts` and `Room.ts`
are the current observable implementation, not trusted geometry contracts.
The user reports detached/unbounded drink reaches, tree/furniture intersections,
uncozy lighting, poor moustaches, missing ordering and an inadequate ashtray.
Earlier real browser inspection exposed paper penetration and elbow gaps.
`tests/anatomy.test.ts` checks some geometry but does not establish visual quality.
The old forearm test may now inspect empty Bone groups: audit it rather than
counting its green result as proof. No final source/production visual or FPS
acceptance exists for the current uncommitted implementation.

## D — observable destination

A seated player can play legal poker, privately inspect cards, order a free
practice drink, reach/grip/sip/return it, and smoke/rest a cigar in a real recessed
ashtray. Arms remain connected, fingers contact rather than pierce props, props
have one owner, and pause/inspection/frame gaps do not duplicate or strand them.
Opponents have connected believable poses, restrained facial hair and private
cards. Drinks, garnish and smoking props are locally authored fine block forms.
The cozy Christmas room has clear furniture/wall separation, warm readable faces
and cards, restrained snow, stable trim and a visible block-built fireplace.
Natural fire crackle and tactile chip sounds complement rather than overwhelm
the room. The game keeps its unobtrusive UI.

Acceptance includes recorded before/after close-ups and seated motion, meaningful
fixture-driven integration tests, measured frame-time/resource comparisons at
the same viewport/quality, full `npm run verify`, and source AND production
browser checks. No claim of perfect art, target FPS or Electron-host verification
without evidence. No paid drinks, real money, assets downloaded at runtime or
changes to the Agent Code host.

## B — record the substrate before changing it

- **Produces:** `src/scene/diagnostics/` opt-in bounded recorder, dev export UI,
  `testing/fixtures/experience/` raw session traces and a provenance manifest.
  Each trace records input kind/order/time, visual clock, pause/inspection/action,
  camera and relevant world transforms, prop parents, viewport/render settings,
  frame timings/draw counts/triangles and errors. No deck or opponent hole cards.
  Four-view production-rig inspector and normal seated screenshots are paired
  with time/subject/action labels; capture a real reach before any replacement.
- **Verified by:** record a genuine browser interaction, export and inspect the
  raw artifact, correlate key events/poses with screenshots, prove recording is
  bounded and absent by default. Synthetic diagnostic unit tests validate the
  recorder, not the game's quality. Preserve the original trace verbatim.
- **Why separate:** changing the animation before capture destroys the failing
  sequence; guesses about world/camera coordinates then become their own tests.
- **Reality check:** the user's named failures plus actual browser sessions of
  D/S/Space, pause and normal betting. Record frequency and missed observations;
  do not label a scripted mathematical sweep as a human/session recording.

## C — catalog observed cases and fix the contracts

- **Produces:** `testing/fixtures/experience/catalog.json` mapping each observed
  case to trace/frame/image evidence, expected semantics, frequency and status;
  `src/scene/interactions/contracts.ts` and `src/scene/environment/layout.ts`
  defining frames, anchors, room envelopes and contact tolerances.
- **Verified by:** every catalog entry resolves to raw evidence; transform chains
  reproduce the recorded failures without rendering; room bounds are checked
  against production geometry, not independently invented rectangles.
- **Why separate:** a wrist solver cannot correct a drink defined in the wrong
  coordinate frame, and a tree transform cannot correct an unknown bar volume.
- **Reality check:** derive coordinate ranges, reach failures and placement
  overlaps from B. Human semantics already supplied: connected arms, no clipping,
  private cards, block props, cozy room, compact UI. Ordering is cosmetic/free
  and cannot debit the poker ledger. Flag genuinely new product choices instead
  of silently inventing them; user need not approve routine engineering choices.

## D1 — isolate and replace interaction ownership

- **Produces:** `src/scene/interactions/` deterministic pose/ownership sampler
  with explicit input/output snapshots, recorded failing regression tests, and a
  single production consumer `src/scene/InteractionDirector.ts`. One owner
  reconciles actions, pause, inspection, camera changes and prop attachment.
- **Verified by:** tests written from B/C fail on the recorded broken reach,
  then pass with bounded reach, continuous contacts, one prop owner and stable
  pause/cancellation. Direct seeking and skipped frames cannot miss transfers.
  Negative controls must detect deliberately detached wrists/duplicate props.
- **Why separate:** `FirstPerson` and `Human` currently improvise trajectories,
  reparenting and grip offsets. More branches there would retain the wrong
  ownership substrate even if one screenshot improved.
- **Reality check:** replay every captured problematic sequence, then record a
  fresh browser run to ensure replay has not concealed integration differences.

## D2 — block assets, ordering and connected characters

- **Produces:** reusable `src/scene/props/` block asset factories with measured
  grip/rim/rest anchors; Old Fashioned/beer/wine/water menu; recessed ashtray with
  cigar rest; corrected production hands, sleeves and restrained facial hair.
- **Verified by:** recorded ordering/sip/return integration sequences; actual
  production meshes in neutral four-view AND seated tavern captures; bounds,
  contact and mesh-budget checks supplement visual judgment. Menu does not
  obscure betting, debit chips, steal shortcuts from text inputs or create a
  second glass during a sip. Dispose replaced GPU resources.
- **Why separate:** art detail must consume correct contact anchors, not conceal
  an ownership bug. Material/mesh changes must be profiled independently.
- **Reality check:** before/after the same captured grip and face frames. Keep
  evidence of remaining anatomical defects; green math tests are not signoff.

## D3 — cozy spatially valid environment

Reopened by September 20 user feedback: the current snow is too faint and the
room still needs warmer, softer glow. Existing geometry-clearance approval is
not cozy-lighting approval. Baseline image `04-36-26-293Z-15.305.png` shows the
window flakes as tiny faint specks; current material uses size .010/opacity .40,
84 points, one draw and cached 24Hz uploads. Increase apparent flake size and
controlled contrast first, not particle count; retain aperture clipping, buffer
reuse and reduced-motion freeze. Compare seated motion and same-window crops
at matched viewport/exposure, with actual frame timings. Do not claim constant
GPU cost merely because count/draws remain fixed: larger sprites add overdraw.

For warmth, record the existing exposure/practical settings, then introduce
motivated amber fireplace/string-light bounce and soft source-local glow. Avoid
an indiscriminate orange screen tint, overexposed skin, luminous cards, flickery
bulbs or additional shadow maps. Match seated and wide views, inspect paper,
faces, dark corners and metal trim, and measure the rendering delta. The
fireplace's lighting belongs to this shared budget, not a second independent
lighting system. Final snow visibility and cozy glow remain open acceptance
gates until fresh visual evidence, not just numerical color changes, passes.

- **Produces:** shared room/furniture/decor placement data, non-intersecting tree
  and presents, coherent warm lighting/material settings, bounded exterior snow.
- **Verified by:** production geometry clearance tests against wall/bar/chair
  envelopes; seated and wide environment images; moving camera check for gold
  trim flicker; readable non-blooming cards and faces. Freeze comparable views.
- **Why separate:** tree placement and light balance need room-level envelopes
  and exposures, not arbitrary local offsets added inside a prop builder.
- **Reality check:** B's intersections and images, not an idealized empty room.
  Light changes reviewed on the actual player view and at close contact views.

## D4 — drinking/smoking contact, intoxication, fireplace and tactile audio (September 20)

### Small HUD slice — always-visible community cards

The user additionally requests table cards always visible in the right corner.
Current `App.tsx` hides its five-card board behind `boardOpen` and the “Inspect
community cards” button; selecting Drinks closes it. This observable UI contract
is the baseline, not an engine defect. Replace that toggle with a persistent,
compact bottom-right public board during every active/saved hand, including pause
and inspection. Keep undealt placeholders, street labels and accessible card
names. The component accepts only the public board, never player/deck objects.
Render-state tests cover preflop/flop/turn/river/reset without inventing cards;
actual narrow/wide browser checks must establish no overlap with the drink
menu, action controls or private cards. Dialogs may cover the room; the board
must not intercept gameplay pointers or create a new bottom dashboard.

This is required scope, not a polish wish list. The user reports NPC drinking
still looks broken and explicitly requests a fireplace, convincing downloaded
fire crackle and satisfying chip sounds. Existing held-contact geometry tests
do not approve a reach/sip/return sequence. `Human.ts` still schedules sips with
mutable history, and `audio.ts` currently substitutes short pitched oscillators
for chips: neither is accepted as the finished experience. The subsequent user
report adds an incorrectly angled cigar that never touches the player's lips,
inadequate player drinking mechanics, and a requested intoxication filter when
drinking. Existing reach/grip tests do not establish either mouth contact.

### B4 — capture these specific starting conditions

- **Produces:** real seated and rig close-up motion recordings covering each of
  the five NPCs reaching, lifting, sipping and returning; glass/wrist/elbow/
  shoulder/mouth world transforms, ownership and visibility alongside pause,
  reduced-motion changes, folding/dealing and long frame gaps. Capture both
  entry/exit transitions, not only the attractive held pose. Preserve the
  current unnatural cardless-hand pose as a separate observation.
- **Player contact baseline:** record complete cigar pickup/puff/return and
  drink reach/lift/sip/return in seated and side-on diagnostic views, including
  interrupted and paused phases. Capture the actual cigar's mouth-end and axis,
  ember end, glass rim, mouth/lip frame and hand transforms. Catalog direction
  error, separation, penetration and missed contact separately; a camera near
  plane is not an anatomical mouth anchor. Preserve the user's reported failure
  as unverified until a real recording confirms its measurable shape.
- **Audio baseline:** capture/listen to current chip actions after a genuine
  user gesture; record trigger time versus visible chip arrival, overlapping
  bot actions, pause/mute/hidden/reload behavior. Record sample format, capture
  route and listening judgment. A screenshot or mocked AudioContext is not
  evidence of audible quality; an unavailable audio capture remains an open gate.
- **Environment baseline:** retain seated and wide views and production room
  bounds before choosing a hearth location. Do not assume an empty wall or
  move existing furniture until its real occupied volumes have been checked.
- **Verified by:** immutable raw files plus provenance, reproducible UI steps
  and a catalog separating each observed defect from an untested suspicion.

### C4 — explicit motion, spatial and audio contracts

- **NPC ownership:** consume one deterministic interaction snapshot for both
  arm and vessel. Table/rest, hand-held and returned are exclusive owners;
  targets share a seat-to-world transform. Capture-derived limits govern reach,
  elbow clearance, rim-to-mouth placement and pose continuity. Specify pause,
  reduced-motion and canceled/late-frame behavior before replacing scheduling.
  A prop must never teleport while visible, duplicate, detach or expose cards.
- **Player smoking/drinking:** define one player mouth frame consistently with
  the first-person shoulder/head frame. The cigar mouth-end approaches the lips,
  ember points outward and remains away from skin; the hand's grip is derived
  from that resolved prop pose, not a separately guessed rotation. The glass
  rim reaches the lips before a sip counts; tilt is bounded and liquid remains
  contained. Contact and orientation tolerances come from actual dimensions.
  In a stable sip/puff interval, mouth contact, supporting hand contact and
  bounded shoulder/elbow reach must all hold simultaneously. If infeasible,
  revisit pose/anchor placement rather than stretch limbs or hide clipping.
  Pause, inspection and cancellation preserve single ownership and a safe
  return; restarting must not double-count the same completed sip.
- **Intoxication:** cosmetic-only, optional, gradual and capped, driven by
  explicit completed-sip events from the PLAYER'S drink owner, never by NPC
  drinking, ordering/selecting a drink, merely holding it, key presses,
  held duration or animation frames. Old Fashioned/ale/wine contribute; water
  does not. Interrupted pre-contact reaches do not count. Decide the visual
  decay/reset contract and document it before implementing; never portray it
  as real blood-alcohol simulation. A reversible mild vignette/color/focus
  treatment may build over successive sips without obscuring cards, bets or
  menus. Do not start with camera roll, double vision, strong blur or flashing.
  Reduced-motion and a separate intensity/off control must support a steady,
  readable view, including disabling it while active. No changes to odds,
  legal actions, bot knowledge, input latency, chips or betting judgment prompts.
  Freeze the effect clock on pause/hidden alongside interaction time. The
  effect consumes public cosmetic sip events, not engine state or private cards.
- **Hearth:** one shared layout envelope owns surround, opening, fire/logs and
  mantle. Test production bounds against walls, bar, furniture, Christmas tree,
  gifts and character reach envelopes; intentional mounting against a wall is
  distinct from protruding through it. Keep the fireplace visible from the
  normal seated camera without adding an obstructive foreground object.
- **Audio:** a cosmetic public-event adapter is the sole gameplay consumer;
  sound cannot mutate the ledger or inspect private cards. Separate chip/card
  effects from ambience gains, preserve global mute, and unlock only through a
  genuine gesture. Deduplicate event IDs; synchronize chip contact sound to
  rendered arrival, never to every animation frame. Bound voices and decoded
  buffers, suspend ambience when paused/hidden, and dispose all nodes on exit.
- **Asset policy:** the user authorizes web audio acquisition only. Prefer CC0;
  otherwise require explicit redistribution/derivative permission compatible
  with this shipped extension, with no account/payment needed. Record original
  URL, author, exact license URL/text, access date, original hash and edits in
  an audio asset manifest; retain required attribution. No ripped video/music,
  ambiguous-license downloads, imported characters or runtime fetching. Bundle
  the licensed audio locally and verify the exact production artifact includes
  it. This is a narrow exception to the earlier all-self-authored asset policy.
- **Verified by:** fixture-derived contract tests with deliberately detached
  wrists, duplicated sounds/props and bad hearth placement as negative controls.
  Synthetic boundary tests supplement, not replace, recorded failures.

### D4 implementation — prove one instance before expanding

1. Fix the player's lip-aligned cigar and full drink sequence, then one NPC's
   full recorded drinking sequence through isolated interaction
   ownership, then apply the verified sampler to every seat and drink. Review
   elbow/sleeve silhouettes and mouth contact in motion from the player's eye.
   Verify approach, stable contact and withdrawal, including cigar orientation
   in side views and glass rim/face separation through tilt, before more detail.
2. Build the block hearth and logs from the verified room plan. Use a bounded,
   low-cost flame/ember treatment and motivated warm light; retain readable
   matte cards, no strobing or added expensive shadow owner. Reduced motion
   uses a calm fire state. Profile with the hearth off/on at the same camera.
3. Audition licensed fire and chip recordings. Fire needs a seamless quiet bed
   with sparse varied crackles, not a conspicuous short repeated loop. Chips
   need distinct light contact, stack/set-down and pot-gather textures, bounded
   variation and believable weight; no piercing tones, constant clatter or
   casino reward fanfare. “Satisfying” means tactile feedback, not manipulative
   reward timing. Handle decoding failure gracefully with silent play available.
4. Isolate audio scheduling/mixing from asset loading and scene presentation.
   Expose compact effects/ambience controls, persist preferences safely, and
   confirm a mute cannot be undone by late decode/resume or tab restoration.
5. Implement the isolated completed-sip effect accumulator and cheap visual
   treatment only after drinking contact/ownership passes. Deduplicate sip IDs,
   clamp intensity, honor off/reduced-motion and use a documented decay/reset
   rule. Compare sober/mid/capped/off views at the same pose; profile its actual
   rendering cost rather than add an unmeasured full-resolution blur chain.

### E4 — integration and perceptual acceptance

- Replay recorded NPC transitions through actual production bones and inspect
  fresh motion for all five seats: attached joints, supported vessel, sensible
  elbow path, clear table/chair/face, uninterrupted private-card concealment.
- Replay player cigar/drink recordings with actual mesh anchors and negative
  controls for a reversed cigar, absent lip contact and duplicated sip events.
  Retain seated plus side close-ups and real motion showing mouth contact
  without face/hand penetration. Test all drink types, successful/canceled sips,
  pause/inspection/hidden transitions, effect cap/decay/off/reduced-motion and
  repeat restoration. Verify readable private cards and action amounts in
  sober, intermediate and capped-effect screenshots. Synthetic effect-state
  tests alone are not approval of comfort, drinking motion or mouth contact.
- Retain seated/wide fireplace images, actual geometry clearance results and
  same-device before/after frame/resource measurements. Budget flame geometry,
  lights, voices and audio bytes explicitly after measuring the first instance.
- Listen to repeated chips, simultaneous actions and at least two fire-loop
  boundaries; record whether seams, clipping, harsh transients or repetition
  remain. Digital peak/loop-boundary analysis is additional evidence, not a
  replacement for listening. Distinguish actual output capture from source-file
  analysis and do not label an unlistened mix approved.
- Test gesture unlock, mute/unmute, independent gains, pause, hidden/resume,
  reduced motion, decode failure and repeated mount/dispose. No duplicate chip
  cue after save restoration and no leaked nodes/background playback.
- Run `npm run verify` and source plus shipped preview flows. Confirm packaged
  assets load without external requests, licenses/attribution ship, and saves,
  engine conservation and private cards remain unchanged. Electron remains a
  separately disclosed check. These gates stay open until recorded evidence
  exists; adding this plan does not claim any implementation or audio approval.

## E — profile, regress and ship the same verified view

- **Produces:** `testing/fixtures/experience/verification.json` with measured
  baseline/candidate frame distributions, draw/triangle/resource counts,
  viewport/device/quality, screenshots and per-case outcomes; updated controls
  docs and committed `dist/`; coherent commits and fully verified PR (no merge).
- **Verified by:** same-device comparisons with warmup and active/idle/hidden
  phases; no unbounded allocations or background render loop; target smooth
  60 Hz on the current machine, report actual p50/p95 rather than promise it.
  Run full verification and actual `/dev/` + `/dev/?production` enter/action/
  inspect/drink/cigar/pause/reload flows. Verify private cards remain private.
- **Why separate:** fewer draw calls alone do not prove smoothness, nor does
  source HMR prove that the committed install artifact is correct.
- **Reality check:** fresh recordings after fixes; keep baseline failures for
  regression. If browser access is temporarily unavailable, continue independent
  work but leave browser gates open rather than manufacture evidence.

## Isolation/import rules

The difficult part is arbitration of transforms, contacts and ownership, not
mesh construction. `interactions/` may depend on math and its own contracts; it
must not import React, engine state, host APIs, DOM, clocks, `Human`, `Room` or
`FirstPerson`. Only `InteractionDirector` imports its runtime API in production;
tests/diagnostics may consume immutable snapshots. Mesh presenters accept one
resolved pose and do not re-arbitrate it. Engine code must not import any scene
module. A structural test enforces these edges. Shared props expose anchors,
not animation policy. The environment layout owns placement envelopes; the
room consumes them instead of duplicating dimensions.

## Unknowns to resolve, not bury

- Actual drink/cigar contact separation and frame-discontinuity magnitudes;
  camera-relative sleeve reach versus a real shoulder-based arm.
- Which interruption sequences fail in practice and how frequently; whether
  inspection should finish returning a held drink or briefly defer inspection.
- Exact production furniture/tree overlap and safe alternative visible location.
- Current GPU versus CPU bottleneck, startup cost and hidden-tab resource use;
  greedy meshing has not yet been measured in the running browser.
- Whether card support, glass wrap and moustache silhouettes remain wrong when
  viewed from the player camera despite the existing geometry tests.
- Browser automation connection availability and clean source/production parity.

## Fixture provenance and stage gate

Stage B creates real recordings through the preview, using isolated `?qa=` saves
so the user's ongoing poker game is untouched. Store raw JSON unedited and pair
screenshots with capture IDs/timestamps; annotate separately. Exclude private
opponent cards and unrelated browsing data. Never replace these with imagined
inputs. Synthetic parameter sweeps are additional mathematical checks and must
be labeled as such. Never weaken a real failing regression to obtain green.

At every stage: verify the named artifact independently, update this status and
issue #1, then proceed. If evidence invalidates the decomposition, revise this
document before more implementation. The goal loop remains active through
unfinished gates; a finite continuation limit is not completion.

### Stage B evidence, 2026-09-20

Two actual isolated Chrome sessions are preserved losslessly in
`testing/fixtures/experience/`, alongside six seated images and three neutral
four-view captures. `manifest.json` describes provenance/measurement limitations;
`catalog.json` maps observed failures to these artifacts. The first session has
1,122 frame samples and 500 pose samples, two accepted drinks, pause/resume,
inspection cancellation, cigar rejection during camera settling, a successful
cigar action and poker betting transitions. No console warnings/errors were
observed in this source session. This is not production acceptance.

Notably, hand/glass contact anchors already coincide numerically during sipping,
but the hero wrist still reaches 1.99m from the camera with no shoulder-based
arm. The next contract must constrain reach/body attachment, not merely anchor
equality. Tree metadata reproduces seven conservative bar-envelope overlaps.
Measured frame p50/p95 is 36/56ms in the instrumented interaction session, not a
controlled benchmark. Recorded facial hair is a floating U-shaped slab. None of
these defects is closed by the recorder or the currently passing math tests.

Stage-B verification exposed a preview substrate defect before the next stage:
`/dev/?production` has no Old Fashioned control although the freshly built
`dist/view.js` contains it, and Chrome warns about multiple Three.js instances.
The adapter eagerly imports source before conditionally importing the production
bundle; Vite's transformed `dist/view.js?import` response is stale. Repair the
preview isolation before treating any production browser run as evidence. Serve
the exact current dist bytes through a dev-only, no-cache flat JS-only endpoint,
and dynamically import only the selected source OR production entry. Verify
byte identity plus visible controls and absence of the duplicate-Three warning.
The browser additionally exposed the SDK's relative shared runtime chunk; the
endpoint and integration test must cover every emitted JS artifact, not only
the entry. No arbitrary paths, nested paths or non-JS files are served there.

### C/D1 implementation slice: hero leisure ownership

Work per recorded case, with the hero drink/cigar sequence first. The recorded
camera z=2.02 places the eyes almost a metre behind the table edge, so a normal
arm cannot reach the existing drink/tray. The candidate calibration moves the
seated eye to z=1.50, establishes a world-space shoulder frame, and moves both
props to the near felt within a 0.57m arm chain. This is a physical-layout
correction, not a longer stretchy arm. Verify the new player view before final
acceptance. Environment tree/bar contracts remain a separate C/D3 slice.

First produce and replay an isolated director without mesh dependencies, using
the recorded command order/visual times. Then integrate that verified output
into the production hero presenter. Keep these two gates distinct: a correct
sampler does not yet fix the rendered hand. All phases are sampled from absolute
visual time so skipped frames cannot omit a prop transfer. Inspection requests
a short safe return before the camera leans; pause freezes the supplied clock.
The right hand never owns the glass and cigar simultaneously. If inspection
interrupts a sip, the cigar may remain safely on the tray until next requested.

The isolated sampler passed the original 500-pose/command replay before hero
integration. The presenter now consumes resolved joints (not a second IK solve),
and an integration replay checks actual sleeve-bone/hand-root coincidence and
the world-space shoulder frame. A dependency test enforces the single director
consumer and excludes browser/engine/mesh dependencies from the ownership core.

Fresh source capture `2026-09-20T03-39-26-621Z` contains 569 poses, three drink
starts, pause/resume while lifting, safe interrupted glass return, inspection
and cigar pickup from the tray. Maximum actual shoulder-to-wrist distance is
0.553774m in the 0.57m arm chain; no reach correction beyond floating-point
noise. A new replay preserves this real mid-sip interruption and checks against
teleporting prop/wrist movement. Four images preserve visible results and the
remaining poor finger/glass geometry. This closes the hero's unbounded-reach
substrate, not overall hand quality, opponent ownership, or final visual signoff.

C/D1 checkpoint verification: `npm run verify` passes 34 tests, TypeScript/build,
two SDK packaging tests and the real preview HTTP integration. Production QA
reproduces interrupted glass return, inspection then immediate cigar retrieval,
legal call 66, pause/resume and reload preserving hand 1 turn, stack 1,914 and
pot 595. Fresh tab reports no console warnings/errors. The new camera makes
the finger ribbons and slab beards particularly apparent; D2 remains necessary.
Candidate frame p50/p95 27.4/31.8ms is NOT a performance comparison because the
camera/workload differs from baseline. Electron-host verification remains open.

### D2 first slice: deforming surface topology

The recorded card-grip side view shows thin open finger ribbons. A new audit of
the actual production hand at 2.5mm resolution fails with 1,492 unpaired triangle
edges in bind geometry. Greedy rectangle T-junctions do not remain coincident
under nonlinear bone blending; the earlier 20mm patch cap did not fix this.
Use a conforming voxel-face lattice for animated hands/sleeves only, preserving
rigid-object greedy meshing. Verify closed edges in actual posed production
geometry, keep a construction budget, then inspect fresh neutral and seated
views. This fixes surface continuity, not yet anatomical proportions or grips.
Do not claim a frame-rate improvement: the correctness fix increases vertices
and must be included in the later controlled performance comparison.

The topology regression now passes for all five actual production hand poses,
as do actual bent sleeves across color seams. The existing no-paper-penetration
test remains green. Production hand cost is 24,872 vertices/12,436 triangles;
sleeve cost 32,600/16,300, still one draw each. Separately, short beards now paint
occupied face cells instead of adding geometry; neutral four-view evidence
`surface-beard-seat1.png` confirms removal of the floating U-shaped plate.
Three fresh inspector images and source session `2026-09-20T03-53-42-707Z`
(728 frames, 240 poses) preserve the result. This session reports frame p50/p95
28.6/31.9ms, CPU submission 5.2/7.8ms; not a controlled benchmark. Full verify
passes 37 tests plus build/packaging/preview gates. Finger silhouettes, convincing
cigar pinch/glass wrap, and face realism remain open despite closed surfaces.

Next D2 work must make block prop dimensions/contact anchors the source of truth
for grip calibration, rather than tweaking fingers around the old cylinder
meshes. Build a recessed ashtray/cigar rest and block glass/liquid/garnish assets,
then fit/verify grips against actual surfaces and expose safe free ordering.

### D2 block props and safe ordering

`props/specs.ts` now owns vessel radii/rims, cigar endpoints and ashtray rest
height; block factories consume the same dimensions as interaction calibration.
All four drinks use a shared lower tumbler/stemless grip profile with different
heights/contents. The director targets each actual rim at the same mouth point.
No transmission render target or per-block draw call is introduced. Liquid,
ice, orange peel, foam, cigar, coaster and recessed/notched ashtray are sampled
block surfaces. A raycast regression caught the first cigar rest 1mm too low;
the support is now calibrated from the actual tray geometry and shared felt Y.

The non-modal Drinks menu never calls the poker engine or save API. The director
rejects replacement during reach/sip/return/inspection, even when bypassing UI;
the presenter swaps one table-owned glass and disposes its owned geometry and
materials. Availability is published to React only on transitions, not guessed
with a timeout. Drink choice deliberately resets on reload, leaving saved hands
untouched. The user requested ordering, not a persistent cosmetic save migration.

Actual source session `2026-09-20T04-02-22-844Z` records all four orders/sips,
pause/resume, interrupted return/inspection, cigar pickup and a legal call.
It contains 2,303 frame samples, 772 poses and six images. A production-mesh
integration replay covers every order, sole glass ownership, disposal, rejected
mid-motion replacements and zero reach correction for all heights. Full verify
passes 41 tests plus build/packaging/preview integration. Source reload retains
hand 1 flop, stack 1,952 and pot 254. No source console warnings/errors observed.
Frame p50/p95 30/33.5ms is an instrumented workload, not controlled FPS acceptance.
Finger/glass wrap and cigar pinch are still visibly awkward; the new assets
establish the surface contracts for that next grip pass, not final art signoff.

Shipped `/dev/?production&qa=props-production` independently verifies all four
menu choices, ale/wine/water sipping, disabled mid-motion orders, pause/resume,
inspection return and cigar pickup. Orders leave the stack at 2,000; call 20
spends only that legal wager. Reload retains hand 1 flop, stack 1,980 and pot
252. No production console warnings/errors observed. Electron host is separate.

### D2 surface contacts and opposite-facing grips

The block props exposed a false invariant: equal attachment anchors did not
mean the skin touched the correct surface. An offline audit of the a661198
glass pose measured over 20mm of penetration, with the palm 38mm away. Preserve
that authored pose as a negative control. `testing/audit-grip.ts` is a disposable-
process, deterministic calibration aid, not runtime IK. Runtime uses static
grip frames/poses. `grip-surfaces.test.ts` measures the entire deformed triangle
projection against conservative voxel-cylinder envelopes, not only fingertips
or sampled vertices. This caught the first cigar candidate that a sparse vertex
audit missed. Supporting fingers must also stay close, with thumb/fingers or
index/middle on opposing sides; moving the prop out of reach cannot pass.

The glass now sits closer to the palm and the thumb opposes the finger wrap.
The cigar has an index/middle pinch and less tightly curled unused fingers.
`HandGrips.ts` is the shared contact-frame source for hero and opponents. A new
cast-wide test failed at 64.829mm wrist/glass separation: opponents face local
+Z, unlike the hero's -Z. Rotating the complete vessel/contact frame to its
near side fixes the reach assumption without changing arm lengths, moving the
coaster, or independently clamping the held prop. All five opponents now retain
contact at 81 samples across lift/sip/return; their actual rim targets the
animated head's mouth rather than a separately guessed height. Their legacy
scheduling/ownership still needs migration and interruption/reduced-motion work.

The studio now isolates the actual hand AND glass together, with an exact-time
numeric control for repeatable contact frames. Three fresh four-view PNGs show
hero glass/cigar and the complete opponent sip. Sleeves are explicitly hidden
only in hand close-ups, never in the complete rig or live game. Finger silhouette
remains angular, the card pose is stiff, and transition collision sweeps are not
yet accepted. Research reference: Blender's official Armature Modifier manual
describes volume loss under ordinary rotational blending; that supports keeping
deformation quality separate from collision tests, not claiming a new volume-
preserving skinning implementation (none was added):
https://docs.blender.org/manual/en/latest/modeling/modifiers/deform/armature.html

Source browser checks include sip/pause/inspection return/cigar, legal call20,
and reload retaining hand1 preflop stack1980 pot70, with no warnings/errors.
The first live trace export did not appear on disk (only its paused-sip PNG did);
do not invent that missing trace. A new actual recording was exported and
confirmed: `2026-09-20T04-23-47-481Z`, 219 frames/155 poses. Its inputs are replayed
through the production hero alongside the original failing baseline. Frame
p50/p95 86.5/140.2ms and CPU submission6.2/8.5ms are poor, uncontrolled samples
on a busy desktop, not a controlled comparison or GPU timing. Performance is
still an explicit open gate. No source/production artwork is called perfect.

Final `npm run verify` passes 46 tests, TypeScript/build, two SDK contract checks
and exact-byte production-preview HTTP integration. The shipped bundle was
independently exercised for sip, interrupted return/inspection, cigar, call20,
pause and reload retaining hand1 preflop stack1980 pot90. No warnings/errors
observed. Three rig PNGs, one seated PNG and the raw trace are committed with
their honest provenance; production screenshots were inspected in CUA only.
Electron host remains unverified. Next gates: grip/ownership transition sweeps,
card-hand/character silhouette, then Christmas clearance/light and controlled
performance profiling (do not carry this poor uncontrolled timing as baseline).

### C/D3 next slice: room contracts before atmosphere

D2's held-contact checkpoint is verified but its transition/anatomy gates stay
open. The independent recorded tree/bar defect can now progress through C/D3:
first reproduce the seven recorded overlaps, then extract the actual room's
block/fixture placement data into a DOM-free environment plan. Test authored
tree/present bounds against those same production blocks and oriented chair
envelopes, preserving the old location as a negative control. Move the complete
tree, gifts and its practical illumination together into a measured clear bay;
do not move furniture just to make a tree assertion pass. Then review warm,
motivated lighting in the seated and wide views, without extra shadow maps or
per-bulb lights. Compare actual images; geometry assertions do not approve
coziness or performance. Preserve source/production smoke/drink/poker checks.

### D3 clearance and warm-room checkpoint

`RoomPlan.ts` now supplies the actual furniture/architecture blocks, practical
fixture placements and signs. Its extraction is checked against every recorded
baseline block, so no furniture was moved to make a tree test green. The old
tree still reproduces seven bar-envelope overlaps as a negative control. The
complete tree and gifts now occupy the bay between the 2.85m counter edge and
4.74m wall face, at 84% scale, with a tested 12cm margin. Shared oriented chair
placements are included in clearance checks. Garland/wreath envelopes exposed
additional bottle/mirror/beam risks; both now have tested 2cm room clearance.
Conservative box overlap is not a claim that every enclosed triangle intersects.

`Lighting.ts` centralizes the warm key, reduced frontal/hemisphere fill, amber
bar bounce and restrained window-blue fill. The tree bounce moved outside the
foliage: its former near-zero-distance light produced the recorded white hotspot.
Small steady bulbs remain instanced emissive meshes; there are at most eight
lights and exactly one shadow owner. Wreath sprigs/berries and a tied bow break
its smooth ring silhouette without per-leaf draw calls. These are visual changes,
not a measured frame-rate optimization. Snow remains 84 soft points in the
window, a reused buffer, capped at 24Hz; reduced-motion buffer stability and long
time aperture bounds are tested independently of game interaction preferences.

The opt-in recorder now provides Wide room / Seated view controls. These move
only the inspection camera; the installed game remains first-person. Actual
source recording `2026-09-20T04-36-26-293Z` retains 196 frames, 87 poses, all three
decor envelopes, wide/seated PNGs, sip/pause/return/inspection/cigar and call70.
A separate raw-bounds integration check confirms the browser used the same room
plan and collision-free decor. A before-lighting PNG retains the tree hotspot;
it is a different animation instant, not a pixel-aligned golden comparison.
The two final canvas exports were opened and inspected, as well as browser UI
views. Warm practicals read clearly and paper stays matte; character shape is
still visibly provisional. No obvious trim flashing was observed during the
inspection/return camera motion, not a general all-camera flicker guarantee.

`npm run verify` passes 50 tests, TypeScript/build, two SDK packaging checks and
exact-byte production-preview HTTP integration. Source reload preserves hand1
preflop stack1930, pot568 after call70 and subsequent bot actions. Production
independently verifies the warm room, held cards/cigar, paused sip, inspection
return, call20 and reload preserving hand1 preflop stack1980, pot90. No console
warnings/errors observed in either; QA left paused. Electron host remains
separately unverified and host fullscreen deferred.

This short mixed-camera session reports frame p50/p95 40.3/79.1ms, CPU submission
5.7/9.2ms. Those are NOT comparable to the prior busy-desktop grip trace or proof
of 60Hz. Next work starts with a controlled warm, same-camera performance
recording and bottleneck isolation, preserving these visual results. After that,
close gesture transition/ownership and hand/card/character silhouette gates;
do not reinterpret the environment checkpoint as overall game completion.

### E1: repeatable render-cost measurement

The warm lobby currently reports about 46 FPS with 3–4ms CPU submission. Record
that real baseline before altering quality. This is not GPU timing. Add an
opt-in, lobby-only fixed-pose A/B/A/B probe with warmup excluded from each timed
window, identical camera/scene, and explicit viewport/buffer/quality metadata.
Its artifact is a raw local JSON download; reject interrupted/hidden/resized
runs rather than interpreting them as faster frames. Verify its timing contract
independently with recorded frame intervals plus labeled synthetic boundaries.

Then isolate render sizing in `rendering/RenderQuality.ts`, consumed only by
Room. Compare the existing 1.25 DPR cap with a 2.5-million-pixel cap, retaining
4x MSAA, materials, shadow resolution and geometry. Tests must use the actual
recorded viewport, while browser images judge the loss of supersampling. Do not
claim equivalent resolution or general gameplay 60Hz from a static lobby probe.
Only adopt a candidate after repeated same-session results and visible card/hand
inspection, then run active source/production and pause/restore checks. Engine,
interactions and React must not import the sizing policy or diagnostic probe.

E1 outcome: actual warm-lobby baseline `04-43-40-879Z` retains383 frames and
102poses (frame p50/p95 21.5/30.3ms), before the fixed-scene protocol. Two raw
profile exports (`04-46-33-937Z`, `04-50-10-044Z`) each hold four full windows,
same2133×1104 CSS viewport, centered seated view, fixed visual time12,300draws
and1,145,166triangles every sample. First non-GPU-query run frame medians:
92.7→76.8ms,77.5→65.1ms. Second sparse-GPU-query run:82.7→66.2ms,75.8→63ms;
p95:99.4→74.4ms,92.4→68.7ms. CPU submission medians6.3–6.5ms in that run.
Strong baseline drift and the large difference from the earlier animated lobby
show desktop/session conditions remain material. These are paired reductions,
NOT general game FPS or a claim that the broader performance gate passed.

The candidate caps scene pixels at2.5M (buffer2197×1137 versus2666×1380 here,
about32% fewer pixels), preserving4xMSAA,2048shadow,lighting/materials/geometry.
HTML controls remain native resolution. No adaptive resolution changes during a
gesture. Sizing has one production consumer, Room. The pure probe retains raw
intervals, excludes warmup and is independently replayed against real intervals;
actual A/B counts/buffers and immutable raw hashes are checked. No CI FPS threshold
is fabricated from these historical recordings.

`&record` exposes the lobby-only probe, aborting hidden/resized/paused/entered-game
runs rather than blessing contaminated windows. `&gpu` separately opts into
sparse asynchronous EXT_disjoint_timer_query_webgl2 samples (one per30frames,
at most8pending, no blocking wait; unsupported/disjoint results aren't invented).
The real second run has15driver elapsed samples101.5–220.3ms, distinct from frame
intervals and not exclusive shader cost. Unit tests cover driver lifecycle with
a labeled fake, not invented GPU performance. Protocol follows Khronos:
https://registry.khronos.org/webgl/extensions/EXT_disjoint_timer_query_webgl2/

Source active trace `04-52-11-274Z` and three PNGs retain279frames/189poses,
sip/pause/resume/inspection return/cigar/call20. Readable cards, warm lighting,
hand edges and paper inspected; angular card fingers/character art remain open.
Source reload returns hand1preflop,stack1980,pot110. Shipped preview independently
checks the same interactions, call59 and reload returning hand1/stack1941;
subsequent observed public pot336 includes Juno's raise178. No warnings/errors
observed; production QA left paused. Electron host remains unverified.
The active trace is still slow: frame p50/p95 70/149.9ms, CPU5.1/8.3ms, with
camera/export/pause overhead. Do not hide this behind the paired percentage gain.

Next: isolate shadows, postprocessing and material cost with the same probe,
including a simpler render pipeline comparison, before trading away any more
fine anatomy or antialiasing. A coherent render pipeline may matter more than
another DPR tweak. D1/D2 ownership/transitions and hand/card/face work stay open.

Final E1 check passes55tests/build/SDK/preview checks. Actual UI negative control
`04-58-59-194Z` starts profiling then immediately changes to Wide room: the raw
export says camera-changed with zero measured frames, not successful performance
evidence. Other guarded abort reasons are not independently browser-recorded.

### E2: isolate pipeline cost before changing the picture

E1's retained paired profiles show a pixel-area effect but poor absolute timing.
Extend the existing probe with a separate five-window ablation: balanced baseline,
bloom disabled, shadows disabled, direct antialiased renderer, repeated balanced
baseline. Keep camera, pose, pixel budget and geometry fixed. Each gets4s warmup
and6s samples; raw mode/count/buffer evidence, not an FPS assertion, is the artifact.
These diagnostic omissions are NOT candidate art decisions. Review measured cost
first, then isolate the production pipeline in `rendering/` if a simpler route
preserves matte cards, warm practicals, stable fine edges and depth in actual views.
Room is the only pipeline consumer; rules/interactions must never import it.
Protect output color/tone mapping, resize, disposal and paused/hidden behavior;
compare source and shipped gameplay after any adoption. Do not lower geometry
detail or remove the one shadow owner merely to hit a synthetic static score.

First ablation `05-03-34-188Z` invalidates a simple winner: balanced baseline
p50 drifts16.7→82.6ms. Do not choose direct rendering from these samples. Preserve
the warm picture and instead remove a demonstrably redundant allocation: the
canvas is multisampled even though only a fullscreen already-resolved composer
image reaches it. Capture identical fixed-pose PNGs before/after disabling canvas
MSAA while retaining the actual scene target's4xMSAA. Pixel comparison and actual
context/target settings verify that boundary independently of unstable FPS.
Isolate the unchanged post chain in `rendering/PostProcessing.ts`; one owner must
resize/dispose its targets and passes. Add a benchmark drift assessment so a
completed run with moving baselines cannot silently be called a fair comparison.

The first fixed PNG pair differs only around two opponents' arms/glasses:
the old diagnostic froze time but inherited stateful sip scheduling. Do NOT
accept its small average pixel difference as pipeline equivalence. Canonical
comparisons must sample the real rig's existing reduced-motion/rest behavior at
time12, independent of prior sip history, on both canvas-context configurations.
Retain the failed pair as an explicit diagnostic negative control. This corrects
test substrate, not the still-open opponent ownership design. Expanded QA buttons
also covered the lobby CTA; move that opt-in panel above gameplay controls.

E2 checkpoint: preserve the real rejected five-window profile and invalid PNG
pair in the manifest. Browser connection interruptions prevented a fresh
canonical pair and updated source/shipped interaction verification. Therefore
canvas-MSAA removal is DEV-only via `&resolved-canvas-aa`; ordinary and shipped
play retain the established canvas setting. The extracted post chain keeps HDR,
bloom and scene4xMSAA. 59 tests/build/SDK/exact-byte preview passed before the
subsequent persistent-board slice; run full verification again before commit.
No new performance or visual-equivalence acceptance is claimed.

### D4a — recorded player mouth-contact correction

Real source recording `05-26-21-152Z` retains667frames/465poses, one complete
smoke and one Old Fashioned sip. Seven puff samples show cigar axis
[.95056,.01946,.30992]: the burning tip points sideways and BACK toward the
eye, not outward over the table. Bite point is [.015,1.335,1.37]; eleven sip
samples use [.005,1.335,1.365]. Attachment passes but these are two invented
mouths roughly13cm forward of eyes[0,1.43,1.50]. This is the wrong calibration
substrate, not a reason to add phase offsets to the hand renderer.

Contract: define one body-local/world-rest lip landmark 95mm below and55mm
forward of the seated eyes (an explicit authored anatomy choice, not a measured
real person). Both props and exhalation consume it. Resolve cigar mouth-end at
that landmark and its +X shaft outward toward negative worldZ; derive the hand
from the existing surface-fitted grip. Glass rim uses the same landmark for
each drink height. First write recorded replay tests for endpoint/direction and
zero reach correction, preserving the old matrices as negative controls. Then
integrate shared calibration without changing ownership clocks, arm lengths,
card transforms or engine rules. Actual presenter and browser motion remain
separate gates: a pure endpoint test cannot approve a silhouette or comfort.

### D2 thumb silhouette reopened from user image

User screenshot `user-thumb-silhouette-before.png` shows the cigar-pose thumb
curling as a raised hook across the palm, with a bulbous base and no visible
thumbnail. This is actual user evidence, not a synthetic golden. Preserve it
and compare the same production hand. The cigar is supported by index/middle,
so the thumb should rest abducted along the palm's side, not oppose an absent
glass. Isolate cigar-pose splay from the necessary glass-opposition pose; flatten
the thenar mound, taper the thumb and add a small dorsal nail for anatomical
readability. Verify existing glass/cigar triangle clearance, closed deformation
and card nonpenetration unchanged. A thumb-tip side-of-palm test protects this
specific pose error, but only actual images can approve the overall silhouette.

### D5 — seated mouse-look (dealer canceled; hand art paused)

The user canceled the human dealer because the live seating/layout did not work
well. The rejected experiment is recorded at the top of this document; it has
no remaining implementation or acceptance tasks. Existing hand art remains
provisional and paused. Preserve the poker dealer button and engine seat IDs.

| Stage | Produces | Verified by | Why separate | Reality check |
|---|---|---|---|---|
| B | Source input/camera traces, seated/inspection images | Retained exports correlate actual inputs and camera matrices | Parallax is not deliberate looking | Actual CUA scene versus UI controls, pause and focus loss |
| C | Input arbitration contracts | Menu/pause/focus outrank drag; inspection returns safely | Camera is the single view owner; props must not independently chase cursor input | Recorded camera/inspection cases; novel probes labeled synthetic |
| D | Isolated scene/camera controller consumed only by Room | Deterministic bounded elapsed-time motion, no engine/storage dependency | Shared coordinates prevent detached props and stranded labels | Existing source opt-in implementation; real drag still unverified |
| E | Actual source and shipped input/motion/restore evidence | Comfortable look/recenter, no private faces, stable public board and safe controls | Controller math cannot approve visual comfort | Fresh CUA drag, UI-focus, inspection, sip/puff, pause/reload and timing captures |

Mouse-look default proposal: hold left mouse and drag on unobstructed scene
background, not controls or clickable props; retain bounded yaw/pitch on release
and provide explicit recenter. No mandatory pointer lock or camera swing while
choosing a bet. Tune limits/sensitivity in real full-screen and narrow trials;
offer reduced-motion/off behavior and non-drag recenter. Cancel drag on pointer
cancel, blur, pause and disposal. Use elapsed-time damping, not per-frame lerp.
For initial contact safety, sip/puff smoothly recenter before mouth contact and
suspend look until return. Do not pretend a body-fixed mouth follows a turned
head. Inspection saves/restores look intent through the single camera owner.
Head-following contacts would require separately verified neck/reach contracts.

Unknowns: comfortable limits/sensitivity, newly visible private-card sightlines,
and measured motion/render cost. Keep the candidate gated until actual browser
acceptance; do not use synthetic input tests as a substitute.

### D6 — readable chip and table lettering

The user reports low-resolution lettering on table chips. First distinguish
chip denomination textures, felt lettering and final render-buffer resolution;
do not assume every blurred mark has the same source.

- **Produces (record):** actual seated and inspection close-ups at known viewport,
  DPR, buffer size and texture settings; retain full image plus labeled crops.
  Audit the production chip/felt texture generation and filtering paths.
- **Verified by:** correlate each reported mark to the real texture and projected
  size. Record texture dimensions, filtering/mipmaps and grazing angle. Do not
  mistake a crop enlargement for additional source detail.
- **Why separate:** blindly increasing global DPR increases render cost without
  recovering detail missing from a texture or fixing oblique minification.
- **Reality check:** current production textures and actual QA captures; latest
  complaint is recorded separately from any still-uncollected close-up.

Then catalog each observed cause and isolate texture creation/quality policy in
the existing chip/table material owners. Write regression checks for confirmed
source-detail or sampler mistakes before changing them. Preserve shared/cached
textures, correct denomination mapping, matte materials and engine-owned chips.
Integrate candidate resolution/filter changes one at a time, compare matched
source/shipped views and measure memory/draw/frame cost. Acceptance is readable
denominations in normal inspection, stable edges at seated grazing angles and
no shimmer/glow regression—not universally pixel-sharp distant tiny text. Final
texture sizes/filter settings stay unknown until this evidence is collected.

Source audit: `Chips.ts` authors each cap at128×128 with28px Georgia numerals;
its CanvasTexture uses no explicit anisotropy. Felt artwork in `Room.ts` is
1024×512 with26px/16px lettering and likewise no anisotropy, whereas card
textures already use the renderer's maximum supported anisotropy. This is a
specific likely grazing-angle blur contributor, not yet an image-proven sole
cause. The2.5M render-pixel cap also limits projected detail; isolate texture
sampling before spending more fullscreen pixels. No lettering fix is claimed.

### Priority override — hand animation paused

The user explicitly stopped hand-animation work after D5/D6 were planned.
Preserve the current tested contact/thumb checkpoint as provisional. Do not
iterate hand art, poses or gesture animation further without a new request.
Continue table behavior, mouse-look, lettering, room ambience, snow,
fireplace, audio and other non-hand work. D5 hand acceptance remains open/deferred,
not silently passed; necessary future camera/prop integration must not disguise
another hand-animation project.

### D7 — folded cards remain on the felt

**A:** the user sees folded NPC cards disappear through the table. Code confirms
`Human.cards.visible` turns off immediately on fold, while `CardField` starts a
face-down flight from a guessed height and marks it `disappear:true` at .68s.
It is disappearance, not evidence of an actual below-felt vertex. Preserve this
distinction and inspect the real flight before changing the presentation.
**D:** folded cards land face-down above the felt, stay visible in a coherent
discard area, and are only cleared by next-hand
reset. Never reveal folded faces, resurrect held cards or change the ledger.

- **Produces (record/catalog):** actual public fold transitions from retained
  browser traces, a new live fold capture where available, and a catalog entry
  mapping the disappearance to table-card ownership. Record held-to-table
  handoff, flight end, pause/reload and subsequent street transitions separately.
- **Verified by:** fixture replay reconstructs only presentation inputs from
  sanitized public state; private card placeholders are explicitly synthetic
  and must never be requested as face textures. A failing test observes that
  folded paper becomes hidden at flight end in the original implementation.
- **Why separate:** setting a mesh visible is insufficient if an old deal flight
  still owns it or restoration starts a new fold animation from invented hands.
- **Reality check:** the user report, actual public trace events, current
  `Cards.ts` and a fresh browser observation, each labeled by provenance.

Then isolate lifecycle ownership within the existing CardField (Room remains
its sole production consumer). A per-card presentation transfer supersedes any
older flight for that mesh. Folded backs settle in a layered, felt-safe discard
area and survive later state projections and pause; reload restores settled
backs without re-dealing. New hands dispose them once. Add recorded regression
tests plus labeled synthetic timing/restore probes before implementation.
Human-dealer collection is canceled; the next hand clears this same set of cards.
Integration gates: source/shipped visible fold landing/retention, no below-felt
corners or coplanar overlapping discards, no private texture request, unchanged
engine/save state and bounded mesh counts across hands. This does not authorize
resuming the paused hand-animation pass.

Frozen hand/contact checkpoint: recorded replay now targets one authored lip
landmark with an outward cigar; thumb side-rest and shallower palm pad are
provisional. `npm run verify` passes65 tests/build/2SDK checks/exact-byte preview.
Three actual studio exports retain the revised silhouette/full sleeves, not
live motion approval. User rejected naturalness and stopped this work; keep it
deferred. Source baseline smoke/sip was recorded; fresh source/shipped contact
acceptance remains open after CUA tab-reconnection timeout. No further hand
changes are part of the next table-card slice.

Continuation9 table checkpoint: real retained events `04-02-22-844Z` capture
seat4/5 folds at20.4149/21.5804s. New tests first fail because paper is hidden on
landing; candidate retains layered backs, cancels stale deal ownership and
restores settled discards immediately. Synthetic fast-fold and reduced-motion
probes additionally guard lifecycle boundaries. No hand animation was changed.

Actual source inspection capture `05-43-43-579Z-40.700.png` is retained as
`table-lettering-before.png` (2137×1169). Felt line stair-stepping is visible;
player100 denominations can already be read, so do not exaggerate the defect.
Candidate doubles chip cap and felt source resolution, retains edge resolution,
mipmaps, materials and draw count, and caps supported anisotropy at8. Estimated
RGBA8+mipmap increment is9.25MiB, NOT a driver-memory measurement or free speedup.
Three's texture reference documents the clarity/sample-cost tradeoff:
https://threejs.org/docs/pages/Texture.html#anisotropy
The pinned r169 sampler code was also inspected. Chip tests verify actual shared
material/texture configuration with a labeled canvas stub, not raster quality.

Full verify passes70 tests/build/SDK/exact-byte preview at this checkpoint.
Source hand entry/inspection and baseline PNG were captured, but repeated browser
timeouts then debugger detachment interrupted follow-up. The user is actively
playing their own tab; do not switch it for QA. Candidate source/shipped fold
landing, matched lettering images and measured sampling cost remain OPEN.
New opt-in recorder metadata includes print configuration and table-card poses
without values/textures, to make the next actual session more diagnostic.

Continuation9 acceptance follow-up supersedes the interrupted checks above:
source `05-52-49-020Z` now retains1151 frames,512 poses,two PNGs and the complete
untruncated raw trace with SHA256 in the manifest. Raise500 yields three folds,
two calls and a flop; six backs remain visibly face-down above felt through
later decisions. A distinct actual-pose assertion complements renderer replay.
Production QA also raises500, observes all five folds/ten backs, inspection,
pause and reload/Return restoring the completed hand and stack2090. Source
reload loses the CUA debugger, so that final source check remains open.

Before/after inspection views share the saved hand and camera, not random chip
rotations/NPC poses; smoother felt lettering is visible, but this is not a
pixel-aligned golden. Actual metadata confirms capped8x filtering and doubled
source artwork. Frame p50/p95 34.1/110.2ms and CPU5.2/9.4ms are instrumented mixed
workload observations, NOT performance improvement. No fresh console export,
Electron verification or hand-motion acceptance. Keep existing quality and
Performance gates open; mouse-look/fireplace/audio remain. Human dealer canceled.

Source restoration recovery: fresh isolated tab321804218 loaded the same QA save
after the debugger failure. Return to table restores hand1/flop K♥3♦9♥,
stack1500/pot1550 and six visible folded backs; CUA screenshot inspected, then
left paused. No new trace is claimed for this restoration screenshot. This
closes the source restoration check above, not the console/performance gates.

Final continuation9 verify:71 tests pass, TypeScript/build,2SDK checks and
exact-byte production-preview integration pass. No dependency/lockfile change.

### D5 camera slice — continuation10

Browser baseline instrumentation now records pointer down/up target category
and coordinates before changing input. Fresh CUA recording is unavailable:
the QA tab times out and browser inventory becomes empty. Do not invent that
missing drag trace. Existing05-52-49 raw source evidence contains325 seated
poses with camera yaw -0.01391…0.01899 radians, plus real inspection transitions.
This verifies the tiny parallax substrate, not the unrecorded pointer cause.

- **Produces:** camera baseline catalog, retained-trace measurement test, and
  an isolated `scene/camera/SeatedLook.ts` controller; then a DEV-only `&look`
  adapter in Room. Normal/shipped play keeps its verified camera until live
  input/comfort/privacy/restore checks pass.
- **Verified by:** existing recorded camera/inspection samples plus explicitly
  synthetic drag/cancel/frame-rate boundaries. Tests precede implementation.
  Room is the sole runtime consumer; engine/props/hands/React cannot import it.
- **Why separate:** camera arbitration must not make hands chase the camera,
  accept controls as drag surfaces, or start sipping while turned away. No
  world-space prop or gesture pose changes are authorized by this slice.
- **Reality check:** actual05-52-49 trace and current Room/App code; fresh drag
  and source/shipped browser acceptance remain unrecorded, not synthetic proof.

Candidate contract: primary mouse drag on canvas only, bounded yaw/pitch,
retain angle on release, explicit R/recenter and session-only off toggle.
Elapsed-time damping; no inertia after release. Pause/focus/menu/inspection/
busy leisure cancel drag. Inspection temporarily centers but retains intent;
R or a leisure request discards intent and centers. Sip/puff requests wait until
centered before calling the existing hero API; pause/menu/inspection cancel a
pending request. Reduced motion applies direct input without easing. World
labels project through the live camera and hide outside its frustum; fixed
community cards/controls remain untouched. Do not add a persisted-save field.

Camera implementation checkpoint: seven isolated tests pass (retained real
baseline and inspection/pause inputs plus explicitly synthetic drag/contact
boundaries). The pending-contact contract first failed because the API was
absent; no claim that it reproduced a recorded camera-drag failure. Room consumes
one controller, including one-shot centering requests; App exposes R/recenter,
session off and menu blocking. No hand/arm/prop pose code changed. World-up yaw
avoids unintended roll; label projection reuses a vector, without React frame
updates. Normal/shipped camera remains unchanged behind DEV-only `&look`.

CUA recovered briefly: actual source QA `look-13` entered a fresh hand8♦4♠ and
displayed Recenter view. The subsequent real drag could not execute because the
browser disconnected. No raw export or successful drag/comfort/production
acceptance is claimed from that attempted recording. Continue this precise
browser gate when connected; do not count it as a passing motion test.

Full camera-candidate checkpoint: `npm run verify` passes78 tests, TypeScript,
production build,2SDK checks and exact-byte HTTP preview. Actual source hand
entry/control visibility is the only fresh browser observation; the browser
inventory subsequently returned empty. Production browser verification remains
open. No dependency or lockfile change. Do not enable this candidate by default
until real drag/interruption/restore and camera-extreme privacy checks pass.
