
import React from 'react';
import GenericCategoryPage from '@/components/GenericCategoryPage';
import { House } from 'lucide-react';

const RealEstate = () => {
  return (
    <GenericCategoryPage 
      title="Real Estate" 
      description="Browse real estate, properties, homes, and real estate market trends"
      Icon={House}
    />
  );
};

export default RealEstate;
