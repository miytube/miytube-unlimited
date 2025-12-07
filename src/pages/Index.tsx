
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { VideoCard } from '@/components/VideoCard';
import { Layout } from '@/components/Layout';
import { ShortVideosSection } from '@/components/video/ShortVideosSection';
import { TrendingShortVideosSection } from '@/components/video/TrendingShortVideosSection';
import { useUploadedVideos } from '@/context/UploadedVideosContext';

const Index = () => {
  const { uploadedVideos } = useUploadedVideos();

  // ALL uploaded videos appear on home page (newest first), shorts included in shorts section
  const allVideos = useMemo(() => {
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
      }));
  }, [uploadedVideos]);

  // All uploaded videos appear first on home page (newest first) - 20 per page
  const recommendedVideos = useMemo(() => {
    return [...allVideos].reverse().slice(0, 20);
  }, [allVideos]);

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

        {recommendedVideos.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-medium mb-4">Recommended</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {recommendedVideos.map((video) => (
                <VideoCard key={video.id} {...video} />
              ))}
            </div>
          </div>
        )}

        {/* Shorts sections positioned together */}
        <ShortVideosSection />
        <TrendingShortVideosSection />

        {recommendedVideos.length === 0 && (
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
