
import React from 'react';
import GenericCategoryPage from '@/components/GenericCategoryPage';
import { Car } from 'lucide-react';

const AutosVehicles = () => {
  return (
    <GenericCategoryPage 
      title="Autos & Vehicles" 
      description="Discover content about automobiles, vehicles, and transportation"
      Icon={Car}
    />
  );
};

export default AutosVehicles;
