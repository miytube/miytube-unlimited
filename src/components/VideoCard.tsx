
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface VideoCardProps {
  id: string;
  title: string;
  thumbnail: string;
  channelName: string;
  views: string;
  timestamp: string;
  duration: string;
}

export const VideoCard: React.FC<VideoCardProps> = ({
  id,
  title,
  thumbnail,
  channelName,
  views,
  timestamp,
  duration,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <article className="video-card animate-scale-in w-full">
      <Link to={`/watch?v=${id}`} className="block">
        <div className="video-thumbnail w-full">
          <div className={`w-full h-full ${!imageLoaded ? 'lazy-image-loading' : ''}`}>
            <img
              src={thumbnail}
              alt={title}
              className={`w-full h-full object-cover rounded-md transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImageLoaded(true)}
              loading="lazy"
            />
          </div>
          <span className="video-duration">{duration}</span>
        </div>
        <div className="video-info">
          <h3 className="video-title">{title}</h3>
          <div className="video-meta">
            <span className="video-channel">{channelName}</span>
            <span className="flex items-center gap-1">
              <span>{views} views</span>
              <span className="text-xs">•</span>
              <span>{timestamp}</span>
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
};
