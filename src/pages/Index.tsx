
import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { VideoCard } from '@/components/VideoCard';
import { Layout } from '@/components/Layout';
import { ShortVideosSection } from '@/components/video/ShortVideosSection';
import { TrendingShortVideosSection } from '@/components/video/TrendingShortVideosSection';
import { useUploadedVideos } from '@/context/UploadedVideosContext';
import { TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { uploadedVideos } = useUploadedVideos();
  const [currentPage, setCurrentPage] = useState(1);
  const prevVideoCountRef = useRef(uploadedVideos.length);

  // Reset to page 1 when new videos are added
  useEffect(() => {
    if (uploadedVideos.length > prevVideoCountRef.current) {
      setCurrentPage(1);
    }
    prevVideoCountRef.current = uploadedVideos.length;
  }, [uploadedVideos.length]);
  const videosPerPage = 20;

  // ALL uploaded videos appear on home page (newest first) - including shorts
  const allVideos = useMemo(() => {
    return [...uploadedVideos].reverse().map(video => ({
      id: video.id,
      title: video.title,
      thumbnail: video.thumbnail,
      channelName: 'Your Channel',
      views: video.views,
      timestamp: video.timestamp,
      duration: video.duration,
      description: video.description,
      category: video.category,
      subcategory: video.subcategory,
      tags: video.tags,
    }));
  }, [uploadedVideos]);

  const totalPages = Math.ceil(allVideos.length / videosPerPage);
  const startIndex = (currentPage - 1) * videosPerPage;
  const endIndex = startIndex + videosPerPage;
  const displayVideos = allVideos.slice(startIndex, endIndex);

  // Trending section - regular videos only (non-shorts), newest first
  const trendingVideos = useMemo(() => {
    return uploadedVideos
      .filter(video => video.category?.toLowerCase() !== 'shorts')
      .map(video => ({
        id: video.id,
        title: video.title,
        thumbnail: video.thumbnail,
        channelName: 'Your Channel',
        views: video.views,
        timestamp: video.timestamp,
        duration: video.duration,
        description: video.description,
        category: video.category,
        subcategory: video.subcategory,
        tags: video.tags,
      }))
      .reverse()
      .slice(0, 8);
  }, [uploadedVideos]);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  return (
    <Layout>
      <div className="py-4 w-full">
        {/* Page Header */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground mb-2">
            <span className="font-semibold text-primary">MiyTube</span> / Home
          </p>
          <h1 className="text-3xl font-bold mb-4">Home</h1>
        </div>

        {displayVideos.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-medium">Recommended</h2>
              {totalPages > 1 && (
                <span className="text-muted-foreground text-sm">
                  Page {currentPage} of {totalPages} ({allVideos.length} videos)
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {displayVideos.map((video) => (
                <VideoCard key={video.id} {...video} />
              ))}
            </div>
            
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
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
        )}

        {/* Trending Videos Section - Regular videos only */}
        {trendingVideos.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-medium">Trending Videos</h2>
              <Link to="/trending" className="ml-auto text-primary text-sm hover:underline">
                View all
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {trendingVideos.map((video) => (
                <VideoCard key={video.id} {...video} />
              ))}
            </div>
          </div>
        )}

        {/* Shorts sections positioned together */}
        <ShortVideosSection />
        <TrendingShortVideosSection />

        {allVideos.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>No videos uploaded yet. Upload videos to see them here!</p>
            <Link to="/upload" className="text-primary hover:underline mt-2 inline-block">
              Upload your first video
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Index;
