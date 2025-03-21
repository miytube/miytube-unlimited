
import { useParams } from 'react-router-dom';
import { Film, LucideIcon } from 'lucide-react';
import { subcategoryMappings, SubcategoryInfo } from '@/data/subcategoryMappings';

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
  
  // Generate a key from the category and subcategory
  const mappingKey = `${category}-${subcategory}`;
  
  // Default values in case the category is not in our mapping
  let pageTitle = subcategory ? subcategory.replace(/-/g, ' ') : 'Category';
  let pageDescription = 'Explore videos and content in this category';
  let IconComponent: LucideIcon = Film;
  let parentRoute = '/';
  let parentName = 'Home';
  
  // If we have mapping data for this category, use it
  if (subcategoryMappings[mappingKey]) {
    const mapping = subcategoryMappings[mappingKey];
    pageTitle = mapping.title;
    pageDescription = mapping.description;
    IconComponent = mapping.icon;
    parentRoute = mapping.parent.route;
    parentName = mapping.parent.name;
  }
  
  return {
    pageTitle,
    pageDescription,
    IconComponent,
    parentRoute,
    parentName,
    mappingKey
  };
};
