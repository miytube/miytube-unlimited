
import React from 'react';
import GenericCategoryPage from '@/components/GenericCategoryPage';
import { Ship } from 'lucide-react';

const Boats = () => {
  return (
    <GenericCategoryPage 
      title="Boats" 
      description="Explore content about boats, sailing, and marine vessels"
      Icon={Ship}
    />
  );
};

export default Boats;
