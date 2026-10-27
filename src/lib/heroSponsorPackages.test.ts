/// <reference types="node" />
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { getHeroPackage, heroEndDate } from './heroSponsorPackages';

describe('homepage hero sponsor packages', () => {
  test('3 days costs $199', () => {
    assert.equal(getHeroPackage('hero_3d')?.priceCents, 19900);
    assert.equal(getHeroPackage('hero_3d')?.days, 3);
  });
  test('7 days costs $499', () => {
    assert.equal(getHeroPackage('hero_7d')?.priceCents, 49900);
    assert.equal(getHeroPackage('hero_7d')?.days, 7);
  });
  test('30 days costs $1,499', () => {
    assert.equal(getHeroPackage('hero_30d')?.priceCents, 149900);
    assert.equal(getHeroPackage('hero_30d')?.days, 30);
  });
  test('a 7-day run starting Nov 1 ends Nov 7', () => {
    assert.equal(heroEndDate('2026-11-01', 7), '2026-11-07');
  });
});
