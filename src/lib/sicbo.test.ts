/// <reference types="node" />
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { SICBO_MAX_STAKE, SICBO_MIN_BET, betReturn, totalOdds } from './sicbo';

// betReturn gives coins back including the stake, so a 1-to-1 win on 100 returns 200.
describe('sic bo pay table', () => {
  test('big wins 1 to 1 on 11-17', () => {
    assert.equal(betReturn({ type: 'big', value: 0, amount: 100 }, [4, 5, 6]), 200);
  });
  test('big and small lose on any triple', () => {
    assert.equal(betReturn({ type: 'big', value: 0, amount: 100 }, [5, 5, 5]), 0);
    assert.equal(betReturn({ type: 'small', value: 0, amount: 100 }, [2, 2, 2]), 0);
  });
  test('small wins 1 to 1 on 4-10', () => {
    assert.equal(betReturn({ type: 'small', value: 0, amount: 100 }, [1, 2, 3]), 200);
  });
  test('odd and even pay 1 to 1 and lose on a triple', () => {
    assert.equal(betReturn({ type: 'odd', value: 0, amount: 10 }, [1, 2, 4]), 20);
    assert.equal(betReturn({ type: 'even', value: 0, amount: 10 }, [3, 3, 3]), 0);
  });
  test('totals pay 60, 30, 17, 12, 8, 6 to 1', () => {
    assert.deepEqual([4, 5, 6, 7, 8, 9, 10].map(totalOdds), [60, 30, 17, 12, 8, 6, 6]);
    assert.deepEqual([17, 16, 15, 14, 13, 12, 11].map(totalOdds), [60, 30, 17, 12, 8, 6, 6]);
    assert.equal(betReturn({ type: 'total', value: 4, amount: 10 }, [1, 1, 2]), 610);
  });
  test('any triple pays 30 to 1, a specific triple 180 to 1', () => {
    assert.equal(betReturn({ type: 'any_triple', value: 0, amount: 10 }, [2, 2, 2]), 310);
    assert.equal(betReturn({ type: 'triple', value: 5, amount: 10 }, [5, 5, 5]), 1810);
    assert.equal(betReturn({ type: 'triple', value: 5, amount: 10 }, [4, 4, 4]), 0);
  });
  test('a specific double pays 10 to 1', () => {
    assert.equal(betReturn({ type: 'double', value: 3, amount: 10 }, [3, 3, 1]), 110);
    assert.equal(betReturn({ type: 'double', value: 3, amount: 10 }, [3, 2, 1]), 0);
  });
  test('a single number pays 1, 2 or 3 to 1 per match', () => {
    assert.equal(betReturn({ type: 'single', value: 6, amount: 10 }, [6, 1, 2]), 20);
    assert.equal(betReturn({ type: 'single', value: 6, amount: 10 }, [6, 6, 2]), 30);
    assert.equal(betReturn({ type: 'single', value: 6, amount: 10 }, [6, 6, 6]), 40);
    assert.equal(betReturn({ type: 'single', value: 6, amount: 10 }, [1, 2, 3]), 0);
  });
  test('bets are at least 10 coins and up to 500 per roll', () => {
    assert.equal(SICBO_MIN_BET, 10);
    assert.equal(SICBO_MAX_STAKE, 500);
  });
});
