
import React from 'react';
import GenericCategoryPage from '@/components/GenericCategoryPage';
import { Headphones } from 'lucide-react';

const ASMR = () => {
  return (
    <GenericCategoryPage 
      title="ASMR" 
      description="Relaxing ASMR content for sleep and relaxation"
      Icon={Headphones}
    />
  );
};

export default ASMR;
