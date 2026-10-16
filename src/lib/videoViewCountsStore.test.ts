/// <reference types="node" />
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { createVideoViewCountsStore } from './videoViewCountsStore';

describe('sitewide video view totals', () => {
  test('two displays share one fetched total, not the stale 7 and doubled 14', async () => {
    const store = createVideoViewCountsStore(async () => [{ video_id: 'atlanta', views: 7 }]);
    let first: number | undefined;
    let second: number | undefined;
    const a = store.subscribe(['atlanta'], () => { first = store.get('atlanta'); });
    const b = store.subscribe(['atlanta'], () => { second = store.get('atlanta'); });
    await store.refresh();
    assert.equal(first, 7);
    assert.equal(second, 7);
    a(); b();
  });

  test('a new view updates every mounted display by exactly one', async () => {
    let total = 7;
    const store = createVideoViewCountsStore(async () => [{ video_id: 'atlanta', views: total }]);
    const first: number[] = [];
    const second: number[] = [];
    const a = store.subscribe(['atlanta'], () => first.push(store.get('atlanta') ?? -1));
    const b = store.subscribe(['atlanta'], () => second.push(store.get('atlanta') ?? -1));
    await store.refresh();
    total++;
    await store.refresh();
    assert.deepEqual(first, [7, 8]);
    assert.deepEqual(second, [7, 8]);
    a(); b();
  });

  test('cards batch their ids and an unsuccessful refresh preserves the last total', async () => {
    let fail = false;
    let requested: string[] = [];
    const store = createVideoViewCountsStore(async ids => {
      requested = ids;
      if (fail) throw new Error('offline');
      return [{ video_id: 'one', views: 9 }, { video_id: 'two', views: 3 }];
    });
    const a = store.subscribe(['one'], () => {});
    const b = store.subscribe(['two'], () => {});
    await store.refresh();
    assert.deepEqual(requested, ['one', 'two']);
    fail = true;
    await store.refresh();
    assert.equal(store.get('one'), 9);
    a(); b();
  });
});