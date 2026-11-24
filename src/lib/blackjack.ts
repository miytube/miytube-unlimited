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
/** Result of one split hand; split hands never pay blackjack 3:2. */
export type SplitStatus = 'win' | 'push' | 'lose' | 'bust';
/** "split" only appears in history, where both hands are summed. */
export type HistoryStatus = HandStatus | 'split';

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
  /** Second hand after a split, or null. `player` is then the first hand. */
  split: number[] | null;
  split_bet: number;
  split_doubled: boolean;
  split_status: SplitStatus | null;
  split_payout: number;
  split_total: number | null;
  /** 1 or 2: which hand Hit/Stand/Double act on. */
  active_hand: 1 | 2;
  can_split: boolean;
  balance: number;
}

export interface RecentHand {
  status: HistoryStatus;
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

/** A pair can be split when both cards share a rank (8-8, K-K; K-Q does not). */
export function canSplitPair(cards: number[]): boolean {
  return cards.length === 2 && cards[0] % 13 === cards[1] % 13;
}

/** Split aces get one card each and the hand ends; other pairs are played out. */
export function isSplitAces(cards: number[]): boolean {
  return canSplitPair(cards) && cards[0] % 13 === 0;
}

/** Coins returned for one finished split hand (stake included). */
export function splitPayoutFor(status: SplitStatus, bet: number): number {
  return status === 'win' ? bet * 2 : status === 'push' ? bet : 0;
}

/** Banner for a finished split: both hands summed. */
export function splitResultLabel(totalBet: number, totalPayout: number): { title: string; tone: 'win' | 'push' | 'lose' } {
  const net = totalPayout - totalBet;
  if (net > 0) return { title: `Split hands: +${net.toLocaleString()} coins`, tone: 'win' };
  if (net === 0) return { title: 'Split hands: even — your bets are back', tone: 'push' };
  return { title: `Split hands: −${Math.abs(net).toLocaleString()} coins`, tone: 'lose' };
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
