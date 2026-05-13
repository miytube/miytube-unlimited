import { subcategoryMappings } from '@/data/subcategoryMappings';

const trimSlashes = (value: string) => value.replace(/^\/+|\/+$/g, '');

export const getUploadDestinationRoute = (category?: string, subcategory?: string) => {
  const cleanCategory = category ? trimSlashes(category) : '';
  const cleanSubcategory = subcategory ? trimSlashes(subcategory) : '';

  if (!cleanCategory) return '/';
  if (!cleanSubcategory) return `/${cleanCategory}`;

  if (subcategoryMappings[`/${cleanSubcategory}`]) return `/${cleanSubcategory}`;
  if (subcategoryMappings[cleanSubcategory]) return cleanSubcategory.startsWith('/') ? cleanSubcategory : `/${cleanSubcategory}`;

  if (cleanSubcategory.startsWith(`${cleanCategory}/`)) return `/${cleanSubcategory}`;
  if (cleanSubcategory.startsWith(`${cleanCategory}-`)) {
    return `/${cleanCategory}/${cleanSubcategory.slice(cleanCategory.length + 1)}`;
  }

  return `/${cleanCategory}/${cleanSubcategory}`;
};