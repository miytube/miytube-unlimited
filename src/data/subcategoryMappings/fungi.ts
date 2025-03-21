
import { Flower, Skull } from 'lucide-react';
import { SubcategoryMapping } from './types';

export const fungiSubcategories: SubcategoryMapping = {
  'fungi-general': {
    title: 'Fungi',
    description: 'Content about different types of fungi',
    icon: Flower,
    parent: {
      route: '/fungi',
      name: 'Fungi'
    }
  },
  'fungi-killer': {
    title: 'Killer Fungi',
    description: 'Content about dangerous and toxic fungi species',
    icon: Skull,
    parent: {
      route: '/fungi',
      name: 'Fungi'
    }
  }
};
