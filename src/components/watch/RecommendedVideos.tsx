
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
  description: string;
  tags?: string[];
}

interface RecommendedVideosProps {
  videos: VideoItem[];
}

export const RecommendedVideos: React.FC<RecommendedVideosProps> = ({ videos }) => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Recommended</h3>
      <div className="space-y-3 animate-fade-in">
        {videos.map((video) => (
          <VideoCard key={video.id} {...video} />
        ))}
      </div>
    </div>
  );
};
