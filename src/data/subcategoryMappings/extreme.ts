
import { Mountain, Snowflake, Wind } from 'lucide-react';
import { SubcategoryMapping } from './types';

export const extremeSubcategories: SubcategoryMapping = {
  'extreme-activity': {
    title: 'Extreme Activities',
    description: 'Content featuring extreme sports and activities',
    icon: Mountain,
    parent: {
      route: '/extreme',
      name: 'Extreme Activities'
    }
  },
  'extreme-sports': {
    title: 'Extreme Sports',
    description: 'Content about extreme sports and high-adrenaline activities',
    icon: Wind,
    parent: {
      route: '/extreme',
      name: 'Extreme Activities'
    }
  },
  'extreme-adventures': {
    title: 'Extreme Adventures',
    description: 'Content featuring extreme adventure expeditions and challenges',
    icon: Snowflake,
    parent: {
      route: '/extreme',
      name: 'Extreme Activities'
    }
  }
};
