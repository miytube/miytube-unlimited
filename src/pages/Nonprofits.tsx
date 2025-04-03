
import React from 'react';
import GenericCategoryPage from '@/components/GenericCategoryPage';
import { HeartHandshake } from 'lucide-react';

const Nonprofits = () => {
  return (
    <GenericCategoryPage 
      title="Nonprofits" 
      description="Discover content about nonprofit organizations, charities, and humanitarian efforts"
      Icon={HeartHandshake}
    />
  );
};

export default Nonprofits;
