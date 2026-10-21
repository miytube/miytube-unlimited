import { describe, it, expect } from 'vitest';
import { isAnnouncementActive } from './CeoAnnouncement';

describe('CEO announcement runs 10 days', () => {
  it('shows on Oct 21 2026', () => expect(isAnnouncementActive(new Date('2026-10-21T12:00:00Z'))).toBe(true));
  it('shows on Oct 30 2026', () => expect(isAnnouncementActive(new Date('2026-10-30T23:00:00Z'))).toBe(true));
  it('hides from Oct 31 2026', () => expect(isAnnouncementActive(new Date('2026-10-31T00:00:00Z'))).toBe(false));
});
