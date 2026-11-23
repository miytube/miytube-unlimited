/// <reference types="node" />
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { PGTILES_BET_MAX, PGTILES_BET_MIN, TILES, houseWay, paigowReturn, settleTiles, splitTiles, tileHandName, tileScore } from './paigowTiles';

// Tile ids: Teen 0/1, Day 2/3, Yun 4/5, Gor 6/7, Mooy 8/9, Chong 10/11, Bon 12/13, Foo 14/15, Ping 16/17,
// Tit 18/19, Look 20/21, 9s 22/23, 8s 24/25, 7s 26/27, 5s 28/29, Gee Joon 30 (1-2) / 31 (2-4).
const name = (h: number[]) => tileHandName(tileScore(h));
const sorted = (h: number[]) => [...h].sort((a, b) => a - b);

describe('pai gow tiles', () => {
  test('the set is 32 Chinese dominoes with 227 pips', () => {
    assert.equal(TILES.length, 32);
    assert.equal(TILES.reduce((s, t) => s + t.top + t.bottom, 0), 227);
    assert.deepEqual(TILES.map((t) => t.rank), [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15, 16, 16]);
  });
  test('bets are 10 to 500 coins', () => {
    assert.equal(PGTILES_BET_MIN, 10);
    assert.equal(PGTILES_BET_MAX, 500);
  });
  test('Gee Joon pair is the best hand, then Teen pair; even mixed 5s beat a Wong', () => {
    assert.equal(name([30, 31]), 'Gee Joon pair');
    assert.equal(name([0, 1]), 'Pair of Teen');
    assert.ok(tileScore([30, 31]) > tileScore([0, 1]));
    assert.ok(tileScore([0, 1]) > tileScore([2, 3]));
    assert.ok(tileScore([28, 29]) > tileScore([0, 22]));
    assert.equal(name([22, 23]), 'Pair of Mixed 9');
  });
  test('Wong (Teen/Day + 9) beats Gong (Teen/Day + 8), which beats 9 points', () => {
    assert.equal(name([0, 22]), 'Wong (Teen)');
    assert.equal(name([3, 4]), 'Gong (Day)');
    assert.ok(tileScore([0, 22]) > tileScore([2, 23]));
    assert.ok(tileScore([2, 23]) > tileScore([0, 25]));
    assert.equal(name([8, 22]), '9 points');
    assert.ok(tileScore([3, 24]) > tileScore([8, 22]));
  });
  test('points are pips mod 10; Gee Joon tiles count as 3 or 6, whichever is better', () => {
    assert.equal(name([18, 20]), '3 points'); // 7 + 6
    assert.equal(name([8, 16]), '0 points'); // 10 + 10
    assert.equal(name([30, 10]), '9 points'); // 1-2 as 3, + 6
    assert.equal(name([31, 12]), '7 points'); // 2-4 as 3, + 4
    assert.equal(name([30, 28]), '8 points'); // 1-2 as 3, + 5
  });
  test('equal points: the better single tile wins; same best tile or 0 points is a copy for the banker', () => {
    assert.ok(tileScore([0, 26]) > tileScore([2, 27])); // 9 with Teen beats 9 with Day
    assert.equal(tileScore([0, 26]), tileScore([1, 27]));
    assert.equal(tileScore([8, 16]), tileScore([10, 6])); // both 0 points
    assert.deepEqual(settleTiles({ highScore: 916, lowScore: 0 }, { highScore: 916, lowScore: 0 }), { highWins: false, lowWins: false });
  });
  test('the stronger pairing is always the high hand', () => {
    const s = splitTiles([18, 20, 0, 1], [18, 20]);
    assert.deepEqual(sorted(s.high), [0, 1]);
    assert.deepEqual(sorted(s.low), [18, 20]);
  });
  test('house way keeps a pair together, otherwise builds the best low hand', () => {
    assert.deepEqual(sorted(houseWay([0, 18, 1, 29])), [0, 1]);
    assert.deepEqual(sorted(houseWay([0, 22, 8, 16])), [8, 22]); // 9 points high, Teen + Ping 2 low
  });
  test('win both pays 1 to 1 less 5%, one each returns the bet', () => {
    assert.deepEqual(paigowReturn(100, true, true), { status: 'win', payout: 195 });
    assert.deepEqual(paigowReturn(100, true, false), { status: 'push', payout: 100 });
    assert.deepEqual(paigowReturn(100, false, false), { status: 'lose', payout: 0 });
  });
});
