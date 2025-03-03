
import React from 'react';
import { MessageCircle, ChevronDown } from 'lucide-react';

interface DiscussionControlsProps {
  categories: string[];
  category: string;
  newPostVisible: boolean;
  onCategoryChange: (category: string) => void;
  onNewPostToggle: () => void;
}

export const DiscussionControls: React.FC<DiscussionControlsProps> = ({
  categories,
  category,
  newPostVisible,
  onCategoryChange,
  onNewPostToggle,
}) => {
  return (
    <div className="mb-8 flex flex-wrap justify-between items-center gap-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center border rounded-lg overflow-hidden">
          <button 
            className={`px-4 py-2 flex items-center gap-2 ${newPostVisible ? 'bg-primary text-white' : 'hover:bg-secondary'}`}
            onClick={onNewPostToggle}
          >
            <MessageCircle size={18} />
            <span>Share Your Experience</span>
          </button>
        </div>
        
        <div className="border rounded-lg flex items-center">
          <div className="relative">
            <select 
              className="appearance-none bg-transparent px-4 py-2 pr-8 rounded-lg cursor-pointer"
              value={category}
              onChange={(e) => onCategoryChange(e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Sort by:</span>
        <select className="border rounded-lg p-2 text-sm">
          <option>Most Recent</option>
          <option>Most Popular</option>
          <option>Most Replies</option>
        </select>
      </div>
    </div>
  );
};
