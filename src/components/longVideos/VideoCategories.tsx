
import React from 'react';
import { sortByName } from '@/lib/sortByName';

interface Category {
  name: string;
  icon: string;
}

interface VideoCategoriesProps {
  categories: Category[];
}

export const VideoCategories: React.FC<VideoCategoriesProps> = ({ categories }) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Categories</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {sortByName(categories).map((category) => (
          <div key={category.name} className="bg-card p-4 rounded-lg shadow-sm flex items-center gap-3">
            <span className="text-2xl">{category.icon}</span>
            <span className="font-medium">{category.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
