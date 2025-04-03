
import React from 'react';
import GenericCategoryPage from '@/components/GenericCategoryPage';
import { Truck } from 'lucide-react';

const Shipping = () => {
  return (
    <GenericCategoryPage 
      title="Shipping" 
      description="Explore content about shipping, logistics, and transportation"
      Icon={Truck}
    />
  );
};

export default Shipping;
