import React from 'react';
import { House } from 'lucide-react';
import { SidebarCategoryLinks } from './SidebarCategoryLinks';

const realEstateLinks = [
  { 
    id: 'real-estate',
    icon: House, 
    label: 'Real Estate', 
    path: '/real-estate',
    subItems: [
      { id: 'real-estate-residential', label: 'Residential Property', path: '/category/real-estate-residential' },
      { id: 'real-estate-commercial', label: 'Commercial Property', path: '/category/real-estate-commercial' },
      { id: 'real-estate-luxury', label: 'Luxury & Million Dollar', path: '/category/real-estate-luxury' },
    ]
  },
];

export const RealEstateLinks: React.FC = () => {
  return <SidebarCategoryLinks title="Real Estate" links={realEstateLinks} />;
};
