/**
 * Strict video filtering utility to prevent loose matching issues.
 * Videos should only appear in categories/subcategories they were explicitly assigned to.
 * Includes fuzzy matching to handle common typos.
 */

import { UploadedVideo } from '@/context/UploadedVideosContext';

/**
 * True Levenshtein edit distance — used for tight typo tolerance only.
 */
const editDistance = (a: string, b: string): number => {
  const m = a.length, n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const dp: number[] = new Array(n + 1);
  for (let j = 0; j <= n; j++) dp[j] = j;
  for (let i = 1; i <= m; i++) {
    let prev = dp[0];
    dp[0] = i;
    for (let j = 1; j <= n; j++) {
      const tmp = dp[j];
      if (a[i - 1] === b[j - 1]) {
        dp[j] = prev;
      } else {
        dp[j] = 1 + Math.min(prev, dp[j], dp[j - 1]);
      }
      prev = tmp;
    }
  }
  return dp[n];
};

/**
 * Tight typo tolerance: allow 1 edit for words ≥6 chars, 2 edits for ≥10 chars.
 * NEVER matches substrings or different-length strings beyond that budget.
 */
const isFuzzyMatch = (input: string, target: string): boolean => {
  const a = input.toLowerCase().trim();
  const b = target.toLowerCase().trim();
  if (!a || !b) return false;
  if (a === b) return true;
  // Length must be close
  if (Math.abs(a.length - b.length) > 2) return false;
  const longer = Math.max(a.length, b.length);
  if (longer < 6) return false; // too short, would cause false positives
  const budget = longer >= 10 ? 2 : 1;
  return editDistance(a, b) <= budget;
};

const sportsLeaguePatterns = [
  { league: 'nba', pattern: /(^|[\s\-/])nba($|[\s\-/])/ },
  { league: 'wnba', pattern: /(^|[\s\-/])wnba($|[\s\-/])/ },
  { league: 'nhl', pattern: /(^|[\s\-/])nhl($|[\s\-/])/ },
  { league: 'mlb', pattern: /(^|[\s\-/])mlb($|[\s\-/])/ },
  { league: 'nfl', pattern: /(^|[\s\-/])nfl($|[\s\-/])/ },
];

const detectSportsLeague = (text: string): string | undefined => {
  const normalized = text.toLowerCase().replace(/_/g, '-');
  return sportsLeaguePatterns.find(({ pattern }) => pattern.test(normalized))?.league;
};

/**
 * Filter videos by exact category match or keyword-based matching for parent categories.
 * For parent categories (like "Business", "Cars"), we match if the video's category
 * starts with or equals that category name. Includes fuzzy matching for typos.
 */
export const filterVideosByCategory = (
  videos: UploadedVideo[],
  categoryName: string,
  keywords?: string[]
): UploadedVideo[] => {
  const categoryLower = categoryName.toLowerCase().trim();
  
  return videos.filter(video => {
    const vidCategory = video.category?.toLowerCase().trim() || '';
    const vidSubcategory = video.subcategory?.toLowerCase().trim() || '';
    const vidTags = video.tags?.map(t => t.toLowerCase().trim()) || [];
    
    // Exact match on category
    if (vidCategory === categoryLower) return true;
    
    // Check if category starts with the parent category name
    // e.g., "business-cryptocurrency" starts with "business"
    if (vidCategory.startsWith(categoryLower + '-') || vidCategory.startsWith(categoryLower + ' ')) return true;
    
    // Check subcategory exact match
    if (vidSubcategory === categoryLower) return true;
    
    // Check tags for exact match only
    if (vidTags.includes(categoryLower)) return true;
    
    // If keywords provided, check for exact or fuzzy keyword matches in category/subcategory
    if (keywords && keywords.length > 0) {
      return keywords.some(keyword => {
        const keywordLower = keyword.toLowerCase().trim();
        return (
          vidCategory === keywordLower ||
          vidSubcategory === keywordLower ||
          vidTags.includes(keywordLower)
        );
      });
    }
    
    return false;
  });
};

/**
 * Filter videos by subcategory with STRICT matching.
 *
 * A video matches only when its category/subcategory equals (or is a near-exact
 * typo variant of) the page's mapping key — including hyphen/space/no-separator
 * variants and the parent+child path form. Tag-based fallbacks, substring
 * `includes()`, and single-word title matching were removed because they leaked
 * videos across categories (e.g. cartoons appearing under Music/Rock).
 */
