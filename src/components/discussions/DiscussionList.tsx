
import React from 'react';
import { DiscussionCard, Discussion } from './DiscussionCard';
import { EmptyDiscussionState } from './EmptyDiscussionState';

interface DiscussionListProps {
  discussions: Discussion[];
  onCreateClick: () => void;
}

export const DiscussionList: React.FC<DiscussionListProps> = ({ discussions, onCreateClick }) => {
  return (
    <div className="space-y-4">
      {discussions.length > 0 ? 
        discussions.map(discussion => (
          <DiscussionCard key={discussion.id} discussion={discussion} />
        )) : (
          <EmptyDiscussionState onCreateClick={onCreateClick} />
        )
      }
    </div>
  );
};
