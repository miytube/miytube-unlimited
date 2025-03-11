
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface ShortCardProps {
  id: string;
  title: string;
  thumbnail: string;
  creator: string;
  views: string;
}

export const ShortCard: React.FC<ShortCardProps> = ({
  id,
  title,
  thumbnail,
  creator,
  views,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Link 
      to={`/shorts/${id}`} 
      className="group flex flex-col rounded-lg overflow-hidden hover:shadow-md transition-all bg-card"
    >
      {/* Fixed aspect ratio container */}
      <div className="relative aspect-[9/16] bg-muted overflow-hidden">
        <div className={`w-full h-full ${!imageLoaded ? 'lazy-image-loading' : ''}`}>
          <img 
            src={thumbnail} 
            alt={title} 
            className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
            loading="lazy"
          />
        </div>
        {/* Duration badge */}
        <div className="absolute bottom-2 right-2 px-1 py-0.5 text-xs bg-black/70 text-white rounded">
          Short
        </div>
      </div>
      {/* Content area */}
      <div className="p-3 flex-1 flex flex-col">
        <h3 className="font-medium text-sm line-clamp-2 leading-tight mb-1">
          {title}
        </h3>
        <div className="mt-auto text-xs text-muted-foreground">
          <div className="flex items-center justify-between">
            <span>{creator}</span>
            <span>{views} views</span>
          </div>
        </div>
      </div>
    </Link>
  );
};
