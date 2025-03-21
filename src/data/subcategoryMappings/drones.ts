
import { Plane } from 'lucide-react';
import { SubcategoryMapping } from './types';

export const dronesSubcategories: SubcategoryMapping = {
  // Drone Routes
  'drones-civilian': {
    title: 'Civilian Drones',
    description: 'Consumer drones, remote controlled aircraft and aerial photography',
    icon: Plane,
    parent: { route: '/drones', name: 'Drones' }
  },
};
