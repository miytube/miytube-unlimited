/// <reference types="node" />
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { PAIGOW_BET_MAX, PAIGOW_BET_MIN, lowName, paigowReturn, score2, splitIsValid } from './paigow';

// Card id = suit * 13 + rank, rank 0 = Ace … 12 = King.
const c = (rank: number, suit = 0) => suit * 13 + rank;

describe('pai gow poker', () => {
  test('bets are 10 to 500 coins', () => {
    assert.equal(PAIGOW_BET_MIN, 10);
    assert.equal(PAIGOW_BET_MAX, 500);
  });
  test('winning both hands pays 1 to 1 less 5%', () => {
    assert.deepEqual(paigowReturn(100, true, true), { status: 'win', payout: 195 });
    assert.deepEqual(paigowReturn(25, true, true), { status: 'win', payout: 48 }); // 25 + 23 (5% rounds against the player)
  });
  test('winning one hand returns the bet', () => {
    assert.deepEqual(paigowReturn(100, true, false), { status: 'push', payout: 100 });
    assert.deepEqual(paigowReturn(100, false, true), { status: 'push', payout: 100 });
  });
  test('losing both (ties count as losses) pays nothing', () => {
    assert.deepEqual(paigowReturn(100, false, false), { status: 'lose', payout: 0 });
  });
  test('a low pair beats any low high-card hand', () => {
    assert.ok(score2([c(1), c(1, 1)]) > score2([c(0), c(12)]));
    assert.equal(lowName(score2([c(0), c(12)])), 'A-K high');
  });
  test('the 5-card hand must beat the 2-card hand', () => {
    const seven = [c(0), c(0, 1), c(4), c(6, 2), c(8, 3), c(10), c(11, 1)];
    assert.equal(splitIsValid(seven, [c(10), c(11, 1)]), true); // pair of aces high, J-Q low
    assert.equal(splitIsValid(seven, [c(0), c(0, 1)]), false); // aces low leaves Q-high: foul
  });
});
