
import React from 'react';
import { MessageSquare, ThumbsUp, ThumbsDown } from 'lucide-react';

export const CommentsSection: React.FC = () => {
  return (
    <div className="mt-6">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare size={20} />
        <h3 className="font-medium">Comments</h3>
        <span className="text-sm text-muted-foreground">(643)</span>
      </div>
      
      <div className="flex gap-3 mb-6">
        <div className="w-8 h-8 rounded-full bg-secondary flex-shrink-0"></div>
        <div className="w-full">
          <input 
            type="text" 
            placeholder="Add a comment..." 
            className="w-full bg-transparent border-b outline-none py-2 focus:border-primary transition-colors"
          />
        </div>
      </div>
      
      {/* Comment examples */}
      <div className="space-y-4">
        {[1, 2, 3].map((comment) => (
          <div key={comment} className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-secondary flex-shrink-0"></div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">User Name</span>
                <span className="text-xs text-muted-foreground">2 days ago</span>
              </div>
              <p className="text-sm mt-1">
                This is an amazing video! I learned so much from this content, thank you for sharing your knowledge.
              </p>
              <div className="flex items-center gap-3 mt-2">
                <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <ThumbsUp size={14} />
                  <span>128</span>
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
