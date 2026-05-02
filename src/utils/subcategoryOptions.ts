import { subcategoryMappings } from '@/data/subcategoryMappings';

// Extract all subcategories from mappings for autocomplete
export const getAllSubcategoryOptions = () => {
  const subcategories: Array<{ id: string; name: string; category?: string }> = [];
  
  Object.entries(subcategoryMappings).forEach(([key, value]) => {
    subcategories.push({
      id: key,
      name: value.title.replace(/^.*\(/, '').replace(/\)$/, '') || value.title,
      category: value.parent?.name
    });
  });
  
  return subcategories;
};

// Get subcategories filtered by parent category
export const getSubcategoriesByCategory = (categoryId: string): Array<{ id: string; name: string }> => {
  const subcategories: Array<{ id: string; name: string }> = [];
  const categoryName = categoryId.toLowerCase().replace(/-/g, ' ');
  
  Object.entries(subcategoryMappings).forEach(([key, value]) => {
    const parentName = value.parent?.name?.toLowerCase() || '';
    const parentRoute = value.parent?.route?.toLowerCase().replace('/', '') || '';
    
    if (parentName.includes(categoryName) || parentRoute.includes(categoryId.replace(/-/g, '')) || categoryName.includes(parentName)) {
      subcategories.push({
        id: key,
        name: value.title
      });
    }
  });
  
  return subcategories;
};

// Common subcategories for real estate
export const realEstateSubcategoryOptions = [
  { id: 'residential', name: 'Residential Property' },
  { id: 'commercial', name: 'Commercial Property' },
  { id: 'luxury', name: 'Luxury & Million Dollar Property' },
  { id: 'real-estate-residential', name: 'Real Estate (Residential Property)' },
  { id: 'real-estate-commercial', name: 'Real Estate (Commercial Property)' },
  { id: 'real-estate-luxury', name: 'Real Estate (Luxury, Million Dollar Property)' },
];

