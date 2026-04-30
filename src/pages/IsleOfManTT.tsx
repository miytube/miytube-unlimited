
import React from 'react';
import GenericCategoryPage from '@/components/GenericCategoryPage';
import { Bike } from 'lucide-react';

const IsleOfManTT = () => {
  return (
    <GenericCategoryPage 
      title="Isle of Man TT" 
      description="Watch thrilling Isle of Man Tourist Trophy motorcycle racing — the most famous road race in the world"
      Icon={Bike}
    />
  );
};

export default IsleOfManTT;
