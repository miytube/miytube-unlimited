/**
 * Display helpers for MiyTube Sic Bo. The backend rolls the dice and pays
 * every bet (sicbo_roll); these mirror its pay table so the table can label odds.
 */
export const SICBO_MIN_BET = 10;
export const SICBO_MAX_STAKE = 500;
export const SICBO_MAX_BETS = 20;
export const SICBO_CHIPS = [10, 25, 50, 100] as const;

export type SicBoBetType = 'small' | 'big' | 'odd' | 'even' | 'total' | 'any_triple' | 'triple' | 'double' | 'single';

export interface SicBoBet {
  type: SicBoBetType;
  value: number;
  amount: number;
}

export interface SicBoResult {
  id: string;
  dice: number[];
  bets: (SicBoBet & { return: number })[];
  stake: number;
  payout: number;
  balance: number;
}

/** "x to 1" odds for a total of 4..17. */
export function totalOdds(total: number): number {
  if (total === 4 || total === 17) return 60;
  if (total === 5 || total === 16) return 30;
  if (total === 6 || total === 15) return 17;
  if (total === 7 || total === 14) return 12;
  if (total === 8 || total === 13) return 8;
  return 6;
}

export const ODDS_LABEL: Record<Exclude<SicBoBetType, 'total'>, string> = {
  small: '1 to 1',
  big: '1 to 1',
  odd: '1 to 1',
  even: '1 to 1',
  any_triple: '30 to 1',
  triple: '180 to 1',
  double: '10 to 1',
  single: '1·2·3 to 1',
};

/** Coins returned for one bet, stake included; 0 when it loses. */
export function betReturn(bet: SicBoBet, dice: number[]): number {
  const sum = dice[0] + dice[1] + dice[2];
  const triple = dice[0] === dice[1] && dice[1] === dice[2];
  const hits = dice.filter((d) => d === bet.value).length;
  let odds = 0;
  switch (bet.type) {
    case 'small':
      odds = !triple && sum >= 4 && sum <= 10 ? 1 : 0;
      break;
    case 'big':
      odds = !triple && sum >= 11 && sum <= 17 ? 1 : 0;
      break;
    case 'odd':
      odds = !triple && sum % 2 === 1 ? 1 : 0;
      break;
    case 'even':
      odds = !triple && sum % 2 === 0 ? 1 : 0;
      break;
    case 'total':
      odds = sum === bet.value ? totalOdds(bet.value) : 0;
      break;
    case 'any_triple':
      odds = triple ? 30 : 0;
      break;
    case 'triple':
      odds = triple && dice[0] === bet.value ? 180 : 0;
      break;
    case 'double':
      odds = hits >= 2 ? 10 : 0;
      break;
    case 'single':
      odds = hits;
      break;
  }
  return odds > 0 ? bet.amount * (odds + 1) : 0;
}

export const betKey = (type: SicBoBetType, value = 0) => `${type}:${value}`;

export function stakeOf(bets: SicBoBet[]): number {
  return bets.reduce((s, b) => s + b.amount, 0);
}
