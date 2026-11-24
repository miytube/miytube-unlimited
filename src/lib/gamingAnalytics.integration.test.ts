import { describe, test as it } from 'node:test';
import assert from 'node:assert/strict';
import { gamingAnalyticsSchema } from './gamingAnalytics';

// These checks are opt-in against the hosted app; never put session credentials in source.
const enabled = process.env.RUN_GAMING_ANALYTICS_INTEGRATION === '1';
const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const token = process.env.GAMING_ANALYTICS_ADMIN_TOKEN;
const memberToken = process.env.GAMING_ANALYTICS_MEMBER_TOKEN;

async function request(body: object, accessToken?: string) {
  if (!url || !key) throw new Error('App connection is not configured');
  return fetch(`${url}/rest/v1/rpc/get_gaming_analytics`, {
    method: 'POST',
    headers: { apikey: key, Authorization: `Bearer ${accessToken ?? key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('Hosted Gaming Room analytics permissions', { skip: !enabled }, () => {
  it('denies signed-out access to aggregate gameplay totals', async () => {
    const response = await request({});
    assert.ok(response.status === 401 || response.status === 403);
  });
  it('denies a signed-in ordinary member access', { skip: !memberToken }, async () => {
    const response = await request({}, memberToken);
    assert.equal(response.status, 403);
    const data = await response.json();
    assert.equal(data.code, '42501');
  });
  it('lets a signed-in administrator read only aggregate data', async () => {
    assert.ok(token, 'An administrator session is required');
    const response = await request({}, token);
    assert.equal(response.status, 200);
    const data = gamingAnalyticsSchema.parse(await response.json());
    assert.equal(data.net_retained, data.wagered - data.returned);
    assert.equal(data.rounds, data.games.reduce((total, game) => total + game.rounds, 0));
    assert.equal(data.unsettled, data.games.reduce((total, game) => total + game.rounds - game.settled, 0));
    for (const game of data.games) {
      assert.equal(game.settled, game.wins + game.even + game.losses);
    }
    const mahjong = data.games.find(game => game.game === 'mahjong');
    assert.equal(mahjong?.rounds, 0);
    assert.equal(mahjong?.players, 0);
  });
  it('rejects reversed date bounds for an administrator', async () => {
    assert.ok(token, 'An administrator session is required');
    const response = await request({ _since: '2026-11-25T00:00:00Z', _until: '2026-11-24T00:00:00Z' }, token);
    assert.equal(response.status, 400);
    const data = await response.json();
    assert.equal(data.code, '22023');
  });
});