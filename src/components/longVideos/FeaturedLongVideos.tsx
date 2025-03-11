
import React from 'react';
import { VideoCard } from '@/components/VideoCard';

interface VideoItem {
  id: string;
  title: string;
  thumbnail: string;
  channelName: string;
  views: string;
  timestamp: string;
  duration: string;
  tags?: string[];
}

interface FeaturedLongVideosProps {
  videos: VideoItem[];
}

export const FeaturedLongVideos: React.FC<FeaturedLongVideosProps> = ({ videos }) => {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-6">Featured Long-Form Content</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {videos.map((video) => (
          <VideoCard key={video.id} {...video} />
        ))}
      </div>
    </div>
  );
};
