import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ShortCard } from '@/components/ShortCard';
import { TrendingUp } from 'lucide-react';
import { useUploadedVideos } from '@/context/UploadedVideosContext';
import { Pagination, PageInfo } from '@/components/Pagination';

export const TrendingShortVideosSection: React.FC = () => {
  const { getVideosByCategory } = useUploadedVideos();
  const [currentPage, setCurrentPage] = useState(1);
  const shortsPerPage = 20;
  
  // Get uploaded shorts only
  const uploadedShorts = getVideosByCategory('shorts');
  const prevShortsCount = useRef(uploadedShorts.length);

  // Reset to page 1 when new shorts are added
  useEffect(() => {
    if (uploadedShorts.length > prevShortsCount.current) {
      setCurrentPage(1);
    }
    prevShortsCount.current = uploadedShorts.length;
  }, [uploadedShorts.length]);
  
  // Format for ShortCard
  const allShorts = uploadedShorts.map(video => ({
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

  const totalPages = Math.ceil(allShorts.length / shortsPerPage);
  const startIndex = (currentPage - 1) * shortsPerPage;
  const shortsToDisplay = allShorts.slice(startIndex, startIndex + shortsPerPage);

  // Don't render section if no shorts uploaded
  if (allShorts.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-medium">Trending Shorts</h2>
        </div>
        <div className="flex items-center gap-4">
          <PageInfo 
            currentPage={currentPage} 
            totalPages={totalPages} 
            totalItems={allShorts.length} 
            itemLabel="shorts" 
          />
          <Link to="/shorts" className="text-primary text-sm hover:underline">
            See more
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        scrollToTop={false}
      />
    </div>
  );
};
