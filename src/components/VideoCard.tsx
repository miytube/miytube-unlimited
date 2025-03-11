
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
    <article className="video-card">
      <Link to={`/watch?v=${id}`} className="block">
        <div className="relative aspect-video rounded-lg overflow-hidden">
          <div className={`absolute inset-0 ${!imageLoaded ? 'lazy-image-loading' : ''}`}>
            <img
              src={thumbnail}
              alt={title}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              loading="lazy"
            />
          </div>
          <span className="absolute bottom-2 right-2 px-1 py-0.5 text-xs bg-black/70 text-white rounded">
            {duration}
          </span>
        </div>
        <div className="mt-2">
          <h3 className="font-medium text-sm line-clamp-2">{title}</h3>
          <div className="mt-1 text-sm text-muted-foreground">
            <p>{channelName}</p>
            <div className="flex items-center gap-1 text-xs">
              <span>{views} views</span>
              <span>•</span>
              <span>{timestamp}</span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
};
