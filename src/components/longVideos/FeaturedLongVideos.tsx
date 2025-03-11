
import React from 'react';

interface VideoItem {
  id: string;
  title: string;
  thumbnail: string;
  channelName: string;
  views: string;
  timestamp: string;
  duration: string;
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
          <div key={video.id} className="video-card">
            <a href={`/watch?v=${video.id}`} className="block">
              <div className="video-thumbnail">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                <span className="video-duration">{video.duration}</span>
              </div>
              <div className="video-info">
                <h3 className="video-title">{video.title}</h3>
                <div className="video-meta">
                  <span className="video-channel">{video.channelName}</span>
                  <span className="flex items-center gap-1">
                    <span>{video.views} views</span>
                    <span className="text-xs">•</span>
                    <span>{video.timestamp}</span>
                  </span>
                </div>
              </div>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};
