
import React from 'react';
import { Music as MusicIcon } from 'lucide-react';

interface MusicCategoriesProps {
  categories: string[];
}

export const MusicCategories: React.FC<MusicCategoriesProps> = ({ categories }) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Popular Categories</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {categories.map((category) => (
          <div key={category} className="aspect-square rounded-lg overflow-hidden relative group bg-card flex items-center justify-center">
            <div className="text-center">
              <MusicIcon size={32} className="mx-auto mb-2 text-primary" />
              <div className="font-medium">{category}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
