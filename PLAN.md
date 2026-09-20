# Agent Code Poker

Refs #1. Deliver a standalone API-v2 extension: six-seat No-Limit Texas Hold’em against five local opponents in a spacious, procedural block-built 3D card room.

1. Build a deterministic, UI-independent poker engine and exhaustive five-card evaluator used for best-of-seven hands. Protect legal betting, heads-up order, full-raise reopening, side pots, ties, odd chips, and conservation with behavioral tests and simulated tournaments.
2. Give bots only their own cards and public observations. Estimate strength from sampled unseen cards; vary risk and bluff frequency by character.
3. Build the room and animated characters from reusable block geometry, with readable cards, chips, lighting and camera framing. Keep frame animation separate from rules and honor reduced motion.
4. Build the complete experience: lobby, table, action controls, raise sizing, opponent turns, street transitions, showdown, results, history, settings, pause and saved session restoration. Persist completed decisions, including the active hand, so closing a view cannot erase a wager.
5. Package independent runtime/view modules with the pinned SDK and committed bundles. Target 1100 × 760 natural content, within the host’s present width ceiling, scaling through the host on smaller displays.
6. Verify engine behavior, typecheck, production artifacts and browser interactions/screenshots; inspect host integration, then commit and open a PR linked to #1. Merge requires explicit user approval.

The initial repository is private. All chips are free practice currency. There are no external assets, network calls, accounts, purchases or requested host permissions. Rules use TDA betting/settlement conventions where applicable; physical casino procedures are represented by legal UI actions.

Keep the rationale near the implementation. The engine owns chip amounts and legal actions; rendering never moves money. Storage failure must be visible and must not silently replace saved progress.
