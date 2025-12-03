
import React from 'react';
import GenericCategoryPage from '@/components/GenericCategoryPage';
import { Volume2 } from 'lucide-react';

const SoundEffects = () => {
  return (
    <GenericCategoryPage 
      title="Sound Effects" 
      description="Browse and discover sound effects for your projects"
      Icon={Volume2}
    />
  );
};

export default SoundEffects;
