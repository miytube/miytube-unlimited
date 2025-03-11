
import React from 'react';
import { Link } from 'react-router-dom';
import { useUploadedVideos } from '@/context/UploadedVideosContext';
import { VideoCard } from '@/components/VideoCard';

export const UploadedVideosSection: React.FC = () => {
  const { uploadedVideos } = useUploadedVideos();
  
  if (uploadedVideos.length === 0) {
    return null;
  }
  
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-medium">Your Uploads</h2>
        <Link to="/upload/video" className="text-primary text-sm">View all</Link>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {uploadedVideos.map((video) => (
          <VideoCard
            key={video.id}
            id={video.id}
            title={video.title}
            thumbnail={video.thumbnail}
            channelName="Your Channel"
            views={video.views}
            timestamp={video.timestamp}
            duration={video.duration}
          />
        ))}
      </div>
    </div>
  );
};
