/**
 * Upload category validation.
 *
 * Rule: the title (and optionally description/tags) MUST reference the chosen
 * category or subcategory by name (or a well-known synonym).
 *
 * This stops obvious miscategorization at upload time — e.g. a "Prince Rolls
 * Royce" or "D4vd murder case" video tagged as Music will be rejected because
 * neither the category word ("music") nor any music synonym appears.
 */

// Synonyms grouped per category slug. Keys are normalized (lowercase, hyphens).
const CATEGORY_SYNONYMS: Record<string, string[]> = {
  music: ['music', 'song', 'songs', 'album', 'track', 'tracks', 'single', 'remix', 'cover',
          'lyrics', 'lyric', 'concert', 'live', 'performance', 'mv', 'official video',
          'audio', 'beat', 'beats', 'instrumental', 'acoustic', 'feat', 'ft.'],
  'music-artists': ['artist', 'artists', 'singer', 'rapper', 'band', 'musician', 'producer', 'dj'],
  news: ['news', 'breaking', 'report', 'reports', 'reported', 'update', 'updates'],
  politics: ['politics', 'political', 'election', 'senate', 'congress', 'president', 'government'],
  sports: ['sports', 'sport', 'game', 'match', 'highlights', 'season'],
  comedy: ['comedy', 'funny', 'standup', 'stand-up', 'joke', 'jokes', 'comedian'],
  gaming: ['gaming', 'gameplay', 'game', 'gamer', 'playthrough', 'walkthrough'],
  cars: ['car', 'cars', 'auto', 'vehicle', 'engine', 'driving'],
  cooking: ['cooking', 'recipe', 'food', 'chef', 'kitchen', 'meal'],
  education: ['education', 'tutorial', 'lesson', 'learn', 'how to', 'guide'],
  fitness: ['fitness', 'workout', 'exercise', 'gym', 'training'],
  pets: ['pet', 'pets', 'dog', 'cat', 'puppy', 'kitten', 'animal'],
  animals: ['animal', 'animals', 'wildlife', 'nature'],
  military: ['military', 'army', 'navy', 'marines', 'soldier', 'war'],
  hollywood: ['hollywood', 'celebrity', 'celebrities', 'actor', 'actress', 'movie', 'film'],
  film: ['film', 'movie', 'trailer', 'cinema', 'director'],
  podcasts: ['podcast', 'podcasts', 'episode', 'interview'],
  weather: ['weather', 'storm', 'forecast', 'rain', 'snow', 'hurricane'],
  business: ['business', 'startup', 'company', 'entrepreneur', 'finance', 'market'],
};

const tokenizeSlug = (slug: string): string[] =>
  slug.toLowerCase().split(/[-_/\s]+/).filter(t => t.length >= 3);

const buildExpectedTokens = (category?: string, subcategory?: string): string[] => {
  const tokens = new Set<string>();
  const addAll = (arr: string[]) => arr.forEach(t => tokens.add(t.toLowerCase()));

  for (const slug of [category, subcategory].filter(Boolean) as string[]) {
    const norm = slug.toLowerCase().trim();
    // The slug itself and its hyphenated/spaced variants
    tokens.add(norm);
    tokens.add(norm.replace(/-/g, ' '));
    // Word tokens from the slug (≥3 chars to skip noise)
    tokenizeSlug(norm).forEach(t => tokens.add(t));
    // Known synonym lists
    if (CATEGORY_SYNONYMS[norm]) addAll(CATEGORY_SYNONYMS[norm]);
    // Try parent slug (e.g. "music-artists-news" → "music")
    const parent = norm.split('-')[0];
    if (CATEGORY_SYNONYMS[parent]) addAll(CATEGORY_SYNONYMS[parent]);
  }
  return [...tokens].filter(t => t.length >= 3);
};

export interface CategoryValidationResult {
  ok: boolean;
  reason?: string;
  expectedAny?: string[];
}

/**
 * Validate that the title/description/tags reference the chosen category/sub.
 * Returns { ok: false, reason } when no expected keyword appears anywhere.
 */
export const validateUploadCategoryMatch = (
  title: string,
  description: string,
  tags: string[] | undefined,
  category?: string,
  subcategory?: string
): CategoryValidationResult => {
  if (!category && !subcategory) return { ok: true };

  const expected = buildExpectedTokens(category, subcategory);
  if (expected.length === 0) return { ok: true };

  const haystack = [
    title || '',
    description || '',
    ...(tags || []),
  ].join(' ').toLowerCase();

  if (!haystack.trim()) {
    return {
      ok: false,
      reason: `Add a title that mentions ${category || subcategory} so it lands in the right place.`,
      expectedAny: expected.slice(0, 8),
    };
  }

  const matched = expected.some(tok => {
    if (tok.includes(' ')) return haystack.includes(tok);
    const re = new RegExp(`(^|[^a-z0-9])${tok.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}([^a-z0-9]|$)`, 'i');
    return re.test(haystack);
  });

  if (matched) return { ok: true };

  const label = subcategory || category;
  return {
    ok: false,
    reason: `This upload doesn't look like "${label}". The title/tags should mention ${label} (or a related word like ${expected.slice(0, 5).join(', ')}). Pick a different category, or rename the file/title to match.`,
    expectedAny: expected.slice(0, 8),
  };
};
