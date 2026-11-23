/// <reference types="node" />
import { describe, test as it } from 'node:test';
import assert from 'node:assert/strict';
import { BET_MAX, BET_MIN, cardRank, cardSuit, handValue, isValidBet, payoutFor } from './blackjack';

// Card ids: rank = id % 13 (0 = Ace, 9 = 10, 12 = King), suit = id / 13.
const ACE = 0;
const NINE = 8;
const KING = 12;
const FIVE = 4;

describe('blackjack rules', () => {
  it('reads card faces from ids', () => {
    assert.equal(cardRank(0), 'A');
    assert.equal(cardRank(12), 'K');
    assert.equal(cardSuit(13), 'hearts');
  });

  it('counts ace + king as 21', () => {
    assert.equal(handValue([ACE, KING]), 21);
  });

  it('drops aces to 1 to avoid busting', () => {
    assert.equal(handValue([ACE, ACE, NINE]), 21);
    assert.equal(handValue([ACE, KING, FIVE]), 16);
  });

  it('busts over 21', () => {
    assert.equal(handValue([KING, KING, FIVE]), 25);
  });

  it('pays blackjack 3 to 2', () => {
    assert.equal(payoutFor('blackjack', 100), 250);
    assert.equal(payoutFor('blackjack', 25), 62); // 25 + 37 (half coins round down)
  });

  it('pays a regular win 1 to 1', () => {
    assert.equal(payoutFor('win', 100), 200);
  });

  it('returns the bet on a push', () => {
    assert.equal(payoutFor('push', 100), 100);
  });

  it('pays nothing on a loss or bust', () => {
    assert.equal(payoutFor('lose', 100), 0);
    assert.equal(payoutFor('bust', 100), 0);
    assert.equal(payoutFor('dealer_blackjack', 100), 0);
  });

  it('only allows bets from 10 to 500 coins', () => {
    assert.equal(BET_MIN, 10);
    assert.equal(BET_MAX, 500);
    assert.equal(isValidBet(9), false);
    assert.equal(isValidBet(10), true);
    assert.equal(isValidBet(500), true);
    assert.equal(isValidBet(501), false);
  });
});
