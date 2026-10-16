import { describe, test, expect } from 'bun:test';
import { createVideoViewCountsStore } from './videoViewCountsStore';

describe('sitewide video view totals', () => {
  test('two displays share one fetched total, not the stale 7 and doubled 14', async () => {
    const store = createVideoViewCountsStore(async () => [{ video_id: 'atlanta', views: 7 }]);
    let first: number | undefined;
    let second: number | undefined;
    const a = store.subscribe(['atlanta'], () => { first = store.get('atlanta'); });
    const b = store.subscribe(['atlanta'], () => { second = store.get('atlanta'); });
    await store.refresh();
    expect(first).toBe(7);
    expect(second).toBe(7);
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
    expect(first).toEqual([7, 8]);
    expect(second).toEqual([7, 8]);
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
    expect(requested).toEqual(['one', 'two']);
    fail = true;
    await store.refresh();
    expect(store.get('one')).toBe(9);
    a(); b();
  });
});