
import React from 'react';
import GenericCategoryPage from '@/components/GenericCategoryPage';
import { Scissors } from 'lucide-react';

const HowToStyle = () => {
  return (
    <GenericCategoryPage 
      title="How-to & Style" 
      description="Learn how to do things and discover the latest style trends"
      Icon={Scissors}
    />
  );
};

export default HowToStyle;
