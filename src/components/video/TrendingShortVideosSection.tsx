
import React from 'react';
import { Link } from 'react-router-dom';
import { ShortCard } from '@/components/ShortCard';
import { TrendingUp } from 'lucide-react';

// Mock data for trending shorts to display on the home page
const trendingShorts = [
  { 
    id: 'ts1', 
    title: 'Viral dance move everyone is trying', 
    views: '5.7M', 
    creator: 'DanceMaster', 
    thumbnail: 'https://images.unsplash.com/photo-1545242104-7c7bf0d92a4b?auto=format&fit=crop&w=800&q=80' 
  },
  { 
    id: 'ts2', 
    title: 'This food hack will blow your mind', 
    views: '3.2M', 
    creator: 'CookingPro', 
    thumbnail: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&w=800&q=80' 
  },
  { 
    id: 'ts3', 
    title: 'Street magic reaction compilation', 
    views: '7.1M', 
    creator: 'MagicTricks', 
    thumbnail: 'https://images.unsplash.com/photo-1524486361537-8ad15938e1a3?auto=format&fit=crop&w=800&q=80' 
  },
  { 
    id: 'ts4', 
    title: 'Unbelievable basketball skills', 
    views: '4.5M', 
    creator: 'SportsHero', 
    thumbnail: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80' 
  }
];

export const TrendingShortVideosSection: React.FC = () => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-medium">Trending Shorts</h2>
        </div>
        <Link to="/shorts" className="text-primary text-sm hover:underline">
          See more
        </Link>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {trendingShorts.map((short) => (
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
