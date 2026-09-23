import test from 'node:test'
import assert from 'node:assert/strict'
import { resumeSeats, seatsForCreate } from '../server/client/resumeSeats'
import type { SeatKey } from '../server/client/SeatRecovery'

const seat = (n: number, name = `Guest ${n}`): SeatKey => ({ token: String(n).repeat(43), nonce: String(n).repeat(64), name })

test('resume skips seats the host rejects, forgets them, and stops at the first accepted seat (#24)', async () => {
  const forgotten: string[] = [], tried: string[] = []
  const found = await resumeSeats([seat(1), seat(2), seat(3)], async key => { tried.push(key.name); return key.name === 'Guest 2' ? 'accepted' : 'rejected' }, key => forgotten.push(key.name))
  assert.equal(found?.name, 'Guest 2')
  assert.deepEqual(tried, ['Guest 1', 'Guest 2'], 'seats after the accepted one are not touched')
  assert.deepEqual(forgotten, ['Guest 1'])
})

test('a transient failure stops the loop and forgets nothing it could not prove dead (#24)', async () => {
  const forgotten: string[] = []
  await assert.rejects(resumeSeats([seat(1), seat(2), seat(3)], async key => {
    if (key.name === 'Guest 1') return 'rejected'
    throw new Error('timeout')
  }, key => forgotten.push(key.name)), /timeout/)
  assert.deepEqual(forgotten, ['Guest 1'], 'the timed-out seat and the untried one survive')
})

test('all seats rejected resolves null after forgetting each (#24)', async () => {
  const forgotten: string[] = []
  assert.equal(await resumeSeats([seat(1), seat(2)], async () => 'rejected', key => forgotten.push(key.name)), null)
  assert.deepEqual(forgotten, ['Guest 1', 'Guest 2'])
})

test('Create only resumes seats saved under the name the player typed (review of #26)', () => {
  const saved = [seat(1, 'Bigj'), seat(2, 'Alice'), seat(3, 'Bigj')]
  assert.deepEqual(seatsForCreate(saved, ' Bigj ').map(k => k.nonce), [seat(1).nonce, seat(3).nonce])
  assert.deepEqual(seatsForCreate(saved, 'Bob'), [], 'another player\'s seat is never claimed by Create')
  assert.deepEqual(seatsForCreate(saved, '   '), [])
})
