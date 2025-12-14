import { Train } from 'lucide-react';
import { SubcategoryMapping } from './types';

export const trainsSubcategories: SubcategoryMapping = {
  'trains': {
    title: 'Trains',
    description: 'Railroad and railway train videos',
    icon: Train,
    parent: { route: '/autos-vehicles', name: 'Transport & Vehicles' }
  },
  'trains-railroad': {
    title: 'Railroad',
    description: 'Railroad trains and track footage',
    icon: Train,
    parent: { route: '/trains', name: 'Trains' }
  },
  'trains-railway': {
    title: 'Railway',
    description: 'Railway systems and train journeys',
    icon: Train,
    parent: { route: '/trains', name: 'Trains' }
  },
  'trains-steam': {
    title: 'Steam Trains',
    description: 'Classic steam locomotive footage and history',
    icon: Train,
    parent: { route: '/trains', name: 'Trains' }
  },
  'trains-freight': {
    title: 'Freight Trains',
    description: 'Cargo and freight train operations',
    icon: Train,
    parent: { route: '/trains', name: 'Trains' }
  },
  'trains-passenger': {
    title: 'Passenger Trains',
    description: 'Passenger rail and commuter trains',
    icon: Train,
    parent: { route: '/trains', name: 'Trains' }
  },
  'trains-crashes': {
    title: 'Train Crashes & Accidents',
    description: 'Train accidents, derailments, and crashes',
    icon: Train,
    parent: { route: '/trains', name: 'Trains' }
  },
  'trains-commercial': {
    title: 'Commercial Trains',
    description: 'Commercial and industrial train operations',
    icon: Train,
    parent: { route: '/trains', name: 'Trains' }
  },
  'trains-riders': {
    title: 'Train Riders & Hobos',
    description: 'Train hopping and train riders',
    icon: Train,
    parent: { route: '/trains', name: 'Trains' }
  },
};
