import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { GamingPresenceSnapshot, gamingTableForPath, gamingVisitorsByTable, isGamingPath, LIVE_GAME_TABLES, otherGamingVisitors } from './gamingPresence';

const first = '11111111-1111-4111-8111-111111111111';
const second = '22222222-2222-4222-8222-222222222222';

describe('Real Gaming Room presence', () => {
  test('waiting updates replace the prior transport ref and a stale leave cannot erase the update', () => {
    const snapshot = new GamingPresenceSnapshot();
    const waiting = { visitor_id: first, table_id: 'tournament', waiting: true, presence_ref: 'old' };
    const browsing = { ...waiting, waiting: false, presence_ref: 'new' };
    snapshot.join('tab', [waiting]);
    assert.equal(gamingVisitorsByTable(snapshot.state(), true).tournament.length, 1);
    snapshot.join('tab', [browsing]);
    snapshot.leave('tab', [waiting]);
    assert.equal(gamingVisitorsByTable(snapshot.state()).tournament.length, 1);
    assert.equal(gamingVisitorsByTable(snapshot.state(), true).tournament.length, 0);
    snapshot.leave('tab', [browsing]);
    assert.equal(gamingVisitorsByTable(snapshot.state()).tournament.length, 0);
    snapshot.join('tab', [waiting]);
    snapshot.clear();
    assert.deepEqual(snapshot.state(), {});
  });
  test('covers all seven open tables and never invents sports-table activity', () => {
    assert.equal(LIVE_GAME_TABLES.length, 7);
    assert.equal(gamingTableForPath('/game-room/tournament/'), 'tournament');
    assert.equal(gamingTableForPath('/game-room/texas-holdem'), 'poker');
    assert.equal(gamingTableForPath('/game-room/golf'), null);
    assert.equal(isGamingPath('/game-room'), true);
    assert.equal(isGamingPath('/shop'), false);
  });
  test('empty presence means zero visitors, with no simulated spectators', () => {
    const counts = gamingVisitorsByTable({});
    assert.deepEqual(counts.tournament, []);
    assert.equal(Object.values(counts).reduce((sum, ids) => sum + ids.length, 0), 0);
  });
  test('counts duplicate tabs as one visitor at each table', () => {
    const result = gamingVisitorsByTable({
      tab1: [{ visitor_id: first, table_id: 'tournament' }],
      tab2: [{ visitor_id: first, table_id: 'tournament' }],
      tab3: [{ visitor_id: second, table_id: 'tournament' }],
      tab4: [{ visitor_id: first, table_id: 'blackjack' }],
    });
    assert.deepEqual(result.tournament, [first, second]);
    assert.deepEqual(result.blackjack, [first]);
  });
  test('the table rail excludes this browser rather than counting it as someone else', () => {
    assert.deepEqual(otherGamingVisitors([first, second], first), [second]);
    assert.deepEqual(otherGamingVisitors([first], first), []);
  });
  test('waiting counts require an explicit choice and deduplicate waiting tabs', () => {
    const state = {
      a: [{ visitor_id: first, table_id: 'tournament', waiting: true }],
      b: [{ visitor_id: first, table_id: 'tournament', waiting: true }],
      c: [{ visitor_id: second, table_id: 'tournament' }],
      d: [{ visitor_id: second, table_id: 'tournament', waiting: 'true' }],
    };
    assert.deepEqual(gamingVisitorsByTable(state, true).tournament, [first]);
    assert.deepEqual(gamingVisitorsByTable(state).tournament, [first, second]);
    assert.deepEqual(gamingVisitorsByTable({}, true).tournament, []);
  });
  test('departures and moved visitors disappear when the live state syncs', () => {
    const before = gamingVisitorsByTable({ a: [{ visitor_id: first, table_id: 'tournament' }] });
    const after = gamingVisitorsByTable({ a: [{ visitor_id: first, table_id: 'lucky-9' }] });
    assert.equal(before.tournament.length, 1);
    assert.equal(after.tournament.length, 0);
    assert.equal(after['lucky-9'].length, 1);
    assert.equal(gamingVisitorsByTable({})['lucky-9'].length, 0);
  });
  test('ignores malformed payloads and unsupported table IDs', () => {
    const result = gamingVisitorsByTable({
      bad: [null, { visitor_id: 'someone', table_id: 'blackjack' }, { visitor_id: first, table_id: 'golf' }],
      malformed: {},
      valid: [{ visitor_id: second, table_id: 'mahjong', presence_ref: 'transport-only' }],
    });
    assert.deepEqual(result.mahjong, [second]);
    assert.equal(Object.values(result).reduce((sum, ids) => sum + ids.length, 0), 1);
  });
});