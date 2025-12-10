import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { VideoCard } from '@/components/VideoCard';
import { Layout } from '@/components/Layout';
import { ShortVideosSection } from '@/components/video/ShortVideosSection';
import { TrendingShortVideosSection } from '@/components/video/TrendingShortVideosSection';
import { useUploadedVideos } from '@/context/UploadedVideosContext';
import { TrendingUp } from 'lucide-react';
import { Pagination, PageInfo } from '@/components/Pagination';

const Index = () => {
  const { uploadedVideos } = useUploadedVideos();
  const [currentPage, setCurrentPage] = useState(1);
  const prevVideoCountRef = useRef(uploadedVideos.length);
  const videosPerPage = 20;

  // Reset to page 1 when new videos are added
  useEffect(() => {
    if (uploadedVideos.length > prevVideoCountRef.current) {
      setCurrentPage(1);
    }
    prevVideoCountRef.current = uploadedVideos.length;
  }, [uploadedVideos.length]);

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
              <PageInfo 
                currentPage={currentPage} 
                totalPages={totalPages} 
                totalItems={allVideos.length} 
                itemLabel="videos" 
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {displayVideos.map((video) => (
                <VideoCard key={video.id} {...video} />
              ))}
            </div>
            
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
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
