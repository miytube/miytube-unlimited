import { SubcategoryMapping } from './types';
import { Waves, Droplets, Ship, Mountain } from 'lucide-react';

export const lakesRiversSubcategories: SubcategoryMapping = {
  'lakes-rivers/freshwater-lakes': {
    title: 'Freshwater Lakes',
    description: 'Beautiful freshwater lakes from around the world',
    icon: Droplets,
    parent: {
      route: '/oceans',
      name: 'Lakes & Rivers'
    }
  },
  'lakes-rivers/rivers': {
    title: 'Rivers',
    description: 'Majestic rivers and waterways',
    icon: Waves,
    parent: {
      route: '/oceans',
      name: 'Lakes & Rivers'
    }
  },
  'lakes-rivers/seas': {
    title: 'Seas',
    description: 'Seas and coastal waters around the globe',
    icon: Ship,
    parent: {
      route: '/oceans',
      name: 'Lakes & Rivers'
    }
  },
  'lakes-rivers/waterfalls': {
    title: 'Waterfalls',
    description: 'Stunning waterfalls and cascades',
    icon: Mountain,
    parent: {
      route: '/oceans',
      name: 'Lakes & Rivers'
    }
  },
};
