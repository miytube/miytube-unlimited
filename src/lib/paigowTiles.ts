/**
 * Display helpers for MiyTube Pai Gow Tiles (32 Chinese dominoes). The backend
 * deals, splits the banker's tiles by the house way and pays
 * (pgtiles_deal / pgtiles_set); keep these rules in step with that migration.
 */
export { PAIGOW_BET_MIN as PGTILES_BET_MIN, PAIGOW_BET_MAX as PGTILES_BET_MAX, PAIGOW_CHIPS as PGTILES_CHIPS, paigowReturn } from './paigow';

export interface DominoTile {
  /** Pips on each half. */
  top: number;
  bottom: number;
  /** 1 = Teen (best) … 16 = Gee Joon tiles (lowest single tile). */
  rank: number;
  name: string;
}

const TILE_PIPS: [number, number][] = [
  [6, 6], [6, 6], [1, 1], [1, 1], [4, 4], [4, 4], [1, 3], [1, 3], [5, 5], [5, 5], [3, 3], [3, 3],
  [2, 2], [2, 2], [5, 6], [5, 6], [4, 6], [4, 6], [1, 6], [1, 6], [1, 5], [1, 5],
  [4, 5], [3, 6], [3, 5], [2, 6], [3, 4], [2, 5], [1, 4], [2, 3], [1, 2], [2, 4],
];
const RANK_NAMES = ['', 'Teen', 'Day', 'Yun', 'Gor', 'Mooy', 'Chong', 'Bon', 'Foo', 'Ping', 'Tit', 'Look', 'Mixed 9', 'Mixed 8', 'Mixed 7', 'Mixed 5', 'Gee Joon'];

/** Tile ids 0–31: 11 civil pairs (0–21), 8 military singles that pair by total (22–29), Gee Joon (30, 31). */
export const TILES: DominoTile[] = TILE_PIPS.map(([top, bottom], id) => {
  const rank = Math.floor(Math.min(id, 22) / 2) + 1 + (id >= 22 ? Math.floor((id - 22) / 2) : 0);
  return { top, bottom, rank, name: RANK_NAMES[rank] };
});

const isNine = (t: number) => t === 22 || t === 23;
const isEight = (t: number) => t === 4 || t === 5 || t === 24 || t === 25;

/**
 * Two-tile hand score (higher wins; equal is a copy, which the banker wins):
 * pairs 3001–3016 (Gee Joon best) > Wong 2001–2002 > Gong 1901–1902 > 9…1 points
 * as 100 × points + the better tile's rank. Every 0-point hand scores 0.
 */
export function tileScore(hand: number[]): number {
  const [a, b] = hand;
  const ra = TILES[a].rank;
  const rb = TILES[b].rank;
  if (ra === rb) return 3000 + 16 - (ra === 16 ? 0 : ra);
  for (const [td, other] of [[a, b], [b, a]]) {
    const r = TILES[td].rank;
    if (r > 2) continue;
    if (isNine(other)) return 2000 + 3 - r;
    if (isEight(other)) return 1900 + 3 - r;
  }
  const values = (t: number) => (t >= 30 ? [3, 6] : [TILES[t].top + TILES[t].bottom]);
  let points = 0;
  for (const x of values(a)) for (const y of values(b)) points = Math.max(points, (x + y) % 10);
  return points === 0 ? 0 : 100 * points + 17 - Math.min(ra, rb);
}

export function tileHandName(score: number): string {
  if (score >= 3000) return score === 3016 ? 'Gee Joon pair' : `Pair of ${RANK_NAMES[3016 - score]}`;
  if (score >= 2000) return `Wong (${score === 2002 ? 'Teen' : 'Day'})`;
  if (score >= 1900) return `Gong (${score === 1902 ? 'Teen' : 'Day'})`;
  const points = Math.floor(score / 100);
  return points === 0 ? '0 points' : `${points} point${points === 1 ? '' : 's'}`;
}

/** Split four tiles: `pair` is two tiles played together; returns [high, low] with scores. */
export function splitTiles(four: number[], pair: number[]) {
  const rest = four.filter((t) => !pair.includes(t));
  const s1 = tileScore(pair);
  const s2 = tileScore(rest);
  return s1 >= s2
    ? { high: pair, low: rest, highScore: s1, lowScore: s2 }
    : { high: rest, low: pair, highScore: s2, lowScore: s1 };
}

/** House way: keep a pair together when there is one; otherwise make the low hand as strong as possible. */
export function houseWay(four: number[]): number[] {
  const options = [1, 2, 3].map((j) => splitTiles(four, [four[0], four[j]]));
  const withPair = options.filter((o) => o.highScore >= 3000);
  const pool = withPair.length ? withPair : options;
  pool.sort((x, y) => y.lowScore - x.lowScore || y.highScore - x.highScore);
  return pool[0].high;
}

/** Player wins a hand only when strictly higher; copies go to the banker. */
export function settleTiles(player: { highScore: number; lowScore: number }, banker: { highScore: number; lowScore: number }) {
  return { highWins: player.highScore > banker.highScore, lowWins: player.lowScore > banker.lowScore };
}
