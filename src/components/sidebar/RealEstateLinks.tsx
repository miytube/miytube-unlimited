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
      { id: 'real-estate-residential', label: 'Residential Property', path: '/real-estate/residential' },
      { id: 'real-estate-commercial', label: 'Commercial Property', path: '/real-estate/commercial' },
      { id: 'real-estate-luxury', label: 'Luxury & Million Dollar', path: '/real-estate/luxury' },
    ]
  },
];

export const RealEstateLinks: React.FC = () => {
  return <SidebarCategoryLinks title="Real Estate" links={realEstateLinks} />;
};
