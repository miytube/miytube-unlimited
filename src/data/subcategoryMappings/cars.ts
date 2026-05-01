
import { Wrench, Car } from 'lucide-react';
import { SubcategoryMapping } from './types';

export const carsSubcategories: SubcategoryMapping = {
  // Car subcategories
  'cars-repairs-major': {
    title: 'Major Car Repairs',
    description: 'Engine, transmission, and complex automotive repairs',
    icon: Wrench,
    parent: { route: '/cars/repairs', name: 'Car Repairs' }
  },
  'cars-repairs-minor': {
    title: 'Minor Car Repairs',
    description: 'Quick fixes and simple car maintenance tasks',
    icon: Wrench,
    parent: { route: '/cars/repairs', name: 'Car Repairs' }
  },
  'cars-repairs-hacks': {
    title: 'Car Repair Hacks',
    description: 'Clever automotive repair and maintenance tricks',
    icon: Wrench,
    parent: { route: '/cars/repairs', name: 'Car Repairs' }
  },
  'cars-repairs-maintenance': {
    title: 'Car Maintenance',
    description: 'Regular maintenance procedures and schedules',
    icon: Wrench,
    parent: { route: '/cars/repairs', name: 'Car Repairs' }
  },
  'cars-drifting': {
    title: 'Car Drifting',
    description: 'Drifting techniques, events, and professional drivers',
    icon: Car,
    parent: { route: '/cars', name: 'Cars' }
  },
  'cars-expensive': {
    title: 'Expensive & Rare Cars',
    description: 'Luxury automobiles and rare vehicle collections',
    icon: Car,
    parent: { route: '/cars', name: 'Cars' }
  },
  'cars-future': {
    title: 'Future Vehicles',
    description: 'Concept cars, upcoming models and automotive innovation',
    icon: Car,
    parent: { route: '/cars', name: 'Cars' }
  },
  'cars-types': {
    title: 'Car Types',
    description: 'Sedans, coupes, SUVs and other vehicle classifications',
    icon: Car,
    parent: { route: '/cars', name: 'Cars' }
  },
  'cars-strange': {
    title: 'Strange & Unusual Cars',
    description: 'Weird, unusual and bizarre automotive creations',
    icon: Car,
    parent: { route: '/cars', name: 'Cars' }
  },
  'cars-supercars': {
    title: 'Supercars & Hypercars',
    description: 'High-performance sports cars and exotic vehicles',
    icon: Car,
    parent: { route: '/cars', name: 'Cars' }
  },
  'cars-accidents': {
    title: 'Car Accidents',
    description: 'Driving mistakes, crashes and accident prevention',
    icon: Car,
    parent: { route: '/cars', name: 'Cars' }
  },
  'cars-crashes': {
    title: 'Vehicle Crashes',
    description: 'Cars, trucks, and motorcycle crashes and accidents',
    icon: Car,
    parent: { route: '/cars', name: 'Cars' }
  },
  'cars-motorcycles': {
    title: 'Cars, Trucks & Motorcycles',
    description: 'Various vehicle types and transportation methods',
    icon: Car,
    parent: { route: '/cars', name: 'Cars' }
  },
  'cars-towed': {
    title: 'Car got Towed',
    description: 'Towed cars, towing incidents, and vehicle impound stories',
    icon: Car,
    parent: { route: '/cars', name: 'Cars' }
  },
};
