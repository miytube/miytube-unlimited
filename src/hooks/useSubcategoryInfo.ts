
import { useParams, useLocation } from 'react-router-dom';
import { Film, LucideIcon } from 'lucide-react';
import { subcategoryMappings } from '@/data/subcategoryMappings';
import { allCategoryMappings, getCategoryInfo } from '@/data/allCategoryMappings';

interface SubcategoryData {
  pageTitle: string;
  pageDescription: string;
  IconComponent: LucideIcon;
  parentRoute: string;
  parentName: string;
  mappingKey: string;
}

export const useSubcategoryInfo = (): SubcategoryData => {
  const { category, subcategory } = useParams<{ category: string; subcategory: string }>();
  const location = useLocation();
  
  // Get the path key from URL (with and without leading slash)
  const pathKey = location.pathname.slice(1);
  const fullPath = location.pathname; // Keep the leading slash for mapping lookup
  
  // For nested routes like /gaming/game-challenges, extract the last segment
  const pathParts = pathKey.split('/');
  const lastSegment = pathParts[pathParts.length - 1];
  
  // Generate a key from the category and subcategory (for nested routes)
  const mappingKey = subcategory ? `${category}-${subcategory}` : (category || pathKey);
  
  // Default values in case the category is not in our mapping
  let pageTitle = pathKey.split('/').pop()?.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') || pathKey;
  let pageDescription = `Explore videos and content about ${pageTitle.toLowerCase()}`;
  let IconComponent: LucideIcon = Film;
  let parentRoute = '/';
  let parentName = 'Home';
  
  // First check subcategoryMappings with full path (including leading slash) - this is the primary format
  if (subcategoryMappings[fullPath]) {
    const mapping = subcategoryMappings[fullPath];
    pageTitle = mapping.title;
    pageDescription = mapping.description;
    IconComponent = mapping.icon;
    parentRoute = mapping.parent.route;
    parentName = mapping.parent.name;
  }
  // Check subcategoryMappings with path key (without leading slash) - for animals and similar mappings
  else if (subcategoryMappings[pathKey]) {
    const mapping = subcategoryMappings[pathKey];
    pageTitle = mapping.title;
    pageDescription = mapping.description;
    IconComponent = mapping.icon;
    parentRoute = mapping.parent.route;
    parentName = mapping.parent.name;
  }
  // Then check subcategoryMappings for nested routes with key format like "category-subcategory"
  else if (subcategoryMappings[mappingKey]) {
    const mapping = subcategoryMappings[mappingKey];
    pageTitle = mapping.title;
    pageDescription = mapping.description;
    IconComponent = mapping.icon;
    parentRoute = mapping.parent.route;
    parentName = mapping.parent.name;
  }
  // Check allCategoryMappings with full path
  else if (allCategoryMappings[fullPath]) {
    const mapping = allCategoryMappings[fullPath];
    pageTitle = mapping.title;
    pageDescription = mapping.description;
    IconComponent = mapping.icon;
    parentRoute = mapping.parent?.route || '/';
    parentName = mapping.parent?.name || 'Home';
  }
  // Check allCategoryMappings for the last segment (for nested routes like /gaming/game-challenges)
  else if (allCategoryMappings[lastSegment]) {
    const mapping = allCategoryMappings[lastSegment];
    pageTitle = mapping.title;
    pageDescription = mapping.description;
    IconComponent = mapping.icon;
    parentRoute = mapping.parent?.route || '/';
    parentName = mapping.parent?.name || 'Home';
  }
  // Then check allCategoryMappings for direct path routes (without leading slash)
  else if (allCategoryMappings[pathKey]) {
    const mapping = allCategoryMappings[pathKey];
    pageTitle = mapping.title;
    pageDescription = mapping.description;
    IconComponent = mapping.icon;
    parentRoute = mapping.parent?.route || '/';
    parentName = mapping.parent?.name || 'Home';
  }
  // Finally, use the getCategoryInfo helper as fallback
  else {
    const info = getCategoryInfo(pathKey);
    pageTitle = info.title;
    pageDescription = info.description;
    IconComponent = info.icon;
  }
  
  return {
    pageTitle,
    pageDescription,
    IconComponent,
    parentRoute,
    parentName,
    mappingKey: pathKey
  };
};
