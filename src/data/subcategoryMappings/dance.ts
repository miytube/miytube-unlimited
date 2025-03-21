
import { Music } from 'lucide-react';
import { SubcategoryMapping } from './types';

export const danceSubcategories: SubcategoryMapping = {
  // Dance Routes
  'dance-styles': {
    title: 'Dance Styles',
    description: 'Various dance styles, choreography and performance',
    icon: Music,
    parent: { route: '/dance', name: 'Dance' }
  },
};
