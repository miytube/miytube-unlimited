/**
 * Strict video filtering utility to prevent loose matching issues.
 * Videos should only appear in categories/subcategories they were explicitly assigned to.
 * Includes fuzzy matching to handle common typos.
 */

import { UploadedVideo } from '@/context/UploadedVideosContext';

/**
 * Calculate similarity score between two strings using character overlap.
 * Returns a value between 0 and 1, where 1 is an exact match.
 */
const getSimilarity = (str1: string, str2: string): number => {
  const s1 = str1.toLowerCase().trim();
  const s2 = str2.toLowerCase().trim();
  if (s1 === s2) return 1;
  if (s1.includes(s2) || s2.includes(s1)) return 0.9;
  
  // Simple character overlap ratio
  const chars1 = new Set(s1.split(''));
  const chars2 = new Set(s2.split(''));
  const intersection = [...chars1].filter(c => chars2.has(c)).length;
  const union = new Set([...chars1, ...chars2]).size;
  return intersection / union;
};

/**
 * Check if two strings are a fuzzy match (handles typos like "commerical" vs "commercial")
 */
const isFuzzyMatch = (input: string, target: string, threshold = 0.75): boolean => {
  const inputLower = input.toLowerCase().trim();
  const targetLower = target.toLowerCase().trim();
  
  // Exact match
  if (inputLower === targetLower) return true;
  
  // Check similarity
  return getSimilarity(inputLower, targetLower) >= threshold;
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
    
    // Fuzzy match on category (for typos)
    if (isFuzzyMatch(vidCategory, categoryLower)) return true;
    
    // Check if category starts with the parent category name
    // e.g., "business-cryptocurrency" starts with "business"
    if (vidCategory.startsWith(categoryLower + '-') || vidCategory.startsWith(categoryLower + ' ')) return true;
    
    // Check subcategory exact match or fuzzy match
    if (vidSubcategory === categoryLower || isFuzzyMatch(vidSubcategory, categoryLower)) return true;
    
    // Check tags for exact match only
    if (vidTags.includes(categoryLower)) return true;
    
    // If keywords provided, check for exact or fuzzy keyword matches in category/subcategory
    if (keywords && keywords.length > 0) {
      return keywords.some(keyword => {
        const keywordLower = keyword.toLowerCase().trim();
        return (
          vidCategory === keywordLower ||
          vidSubcategory === keywordLower ||
          vidTags.includes(keywordLower) ||
          isFuzzyMatch(vidCategory, keywordLower) ||
          isFuzzyMatch(vidSubcategory, keywordLower)
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
  
  return videos.filter(video => {
    const vidCategory = video.category?.toLowerCase().trim() || '';
    const vidSubcategory = video.subcategory?.toLowerCase().trim() || '';
    const vidTags = video.tags?.map(t => t.toLowerCase().trim()) || [];
    
    // Exact match on subcategory (e.g., video.subcategory === "luxury")
    if (vidSubcategory === lastSegment) return true;
    
    // Fuzzy match on subcategory (for typos like "commerical" vs "commercial")
    if (isFuzzyMatch(vidSubcategory, lastSegment)) return true;
    
    // Match when video category matches parent and subcategory matches last segment
    // e.g., video.category="real-estate", video.subcategory="luxury", key="real-estate/luxury"
    if (parentSegment) {
      const normalizedParent = parentSegment.replace(/[\s-]/g, '');
      const normalizedVidCategory = vidCategory.replace(/[\s-]/g, '');
      if ((normalizedVidCategory === normalizedParent || isFuzzyMatch(normalizedVidCategory, normalizedParent)) && 
          (vidSubcategory === lastSegment || isFuzzyMatch(vidSubcategory, lastSegment))) {
        return true;
      }
    }
    
    // Exact match on title
    if (vidCategory === titleLower || vidSubcategory === titleLower) return true;
    
    // Fuzzy match on title
    if (isFuzzyMatch(vidCategory, titleLower) || isFuzzyMatch(vidSubcategory, titleLower)) return true;
    
    // Match combined parent-subcategory pattern (e.g., "real-estate-luxury")
    const combinedKey = `${parentSegment}-${lastSegment}`;
    if (vidCategory === combinedKey || vidSubcategory === combinedKey) return true;
    if (isFuzzyMatch(vidCategory, combinedKey) || isFuzzyMatch(vidSubcategory, combinedKey)) return true;
    
    // Check if category/subcategory contains the page title exactly
    const titleWords = titleLower.split(' ').filter(w => w.length > 2);
    const combinedText = `${vidCategory} ${vidSubcategory}`;
    
    // All title words must be present
    if (titleWords.length >= 2 && titleWords.every(word => combinedText.includes(word))) return true;
    
    // Check if key matches exactly
    if (vidCategory === keyLower || vidSubcategory === keyLower) return true;
    
    // Check if all key words are present in category or subcategory
    if (keyWords.length >= 2 && keyWords.every(word => combinedText.includes(word))) return true;
    
    // Check tags for exact match or fuzzy match
    if (vidTags.includes(titleLower) || vidTags.includes(keyLower) || vidTags.includes(lastSegment)) return true;
    if (vidTags.some(tag => isFuzzyMatch(tag, lastSegment) || isFuzzyMatch(tag, titleLower))) return true;
    
    // Check if tag contains all key words
    if (vidTags.some(tag => keyWords.length >= 2 && keyWords.every(word => tag.includes(word)))) return true;
    
    return false;
  });
};

/**
 * Filter videos by music genre with strict matching plus fuzzy matching for typos.
 */
export const filterVideosByMusicGenre = (
  videos: UploadedVideo[],
  genre: string
): UploadedVideo[] => {
  const genreLower = genre.toLowerCase().trim();
  
  // Handle hyphenated genre names (e.g., "funk-rock" should match "funk rock")
  const genreWords = genreLower.split('-').filter(w => w.length > 0);
  const genreSpaced = genreWords.join(' ');
  
  return videos.filter(video => {
    const categoryLower = video.category?.toLowerCase().trim() || '';
    const subcategoryLower = video.subcategory?.toLowerCase().trim() || '';
    const tags = video.tags?.map(t => t.toLowerCase().trim()) || [];
    
    // Check if this is a music video (category starts with 'music' or equals 'music')
    const isMusicVideo = categoryLower === 'music' || categoryLower.startsWith('music-') || categoryLower.startsWith('music ');
    
    // Exact match on category or subcategory equals the genre
    if (categoryLower === genreLower || subcategoryLower === genreLower) return true;
    
    // Fuzzy match on genre (for typos)
    if (isFuzzyMatch(categoryLower, genreLower) || isFuzzyMatch(subcategoryLower, genreLower)) return true;
    
    // Match music-{genre} pattern
    if (categoryLower === `music-${genreLower}` || subcategoryLower === `music-${genreLower}`) return true;
    
    // Match "music {genre}" pattern (space separated)
    if (categoryLower === `music ${genreLower}` || subcategoryLower === `music ${genreLower}`) return true;
    
    // Match spaced version (e.g., "funk rock" for "funk-rock")
    if (categoryLower === genreSpaced || subcategoryLower === genreSpaced) return true;
    if (categoryLower === `music-${genreSpaced}` || subcategoryLower === `music-${genreSpaced}`) return true;
    if (categoryLower === `music ${genreSpaced}` || subcategoryLower === `music ${genreSpaced}`) return true;
    
    // For music videos, check if subcategory matches genre (exact or fuzzy)
    if (isMusicVideo && (subcategoryLower === genreLower || isFuzzyMatch(subcategoryLower, genreLower))) return true;
    if (isMusicVideo && (subcategoryLower === genreSpaced || isFuzzyMatch(subcategoryLower, genreSpaced))) return true;
    
    // Check tags for exact match or fuzzy match
    if (tags.includes(genreLower) || tags.includes(`music-${genreLower}`) || tags.includes(genreSpaced)) return true;
    if (tags.some(tag => isFuzzyMatch(tag, genreLower))) return true;
    
    // Check if category or subcategory contains the genre (for cases like "music-lyrics" matching "lyrics")
    if (categoryLower.includes(genreLower) || subcategoryLower.includes(genreLower)) return true;
    
    return false;
  });
};
