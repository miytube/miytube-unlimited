import { describe, test as it } from 'node:test';
import assert from 'node:assert/strict';
import { gamingAnalyticsSchema, gamingDateRange, playerWinRate, popularCoinTable, type GamingTableAnalytics } from './gamingAnalytics';

const table: GamingTableAnalytics = {
  game: 'blackjack', rounds: 4, players: 2, settled: 3, wins: 1, even: 1, losses: 1, page_views: 8,
};
const data = {
  rounds: 4, players: 2, unsettled: 1, page_views: 10, lobby_views: 2,
  wagered: 200, returned: 150, net_retained: 50, games: [table],
};

describe('Gaming Room analytics', () => {
  it('starts Today at local midnight and uses an exclusive current-time end', () => {
    const now = new Date(2026, 10, 24, 15, 18);
    assert.deepEqual(gamingDateRange('today', now), {
      _since: new Date(2026, 10, 24).toISOString(), _until: now.toISOString(),
    });
  });
  it('includes exactly seven calendar dates in the seven-day filter', () => {
    assert.equal(gamingDateRange('7d', new Date(2026, 10, 24, 15))._since, new Date(2026, 10, 18).toISOString());
  });
  it('includes exactly thirty calendar dates across a month boundary', () => {
    assert.equal(gamingDateRange('30d', new Date(2026, 10, 24, 15))._since, new Date(2026, 9, 26).toISOString());
  });
  it('leaves the start unbounded for All time', () => {
    assert.equal(gamingDateRange('all')._since, null);
  });
  it('excludes unfinished rounds from the player win-rate denominator', () => {
    assert.equal(playerWinRate(table), 100 / 3);
    assert.equal(playerWinRate({ ...table, settled: 0, wins: 0 }), null);
  });
  it('ranks table popularity by rounds, not visits or extra split bets', () => {
    assert.equal(popularCoinTable({ ...data, games: [table, { ...table, game: 'poker', rounds: 5, page_views: 1 }] })?.game, 'poker');
    assert.equal(popularCoinTable({ ...data, games: [{ ...table, rounds: 0 }] }), null);
  });
  it('keeps Mahjong free-play visits separate from coin-table rounds', () => {
    assert.equal(popularCoinTable({ ...data, games: [table, { ...table, game: 'mahjong', rounds: 100 }] })?.game, 'blackjack');
  });
  it('accepts negative net coin flow when returns exceed wagers', () => {
    assert.equal(gamingAnalyticsSchema.parse({ ...data, returned: 250, net_retained: -50 }).net_retained, -50);
  });
  it('rejects incomplete totals instead of presenting false zero activity', () => {
    assert.equal(gamingAnalyticsSchema.safeParse({ games: [] }).success, false);
  });
  it('includes Lucky 9 rounds in table popularity without exposing cards', () => {
    const lucky = { ...table, game: 'lucky-9' as const, rounds: 5 };
    assert.equal(gamingAnalyticsSchema.parse({ ...data, games: [lucky] }).games[0].game, 'lucky-9');
    assert.equal(popularCoinTable({ ...data, games: [table, lucky] })?.game, 'lucky-9');
  });
  it('rejects any private player or card details in the summary', () => {
    assert.equal(gamingAnalyticsSchema.safeParse({ ...data, user_id: 'private-user' }).success, false);
    assert.equal(gamingAnalyticsSchema.safeParse({ ...data, games: [{ ...table, dealer: [0, 12] }] }).success, false);
  });
});