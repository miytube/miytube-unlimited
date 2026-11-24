import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { lucky9BankerDraws, lucky9BetSchema, lucky9Natural, lucky9Outcome, lucky9Value, lucky9ViewSchema } from './lucky9';

describe('Lucky 9 house rules', () => {
  test('aces count as 1 in all four suits', () => {
    for (const c of [0, 13, 26, 39]) assert.equal(lucky9Value([c]), 1);
  });
  test('2–9 retain face value and 10/J/Q/K count as zero', () => {
    for (let suit = 0; suit < 4; suit++) {
      for (let rank = 1; rank <= 8; rank++) assert.equal(lucky9Value([suit * 13 + rank]), rank + 1);
      for (let rank = 9; rank <= 12; rank++) assert.equal(lucky9Value([suit * 13 + rank]), 0);
    }
  });
  test('only the last digit counts: 7 + 8 = 5', () => assert.equal(lucky9Value([6, 7]), 5));
  test('a third card is included once: 7 + 8 + 9 = 4', () => assert.equal(lucky9Value([6, 7, 8]), 4));
  test('only two-card 8 or 9 is a natural', () => {
    assert.equal(lucky9Natural([7, 9]), true);
    assert.equal(lucky9Natural([8, 12]), true);
    assert.equal(lucky9Natural([6, 12]), false);
    assert.equal(lucky9Natural([3, 3, 9]), false);
  });
  test('banker draws on every total 0–5 and stands on 6–7', () => {
    for (let total = 0; total < 8; total++) {
      const banker = [total === 0 ? 9 : total - 1, 12];
      assert.equal(lucky9BankerDraws([2, 12], banker), total <= 5);
    }
  });
  test('either natural prevents all further drawing', () => {
    assert.equal(lucky9BankerDraws([7, 12], [1, 12]), false);
    assert.equal(lucky9BankerDraws([1, 12], [8, 12]), false);
  });
  test('a win pays 1:1 profit plus the original stake', () => {
    assert.deepEqual(lucky9Outcome([8, 12], [7, 12], 25), { status: 'win', payout: 50 });
  });
  test('equal totals return the stake, even if one hand has three cards', () => {
    assert.deepEqual(lucky9Outcome([3, 3, 9], [7, 12], 25), { status: 'push', payout: 25 });
  });
  test('a loss returns zero, with no extra charge', () => {
    assert.deepEqual(lucky9Outcome([7, 12], [8, 12], 25), { status: 'lose', payout: 0 });
  });
  test('bets accept integers 10–500 only', () => {
    assert.equal(lucky9BetSchema.parse(10), 10);
    assert.equal(lucky9BetSchema.parse(500), 500);
    for (const v of [9, 501, 10.5, null, '25', NaN]) assert.equal(lucky9BetSchema.safeParse(v).success, false);
  });
  test('rejects malformed cards and private deck data in a view', () => {
    const view = { id: '00000000-0000-4000-8000-000000000001', bet: 10, status: 'playing', payout: 0,
      player: [0, 1], dealer: [], dealer_hidden: 2, player_total: 3, dealer_total: null, natural: false, balance: 490 };
    assert.equal(lucky9ViewSchema.safeParse(view).success, true);
    assert.equal(lucky9ViewSchema.safeParse({ ...view, deck: [8, 9] }).success, false);
    assert.equal(lucky9ViewSchema.safeParse({ ...view, player: [0, 52] }).success, false);
  });
});