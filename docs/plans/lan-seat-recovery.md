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
3. Resume tries the selected seat, then the other saved seats, newest first.
   A seat the host rejects (401/410) is forgotten automatically and the next
   one is tried. Network errors stop the loop, since they prove nothing about
   the seat.
4. A 409 "table already exists" on create runs the same resume loop. If no
   saved seat is valid, the page explains what to do instead of dead-ending.

Tests: SeatRecovery round-trips the new fields, sorts newest first, keeps
legacy entries, and fails closed on malformed codes.
