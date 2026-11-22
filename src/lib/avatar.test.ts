/// <reference types="node" />
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_AVATAR_CONFIG,
  sanitizeAvatarConfig,
  sanitizeEquipped,
  toggleEquip,
} from './avatar';

const owned = [
  { sku: 'MIY-AV-0001', slot: 'top' as const },
  { sku: 'MIY-AV-0002', slot: 'top' as const },
  { sku: 'MIY-AV-0004', slot: 'gloves' as const },
];

describe('Avatar Studio rules', () => {
  test('unknown or broken saved looks fall back to the default avatar', () => {
    assert.deepEqual(sanitizeAvatarConfig(null), DEFAULT_AVATAR_CONFIG);
    assert.equal(sanitizeAvatarConfig({ hair: 'mohawk-of-doom' }).hair, DEFAULT_AVATAR_CONFIG.hair);
  });

  test('valid look choices are kept', () => {
    const config = sanitizeAvatarConfig({ skin: 'deep', hair: 'afro', expression: 'focused' });
    assert.equal(config.skin, 'deep');
    assert.equal(config.hair, 'afro');
    assert.equal(config.expression, 'focused');
  });

  test('members can only wear gear they own', () => {
    const result = sanitizeEquipped({ top: 'MIY-AV-0003', gloves: 'MIY-AV-0004' }, owned);
    assert.deepEqual(result, { gloves: 'MIY-AV-0004' });
  });

  test('gear only goes in the slot it was made for', () => {
    assert.deepEqual(sanitizeEquipped({ headwear: 'MIY-AV-0001' }, owned), {});
  });

  test('wearing a second jersey replaces the first', () => {
    const next = toggleEquip({ top: 'MIY-AV-0001' }, owned[1]);
    assert.equal(next.top, 'MIY-AV-0002');
  });

  test('tapping a worn item takes it off', () => {
    assert.deepEqual(toggleEquip({ top: 'MIY-AV-0001' }, owned[0]), {});
  });
});

import { COIN_DAILY_BONUS, COIN_WELCOME_BONUS, itemsInKiosk, shopItems, shopStatus } from './avatar';
import type { AvatarItem } from './avatar';

const shopItem = (sku: string, price: number, kiosk: string | undefined, is_starter = false): AvatarItem => ({
  id: sku, sku, slug: sku, name: sku, description: null, slot: 'top', rarity: 'epic', legend_id: null,
  is_starter, price_credits: price, asset_uri: `miytube://avatar/items/${sku}`, metadata: { kiosk }, sort_order: 0,
});

describe('MiyTube Shop rules', () => {
  test('new members get 500 coins and 50 more each day', () => {
    assert.equal(COIN_WELCOME_BONUS, 500);
    assert.equal(COIN_DAILY_BONUS, 50);
  });

  test('free starter gear is never sold in the shop', () => {
    const items = [shopItem('STARTER', 0, 'legends', true), shopItem('PAID', 300, 'legends')];
    assert.deepEqual(shopItems(items).map((i) => i.sku), ['PAID']);
  });

  test('items show up only in their own kiosk', () => {
    const items = [shopItem('A', 300, 'legends'), shopItem('B', 150, 'fitness')];
    assert.deepEqual(itemsInKiosk(items, 'fitness').map((i) => i.sku), ['B']);
  });

  test('a 500-coin item is buyable with exactly 500 coins but not 499', () => {
    const item = shopItem('JERSEY', 500, 'legends');
    assert.equal(shopStatus(item, new Set(), 500), 'affordable');
    assert.equal(shopStatus(item, new Set(), 499), 'short');
  });

  test('owned items cannot be bought again', () => {
    const item = shopItem('JERSEY', 500, 'legends');
    assert.equal(shopStatus(item, new Set(['JERSEY']), 10000), 'owned');
  });
});
