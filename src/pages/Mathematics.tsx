import React from 'react';
import { Calculator } from 'lucide-react';
import GenericCategoryPage from '@/components/GenericCategoryPage';
import { usePageSEO } from '@/hooks/usePageSEO';

const Mathematics = () => {
  usePageSEO({
    title: 'Mathematics Videos on MiyTube',
    description: 'Watch mathematics videos covering numbers, calculations, formulas, and mathematical concepts on MiyTube.',
    path: '/mathematics',
  });

  return (
    <GenericCategoryPage
      title="Mathematics"
      description="Explore mathematics videos, lessons, calculations, formulas, and numerical concepts"
      Icon={Calculator}
      filterCategory="education"
      filterSubcategory="math"
    />
  );
};

export default Mathematics;