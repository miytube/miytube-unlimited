/// <reference types="node" />
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import type { AvatarItem } from './avatar';
import { browseMallItems } from './mall';

const item = (sku: string, kiosk: string | undefined, price: number, starter = false): AvatarItem => ({
  id: sku, sku, slug: sku, name: `Gear ${sku}`, description: null, slot: 'top', rarity: 'rare',
  legend_id: null, is_starter: starter, price_credits: price, asset_uri: `miytube://avatar/items/${sku}`,
  metadata: { kiosk }, sort_order: price,
});
const items = [item('LEGEND', 'legends', 300), item('GLOVES', 'fitness', 150), item('GOLD', undefined, 500), item('STARTER', 'legends', 0, true)];

describe('Mall inventory', () => {
  test('each storefront retains its existing inventory without selling free starter gear', () => {
    assert.deepEqual(browseMallItems(items, { storeId: 'legends' }).map((i) => i.sku), ['LEGEND']);
    assert.deepEqual(browseMallItems(items, { storeId: 'fitness' }).map((i) => i.sku), ['GLOVES']);
    assert.deepEqual(browseMallItems(items, { storeId: 'miytube' }).map((i) => i.sku), ['GOLD']);
    assert.equal(browseMallItems(items).length, 3);
  });
  test('Booksem and unknown stores never show unrelated avatar gear', () => {
    assert.deepEqual(browseMallItems(items, { storeId: 'booksem' }), []);
    assert.deepEqual(browseMallItems(items, { storeId: 'unknown' }), []);
  });
  test('owned inventory and search both apply inside the selected storefront', () => {
    assert.deepEqual(browseMallItems(items, { storeId: 'fitness', ownedOnly: true, ownedSkus: new Set(['GLOVES']), query: 'gloves' }).map((i) => i.sku), ['GLOVES']);
    assert.deepEqual(browseMallItems(items, { storeId: 'legends', ownedOnly: true, ownedSkus: new Set(['GLOVES']) }), []);
    assert.deepEqual(browseMallItems(items, { query: 'not-an-item' }), []);
  });
  test('price sorting uses the unchanged coin prices and does not mutate the catalog', () => {
    assert.deepEqual(browseMallItems(items, { sort: 'price-high' }).map((i) => i.price_credits), [500, 300, 150]);
    assert.deepEqual(browseMallItems(items, { sort: 'price-low' }).map((i) => i.price_credits), [150, 300, 500]);
    assert.deepEqual(items.map((i) => i.sku), ['LEGEND', 'GLOVES', 'GOLD', 'STARTER']);
  });
});