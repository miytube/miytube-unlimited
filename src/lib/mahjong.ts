/**
 * Mahjong solitaire: match free pairs of identical tiles until the board is clear.
 * A tile is free when nothing sits on top of it and its left or right side is open.
 * Boards are dealt by playing a full layout backwards, so every deal can be cleared.
 */
export type TileSuit = 'characters' | 'dots' | 'bamboo' | 'wind' | 'dragon';

export interface TileFace {
  id: string;
  suit: TileSuit;
  rank: number; // 1..9 for suits; 1..4 winds (E S W N); 1..3 dragons (red, green, white)
}

export interface Slot {
  x: number; // in tile widths (can be .5)
  y: number; // in tile heights (can be .5)
  z: number; // layer
}

export interface Tile extends Slot {
  key: number;
  face: TileFace;
}

/** 72-slot pyramid: 8x6 base, 6x3 second layer, 2x2 third, 2 on top. */
export const LAYOUT: Slot[] = (() => {
  const s: Slot[] = [];
  for (let y = 0; y < 6; y++) for (let x = 0; x < 8; x++) s.push({ x, y, z: 0 });
  for (let y = 0; y < 3; y++) for (let x = 1; x < 7; x++) s.push({ x, y: y + 1.5, z: 1 });
  for (let y = 0; y < 2; y++) for (let x = 3; x < 5; x++) s.push({ x, y: y + 2, z: 2 });
  s.push({ x: 3.5, y: 2, z: 3 }, { x: 3.5, y: 3, z: 3 });
  return s;
})();
export const LAYOUT_COLS = 8;
export const LAYOUT_ROWS = 6;

export const ALL_FACES: TileFace[] = [
  ...(['characters', 'dots', 'bamboo'] as const).flatMap((suit) =>
    Array.from({ length: 9 }, (_, i) => ({ id: `${suit}-${i + 1}`, suit, rank: i + 1 })),
  ),
  ...[1, 2, 3, 4].map((rank) => ({ id: `wind-${rank}`, suit: 'wind' as const, rank })),
  ...[1, 2, 3].map((rank) => ({ id: `dragon-${rank}`, suit: 'dragon' as const, rank })),
];

const overlaps = (a: Slot, b: Slot) => Math.abs(a.x - b.x) < 1 && Math.abs(a.y - b.y) < 1;

export function isFree(tile: Slot, others: Slot[]): boolean {
  let left = false;
  let right = false;
  for (const o of others) {
    if (o === tile) continue;
    if (o.z === tile.z + 1 && overlaps(o, tile)) return false;
    if (o.z === tile.z && Math.abs(o.y - tile.y) < 1) {
      if (Math.abs(o.x - (tile.x - 1)) < 0.5) left = true;
      if (Math.abs(o.x - (tile.x + 1)) < 0.5) right = true;
    }
  }
  return !(left && right);
}

function shuffle<T>(arr: T[], rand: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Put faces on the given slots so the board can be cleared. Returns the tiles
 * and one winning order (pairs of keys) — the order tiles were lifted while dealing.
 */
export function dealSlots(slots: (Slot & { key: number })[], rand: () => number = Math.random) {
  for (let attempt = 0; attempt < 200; attempt++) {
    const pairCount = slots.length / 2;
    const faces = shuffle(ALL_FACES, rand);
    const pool: TileFace[] = Array.from({ length: pairCount }, (_, i) => faces[i % faces.length]);
    const order = shuffle(pool, rand);
    let remaining = [...slots];
    const placed = new Map<number, TileFace>();
    const solution: [number, number][] = [];
    let stuck = false;
    for (const face of order) {
      const free = remaining.filter((s) => isFree(s, remaining));
      if (free.length < 2) {
        stuck = true;
        break;
      }
      const [a, b] = shuffle(free, rand);
      placed.set(a.key, face);
      placed.set(b.key, face);
      solution.push([a.key, b.key]);
      remaining = remaining.filter((s) => s !== a && s !== b);
    }
    if (!stuck) {
      const tiles: Tile[] = slots.map((s) => ({ ...s, face: placed.get(s.key)! }));
      return { tiles, solution };
    }
  }
  throw new Error('Could not deal a board');
}

export function newBoard(rand: () => number = Math.random) {
  return dealSlots(
    LAYOUT.map((s, key) => ({ ...s, key })),
    rand,
  );
}

/** Re-deal faces on the tiles still on the board, keeping it clearable. */
export function reshuffle(tiles: Tile[], rand: () => number = Math.random): Tile[] {
  return dealSlots(
    tiles.map(({ x, y, z, key }) => ({ x, y, z, key })),
    rand,
  ).tiles;
}

export function findHint(tiles: Tile[]): [Tile, Tile] | null {
  const free = tiles.filter((t) => isFree(t, tiles));
  for (let i = 0; i < free.length; i++)
    for (let j = i + 1; j < free.length; j++) if (free[i].face.id === free[j].face.id) return [free[i], free[j]];
  return null;
}

/** How many pairs can be taken right now: free tiles grouped by face, two per pair. */
export function countOpenPairs(tiles: Tile[]): number {
  const counts = new Map<string, number>();
  for (const t of tiles) if (isFree(t, tiles)) counts.set(t.face.id, (counts.get(t.face.id) ?? 0) + 1);
  let pairs = 0;
  for (const n of counts.values()) pairs += Math.floor(n / 2);
  return pairs;
}

export const WIND_CHARS = ['東', '南', '西', '北'];
export const DRAGON_CHARS = ['中', '發', ''];
export const CHINESE_NUMERALS = ['一', '二', '三', '四', '五', '六', '七', '八', '九'];
