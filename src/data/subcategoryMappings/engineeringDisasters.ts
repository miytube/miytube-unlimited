
import { Wrench, Building, Zap, FlaskConical } from 'lucide-react';
import { SubcategoryMapping } from './types';

export const engineeringDisastersSubcategories: SubcategoryMapping = {
  'engineering-disasters/civil': {
    title: 'Civil Engineering Disasters',
    description: 'Bridge collapses, building failures, dam breaks, and structural disasters',
    icon: Building,
    parent: {
      route: '/engineering-disasters',
      name: 'Engineering Disasters'
    }
  },
  'engineering-disasters/mechanical': {
    title: 'Mechanical Engineering Disasters',
    description: 'Machine failures, vehicle crashes, and mechanical system breakdowns',
    icon: Wrench,
    parent: {
      route: '/engineering-disasters',
      name: 'Engineering Disasters'
    }
  },
  'engineering-disasters/electrical': {
    title: 'Electrical Engineering Disasters',
    description: 'Power grid failures, electrical fires, and electronic malfunctions',
    icon: Zap,
    parent: {
      route: '/engineering-disasters',
      name: 'Engineering Disasters'
    }
  },
  'engineering-disasters/chemical': {
    title: 'Chemical Engineering Disasters',
    description: 'Chemical spills, plant explosions, and hazardous material incidents',
    icon: FlaskConical,
    parent: {
      route: '/engineering-disasters',
      name: 'Engineering Disasters'
    }
  }
};
