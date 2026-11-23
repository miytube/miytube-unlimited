/**
 * Poker hand scoring that mirrors the backend's poker_score5 / poker_best, so
 * tables can name hands. Cards are 0..51 (rank = card % 13, 0 = Ace; suit = card / 13).
 * Score = category << 20 | five tiebreak ranks in 4-bit slots.
 */
export const HAND_NAMES = [
  'High card',
  'Pair',
  'Two pair',
  'Three of a kind',
  'Straight',
  'Flush',
  'Full house',
  'Four of a kind',
  'Straight flush',
] as const;

const rankValue = (c: number) => (c % 13 === 0 ? 14 : (c % 13) + 1);

export function score5(cards: number[]): number {
  const v = cards.map(rankValue).sort((a, b) => b - a);
  const flush = new Set(cards.map((c) => Math.floor(c / 13))).size === 1;
  let straight = false;
  let high = 0;
  if (new Set(v).size === 5) {
    if (v[0] - v[4] === 4) {
      straight = true;
      high = v[0];
    } else if (v.join() === '14,5,4,3,2') {
      straight = true;
      high = 5;
    }
  }
  const counts = new Map<number, number>();
  v.forEach((x) => counts.set(x, (counts.get(x) ?? 0) + 1));
  const groups = [...counts.entries()].sort((a, b) => b[1] - a[1] || b[0] - a[0]);
  let tb = groups.map((g) => g[0]);
  const n = groups.map((g) => g[1]);
  let cat: number;
  if (straight && flush) {
    cat = 8;
    tb = [high];
  } else if (n[0] === 4) cat = 7;
  else if (n[0] === 3 && n[1] === 2) cat = 6;
  else if (flush) {
    cat = 5;
    tb = v;
  } else if (straight) {
    cat = 4;
    tb = [high];
  } else if (n[0] === 3) cat = 3;
  else if (n[0] === 2 && n[1] === 2) cat = 2;
  else if (n[0] === 2) cat = 1;
  else {
    cat = 0;
    tb = v;
  }
  let score = 0;
  for (let i = 0; i < 5; i++) score = score * 16 + (tb[i] ?? 0);
  return (cat << 20) | score;
}

export function bestScore(cards: number[]): number {
  let best = -1;
  const n = cards.length;
  for (let a = 0; a < n - 4; a++)
    for (let b = a + 1; b < n - 3; b++)
      for (let c = b + 1; c < n - 2; c++)
        for (let d = c + 1; d < n - 1; d++)
          for (let e = d + 1; e < n; e++) best = Math.max(best, score5([cards[a], cards[b], cards[c], cards[d], cards[e]]));
  return best;
}

export const scoreCategory = (score: number) => score >> 20;

const RANK_PLURAL: Record<number, string> = {
  2: '2s', 3: '3s', 4: '4s', 5: '5s', 6: '6s', 7: '7s', 8: '8s', 9: '9s', 10: '10s',
  11: 'Jacks', 12: 'Queens', 13: 'Kings', 14: 'Aces',
};
const RANK_SINGLE: Record<number, string> = {
  2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8', 9: '9', 10: '10', 11: 'Jack', 12: 'Queen', 13: 'King', 14: 'Ace',
};

/** Plain-English hand name, e.g. "Pair of Kings" or "Full house, 7s over 2s". */
export function handName(score: number | null | undefined): string {
  if (score === null || score === undefined || score < 0) return '';
  const cat = scoreCategory(score);
  const t1 = (score >> 16) & 15;
  const t2 = (score >> 12) & 15;
  switch (cat) {
    case 8:
      return t1 === 14 ? 'Royal flush' : `${RANK_SINGLE[t1]}-high straight flush`;
    case 7:
      return `Four ${RANK_PLURAL[t1]}`;
    case 6:
      return `Full house, ${RANK_PLURAL[t1]} over ${RANK_PLURAL[t2]}`;
    case 5:
      return `${RANK_SINGLE[t1]}-high flush`;
    case 4:
      return `${RANK_SINGLE[t1]}-high straight`;
    case 3:
      return `Three ${RANK_PLURAL[t1]}`;
    case 2:
      return `Two pair, ${RANK_PLURAL[t1]} and ${RANK_PLURAL[t2]}`;
    case 1:
      return `Pair of ${RANK_PLURAL[t1]}`;
    default:
      return t1 ? `${RANK_SINGLE[t1]} high` : '';
  }
}

/** Texas Hold'em ante pay table ("x to 1") by the player's best hand. */
export function holdemAnteOdds(score: number): number {
  const cat = scoreCategory(score);
  if (cat === 8 && ((score >> 16) & 15) === 14) return 100;
  if (cat === 8) return 20;
  if (cat === 7) return 10;
  if (cat === 6) return 3;
  if (cat === 5) return 2;
  return 1;
}

/** Dealer needs a pair of 4s or better to qualify. */
export function dealerQualifies(score: number): boolean {
  const cat = scoreCategory(score);
  return cat >= 2 || (cat === 1 && ((score >> 16) & 15) >= 4);
}

export type HoldemStatus = 'playing' | 'folded' | 'win' | 'lose' | 'push' | 'dealer_no_qualify';

/** Coins returned after calling (ante + call included). */
export function holdemReturn(playerScore: number, dealerScore: number, ante: number): { status: HoldemStatus; payout: number } {
  const call = ante * 2;
  if (!dealerQualifies(dealerScore)) return { status: 'dealer_no_qualify', payout: ante * (holdemAnteOdds(playerScore) + 1) + call };
  if (playerScore > dealerScore) return { status: 'win', payout: ante * (holdemAnteOdds(playerScore) + 1) + call * 2 };
  if (playerScore === dealerScore) return { status: 'push', payout: ante + call };
  return { status: 'lose', payout: 0 };
}

export const HOLDEM_ANTE_MIN = 10;
export const HOLDEM_ANTE_MAX = 100;
export const HOLDEM_CHIPS = [10, 25, 50, 100] as const;

export const HOLDEM_PAYTABLE: { hand: string; odds: number }[] = [
  { hand: 'Royal flush', odds: 100 },
  { hand: 'Straight flush', odds: 20 },
  { hand: 'Four of a kind', odds: 10 },
  { hand: 'Full house', odds: 3 },
  { hand: 'Flush', odds: 2 },
  { hand: 'Straight or less', odds: 1 },
];
