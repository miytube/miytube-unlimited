
import { Bitcoin, BarChart, ShoppingCart, Globe } from 'lucide-react';
import { SubcategoryMapping } from './types';

export const businessSubcategories: SubcategoryMapping = {
  // Business subcategories
  'business-cryptocurrency': {
    title: 'Cryptocurrency',
    description: 'Bitcoin, altcoins, and blockchain technology',
    icon: Bitcoin,
    parent: { route: '/business', name: 'Business' }
  },
  'business-leadership': {
    title: 'Business Leadership',
    description: 'Leadership advice, mentorship and business guidance',
    icon: BarChart,
    parent: { route: '/business', name: 'Business' }
  },
  'business-finance': {
    title: 'Finance & Taxes',
    description: 'Money management, taxes, and interest rates',
    icon: BarChart,
    parent: { route: '/business', name: 'Business' }
  },
  'business-services': {
    title: 'Business Services',
    description: 'Professional services, drones, and business solutions',
    icon: BarChart,
    parent: { route: '/business', name: 'Business' }
  },
  'business-farming': {
    title: 'Farming',
    description: 'Agricultural business, farming techniques and equipment',
    icon: BarChart,
    parent: { route: '/business', name: 'Business' }
  },
  'business-commerce': {
    title: 'Commerce & Trade',
    description: 'Commercial business, trade practices and logistics',
    icon: ShoppingCart,
    parent: { route: '/business', name: 'Business' }
  },
  'business-internet': {
    title: 'Internet Business',
    description: 'Online platforms, coding solutions and web services',
    icon: Globe,
    parent: { route: '/business', name: 'Business' }
  },
};
