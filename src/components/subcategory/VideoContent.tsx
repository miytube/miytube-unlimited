
import React from 'react';
import { VideoCard } from '@/components/VideoCard';
import { MockVideo } from '@/data/mockVideos';

interface VideoContentProps {
  title: string;
  videos: MockVideo[];
}

const VideoContent: React.FC<VideoContentProps> = ({ title, videos }) => {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-6">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {videos.map((video) => (
          <VideoCard key={video.id} {...video} />
        ))}
      </div>
    </div>
  );
};

export default VideoContent;
