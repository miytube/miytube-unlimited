// Self-serve Homepage Hero Sponsor packages. Server mirrors these amounts in
// supabase/functions/create-ad-checkout so the browser cannot set its own price.
export type HeroPackageId = 'hero_3d' | 'hero_7d' | 'hero_30d';

export interface HeroPackage {
  id: HeroPackageId;
  label: string;
  days: number;
  priceCents: number;
  blurb: string;
  highlight?: string;
}

export const HERO_PACKAGES: HeroPackage[] = [
  { id: 'hero_3d', label: '3-Day Spotlight', days: 3, priceCents: 19900, blurb: 'A weekend-sized test run at the top of the homepage.' },
  { id: 'hero_7d', label: '7-Day Hero Sponsor', days: 7, priceCents: 49900, blurb: 'A full week in the prime spot every visitor sees first.', highlight: 'Most popular' },
  { id: 'hero_30d', label: '30-Day Hero Sponsor', days: 30, priceCents: 149900, blurb: 'A month of sustained top-of-homepage presence.', highlight: 'Best value' },
];

export const getHeroPackage = (id: string): HeroPackage | undefined =>
  HERO_PACKAGES.find((p) => p.id === id);

/** Last day the ad runs (inclusive), as YYYY-MM-DD. */
export const heroEndDate = (startDate: string, days: number): string => {
  const d = new Date(`${startDate}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days - 1);
  return d.toISOString().split('T')[0];
};
