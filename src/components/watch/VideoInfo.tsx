
import React from 'react';
import { ThumbsUp, ThumbsDown, Share, Download, Flag, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VideoInfoProps {
  title: string;
  channelName: string;
  channelAvatar: string;
  subscribers: string;
  views: string;
  timestamp: string;
  likes: string;
  tags?: string[];
  isUploadedVideo?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
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
  isUploadedVideo = false,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="mb-6 animate-fade-in">
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-xl md:text-2xl font-medium mb-2 flex-1">{title}</h1>
        
        {isUploadedVideo && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
              className="flex items-center gap-1"
            >
              <Pencil size={16} />
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={onDelete}
              className="flex items-center gap-1"
            >
              <Trash2 size={16} />
              Delete
            </Button>
          </div>
        )}
      </div>
      
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
          <button className="ml-4 px-4 py-1.5 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary/90 transition-colors">
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
