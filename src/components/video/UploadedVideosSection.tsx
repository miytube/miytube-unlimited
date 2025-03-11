
import React from 'react';
import { Link } from 'react-router-dom';
import { useUploadedVideos } from '@/context/UploadedVideosContext';
import { VideoPlayer } from './VideoPlayer';

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
          <div key={video.id} className="space-y-2">
            <div className="relative aspect-video rounded-lg overflow-hidden">
              <VideoPlayer 
                title={video.title} 
                videoFile={video.file} 
              />
            </div>
            <div>
              <h3 className="font-medium text-sm line-clamp-2">{video.title}</h3>
              <div className="mt-1 text-sm text-muted-foreground">
                <p>Your Channel</p>
                <div className="flex items-center gap-1 text-xs">
                  <span>{video.views} views</span>
                  <span>•</span>
                  <span>{video.timestamp}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
