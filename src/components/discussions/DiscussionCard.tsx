
import React from 'react';
import { MessageCircle, ThumbsUp } from 'lucide-react';

export interface Discussion {
  id: number;
  category: string;
  title: string;
  author: string;
  content: string;
  replies: number;
  likes: number;
  timestamp: string;
}

interface DiscussionCardProps {
  discussion: Discussion;
}

export const DiscussionCard: React.FC<DiscussionCardProps> = ({ discussion }) => {
  return (
    <div className="bg-card p-6 rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs px-2 py-1 bg-secondary rounded-full">{discussion.category}</span>
        <span className="text-xs text-muted-foreground">{discussion.timestamp}</span>
      </div>
      <h3 className="text-lg font-medium mb-2">{discussion.title}</h3>
      <p className="text-muted-foreground mb-4">{discussion.content}</p>
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Shared by <span className="font-medium">{discussion.author}</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-sm">
            <MessageCircle size={16} />
            <span>{discussion.replies} replies</span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <ThumbsUp size={16} />
            <span>{discussion.likes} likes</span>
          </div>
        </div>
      </div>
    </div>
  );
};
