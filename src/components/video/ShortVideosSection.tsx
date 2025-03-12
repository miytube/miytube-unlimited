
import React from 'react';
import { Link } from 'react-router-dom';
import { ShortCard } from '@/components/ShortCard';
import { Film } from 'lucide-react';

// Mock data for shorts to display on the home page
const homePageShorts = [
  { 
    id: 's1', 
    title: 'Amazing sunset views', 
    views: '1.2M', 
    creator: 'NatureLover', 
    thumbnail: 'https://images.unsplash.com/photo-1532767153582-b1a0e5145009?auto=format&fit=crop&w=800&q=80' 
  },
  { 
    id: 's2', 
    title: 'Quick cooking hack', 
    views: '4.5M', 
    creator: 'ChefMaster', 
    thumbnail: 'https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?auto=format&fit=crop&w=800&q=80' 
  },
  { 
    id: 's3', 
    title: 'Dance challenge', 
    views: '2.8M', 
    creator: 'DanceKing', 
    thumbnail: 'https://images.unsplash.com/photo-1535525153412-5a42439a210d?auto=format&fit=crop&w=800&q=80' 
  },
  { 
    id: 's4', 
    title: 'DIY home decor', 
    views: '985K', 
    creator: 'CraftyCreator', 
    thumbnail: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80' 
  }
];

export const ShortVideosSection: React.FC = () => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Film className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-medium">Shorts</h2>
        </div>
        <Link to="/shorts" className="text-primary text-sm hover:underline">
          View all
        </Link>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {homePageShorts.map((short) => (
          <ShortCard
            key={short.id}
            id={short.id}
            title={short.title}
            thumbnail={short.thumbnail}
            creator={short.creator}
            views={short.views}
          />
        ))}
      </div>
    </div>
  );
};
