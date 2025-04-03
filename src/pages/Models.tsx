
import React from 'react';
import GenericCategoryPage from '@/components/GenericCategoryPage';
import { Star } from 'lucide-react';

const Models = () => {
  return (
    <GenericCategoryPage 
      title="Models" 
      description="Discover content about professional models and the modeling industry"
      Icon={Star}
    />
  );
};

export default Models;
