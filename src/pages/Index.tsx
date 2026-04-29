import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { useUploadedVideos } from '@/context/UploadedVideosContext';
import { TrendingUp, RefreshCw } from 'lucide-react';
import { Pagination, PageInfo } from '@/components/Pagination';
import { VideoGridSkeleton } from '@/components/skeletons';
import { Button } from '@/components/ui/button';
import { ShortVideosSection } from '@/components/video/ShortVideosSection';
import { AdSlot } from '@/components/ads/AdSlot';

const SimpleVideoCard = ({ id, title, thumbnail, channelName, views, timestamp, duration, category }: {
  id: string;
  title: string;
  thumbnail: string;
  channelName: string;
  views: string;
  timestamp: string;
  duration: string;
  category?: string;
}) => (
  <article className="w-full">
    <Link to={category?.toLowerCase() === 'shorts' ? `/shorts/${id}` : `/watch?v=${id}`} className="block group">
      <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
        <img src={thumbnail} alt={title} className="h-full w-full object-cover transition-transform group-hover:scale-105" loading="lazy" />
        <span className="absolute bottom-2 right-2 rounded bg-foreground/80 px-1.5 py-0.5 text-xs text-background">{duration}</span>
      </div>
      <h3 className="mt-2 line-clamp-2 text-sm font-medium">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{channelName}</p>
      <p className="text-xs text-muted-foreground">{views} views • {timestamp}</p>
    </Link>
  </article>
);

const Index = () => {
  const { uploadedVideos, isLoading, refreshVideos } = useUploadedVideos();
  const [currentPage, setCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const prevVideoCountRef = useRef(uploadedVideos.length);
  const videosPerPage = 20;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshVideos();
    setCurrentPage(1);
    setIsRefreshing(false);
  };

  // Reset to page 1 when new videos are added
  useEffect(() => {
    if (uploadedVideos.length > prevVideoCountRef.current) {
      setCurrentPage(1);
    }
    prevVideoCountRef.current = uploadedVideos.length;
  }, [uploadedVideos.length]);

  // ALL uploaded videos appear on home page (newest first) - including shorts
  // Videos are already sorted newest-first in context, no need to reverse
  const allVideos = useMemo(() => {
    return uploadedVideos.map(video => ({
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
  // Videos are already sorted newest-first in context, no need to reverse
  const trendingVideos = useMemo(() => {
    return uploadedVideos
      .filter(video => video.category?.toLowerCase() !== 'shorts')
      .slice(0, 8)
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
      }));
  }, [uploadedVideos]);

  return (
    <Layout>
      <div className="py-4 w-full">
        {/* Page Header */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground mb-2">
            <span className="font-semibold text-primary">MiyTube</span> / Home
          </p>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Home</h1>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              disabled={isRefreshing || isLoading}
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-medium">Recommended</h2>
            </div>
            <VideoGridSkeleton count={8} />
          </div>
        )}

        {!isLoading && displayVideos.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-medium">Recommended</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {displayVideos.map((video) => (
                <SimpleVideoCard key={video.id} {...video} />
              ))}
            </div>
          </div>
        )}

        {/* Ad slot — between Recommended and Trending */}
        {!isLoading && displayVideos.length > 0 && (
          <AdSlot label="Home recommended ad" className="mb-6" />
        )}

        {/* Trending Videos Section - Regular videos only */}
        {!isLoading && trendingVideos.length > 0 && (
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
                <SimpleVideoCard key={video.id} {...video} />
              ))}
            </div>
          </div>
        )}

        {/* Shorts Section - below Trending */}
        {!isLoading && <ShortVideosSection />}

        {/* Ad slot — below Shorts, above pagination */}
        {!isLoading && allVideos.length > 0 && (
          <AdSlot label="Home below-shorts ad" className="mb-6" />
        )}

        {/* Page counter below trending section */}
        {!isLoading && displayVideos.length > 0 && (
          <div className="flex items-center justify-between mb-6">
            <PageInfo 
              currentPage={currentPage} 
              totalPages={totalPages} 
              totalItems={allVideos.length} 
              itemLabel="videos" 
            />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}

        {!isLoading && allVideos.length === 0 && (
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
