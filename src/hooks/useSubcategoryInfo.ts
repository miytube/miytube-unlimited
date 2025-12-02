
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
  
  // Get the path key from URL (remove leading slash)
  const pathKey = location.pathname.slice(1);
  
  // Generate a key from the category and subcategory (for nested routes)
  const mappingKey = subcategory ? `${category}-${subcategory}` : (category || pathKey);
  
  // Default values in case the category is not in our mapping
  let pageTitle = pathKey.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  let pageDescription = `Explore videos and content about ${pageTitle.toLowerCase()}`;
  let IconComponent: LucideIcon = Film;
  let parentRoute = '/';
  let parentName = 'Home';
  
  // First check subcategoryMappings for nested routes
  if (subcategoryMappings[mappingKey]) {
    const mapping = subcategoryMappings[mappingKey];
    pageTitle = mapping.title;
    pageDescription = mapping.description;
    IconComponent = mapping.icon;
    parentRoute = mapping.parent.route;
    parentName = mapping.parent.name;
  }
  // Then check allCategoryMappings for direct path routes
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
