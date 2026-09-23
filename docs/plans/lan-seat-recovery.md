# LAN seat recovery after a host restart (#24)

Problem: the browser keeps a saved seat for every table the address has ever
hosted. They are labelled only by player name, listed in storage order, and a
dead seat stays after the host rejects it. Creating a table on the host
computer answers 409 and gives no way back to the saved table.

Plan (client only; the host's security rules are unchanged):
1. SeatRecovery stores two optional, validated fields per saved seat: the table
   code and the time it was saved. Legacy entries without them still parse.
   saved() lists newest first.
2. The saved-seat picker shows name, table code and time.
3. Resume tries the selected seat, then only the other seats saved under the
   selected seat's name, newest first (`seatsForResume`). A seat the host
   rejects (401/410) is forgotten automatically and the next one is tried.
   Network errors stop the loop, since they prove nothing about the seat.
   Correction (#27): this step first fell back to EVERY saved seat, so a dead
   seat of one player could silently resume another player's live seat on a
   shared browser. A different name always needs its own explicit selection.
4. A 409 "table already exists" on create runs the same resume loop, but only
   over seats saved under the name the player typed (`seatsForCreate`, from
   the review of #26). If none is valid, the page explains what to do instead
   of dead-ending.

Tests: SeatRecovery round-trips the new fields, sorts newest first, keeps
legacy entries, and fails closed on malformed codes. `resume-seats.test.ts`
pins both name restrictions, including the review's Alice/Bob reproduction.
