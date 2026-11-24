import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { lucky9CurrentSchema, lucky9Natural, lucky9Outcome, lucky9Value, lucky9ViewSchema } from './lucky9';

// Opt-in on an isolated test member only; never use the owner's wallet for these checks.
const enabled = process.env.RUN_LUCKY9_INTEGRATION === '1';
const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const token = process.env.LUCKY9_TEST_MEMBER_TOKEN;

async function rpc(name: string, body: object = {}, signedIn = true) {
  if (!url || !key || (signedIn && !token)) throw new Error('Test member connection required');
  return fetch(`${url}/rest/v1/rpc/${name}`, { method: 'POST',
    headers: { apikey: key, Authorization: `Bearer ${signedIn ? token : key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body) });
}

describe('Hosted Lucky 9 rules and security', { skip: !enabled }, () => {
  test('guests cannot deal, draw, stand or read a hand', async () => {
    for (const [name, body] of [
      ['lucky9_current', {}], ['lucky9_deal', { _bet: 10 }],
      ['lucky9_draw', { _hand_id: '00000000-0000-4000-8000-000000000001' }],
      ['lucky9_stand', { _hand_id: '00000000-0000-4000-8000-000000000001' }],
    ] as const) {
      const response = await rpc(name, body, false);
      assert.ok(response.status === 401 || response.status === 403);
    }
  });
  test('members cannot read private cards or invoke settlement helpers', async () => {
    assert.ok(url && key && token);
    const response = await fetch(`${url}/rest/v1/lucky9_hands?select=*`, {
      headers: { apikey: key, Authorization: `Bearer ${token}` },
    });
    assert.equal(response.status, 403);
    const helper = await rpc('lucky9_finish', { _hand_id: '00000000-0000-4000-8000-000000000001', _draw: false });
    assert.ok(helper.status === 403 || helper.status === 404);
  });
  test('all 52 server card values match the declared scoring rules', async () => {
    for (let card = 0; card < 52; card++) {
      const response = await rpc('lucky9_value', { _cards: [card] });
      assert.equal(response.status, 200);
      assert.equal(await response.json(), lucky9Value([card]));
    }
    const response = await rpc('lucky9_value', { _cards: [6, 7] });
    assert.equal(await response.json(), 5);
  });
  test('out-of-range and fractional bets are rejected without charging coins', async () => {
    const start = await rpc('get_coin_wallet');
    const before = await start.json();
    for (const bet of [9, 501, 10.5, null]) {
      assert.equal((await rpc('lucky9_deal', { _bet: bet })).ok, false);
    }
    assert.equal((await (await rpc('get_coin_wallet')).json()).balance, before.balance);
  });
  test('rejects actions on another or nonexistent hand', async () => {
    assert.equal((await rpc('lucky9_stand', { _hand_id: '00000000-0000-4000-8000-000000000001' })).ok, false);
  });
  test('real deals honor natural/draw/stand rules, save history and settle once', async () => {
    const outcomes = new Set<string>();
    let sawDraw = false, sawStand = false, sawNatural = false, checkedRace = false;
    let lastId = '';
    for (let round = 0; round < 80; round++) {
      const before = await (await rpc('get_coin_wallet')).json();
      assert.ok(before.balance >= 10, 'Test member exhausted its coins');
      const dealt = await rpc('lucky9_deal', { _bet: 10 });
      assert.equal(dealt.status, 200);
      let hand = lucky9ViewSchema.parse(await dealt.json());
      lastId = hand.id;
      const draw = round % 2 === 0;
      if (hand.status === 'playing') {
        assert.deepEqual(hand.dealer, []);
        assert.equal(hand.dealer_total, null);
        assert.equal(hand.dealer_hidden, 2);
        assert.equal(hand.balance, before.balance - 10);
        const saved = lucky9CurrentSchema.parse(await (await rpc('lucky9_current')).json());
        assert.equal(saved.hand?.id, hand.id);
        assert.equal((await rpc('lucky9_deal', { _bet: 10 })).ok, false);
        const action = draw ? 'lucky9_draw' : 'lucky9_stand';
        if (!checkedRace) {
          const results = await Promise.all([rpc(action, { _hand_id: hand.id }), rpc(action, { _hand_id: hand.id })]);
          assert.equal(results.filter(result => result.ok).length, 1);
          const successful = results.find(result => result.ok);
          assert.ok(successful);
          hand = lucky9ViewSchema.parse(await successful.json());
          checkedRace = true;
        } else {
          hand = lucky9ViewSchema.parse(await (await rpc(action, { _hand_id: hand.id })).json());
        }
        assert.equal(hand.player.length, draw ? 3 : 2);
        sawDraw ||= draw; sawStand ||= !draw;
        const originalBankerTotal = lucky9Value(hand.dealer.slice(0, 2));
        assert.equal(hand.dealer.length, originalBankerTotal <= 5 ? 3 : 2);
      } else {
        assert.equal(hand.natural, true);
        assert.ok(lucky9Natural(hand.player) || lucky9Natural(hand.dealer));
        assert.equal(hand.player.length, 2); assert.equal(hand.dealer.length, 2);
        sawNatural = true;
      }
      assert.deepEqual({ status: hand.status, payout: hand.payout }, lucky9Outcome(hand.player, hand.dealer, 10));
      assert.equal(hand.player_total, lucky9Value(hand.player));
      assert.equal(hand.dealer_total, lucky9Value(hand.dealer));
      assert.equal(new Set([...hand.player, ...hand.dealer]).size, hand.player.length + hand.dealer.length);
      assert.equal(hand.balance, before.balance - 10 + hand.payout);
      assert.equal(hand.dealer_hidden, 0);
      assert.equal((await rpc('lucky9_draw', { _hand_id: hand.id })).ok, false);
      assert.equal((await (await rpc('get_coin_wallet')).json()).balance, hand.balance);
      outcomes.add(hand.status);
      if (outcomes.size === 3 && sawDraw && sawStand && sawNatural && checkedRace) break;
    }
    assert.deepEqual([...outcomes].sort(), ['lose', 'push', 'win']);
    assert.ok(sawDraw && sawStand && sawNatural && checkedRace);
    const current = lucky9CurrentSchema.parse(await (await rpc('lucky9_current')).json());
    assert.equal(current.hand?.id, lastId);
    assert.ok(current.recent.length > 0 && current.recent.length <= 10);
    assert.equal(current.recent[0].status, current.hand?.status);
  });
});