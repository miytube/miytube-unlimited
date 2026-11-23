/**
 * Display helpers for MiyTube Pai Gow Poker. The backend deals, splits the
 * dealer's cards by the house way and pays (paigow_deal / paigow_set).
 */
import { HAND_NAMES, score5 } from './poker';

export const PAIGOW_BET_MIN = 10;
export const PAIGOW_BET_MAX = 500;
export const PAIGOW_CHIPS = [10, 25, 50, 100, 250] as const;
export const PAIGOW_COMMISSION_PERCENT = 5;

export type PaiGowStatus = 'playing' | 'win' | 'push' | 'lose';

const rankValue = (c: number) => (c % 13 === 0 ? 14 : (c % 13) + 1);
const RANK = ['', '', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

/** Two-card low hand on the same scale as score5. */
export function score2(cards: number[]): number {
  const [a, b] = cards.map(rankValue);
  if (a === b) return (1 << 20) | (a << 16);
  return (Math.max(a, b) << 16) | (Math.min(a, b) << 12);
}

export function lowName(score: number): string {
  if (score >> 20 === 1) return `Pair of ${RANK[(score >> 16) & 15]}s`;
  return `${RANK[(score >> 16) & 15]}-${RANK[(score >> 12) & 15]} high`;
}

/** The 5-card high hand must beat the 2-card low hand. */
export function splitIsValid(seven: number[], low: number[]): boolean {
  if (low.length !== 2) return false;
  const high = seven.filter((c) => !low.includes(c));
  return high.length === 5 && score5(high) > score2(low);
}

/** Coins returned: win both = 1 to 1 less 5%; win one = bet back; else nothing (ties go to the banker). */
export function paigowReturn(bet: number, highWins: boolean, lowWins: boolean): { status: PaiGowStatus; payout: number } {
  const wins = Number(highWins) + Number(lowWins);
  if (wins === 2) return { status: 'win', payout: bet + Math.floor((bet * (100 - PAIGOW_COMMISSION_PERCENT)) / 100) };
  if (wins === 1) return { status: 'push', payout: bet };
  return { status: 'lose', payout: 0 };
}

export const highCategoryName = (score: number) => HAND_NAMES[score >> 20];
