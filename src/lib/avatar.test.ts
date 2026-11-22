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
