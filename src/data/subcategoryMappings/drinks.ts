
import { Wine } from 'lucide-react';
import { SubcategoryMapping } from './types';

export const drinksSubcategories: SubcategoryMapping = {
  // Drinks Routes
  'drinks-alcohol': {
    title: 'Alcoholic & Non-Alcoholic Drinks',
    description: 'Drink recipes, mixing tutorials and beverage information',
    icon: Wine,
    parent: { route: '/drinks', name: 'Drinks' }
  },
};
