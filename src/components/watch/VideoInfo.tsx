
import React from 'react';
import { ThumbsUp, ThumbsDown, Share, Download, Flag } from 'lucide-react';

interface VideoInfoProps {
  title: string;
  channelName: string;
  channelAvatar: string;
  subscribers: string;
  views: string;
  timestamp: string;
  likes: string;
  tags?: string[];
}

export const VideoInfo: React.FC<VideoInfoProps> = ({
  title,
  channelName,
  channelAvatar,
  subscribers,
  views,
  timestamp,
  likes,
  tags = [],
}) => {
  return (
    <div className="mb-6 animate-fade-in">
      <h1 className="text-xl md:text-2xl font-medium mb-2">{title}</h1>
      
      <div className="flex flex-wrap justify-between items-center gap-4 py-3 border-b">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-lg font-bold overflow-hidden">
            {channelAvatar ? (
              <img src={channelAvatar} alt={channelName} className="w-full h-full object-cover" />
            ) : (
              channelName.charAt(0)
            )}
          </div>
          <div>
            <h3 className="font-medium">{channelName}</h3>
            <p className="text-sm text-muted-foreground">{subscribers} subscribers</p>
          </div>
          <button className="ml-4 px-4 py-1.5 bg-primary text-white rounded-full text-sm font-medium hover:bg-primary/90 transition-colors">
            Subscribe
          </button>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex rounded-full overflow-hidden bg-secondary">
            <button className="flex items-center gap-1 px-4 py-1.5 hover:bg-secondary/80 transition-colors">
              <ThumbsUp size={18} />
              <span className="text-sm font-medium">{likes}</span>
            </button>
            <div className="w-px bg-border h-full"></div>
            <button className="flex items-center gap-1 px-4 py-1.5 hover:bg-secondary/80 transition-colors">
              <ThumbsDown size={18} />
            </button>
          </div>
          
          <button className="flex items-center gap-1 px-4 py-1.5 bg-secondary rounded-full hover:bg-secondary/80 transition-colors">
            <Share size={18} />
            <span className="text-sm font-medium">Share</span>
          </button>
          
          <button className="flex items-center gap-1 px-4 py-1.5 bg-secondary rounded-full hover:bg-secondary/80 transition-colors">
            <Download size={18} />
            <span className="text-sm font-medium">Download</span>
          </button>
          
          <button className="p-2 rounded-full hover:bg-secondary transition-colors">
            <Flag size={18} />
          </button>
        </div>
      </div>
      
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3 mb-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-secondary px-1.5 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      
      <div className="mt-4 p-4 bg-secondary/50 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-medium">{views}</span>
          <span className="text-xs">•</span>
          <span>{timestamp}</span>
        </div>
      </div>
    </div>
  );
};
