
import React from 'react';
import { Link } from 'react-router-dom';
import { ShortCard } from '@/components/ShortCard';
import { TrendingUp } from 'lucide-react';
import { useUploadedVideos } from '@/context/UploadedVideosContext';

export const TrendingShortVideosSection: React.FC = () => {
  const { getVideosByCategory } = useUploadedVideos();
  
  // Get uploaded shorts only
  const uploadedShorts = getVideosByCategory('shorts');
  
  // Format for ShortCard and limit to 4
  const shortsToDisplay = uploadedShorts.slice(0, 4).map(video => ({
    id: video.id,
    title: video.title,
    thumbnail: video.thumbnail,
    creator: 'Your Channel',
    views: video.views,
    description: video.description,
    category: video.category,
    subcategory: video.subcategory,
    tags: video.tags,
  }));

  // Don't render section if no shorts uploaded
  if (shortsToDisplay.length === 0) {
    return null;
  }

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
        {shortsToDisplay.map((short) => (
          <ShortCard
            key={short.id}
            id={short.id}
            title={short.title}
            thumbnail={short.thumbnail}
            creator={short.creator}
            views={short.views}
            description={short.description}
            category={short.category}
            subcategory={short.subcategory}
            tags={short.tags}
          />
        ))}
      </div>
    </div>
  );
};
