import { describe, expect, test } from 'bun:test';
import { getHeroPackage, heroEndDate } from './heroSponsorPackages';

describe('homepage hero sponsor packages', () => {
  test('3 days costs $199', () => {
    expect(getHeroPackage('hero_3d')?.priceCents).toBe(19900);
    expect(getHeroPackage('hero_3d')?.days).toBe(3);
  });
  test('7 days costs $499', () => {
    expect(getHeroPackage('hero_7d')?.priceCents).toBe(49900);
    expect(getHeroPackage('hero_7d')?.days).toBe(7);
  });
  test('30 days costs $1,499', () => {
    expect(getHeroPackage('hero_30d')?.priceCents).toBe(149900);
    expect(getHeroPackage('hero_30d')?.days).toBe(30);
  });
  test('a 7-day run starting Nov 1 ends Nov 7', () => {
    expect(heroEndDate('2026-11-01', 7)).toBe('2026-11-07');
  });
});
