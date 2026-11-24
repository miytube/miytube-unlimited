export const TOURNAMENT_STARTING_CHIPS = 10_000;
export const TOURNAMENT_SEATS = 6;
export const HANDS_PER_LEVEL = 6;
export const BLIND_LEVELS = [100, 200, 400, 800, 1600, 3200, 6400, 12800, 25600, 51200] as const;
export const TOURNAMENT_BOTS = [
  { name: 'Vega', style: 'Aggressive', suit: 'spades' },
  { name: 'Atlas', style: 'Tight', suit: 'clubs' },
  { name: 'Jade', style: 'Patient', suit: 'diamonds' },
  { name: 'Blaze', style: 'Loose', suit: 'hearts' },
  { name: 'River', style: 'Caller', suit: 'spades' },
] as const;
export type TournamentAction = 'fold' | 'check' | 'call' | 'bet' | 'raise';
export type TournamentStatus = 'playing' | 'champion' | 'eliminated';
export interface TournamentSeatView {
  seat: number; name: string; style: string; stack: number; bet: number;
  cards: number[]; folded: boolean; eliminated: boolean; allIn: boolean;
  action: string; place: number | null;
}
export interface TournamentView {
  id: string; version: number; status: TournamentStatus; hand: number;
  level: number; smallBlind: number; bigBlind: number; handsToNextLevel: number;
  button: number; actor: number | null; street: string; board: number[];
  pot: number; pots: { size: number; eligiblePlayers: number[] }[];
  seats: TournamentSeatView[]; legal: TournamentAction[];
  minRaise: number | null; maxRaise: number | null; callAmount: number;
  finished: boolean; result: string; winners: number[];
  log: string[]; place: number | null;
  recent: { hand: number; result: string; net: number }[];
}