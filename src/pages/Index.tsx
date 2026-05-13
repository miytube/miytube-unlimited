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
import { OrganizationStructuredData } from '@/components/seo/OrganizationStructuredData';
import { usePageSEO } from '@/hooks/usePageSEO';

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

  usePageSEO({
    title: 'MiyTube — Watch and share trending videos',
    description: 'Watch trending videos, shorts, music, sports, news, and more on MiyTube. Free video platform for creators and viewers.',
    path: '/',
  });

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

  // Stable order — newest first, no shuffling on refresh
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

  // Trending section - first 8 videos, stable order
  const trendingVideos = useMemo(() => {
    return uploadedVideos
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
      <OrganizationStructuredData />
      <div className="py-4 w-full">
        {/* Page Header */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground mb-2">
            <span className="font-semibold text-primary">MiyTube</span> / Home
          </p>
          <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">MiyTube — Watch and share trending videos</h1>
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
              {displayVideos.slice(0, 8).map((video) => (
                <SimpleVideoCard key={video.id} {...video} />
              ))}
            </div>
            {/* In-grid ad — after row 2 (highest earning placement) */}
            {displayVideos.length > 8 && (
              <AdSlot slot="1227265451" label="Home in-grid ad" className="my-6" format="horizontal" />
            )}
            {displayVideos.length > 8 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {displayVideos.slice(8).map((video) => (
                  <SimpleVideoCard key={video.id} {...video} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Ad slot — between Recommended and Trending */}
        {!isLoading && displayVideos.length > 0 && (
          <AdSlot slot="7284874516" label="Home recommended ad (multiplex)" className="mb-6" format="horizontal" />
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
          <AdSlot slot="2804597664" label="Home below-shorts ad (miytube-grid-3)" className="mb-6" format="horizontal" />
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
