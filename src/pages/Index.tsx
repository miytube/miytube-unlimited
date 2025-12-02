
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { VideoCard } from '@/components/VideoCard';
import { Layout } from '@/components/Layout';
import { ShortVideosSection } from '@/components/video/ShortVideosSection';
import { TrendingShortVideosSection } from '@/components/video/TrendingShortVideosSection';
import { mockVideos } from '@/data/mockVideos';
import { useUploadedVideos } from '@/context/UploadedVideosContext';

const Index = () => {
  const { uploadedVideos } = useUploadedVideos();

  // Convert uploaded videos to VideoCard format
  const formattedUploadedVideos = useMemo(() => {
    return uploadedVideos.map(video => ({
      id: video.id,
      title: video.title,
      thumbnail: video.thumbnail,
      channelName: 'Your Channel',
      views: video.views,
      timestamp: video.timestamp,
      duration: video.duration,
      description: video.description,
    }));
  }, [uploadedVideos]);

  // Combine uploaded videos with mock videos for Recommended (uploaded first)
  const recommendedVideos = useMemo(() => {
    const combined = [...formattedUploadedVideos, ...mockVideos];
    return combined.slice(0, 20); // Show max 20 videos (4x5 grid)
  }, [formattedUploadedVideos]);

  // Combine uploaded videos with mock videos for Trending (uploaded first)
  const trendingVideos = useMemo(() => {
    const shuffledMock = [...mockVideos.slice(4, 8), ...mockVideos.slice(0, 4)];
    const combined = [...formattedUploadedVideos, ...shuffledMock];
    return combined.slice(0, 20); // Show max 20 videos (4x5 grid)
  }, [formattedUploadedVideos]);

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

        <div className="mb-6">
          <h2 className="text-xl font-medium mb-4">Recommended</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {recommendedVideos.map((video) => (
              <VideoCard key={video.id} {...video} />
            ))}
          </div>
        </div>

        {/* Shorts sections positioned together */}
        <ShortVideosSection />
        <TrendingShortVideosSection />

        <div className="mb-8">
          <h2 className="text-xl font-medium mb-4">Trending</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {trendingVideos.map((video, index) => (
              <VideoCard key={`trending-${video.id}-${index}`} {...video} />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
