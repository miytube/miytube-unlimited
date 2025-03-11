
import React, { useState } from 'react';

interface VideoDescriptionProps {
  description: string;
}

export const VideoDescription: React.FC<VideoDescriptionProps> = ({ description }) => {
  const [expanded, setExpanded] = useState(false);
  
  // If description is short, don't show read more button
  const isLongDescription = description.length > 200;
  const displayText = !expanded && isLongDescription 
    ? `${description.substring(0, 200)}...` 
    : description;
  
  return (
    <div className="p-4 bg-secondary/30 rounded-lg animate-fade-in">
      <p className="text-sm whitespace-pre-line">
        {displayText}
      </p>
      
      {isLongDescription && (
        <button 
          className="text-sm font-medium mt-2 text-primary hover:text-primary/80 transition-colors"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'Show less' : 'Read more'}
        </button>
      )}
    </div>
  );
};
