
import React from 'react';
import GenericCategoryPage from '@/components/GenericCategoryPage';
import { Ship } from 'lucide-react';

const Boats = () => {
  return (
    <GenericCategoryPage 
      title="Boats" 
      description="Explore content about boats, sailing, and marine vessels"
      Icon={Ship}
      filterCategory="boats"
      legacyFilterSubcategories={['boats-all', 'all', 'all-boats', 'boats-and-ships', 'all-boats-and-ships', 'shorts']}
    />
  );
};

export default Boats;
