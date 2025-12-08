/**
 * Strict video filtering utility to prevent loose matching issues.
 * Videos should only appear in categories/subcategories they were explicitly assigned to.
 */

import { UploadedVideo } from '@/context/UploadedVideosContext';

/**
 * Filter videos by exact category match or keyword-based matching for parent categories.
 * For parent categories (like "Business", "Cars"), we match if the video's category
 * starts with or equals that category name.
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
    
    // If keywords provided, check for exact keyword matches in category/subcategory
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
 * Filter videos by subcategory with strict matching.
 * Used for subcategory pages where we need exact matches.
 */
export const filterVideosBySubcategory = (
  videos: UploadedVideo[],
  pageTitle: string,
  mappingKey: string
): UploadedVideo[] => {
  const titleLower = pageTitle.toLowerCase().trim();
  const keyLower = mappingKey.toLowerCase().trim();
  
  // Extract core keywords from mapping key (e.g., "sports-mlb-world-series" -> ["mlb", "world", "series"])
  const keyWords = keyLower.split('-').filter(w => w.length > 2);
  
  return videos.filter(video => {
    const vidCategory = video.category?.toLowerCase().trim() || '';
    const vidSubcategory = video.subcategory?.toLowerCase().trim() || '';
    const vidTags = video.tags?.map(t => t.toLowerCase().trim()) || [];
    
    // Exact match on title
    if (vidCategory === titleLower || vidSubcategory === titleLower) return true;
    
    // Check if category/subcategory contains the page title exactly
    // (e.g., "MLB World Series" matches "sports mlb world series")
    const titleWords = titleLower.split(' ').filter(w => w.length > 2);
    const combinedText = `${vidCategory} ${vidSubcategory}`;
    
    // All title words must be present
    if (titleWords.length >= 2 && titleWords.every(word => combinedText.includes(word))) return true;
    
    // Check if key matches exactly
    if (vidCategory === keyLower || vidSubcategory === keyLower) return true;
    
    // Check if all key words are present in category or subcategory
    if (keyWords.length >= 2 && keyWords.every(word => combinedText.includes(word))) return true;
    
    // Check tags for exact match
    if (vidTags.includes(titleLower) || vidTags.includes(keyLower)) return true;
    
    // Check if tag contains all key words
    if (vidTags.some(tag => keyWords.length >= 2 && keyWords.every(word => tag.includes(word)))) return true;
    
    return false;
  });
};

/**
 * Filter videos by music genre with strict matching.
 */
export const filterVideosByMusicGenre = (
  videos: UploadedVideo[],
  genre: string
): UploadedVideo[] => {
  const genreLower = genre.toLowerCase().trim();
  
  return videos.filter(video => {
    const categoryLower = video.category?.toLowerCase().trim() || '';
    const subcategoryLower = video.subcategory?.toLowerCase().trim() || '';
    const tags = video.tags?.map(t => t.toLowerCase().trim()) || [];
    
    // Exact match on subcategory or category equals the genre
    return (
      categoryLower === genreLower ||
      subcategoryLower === genreLower ||
      categoryLower === `music-${genreLower}` ||
      subcategoryLower === `music-${genreLower}` ||
      tags.includes(genreLower) ||
      tags.includes(`music-${genreLower}`)
    );
  });
};
