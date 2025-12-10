import { Waves } from 'lucide-react';
import { SubcategoryMapping } from './types';

export const swimmingSubcategories: SubcategoryMapping = {
  'swim': {
    title: 'Swimming',
    description: 'Swimming and aquatic sports videos',
    icon: Waves,
    parent: { route: '/sports', name: 'Sports' }
  },
  'swim-diving': {
    title: 'Diving',
    description: 'Diving competitions and techniques',
    icon: Waves,
    parent: { route: '/swim', name: 'Swimming' }
  },
  'swim-plunge': {
    title: 'Plunge',
    description: 'Plunge diving and water entry videos',
    icon: Waves,
    parent: { route: '/swim', name: 'Swimming' }
  },
  'swim-plummet': {
    title: 'Plummet',
    description: 'High diving and extreme water jumps',
    icon: Waves,
    parent: { route: '/swim', name: 'Swimming' }
  },
  'swim-jump': {
    title: 'Jump',
    description: 'Water jumping and cliff diving videos',
    icon: Waves,
    parent: { route: '/swim', name: 'Swimming' }
  },
  'swim-freestyle': {
    title: 'Freestyle Swimming',
    description: 'Freestyle swimming techniques and races',
    icon: Waves,
    parent: { route: '/swim', name: 'Swimming' }
  },
};
