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
 * Filter videos by subcategory with strict matching plus fuzzy matching for typos.
 * Used for subcategory pages where we need exact matches but also catch common typos.
 */
export const filterVideosBySubcategory = (
  videos: UploadedVideo[],
  pageTitle: string,
  mappingKey: string
): UploadedVideo[] => {
  const titleLower = pageTitle.toLowerCase().trim();
  const keyLower = mappingKey.toLowerCase().trim();
  
  // Handle path-based keys like "real-estate/luxury" -> extract segments
  const keySegments = keyLower.split('/');
  const lastSegment = keySegments[keySegments.length - 1];
  const parentSegment = keySegments.length > 1 ? keySegments[0] : '';
  
  // Also handle hyphen-separated keys like "real-estate-luxury"
  const hyphenSegments = keyLower.split('-');
  const lastHyphenSegment = hyphenSegments[hyphenSegments.length - 1];
  
  // Extract core keywords from mapping key
  const keyWords = keyLower.split(/[-\/]/).filter(w => w.length > 2);
  
  // Handle alternate formats: "late-night" -> "late night", "latenight"
  const lastSegmentSpaced = lastSegment.replace(/-/g, ' ');
  const lastSegmentNoHyphens = lastSegment.replace(/-/g, '');
  
  // Build alternate forms of the mapping key to match path-style subcategory values
  // e.g. key "animation/cartoons" should match subcategory "/animation/cartoons" or "animation-cartoons"
  const keyWithSlash = keyLower.startsWith('/') ? keyLower : `/${keyLower}`;
  const keyHyphenated = keyLower.replace(/\//g, '-');

  return videos.filter(video => {
    const vidCategoryRaw = video.category?.toLowerCase().trim() || '';
    const vidSubcategoryRaw = video.subcategory?.toLowerCase().trim() || '';
    // Strip leading slash so "/animation/cartoons" matches "animation/cartoons"
    const vidCategory = vidCategoryRaw.replace(/^\/+/, '');
    const vidSubcategory = vidSubcategoryRaw.replace(/^\/+/, '');

    // Match full-path subcategory keys directly (e.g. video.subcategory = "/animation/cartoons" and key = "animation/cartoons")
    if (vidSubcategory === keyLower || vidSubcategoryRaw === keyWithSlash) return true;
    // Match hyphenated equivalent (e.g. "animation-cartoons")
    if (vidSubcategory === keyHyphenated || vidSubcategory.replace(/\//g, '-') === keyHyphenated) return true;

    const vidTags = video.tags?.map(t => t.toLowerCase().trim()) || [];
    const requestedLeague = detectSportsLeague(`${keyLower} ${titleLower}`);
    const videoLeague = detectSportsLeague(`${vidCategory} ${vidSubcategory} ${vidTags.join(' ')}`);

    // Keep sports league playoff pages isolated from each other. This prevents NBA
    // East/West playoff games from appearing on NHL playoff pages just because they
    // share generic terms like "playoffs" or "game highlights".
    if (requestedLeague && videoLeague && requestedLeague !== videoLeague) return false;
    
    // Normalize video fields for comparison (remove hyphens/spaces)
    const vidCategoryNorm = vidCategory.replace(/[\s-]/g, '');
    const vidSubcategoryNorm = vidSubcategory.replace(/[\s-]/g, '');
    
    // Handle comma-separated subcategories (e.g., "gangster,-crime,-drama")
    const subcategoryParts = vidSubcategory.split(',').map(p => p.replace(/^-/, '').trim());
    const firstSubcategoryPart = subcategoryParts[0] || '';
    
    // Normalize singular/plural forms
    const normalizeWordForms = (str: string) => {
      return str.replace(/s$/, ''); // Remove trailing 's' for comparison
    };
    
    const lastSegmentBase = normalizeWordForms(lastSegment);
    const firstPartBase = normalizeWordForms(firstSubcategoryPart);
    
    // Exact match on subcategory (e.g., video.subcategory === "luxury")
    if (vidSubcategory === lastSegment) return true;
    
    // Match first part of comma-separated subcategory (e.g., "gangster" from "gangster,-crime,-drama")
    if (firstSubcategoryPart === lastSegment || firstSubcategoryPart === lastSegmentSpaced) return true;
    if (firstPartBase === lastSegmentBase) return true;
    
    // Match spaced version (e.g., "late night" for "late-night")
    if (vidSubcategory === lastSegmentSpaced) return true;
    
    // Match normalized versions (e.g., "latenight" matches "late-night")
    if (vidSubcategoryNorm === lastSegmentNoHyphens) return true;
    
    // Fuzzy match on subcategory (for typos like "commerical" vs "commercial")
    if (isFuzzyMatch(vidSubcategory, lastSegment)) return true;
    if (isFuzzyMatch(vidSubcategory, lastSegmentSpaced)) return true;
    if (isFuzzyMatch(firstSubcategoryPart, lastSegment)) return true;
    
    // Match when video category matches parent and subcategory matches last segment
    // e.g., video.category="real-estate", video.subcategory="luxury", key="real-estate/luxury"
    if (parentSegment) {
      const normalizedParent = parentSegment.replace(/[\s-]/g, '');
      const normalizedVidCategory = vidCategory.replace(/[\s-]/g, '');
      if ((normalizedVidCategory === normalizedParent || isFuzzyMatch(normalizedVidCategory, normalizedParent)) && 
          (vidSubcategoryNorm === lastSegmentNoHyphens || isFuzzyMatch(vidSubcategory, lastSegment) || isFuzzyMatch(vidSubcategory, lastSegmentSpaced) || firstPartBase === lastSegmentBase)) {
        return true;
      }
    }
    
    // Exact match on title
    if (vidCategory === titleLower || vidSubcategory === titleLower) return true;
    
    // Match title without "shows" suffix (e.g., "late night" matches "late night shows")
    const titleWithoutShows = titleLower.replace(/\s*shows?\s*$/i, '').trim();
    if (vidSubcategory === titleWithoutShows || vidSubcategoryNorm === titleWithoutShows.replace(/[\s-]/g, '')) return true;
    
    // Fuzzy match on title
    if (isFuzzyMatch(vidCategory, titleLower) || isFuzzyMatch(vidSubcategory, titleLower)) return true;
    
    // Match combined parent-subcategory pattern (e.g., "real-estate-luxury")
    const combinedKey = `${parentSegment}-${lastSegment}`;
    if (vidCategory === combinedKey || vidSubcategory === combinedKey) return true;
    if (isFuzzyMatch(vidCategory, combinedKey) || isFuzzyMatch(vidSubcategory, combinedKey)) return true;
    
    // Check if category/subcategory contains the page title exactly
    const titleWords = titleLower.split(' ').filter(w => w.length > 2);
    const combinedText = `${vidCategory} ${vidSubcategory}`;
    
    // All title words must be present (excluding common words like "shows")
    const meaningfulTitleWords = titleWords.filter(w => !['show', 'shows', 'video', 'videos', 'films', 'film'].includes(w));
    if (meaningfulTitleWords.length >= 1 && meaningfulTitleWords.every(word => {
      const wordBase = normalizeWordForms(word);
      return combinedText.includes(word) || combinedText.includes(wordBase) || subcategoryParts.some(p => normalizeWordForms(p) === wordBase);
    })) return true;
    
    // Check if key matches exactly
    if (vidCategory === keyLower || vidSubcategory === keyLower) return true;
    
    // Check if all key words are present in category or subcategory
    if (keyWords.length >= 2 && keyWords.every(word => combinedText.includes(word))) return true;
    
    // Check tags for exact match against full key/title only (avoid generic single-word
    // matches like "playoffs" leaking NBA videos into NHL playoffs page)
    if (vidTags.includes(titleLower) || vidTags.includes(keyLower)) return true;
    if (vidTags.includes(titleWithoutShows)) return true;
    if (vidTags.some(tag => isFuzzyMatch(tag, titleLower) || isFuzzyMatch(tag, keyLower))) return true;
    
    // Check if tag contains ALL key words (requires full context, e.g. "nhl" + "playoffs")
    if (vidTags.some(tag => keyWords.length >= 2 && keyWords.every(word => tag.includes(word)))) return true;
    
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
