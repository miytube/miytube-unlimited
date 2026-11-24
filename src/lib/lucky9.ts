import { z } from 'zod';

export const LUCKY9_BET_MIN = 10;
export const LUCKY9_BET_MAX = 500;
export const LUCKY9_CHIPS = [10, 25, 50, 100, 250, 500] as const;
export const lucky9BetSchema = z.number().int().min(LUCKY9_BET_MIN).max(LUCKY9_BET_MAX);
export const lucky9StatusSchema = z.enum(['playing', 'win', 'push', 'lose']);
export type Lucky9Status = z.infer<typeof lucky9StatusSchema>;

/** Display/test mirror only; the server owns cards, decisions and coin settlement. */
export function lucky9Value(cards: readonly number[]): number {
  return cards.reduce((sum, card) => {
    const rank = card % 13;
    return sum + (rank < 9 ? rank + 1 : 0);
  }, 0) % 10;
}

export function lucky9Natural(cards: readonly number[]): boolean {
  return cards.length === 2 && lucky9Value(cards) >= 8;
}

export function lucky9BankerDraws(player: readonly number[], banker: readonly number[]): boolean {
  return !lucky9Natural(player) && !lucky9Natural(banker) && lucky9Value(banker) <= 5;
}

export function lucky9Outcome(player: readonly number[], banker: readonly number[], bet: number) {
  const p = lucky9Value(player);
  const b = lucky9Value(banker);
  const status: Exclude<Lucky9Status, 'playing'> = p > b ? 'win' : p === b ? 'push' : 'lose';
  return { status, payout: status === 'win' ? bet * 2 : status === 'push' ? bet : 0 };
}

const card = z.number().int().min(0).max(51);
export const lucky9ViewSchema = z.object({
  id: z.string().uuid(), bet: lucky9BetSchema, status: lucky9StatusSchema,
  payout: z.number().int().nonnegative(), player: z.array(card).min(2).max(3),
  dealer: z.array(card).max(3), dealer_hidden: z.number().int().min(0).max(2),
  player_total: z.number().int().min(0).max(9),
  dealer_total: z.number().int().min(0).max(9).nullable(),
  natural: z.boolean(), balance: z.number().int().nonnegative(),
}).strict();
export type Lucky9View = z.infer<typeof lucky9ViewSchema>;
export const lucky9RecentSchema = z.object({
  status: lucky9StatusSchema.exclude(['playing']), bet: lucky9BetSchema,
  payout: z.number().int().nonnegative(),
}).strict();
export type Lucky9Recent = z.infer<typeof lucky9RecentSchema>;
export const lucky9CurrentSchema = z.object({
  hand: lucky9ViewSchema.nullable(), recent: z.array(lucky9RecentSchema).max(10),
}).strict();