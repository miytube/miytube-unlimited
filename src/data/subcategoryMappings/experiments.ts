
import { FlaskConical, Rocket } from 'lucide-react';
import { SubcategoryMapping } from './types';

export const experimentsSubcategories: SubcategoryMapping = {
  'experiments-rockets': {
    title: 'Rocket Experiments',
    description: 'Rocket experiments and launches',
    icon: Rocket,
    parent: {
      route: '/experiments',
      name: 'Experiments'
    }
  },
  'experiments-tops': {
    title: 'Top Experiments',
    description: 'Top experiments in various scientific fields',
    icon: FlaskConical,
    parent: {
      route: '/experiments',
      name: 'Experiments'
    }
  }
};