
import React, { useState } from 'react';
import { MessageSquare, ThumbsUp, ThumbsDown } from 'lucide-react';

interface VideoCommentsProps {
  videoId: string;
}

export const VideoComments: React.FC<VideoCommentsProps> = ({ videoId }) => {
  const [comment, setComment] = useState('');
  
  // Mock comments data
  const comments = [
    {
      id: '1',
      userName: 'Jane Doe',
      avatarUrl: '',
      timestamp: '2 days ago',
      content: 'This is an amazing video! I learned so much from this content, thank you for sharing your knowledge.',
      likes: 128
    },
    {
      id: '2',
      userName: 'John Smith',
      avatarUrl: '',
      timestamp: '1 week ago',
      content: 'Great explanation! Could you make a follow-up video on this topic?',
      likes: 57
    },
    {
      id: '3',
      userName: 'Alex Johnson',
      avatarUrl: '',
      timestamp: '3 days ago',
      content: 'I\'ve been looking for content like this for a long time. Thanks for making this!',
      likes: 84
    }
  ];
  
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we would submit the comment to an API
    setComment('');
  };
  
  return (
    <div className="mt-6 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare size={20} />
        <h3 className="font-medium">Comments</h3>
        <span className="text-sm text-muted-foreground">({comments.length})</span>
      </div>
      
      <form onSubmit={handleCommentSubmit} className="flex gap-3 mb-6">
        <div className="w-8 h-8 rounded-full bg-secondary flex-shrink-0 flex items-center justify-center text-sm">
          Y
        </div>
        <div className="w-full">
          <input 
            type="text" 
            placeholder="Add a comment..." 
            className="w-full bg-transparent border-b outline-none py-2 focus:border-primary transition-colors"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          {comment && (
            <div className="flex justify-end gap-2 mt-2">
              <button 
                type="button" 
                className="px-3 py-1 text-sm"
                onClick={() => setComment('')}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-3 py-1 bg-primary text-primary-foreground rounded text-sm"
              >
                Comment
              </button>
            </div>
          )}
        </div>
      </form>
      
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-secondary flex-shrink-0 flex items-center justify-center text-sm">
              {comment.userName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{comment.userName}</span>
                <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
              </div>
              <p className="text-sm mt-1">
                {comment.content}
              </p>
              <div className="flex items-center gap-3 mt-2">
                <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <ThumbsUp size={14} />
                  <span>{comment.likes}</span>
                </button>
                <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <ThumbsDown size={14} />
                </button>
                <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Reply
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