// All predefined subcategories by category for quick lookup
export const subcategoryOptionsByCategory: Record<string, Array<{ id: string; name: string }>> = {
  'real-estate': realEstateSubcategoryOptions,
  'realestate': realEstateSubcategoryOptions,
  'sports': [
    { id: 'basketball', name: 'Basketball' },
    { id: 'football', name: 'Football' },
    { id: 'baseball', name: 'Baseball' },
    { id: 'soccer', name: 'Soccer' },
    { id: 'tennis', name: 'Tennis' },
    { id: 'golf', name: 'Golf' },
    { id: 'boxing', name: 'Boxing' },
    { id: 'mma', name: 'MMA' },
    { id: 'hockey', name: 'Hockey' },
    { id: 'cricket', name: 'Cricket' },
  ],
  'business': [
    { id: 'finance', name: 'Finance' },
    { id: 'marketing', name: 'Marketing' },
    { id: 'entrepreneurship', name: 'Entrepreneurship' },
    { id: 'cryptocurrency', name: 'Cryptocurrency' },
    { id: 'investing', name: 'Investing' },
    { id: 'startups', name: 'Startups' },
  ],
  'comedy': [
    { id: 'standup', name: 'Stand-up Comedy' },
    { id: 'sketch', name: 'Sketch Comedy' },
    { id: 'prank', name: 'Pranks' },
    { id: 'parody', name: 'Parody' },
    { id: 'improv', name: 'Improv' },
  ],
  'music': [
    { id: 'pop', name: 'Pop' },
    { id: 'rock', name: 'Rock' },
    { id: 'hiphop', name: 'Hip Hop' },
    { id: 'jazz', name: 'Jazz' },
    { id: 'classical', name: 'Classical' },
    { id: 'country', name: 'Country' },
    { id: 'electronic', name: 'Electronic' },
    { id: 'rnb', name: 'R&B' },
  ],
  'gaming': [
    { id: 'arcade-games', name: 'Arcade Games' },
    { id: 'casino-slots', name: 'Casino Slots' },
    { id: 'dominos', name: 'Dominoes & Domino Fails' },
    { id: 'lottery', name: 'Lottery & Prize & Raffle' },
    { id: 'xbox-playstation', name: 'Xbox & PlayStation' },
    { id: 'gaming-cards', name: 'Gaming Cards' },
    { id: 'fps', name: 'FPS Games' },
    { id: 'rpg', name: 'RPG Games' },
    { id: 'strategy', name: 'Strategy Games' },
    { id: 'moba', name: 'MOBA' },
    { id: 'sports-games', name: 'Sports Games' },
    { id: 'racing', name: 'Racing Games' },
  ],
  'education': [
    { id: 'science', name: 'Science' },
    { id: 'math', name: 'Mathematics' },
    { id: 'history', name: 'History' },
    { id: 'language', name: 'Language Learning' },
    { id: 'technology', name: 'Technology' },
    { id: 'arts', name: 'Arts & Crafts' },
  ],
  'film': [
    { id: 'action', name: 'Action' },
    { id: 'drama', name: 'Drama' },
    { id: 'comedy-film', name: 'Comedy' },
    { id: 'horror', name: 'Horror' },
    { id: 'documentary', name: 'Documentary' },
    { id: 'animation', name: 'Animation' },
    { id: 'thriller', name: 'Thriller' },
    { id: 'romance', name: 'Romance' },
  ],
  'cars': [
    { id: 'car-repairs', name: 'Car Repairs' },
    { id: 'car-reviews', name: 'Car Reviews' },
    { id: 'classic-cars', name: 'Classic Cars' },
    { id: 'sports-cars', name: 'Sports Cars' },
    { id: 'electric-vehicles', name: 'Electric Vehicles' },
  ],
  'hollywood': [
    { id: 'bios', name: 'Actors & Actress: Bios & History' },
    { id: 'news', name: 'Actors & Actress: News & Gossip' },
    { id: 'interviews', name: 'Actors & Actress: Interviews & Work' },
  ],
  'military': [
    { id: 'army', name: 'Army' },
    { id: 'airforce', name: 'Air Force' },
    { id: 'navy', name: 'Navy' },
    { id: 'marines', name: 'Marines' },
    { id: 'coast-guard', name: 'Coast Guard' },
  ],
  'fitness': [
    { id: 'weightlifting', name: 'Weightlifting' },
    { id: 'yoga', name: 'Yoga' },
    { id: 'cardio', name: 'Cardio' },
    { id: 'crossfit', name: 'CrossFit' },
    { id: 'pilates', name: 'Pilates' },
  ],
  'trains': [
    { id: 'railroad', name: 'Railroad' },
    { id: 'railway', name: 'Railway' },
    { id: 'steam-trains', name: 'Steam Trains' },
    { id: 'freight-trains', name: 'Freight Trains' },
    { id: 'passenger-trains', name: 'Passenger Trains' },
  ],
  'swimming': [
    { id: 'diving', name: 'Diving' },
    { id: 'plunge', name: 'Plunge' },
    { id: 'plummet', name: 'Plummet' },
    { id: 'jump', name: 'Jump' },
    { id: 'freestyle-swimming', name: 'Freestyle Swimming' },
  ],
  'swim': [
    { id: 'diving', name: 'Diving' },
    { id: 'plunge', name: 'Plunge' },
    { id: 'plummet', name: 'Plummet' },
    { id: 'jump', name: 'Jump' },
    { id: 'freestyle-swimming', name: 'Freestyle Swimming' },
  ],
  'floods': [
    { id: 'flash-floods', name: 'Flash Floods' },
    { id: 'deluge', name: 'Deluge' },
    { id: 'downpour', name: 'Downpour' },
    { id: 'drowning-hazards', name: 'Drowning Hazards' },
    { id: 'engulfing-waters', name: 'Engulfing Waters' },
    { id: 'stream-flooding', name: 'Stream Flooding' },
  ],
  'film-horror': [
    { id: 'terror', name: 'Terror' },
    { id: 'fear', name: 'Fear' },
    { id: 'fright', name: 'Fright' },
    { id: 'dread', name: 'Dread' },
    { id: 'slasher', name: 'Slasher' },
  ],
  'horror': [
    { id: 'terror', name: 'Terror' },
    { id: 'fear', name: 'Fear' },
    { id: 'fright', name: 'Fright' },
    { id: 'dread', name: 'Dread' },
    { id: 'slasher', name: 'Slasher' },
  ],
  'racing-track': [
    { id: 'accidents', name: 'Accidents' },
    { id: 'crashes', name: 'Crashes' },
  ],
  'racing': [
    { id: 'accidents', name: 'Accidents' },
    { id: 'crashes', name: 'Crashes' },
  ],
};

// Get subcategory options for a given category ID
export const getSubcategoryOptionsForCategory = (categoryId: string): Array<{ id: string; name: string }> => {
  const normalizedId = categoryId.toLowerCase().replace(/[\s_]/g, '-');
  
  // Direct match
  if (subcategoryOptionsByCategory[normalizedId]) {
    return subcategoryOptionsByCategory[normalizedId];
  }
  
  // Try without hyphens
  const noHyphenId = normalizedId.replace(/-/g, '');
  for (const [key, value] of Object.entries(subcategoryOptionsByCategory)) {
    if (key.replace(/-/g, '') === noHyphenId) {
      return value;
    }
  }
  
  // Try from subcategoryMappings
  return getSubcategoriesByCategory(categoryId);
};
