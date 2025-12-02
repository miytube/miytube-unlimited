
import React from 'react';
import { VideoCard } from '@/components/VideoCard';
import { MockVideo } from '@/data/mockVideos';

interface VideoContentProps {
  title: string;
  videos: MockVideo[];
}

const VideoContent: React.FC<VideoContentProps> = ({ title, videos }) => {
  // Limit to 20 videos (4x5 grid)
  const displayVideos = videos.slice(0, 20);
  
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-6">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {displayVideos.map((video) => (
          <VideoCard key={video.id} {...video} />
        ))}
      </div>
    </div>
  );
};

export default VideoContent;
