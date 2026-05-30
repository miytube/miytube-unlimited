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
  };

  return aliases[cleaned] || cleaned || undefined;
};
