
import React from 'react';
import GenericCategoryPage from '@/components/GenericCategoryPage';
import { Plane } from 'lucide-react';

const Airports = () => {
  return (
    <GenericCategoryPage 
      title="Airports" 
      description="Explore content about airports, air travel, and aviation facilities"
      Icon={Plane}
    />
  );
};

export default Airports;