export const filterVideosBySubcategory = (
  videos: UploadedVideo[],
  pageTitle: string,
  mappingKey: string
): UploadedVideo[] => {
  const titleLower = pageTitle.toLowerCase().trim();
  const keyLower = mappingKey.toLowerCase().trim();

  const keySegments = keyLower.split('/');
  const lastSegment = keySegments[keySegments.length - 1];
  const parentSegment = keySegments.length > 1 ? keySegments[0] : '';

  const lastSegmentSpaced = lastSegment.replace(/-/g, ' ');
  const lastSegmentNoSep = lastSegment.replace(/[-\s]/g, '');
  const keyHyphenated = keyLower.replace(/\//g, '-');
  const keyNoSep = keyLower.replace(/[-\s/]/g, '');
  const titleNoSep = titleLower.replace(/[-\s]/g, '');

  // Build the canonical accepted-value set for this page.
  const accepted = new Set<string>([
    keyLower,
    keyHyphenated,
    keyNoSep,
    lastSegment,
    lastSegmentSpaced,
    lastSegmentNoSep,
    titleLower,
    titleNoSep,
    `${parentSegment}-${lastSegment}`,
    `${parentSegment}/${lastSegment}`,
  ].filter(Boolean));

  const acceptedFuzzyTargets = [keyLower, keyHyphenated, lastSegment, lastSegmentSpaced];

  const norm = (s: string) => s.toLowerCase().trim().replace(/^\/+/, '');
  const normNoSep = (s: string) => norm(s).replace(/[-\s/]/g, '');

  return videos.filter(video => {
    const vidCategory = norm(video.category || '');
    const vidSubcategory = norm(video.subcategory || '');
    const vidCategoryNoSep = normNoSep(video.category || '');
    const vidSubcategoryNoSep = normNoSep(video.subcategory || '');
    const vidTags = (video.tags || []).map(t => norm(t));

    // Sports league isolation (NBA vs NHL etc.)
    const requestedLeague = detectSportsLeague(`${keyLower} ${titleLower}`);
    const videoLeague = detectSportsLeague(`${vidCategory} ${vidSubcategory} ${vidTags.join(' ')}`);
    if (requestedLeague && videoLeague && requestedLeague !== videoLeague) return false;

    // 1) Exact match on category or subcategory (including normalized variants)
    if (accepted.has(vidCategory) || accepted.has(vidSubcategory)) return true;
    if (accepted.has(vidCategoryNoSep) || accepted.has(vidSubcategoryNoSep)) return true;

    // 2) Parent + child match: video.category == parent AND video.subcategory == child
    if (parentSegment) {
      const parentNoSep = parentSegment.replace(/[-\s]/g, '');
      const parentMatches = vidCategory === parentSegment || vidCategoryNoSep === parentNoSep;
      const childMatches =
        vidSubcategory === lastSegment ||
        vidSubcategory === lastSegmentSpaced ||
        vidSubcategoryNoSep === lastSegmentNoSep;
      if (parentMatches && childMatches) return true;
    }

    // 3) Tight typo tolerance ONLY against the page key/title — not against tags,
    //    not against substrings, not against single words.
    for (const target of acceptedFuzzyTargets) {
      if (isFuzzyMatch(vidSubcategory, target) || isFuzzyMatch(vidCategory, target)) return true;
    }

    // 4) Exact tag match against the FULL page key or title (not single words)
    if (vidTags.includes(keyLower) || vidTags.includes(keyHyphenated) || vidTags.includes(titleLower)) {
      return true;
    }

    return false;
  });
};

/**
 * Filter videos by music genre with STRICT matching.
 * Requires the video to be a music-categorized upload AND the genre to match
 * the category/subcategory/tag exactly (or as a hyphen/space variant).
 * No fuzzy matching and no substring matching — short genre names like "rock"
 * were leaking unrelated videos (cartoons, sports) via loose includes/fuzzy logic.
 */
export const filterVideosByMusicGenre = (
  videos: UploadedVideo[],
  genre: string
): UploadedVideo[] => {
  const genreLower = genre.toLowerCase().trim();
  if (!genreLower) return [];

  // Build accepted genre variants (hyphen / space / no-separator)
  const genreSpaced = genreLower.replace(/-/g, ' ');
  const genreNoSep = genreLower.replace(/[-\s]/g, '');
  const variants = new Set<string>([
    genreLower,
    genreSpaced,
    genreNoSep,
    `music-${genreLower}`,
    `music ${genreLower}`,
    `music-${genreSpaced}`,
    `music ${genreSpaced}`,
  ]);

  const norm = (s: string) => s.toLowerCase().trim();
  const normNoSep = (s: string) => norm(s).replace(/[-\s]/g, '');

  return videos.filter(video => {
    const categoryLower = norm(video.category || '');
    const subcategoryLower = norm(video.subcategory || '');

    // MUST be a music video — prevents cartoons, sports, etc. from appearing
    const isMusicVideo =
      categoryLower === 'music' ||
      categoryLower.startsWith('music-') ||
      categoryLower.startsWith('music ');
    if (!isMusicVideo) return false;

    // Exact (or normalized) match on category/subcategory
    if (variants.has(categoryLower) || variants.has(subcategoryLower)) return true;
    if (variants.has(normNoSep(video.category || '')) || variants.has(normNoSep(video.subcategory || ''))) return true;

    // Exact tag match only
    const tags = (video.tags || []).map(t => norm(t));
    if (tags.some(t => variants.has(t))) return true;

    return false;
  });
};
