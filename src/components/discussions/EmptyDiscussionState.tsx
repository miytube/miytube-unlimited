
import React from 'react';
import { MessageCircle } from 'lucide-react';

interface EmptyDiscussionStateProps {
  onCreateClick: () => void;
}

export const EmptyDiscussionState: React.FC<EmptyDiscussionStateProps> = ({ onCreateClick }) => {
  return (
    <div className="bg-card p-8 rounded-lg shadow-md text-center">
      <MessageCircle size={40} className="mx-auto mb-4 text-muted-foreground" />
      <h3 className="text-lg font-medium mb-2">No experiences shared yet</h3>
      <p className="text-muted-foreground mb-4">
        Be the first to share how this topic has affected your personal life!
      </p>
      <button 
        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
        onClick={onCreateClick}
      >
        Share Your Experience
      </button>
    </div>
  );
};
