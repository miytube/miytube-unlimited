
import { Trophy } from 'lucide-react';
import { SubcategoryMapping } from './types';

export const sportsSubcategories: SubcategoryMapping = {
  // Boxing subcategories
  'boxing-professional': {
    title: 'Professional Boxing',
    description: 'Professional boxing matches, fighters and championships',
    icon: Trophy,
    parent: { route: '/sports/boxing', name: 'Boxing' }
  },
  'boxing-street-fighting': {
    title: 'Street Fighting',
    description: 'Street fighting techniques and real-world combat',
    icon: Trophy,
    parent: { route: '/sports/boxing', name: 'Boxing' }
  },
  'boxing-amateur': {
    title: 'Amateur Boxing',
    description: 'Amateur boxing competitions and training',
    icon: Trophy,
    parent: { route: '/sports/boxing', name: 'Boxing' }
  },
  'boxing-training': {
    title: 'Boxing Training',
    description: 'Boxing workouts, techniques and training regimens',
    icon: Trophy,
    parent: { route: '/sports/boxing', name: 'Boxing' }
  },
};
