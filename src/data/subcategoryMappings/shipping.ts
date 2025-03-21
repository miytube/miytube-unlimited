
import { Ship } from 'lucide-react';
import { SubcategoryMapping } from './types';

export const shippingSubcategories: SubcategoryMapping = {
  // Shipping and Container Routes
  'shipping-container-ships': {
    title: 'Container Ships',
    description: 'Container vessels, oil tankers and commercial shipping',
    icon: Ship,
    parent: { route: '/shipping', name: 'Shipping' }
  },
};
