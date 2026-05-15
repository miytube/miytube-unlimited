
import { Ship, Anchor, Sailboat } from 'lucide-react';
import { SubcategoryMapping } from './types';

export const boatsSubcategories: SubcategoryMapping = {
  'boats-yachts': {
    title: 'Yachts',
    description: 'Luxury yachts and high-end watercraft',
    icon: Sailboat,
    parent: {
      route: '/boats',
      name: 'Boats'
    }
  },
  'shipping-cargo-ships': {
    title: 'Cargo Ships',
    description: 'Large vessels designed for transporting cargo',
    icon: Ship,
    parent: {
      route: '/shipping',
      name: 'Shipping'
    }
  },
  'shipping-oil-tankers': {
    title: 'Oil Tankers',
    description: 'Ships designed for transporting oil and petroleum products',
    icon: Ship,
    parent: {
      route: '/shipping',
      name: 'Shipping'
    }
  }
};
