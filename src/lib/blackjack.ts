/**
 * Display helpers for MiyTube Blackjack. The backend deals, decides and pays
 * every hand; these mirror its rules so the table can label cards and totals.
 * Cards are 0..51: rank = card % 13 (0 = Ace … 12 = King), suit = card / 13.
 */
export const BET_MIN = 10;
export const BET_MAX = 500;
export const CHIP_VALUES = [10, 25, 50, 100, 250, 500] as const;

export type Suit = 'spades' | 'hearts' | 'diamonds' | 'clubs';
export const SUITS: Suit[] = ['spades', 'hearts', 'diamonds', 'clubs'];
export const SUIT_SYMBOL: Record<Suit, string> = { spades: '♠', hearts: '♥', diamonds: '♦', clubs: '♣' };
const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

export type HandStatus = 'playing' | 'blackjack' | 'win' | 'push' | 'lose' | 'bust' | 'dealer_blackjack';

export interface BlackjackView {
  id: string;
  bet: number;
  doubled: boolean;
  status: HandStatus;
  payout: number;
  player: number[];
  dealer: number[];
  dealer_hidden: number;
  player_total: number;
  dealer_total: number;
  can_double: boolean;
  balance: number;
}

export interface RecentHand {
  status: HandStatus;
  bet: number;
  payout: number;
}

export function cardRank(card: number): string {
  return RANKS[card % 13];
}

export function cardSuit(card: number): Suit {
  return SUITS[Math.floor(card / 13)];
}

export function isRedSuit(suit: Suit): boolean {
  return suit === 'hearts' || suit === 'diamonds';
}

/** Best blackjack total: aces count 11 unless that would bust. */
export function handValue(cards: number[]): number {
  let total = 0;
  let aces = 0;
  for (const c of cards) {
    const r = c % 13;
    if (r === 0) {
      aces += 1;
      total += 11;
    } else if (r >= 9) total += 10;
    else total += r + 1;
  }
  while (total > 21 && aces > 0) {
    total -= 10;
    aces -= 1;
  }
  return total;
}

/** Coins returned to the member for a finished hand (stake included). */
export function payoutFor(status: HandStatus, bet: number): number {
  switch (status) {
    case 'blackjack':
      return bet + Math.floor((bet * 3) / 2);
    case 'win':
      return bet * 2;
    case 'push':
      return bet;
    default:
      return 0;
  }
}

export function isValidBet(bet: number): boolean {
  return Number.isInteger(bet) && bet >= BET_MIN && bet <= BET_MAX;
}

export function resultLabel(status: HandStatus, bet: number, payout: number): { title: string; tone: 'win' | 'push' | 'lose' } {
  const net = payout - bet;
  switch (status) {
    case 'blackjack':
      return { title: `Blackjack! +${net.toLocaleString()} coins`, tone: 'win' };
    case 'win':
      return { title: `You win +${net.toLocaleString()} coins`, tone: 'win' };
    case 'push':
      return { title: 'Push — your bet is back', tone: 'push' };
    case 'bust':
      return { title: `Bust — −${bet.toLocaleString()} coins`, tone: 'lose' };
    case 'dealer_blackjack':
      return { title: `Dealer blackjack — −${bet.toLocaleString()} coins`, tone: 'lose' };
    default:
      return { title: `Dealer wins — −${bet.toLocaleString()} coins`, tone: 'lose' };
  }
}
