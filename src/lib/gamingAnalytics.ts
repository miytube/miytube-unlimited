import { z } from 'zod';

export const GAMING_PERIODS = ['today', '7d', '30d', 'all'] as const;
export type GamingPeriod = typeof GAMING_PERIODS[number];

const count = z.number().int().nonnegative();
export const gamingAnalyticsSchema = z.object({
  rounds: count,
  players: count,
  unsettled: count,
  page_views: count,
  lobby_views: count,
  wagered: count,
  returned: count,
  net_retained: z.number().int(),
  games: z.array(z.object({
    game: z.enum(['blackjack', 'poker', 'sic-bo', 'pai-gow', 'pai-gow-tiles', 'mahjong']),
    rounds: count,
    players: count,
    settled: count,
    wins: count,
    even: count,
    losses: count,
    page_views: count,
  }).strict()),
}).strict();

export type GamingAnalytics = z.infer<typeof gamingAnalyticsSchema>;
export type GamingTableAnalytics = GamingAnalytics['games'][number];

export const GAMING_TABLE_NAMES: Record<GamingTableAnalytics['game'], string> = {
  blackjack: 'Blackjack',
  poker: "Texas Hold’em",
  'sic-bo': 'Sic Bo',
  'pai-gow': 'Pai Gow Poker',
  'pai-gow-tiles': 'Pai Gow Tiles',
  mahjong: 'Mahjong',
};

/** Calendar dates in the viewer's timezone, with an exclusive upper bound. */
export function gamingDateRange(period: GamingPeriod, now = new Date()) {
  const since = new Date(now);
  since.setHours(0, 0, 0, 0);
  if (period === '7d') since.setDate(since.getDate() - 6);
  if (period === '30d') since.setDate(since.getDate() - 29);
  return { _since: period === 'all' ? null : since.toISOString(), _until: now.toISOString() };
}

/** A split round is profitable only when both returns combined exceed both stakes. */
export function playerWinRate(game: GamingTableAnalytics): number | null {
  return game.settled === 0 ? null : game.wins * 100 / game.settled;
}

export function popularCoinTable(data: GamingAnalytics): GamingTableAnalytics | null {
  return data.games.filter(game => game.game !== 'mahjong' && game.rounds > 0)
    .sort((a, b) => b.rounds - a.rounds || a.game.localeCompare(b.game))[0] ?? null;
}