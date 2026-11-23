/// <reference types="node" />
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { BOOKSEM_BOOKS, passPriceCents } from '../../supabase/functions/_shared/booksemBooks';
import { BOOKSEM_PASS_PRICE_COINS } from './booksemPass';

describe('Booksem 50% Off Pass', () => {
  test('costs 250 MiyTube Coins', () => {
    assert.equal(BOOKSEM_PASS_PRICE_COINS, 250);
  });

  test('charges half the book price, never rounding up', () => {
    assert.equal(passPriceCents(399), 199);
    assert.equal(passPriceCents(499), 249);
    assert.equal(passPriceCents(299), 149);
  });

  test('prices The Art of War at $1.99 with a pass', () => {
    assert.equal(passPriceCents(BOOKSEM_BOOKS['1'].priceCents), 199);
  });
});
