/// <reference types="node" />
import { describe, test as it } from 'node:test';
import assert from 'node:assert/strict';
import { chipBreakdown, chipDenomination } from './chips';

const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);

describe('chipBreakdown', () => {
  it('stacks a 3:2 blackjack payout of 62 coins exactly', () => {
    assert.deepEqual(chipBreakdown(62), [50, 10, 1, 1]);
  });

  it('uses the fewest chips for a 750 coin stack', () => {
    assert.deepEqual(chipBreakdown(750), [500, 250]);
  });

  it('always adds up to the amount shown', () => {
    for (const n of [1, 9, 37, 75, 99, 125, 1499]) assert.equal(sum(chipBreakdown(n)), n);
  });

  it('draws nothing for an empty bet', () => {
    assert.deepEqual(chipBreakdown(0), []);
  });
});

describe('chipDenomination', () => {
  it('colors each table chip by its own value', () => {
    assert.deepEqual([10, 25, 50, 100, 250, 500].map(chipDenomination), [10, 25, 50, 100, 250, 500]);
  });
});
