
import { FlaskConical, Rocket } from 'lucide-react';
import { SubcategoryMapping } from './types';

export const experimentsSubcategories: SubcategoryMapping = {
  'experiments-rockets': {
    title: 'Rocket Experiments',
    description: 'Content featuring rocket experiments and launches',
    icon: Rocket,
    parent: {
      route: '/experiments',
      name: 'Experiments'
    }
  },
  'experiments-tops': {
    title: 'Top Experiments',
    description: 'Content featuring top experiments in various scientific fields',
    icon: FlaskConical,
    parent: {
      route: '/experiments',
      name: 'Experiments'
    }
  }
};
