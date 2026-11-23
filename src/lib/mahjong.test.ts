/// <reference types="node" />
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { LAYOUT, Tile, findHint, isFree, newBoard, reshuffle } from './mahjong';

// Small seeded random so the test is repeatable.
const seeded = (seed: number) => () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
};

describe('mahjong solitaire', () => {
  test('the board has 72 tiles', () => assert.equal(LAYOUT.length, 72));

  test('every tile face appears an even number of times', () => {
    const { tiles } = newBoard(seeded(1));
    const counts = new Map<string, number>();
    tiles.forEach((t) => counts.set(t.face.id, (counts.get(t.face.id) ?? 0) + 1));
    for (const n of counts.values()) assert.equal(n % 2, 0);
  });

  for (const seed of [1, 2, 3, 42, 99]) {
    test(`deal ${seed} can be cleared`, () => {
      const { tiles, solution } = newBoard(seeded(seed));
      let left: Tile[] = tiles;
      for (const [a, b] of solution) {
        const ta = left.find((t) => t.key === a)!;
        const tb = left.find((t) => t.key === b)!;
        assert.equal(ta.face.id, tb.face.id);
        assert.ok(isFree(ta, left) && isFree(tb, left));
        left = left.filter((t) => t !== ta && t !== tb);
      }
      assert.equal(left.length, 0);
    });
  }

  test('a top tile is free; a covered base tile is not', () => {
    const { tiles } = newBoard(seeded(7));
    const top = tiles.find((t) => t.z === 3)!;
    const covered = tiles.find((t) => t.z === 0 && t.x === 3 && t.y === 2)!;
    assert.equal(isFree(top, tiles), true);
    assert.equal(isFree(covered, tiles), false);
  });

  test('reshuffling keeps the same tiles in play and leaves a match', () => {
    const { tiles } = newBoard(seeded(5));
    const half = tiles.slice(0, 40);
    const again = reshuffle(half, seeded(6));
    assert.equal(again.length, 40);
    assert.ok(findHint(again));
  });
});
