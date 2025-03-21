
import { Brush } from 'lucide-react';
import { SubcategoryMapping } from './types';

export const cosmeticsSubcategories: SubcategoryMapping = {
  // Cosmetics Routes
  'cosmetics-foundation': {
    title: 'Foundation & Powders',
    description: 'Makeup foundations, powders and base products',
    icon: Brush,
    parent: { route: '/cosmetics', name: 'Cosmetics' }
  },
  'cosmetics-lipstick': {
    title: 'Lipstick & Makeup',
    description: 'Lipsticks, lip products and general makeup tutorials',
    icon: Brush,
    parent: { route: '/cosmetics', name: 'Cosmetics' }
  },
};
