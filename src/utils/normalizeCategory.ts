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
    .replace(/[\/\s_]+/g, '-')      // slashes, spaces, underscores -> hyphen
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9-]+/g, '-')   // any other punctuation -> hyphen
    .replace(/-+/g, '-')            // collapse repeated hyphens
    .replace(/^-+|-+$/g, '');       // trim hyphens
  return cleaned || undefined;
};
