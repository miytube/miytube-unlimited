
import React from 'react';
import { Link } from 'react-router-dom';
import { VideoCard } from '@/components/VideoCard';
import { Layout } from '@/components/Layout';
import { UploadedVideosSection } from '@/components/video/UploadedVideosSection';
import { ShortVideosSection } from '@/components/video/ShortVideosSection';
import { TrendingShortVideosSection } from '@/components/video/TrendingShortVideosSection';
import { mockVideos } from '@/data/mockVideos';

const Index = () => {
  return (
    <Layout>
      <div className="py-4 w-full">
        <UploadedVideosSection />
        
        <div className="mb-6">
          <h1 className="text-xl font-medium mb-4">Recommended</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {mockVideos.map((video) => (
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
            {mockVideos.slice(4, 8).concat(mockVideos.slice(0, 4)).map((video) => (
              <VideoCard key={`trending-${video.id}`} {...video} />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
