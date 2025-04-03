
import React from 'react';
import GenericCategoryPage from '@/components/GenericCategoryPage';
import { UserRound } from 'lucide-react';

const Relationships = () => {
  return (
    <GenericCategoryPage 
      title="Relationships" 
      description="Explore content about relationships, dating, and interpersonal connections"
      Icon={UserRound}
    />
  );
};

export default Relationships;
