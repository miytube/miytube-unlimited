
import React from 'react';
import GenericCategoryPage from '@/components/GenericCategoryPage';
import { Quote } from 'lucide-react';

const QuotesPoems = () => {
  return (
    <GenericCategoryPage 
      title="Quotes & Poems" 
      description="Explore inspirational quotes, poetry, and literary content"
      Icon={Quote}
    />
  );
};

export default QuotesPoems;
