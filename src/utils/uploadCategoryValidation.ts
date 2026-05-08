/**
 * Upload category validation — STRICT.
 *
 * Rule: the title (and optionally description/tags) MUST contain the chosen
 * category and/or subcategory name. No synonyms, no fuzzy matching.
 *
 * If you choose "music-artists / music-artists-news", the title/description/tags
 * must literally include "music" or "artist" or "news" (the actual words from
 * the slugs you picked). Otherwise the upload is blocked.
 */

const tokenize = (slug: string): string[] =>
  slug.toLowerCase()
    .replace(/[\/_]/g, '-')
    .split('-')
    .map(t => t.trim())
    .filter(t => t.length >= 3); // skip noise like "of", "to"

export interface CategoryValidationResult {
  ok: boolean;
  reason?: string;
  expectedAny?: string[];
}

/**
 * Validate that the title/description/tags reference the chosen category/sub.
 * The user must include AT LEAST ONE word from the chosen category or
 * subcategory slug in their title, description, or tags.
 */
export const validateUploadCategoryMatch = (
  title: string,
  description: string,
  tags: string[] | undefined,
  category?: string,
  subcategory?: string
): CategoryValidationResult => {
  const slugs = [category, subcategory].filter(Boolean) as string[];
  if (slugs.length === 0) return { ok: true };

  const expected = Array.from(new Set(slugs.flatMap(tokenize)));
  if (expected.length === 0) return { ok: true };

  const haystack = [
    title || '',
    description || '',
    ...(tags || []),
  ].join(' ').toLowerCase();

  if (!haystack.trim()) {
    return {
      ok: false,
      reason: `Add a title that mentions ${expected.join(' or ')} so it lands in the right place.`,
      expectedAny: expected,
    };
  }

  const matched = expected.some(tok => {
    const re = new RegExp(`(^|[^a-z0-9])${tok.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}([^a-z0-9]|$)`, 'i');
    return re.test(haystack);
  });

  if (matched) return { ok: true };

  const label = subcategory || category;
  return {
    ok: false,
    reason: `This upload doesn't match "${label}". The title, description, or tags must include one of: ${expected.join(', ')}. Either pick a different category or rename the title to match.`,
    expectedAny: expected,
  };
};
