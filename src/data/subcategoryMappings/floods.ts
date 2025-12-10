import { Droplets } from 'lucide-react';
import { SubcategoryMapping } from './types';

export const floodsSubcategories: SubcategoryMapping = {
  'floods': {
    title: 'Floods',
    description: 'Flood events, disasters and water damage footage',
    icon: Droplets,
    parent: { route: '/disasters', name: 'Disasters' }
  },
  'floods-flash-flood': {
    title: 'Flash Floods',
    description: 'Flash flood events and sudden water surges',
    icon: Droplets,
    parent: { route: '/floods', name: 'Floods' }
  },
  'floods-deluge': {
    title: 'Deluge',
    description: 'Major flooding and water deluge events',
    icon: Droplets,
    parent: { route: '/floods', name: 'Floods' }
  },
  'floods-downpour': {
    title: 'Downpour',
    description: 'Heavy rain and downpour causing floods',
    icon: Droplets,
    parent: { route: '/floods', name: 'Floods' }
  },
  'floods-drown': {
    title: 'Drowning Hazards',
    description: 'Water safety and drowning awareness',
    icon: Droplets,
    parent: { route: '/floods', name: 'Floods' }
  },
  'floods-engulf': {
    title: 'Engulfing Waters',
    description: 'Rising waters and engulfing flood footage',
    icon: Droplets,
    parent: { route: '/floods', name: 'Floods' }
  },
  'floods-stream': {
    title: 'Stream Flooding',
    description: 'Stream and river overflow events',
    icon: Droplets,
    parent: { route: '/floods', name: 'Floods' }
  },
};
