
import React from 'react';
import GenericCategoryPage from '@/components/GenericCategoryPage';
import { Dog } from 'lucide-react';

const PetsAnimals = () => {
  return (
    <GenericCategoryPage 
      title="Pets & Animals" 
      description="Explore content about pets, animals, wildlife, and more"
      Icon={Dog}
    />
  );
};

export default PetsAnimals;
