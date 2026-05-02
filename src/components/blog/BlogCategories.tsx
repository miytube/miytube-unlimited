
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { sortByName } from '@/lib/sortByName';

export const BlogCategories = () => {
  const categories = ['Growth Strategy', 'Tutorials', 'Technology', 'Equipment', 'Monetization', 'Analytics', 'Community', 'Design'];
  
  return (
    <div className="bg-card rounded-lg p-6 shadow-md mb-8">
      <h3 className="text-lg font-semibold mb-4">Categories</h3>
      <ul className="space-y-2">
        {sortByName(categories).map((category) => (
          <li key={category}>
            <a href="#" className="flex items-center justify-between py-2 hover:text-primary transition-colors">
              <span>{category}</span>
              <ChevronRight size={16} />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};
