import { describe, expect, it } from 'vitest';
import { chipBreakdown, chipDenomination } from './chips';

const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);

describe('chipBreakdown', () => {
  it('stacks a 3:2 blackjack payout of 62 coins exactly', () => {
    expect(chipBreakdown(62)).toEqual([50, 10, 1, 1]);
  });

  it('uses the fewest chips for a 750 coin stack', () => {
    expect(chipBreakdown(750)).toEqual([500, 250]);
  });

  it('always adds up to the amount shown', () => {
    for (const n of [1, 9, 37, 75, 99, 125, 1499]) expect(sum(chipBreakdown(n))).toBe(n);
  });

  it('draws nothing for an empty bet', () => {
    expect(chipBreakdown(0)).toEqual([]);
  });
});

describe('chipDenomination', () => {
  it('colors each table chip by its own value', () => {
    expect([10, 25, 50, 100, 250, 500].map(chipDenomination)).toEqual([10, 25, 50, 100, 250, 500]);
  });
});
