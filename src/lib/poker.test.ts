/// <reference types="node" />
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { HOLDEM_ANTE_MAX, HOLDEM_ANTE_MIN, bestScore, dealerQualifies, handName, holdemReturn, score5 } from './poker';

// Card id = suit * 13 + rank, rank 0 = Ace, 1 = 2 … 12 = King.
const c = (rank: number, suit = 0) => suit * 13 + rank;

describe('poker hands', () => {
  test('names a royal flush', () => assert.equal(handName(score5([c(0), c(12), c(11), c(10), c(9)])), 'Royal flush'));
  test('ace-low straight counts as a 5-high straight', () => assert.equal(handName(score5([c(0), c(1, 1), c(2, 2), c(3, 3), c(4)])), '5-high straight'));
  test('six-high straight flush', () => assert.equal(handName(score5([c(5), c(4), c(3), c(2), c(1)])), '6-high straight flush'));
  test('names pairs and full houses by rank', () => {
    assert.equal(handName(score5([c(12), c(12, 1), c(1), c(2, 1), c(6)])), 'Pair of Kings');
    assert.equal(handName(score5([c(6), c(6, 1), c(6, 2), c(1), c(1, 1)])), 'Full house, 7s over 2s');
  });
  test('pair of aces beats pair of kings', () => {
    assert.ok(score5([c(0), c(0, 1), c(1), c(2, 1), c(6)]) > score5([c(12), c(12, 1), c(1), c(2, 1), c(6)]));
  });
  test('finds the best five of seven', () => assert.equal(handName(bestScore([c(7, 1), c(7, 2), c(0), c(12), c(11), c(10), c(9)])), 'Royal flush'));
});

describe("texas hold'em payouts", () => {
  test('antes are 10 to 100 coins', () => {
    assert.equal(HOLDEM_ANTE_MIN, 10);
    assert.equal(HOLDEM_ANTE_MAX, 100);
  });
  test('dealer qualifies with a pair of 4s, not 3s', () => {
    assert.equal(dealerQualifies(score5([c(3), c(3, 1), c(8, 2), c(12, 3), c(1, 2)])), true);
    assert.equal(dealerQualifies(score5([c(2), c(2, 1), c(8, 2), c(12, 3), c(1, 2)])), false);
  });
  const flush = score5([c(1), c(3), c(5), c(7), c(9)]);
  const pair3s = score5([c(2), c(2, 1), c(8, 2), c(12, 3), c(1, 2)]);
  const trips = score5([c(6), c(6, 1), c(6, 2), c(12, 3), c(1, 2)]);
  test('dealer not qualifying: ante pays by the table, call is returned', () => {
    // ante 10 with a flush (2 to 1) -> 30 back on the ante + 20 call returned
    assert.deepEqual(holdemReturn(flush, pair3s, 10), { status: 'dealer_no_qualify', payout: 50 });
  });
  test('win against a qualifying dealer: ante by the table, call 1 to 1', () => {
    // ante 10 flush (30) + call 20 paid 1 to 1 (40)
    assert.deepEqual(holdemReturn(flush, trips, 10), { status: 'win', payout: 70 });
  });
  test('tie returns both bets; a loss returns nothing', () => {
    assert.deepEqual(holdemReturn(trips, trips, 10), { status: 'push', payout: 30 });
    assert.deepEqual(holdemReturn(trips, flush, 10), { status: 'lose', payout: 0 });
  });
});
