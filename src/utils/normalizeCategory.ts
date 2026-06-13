/**
 * Canonical normalization for category and subcategory strings.
 *
 * Rule: lowercase, slashes -> hyphens, spaces -> hyphens, strip leading/trailing
 * hyphens, collapse repeated hyphens, drop characters other than [a-z0-9-].
 *
 * This guarantees every video stored in `uploaded_videos` uses one consistent
 * format so the read-side filter doesn't have to guess.
 */
export const normalizeCategoryValue = (value?: string | null): string | undefined => {
  if (!value) return undefined;
  const cleaned = value
    .toString()
    .toLowerCase()
    .trim()
    .replace(/^\/+|\/+$/g, '')      // strip leading/trailing slashes
    .replace(/[\s/_]+/g, '-')       // slashes, spaces, underscores -> hyphen
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9-]+/g, '-')   // any other punctuation -> hyphen
    .replace(/-+/g, '-')            // collapse repeated hyphens
    .replace(/^-+|-+$/g, '');       // trim hyphens

  const aliases: Record<string, string> = {
    'cars-and-vehicles': 'autos-vehicles',
    'autos-and-vehicles': 'autos-vehicles',
    'courts-police-trails': 'courts-trials',
    'courts-police-trials': 'courts-trials',
    'court-trials': 'courts-trials',
    'music-spanish': 'spanish',
    'mexican-spanish': 'spanish',
    'music-mexican-spanish': 'spanish',
    'spanish-mexican-music': 'spanish',
    'spanich-mexican-music': 'spanish',
    'music-lyrics-spanish-and-mexican': 'music-lyrics-spanish',
    'alternative-and-others': 'alternative',
    'alternative-music': 'alternative',
    'alternative-pop-and-electropop': 'alternative',
    'indie-alternative': 'alternative',
    'eulogy-or-funeral-honor': 'eulogy',
    'eulogy-or-funeral': 'eulogy',
    'eulogy-and-memorial': 'eulogy',
    'eulogy-memorial-and-funeral': 'eulogy',
    'thefts': 'people-thefts',
    'thiefts': 'people-thefts',
    'stealing': 'people-thefts',
    'thefts-stealing': 'people-thefts',
    'thiefts-stealing': 'people-thefts',
    'thefts-and-stealing': 'people-thefts',
    'thiefts-and-stealing': 'people-thefts',
    'people-thefts-and-stealing': 'people-thefts',
    'people-thiefts-and-stealing': 'people-thefts',
    'sports-college': 'college-sports',
    'college-sport': 'college-sports',
    'college-sports-category': 'college-sports',
    'sports-college-bowl': 'football-bowl-games',
    'sports-college-football-bowl': 'football-bowl-games',
    'college-football-bowl': 'football-bowl-games',
    'college-football-bowl-games': 'football-bowl-games',
    'football-bowl-game': 'football-bowl-games',
    'bowl-games': 'football-bowl-games',
    'sports-nhl': 'nhl-hockey',
    'sports-nhl-hockey': 'nhl-hockey',
    'new-and-politics': 'news-and-politics',
    'news-politics': 'news-and-politics',
    'fifa-word-cup-soocer-football': 'fifa-world-cup-soccer-football',
    'fifa-world-cup-soocer-football': 'fifa-world-cup-soccer-football',
    'fifa-word-cup-soccer-football': 'fifa-world-cup-soccer-football',
    // Car repair subcategories — uploaders pick "Major Repairs" under
    // "Cars & Vehicles" but the watch page is /cars/repairs/major which
    // expects the canonical id "cars-repairs-major".
    'major-repairs': 'cars-repairs-major',
    'cars-major-repairs': 'cars-repairs-major',
    'major-car-repairs': 'cars-repairs-major',
    'minor-repairs': 'cars-repairs-minor',
    'cars-minor-repairs': 'cars-repairs-minor',
    'minor-car-repairs': 'cars-repairs-minor',
    'car-hacks': 'cars-repairs-hacks',
    'cars-hacks': 'cars-repairs-hacks',
    'car-repair-hacks': 'cars-repairs-hacks',
    'car-maintenance': 'cars-repairs-maintenance',
    'cars-maintenance': 'cars-repairs-maintenance',
    'car-repairs': 'cars-repairs',
  };

  return aliases[cleaned] || cleaned || undefined;
};
