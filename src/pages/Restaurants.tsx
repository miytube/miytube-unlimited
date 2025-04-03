
import React from 'react';
import GenericCategoryPage from '@/components/GenericCategoryPage';
import { Utensils } from 'lucide-react';

const Restaurants = () => {
  return (
    <GenericCategoryPage 
      title="Restaurants" 
      description="Discover and explore restaurants, dining experiences, and culinary venues"
      Icon={Utensils}
    />
  );
};

export default Restaurants;
