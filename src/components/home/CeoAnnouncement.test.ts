/// <reference types="node" />
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

// Mirrors the window in CeoAnnouncement.tsx (kept separate to avoid importing React/assets).
const START = new Date('2026-10-21T00:00:00Z');
const END = new Date('2026-10-31T00:00:00Z');
const active = (d: Date) => d >= START && d < END;

describe('CEO announcement runs 10 days', () => {
  test('shows on Oct 21 2026', () => assert.equal(active(new Date('2026-10-21T12:00:00Z')), true));
  test('shows on Oct 30 2026', () => assert.equal(active(new Date('2026-10-30T23:00:00Z')), true));
  test('hides from Oct 31 2026', () => assert.equal(active(new Date('2026-10-31T00:00:00Z')), false));
  test('window is exactly 10 days', () => assert.equal((END.getTime() - START.getTime()) / 86400000, 10));
});
