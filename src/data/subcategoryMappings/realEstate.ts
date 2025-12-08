import { House, Building2, Castle } from 'lucide-react';
import { SubcategoryMapping } from './types';

export const realEstateSubcategories: SubcategoryMapping = {
  'real-estate-residential': {
    title: 'Real Estate (Residential Property)',
    description: 'Residential homes, apartments, condos, and housing properties',
    icon: House,
    parent: {
      route: '/real-estate',
      name: 'Real Estate'
    }
  },
  'real-estate-commercial': {
    title: 'Real Estate (Commercial Property)',
    description: 'Commercial buildings, offices, retail spaces, and business properties',
    icon: Building2,
    parent: {
      route: '/real-estate',
      name: 'Real Estate'
    }
  },
  'real-estate-luxury': {
    title: 'Real Estate (Luxury, Million Dollar Property)',
    description: 'Luxury estates, mansions, and high-end million dollar properties',
    icon: Castle,
    parent: {
      route: '/real-estate',
      name: 'Real Estate'
    }
  },
  'residential': {
    title: 'Real Estate (Residential Property)',
    description: 'Residential homes, apartments, condos, and housing properties',
    icon: House,
    parent: {
      route: '/real-estate',
      name: 'Real Estate'
    }
  },
  'commercial': {
    title: 'Real Estate (Commercial Property)',
    description: 'Commercial buildings, offices, retail spaces, and business properties',
    icon: Building2,
    parent: {
      route: '/real-estate',
      name: 'Real Estate'
    }
  },
  'luxury': {
    title: 'Real Estate (Luxury, Million Dollar Property)',
    description: 'Luxury estates, mansions, and high-end million dollar properties',
    icon: Castle,
    parent: {
      route: '/real-estate',
      name: 'Real Estate'
    }
  },
};
