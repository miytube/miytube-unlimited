
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShortCard } from '@/components/ShortCard';
import { TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { useUploadedVideos } from '@/context/UploadedVideosContext';
import { Button } from '@/components/ui/button';

export const TrendingShortVideosSection: React.FC = () => {
  const { getVideosByCategory } = useUploadedVideos();
  const [currentPage, setCurrentPage] = useState(1);
  const shortsPerPage = 20;
  
  // Get uploaded shorts only
  const uploadedShorts = getVideosByCategory('shorts');
  
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

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          variant={currentPage === i ? "default" : "outline"}
          size="sm"
          onClick={() => goToPage(i)}
          className="min-w-[40px]"
        >
          {i}
        </Button>
      );
    }
    
    return pages;
  };

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
          {totalPages > 1 && (
            <span className="text-muted-foreground text-sm">
              Page {currentPage} of {totalPages} ({allShorts.length} shorts)
            </span>
          )}
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

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          
          {renderPageNumbers()}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
