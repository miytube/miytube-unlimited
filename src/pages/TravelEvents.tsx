
import React from 'react';
import GenericCategoryPage from '@/components/GenericCategoryPage';
import { Plane } from 'lucide-react';

const TravelEvents = () => {
  return (
    <GenericCategoryPage 
      title="Travel & Events" 
      description="Discover travel destinations, events, and experiences around the world"
      Icon={Plane}
    />
  );
};

export default TravelEvents;
