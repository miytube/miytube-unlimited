
import React from 'react';
import { X } from 'lucide-react';
import { VideoPlayer } from '../video/VideoPlayer';

interface VideoPreviewPlayerProps {
  selectedVideoFile: File | null;
  onClose: () => void;
}

export const VideoPreviewPlayer: React.FC<VideoPreviewPlayerProps> = ({
  selectedVideoFile,
  onClose,
}) => {
  if (!selectedVideoFile) return null;

  return (
    <div className="mt-6 mb-6">
      <h3 className="text-sm font-medium mb-2 flex justify-between items-center">
        <span>Playing: {selectedVideoFile.name}</span>
        <button 
          onClick={onClose} 
          className="text-muted-foreground hover:text-destructive"
        >
          <X size={18} />
        </button>
      </h3>
      <VideoPlayer 
        title={selectedVideoFile.name} 
        videoFile={selectedVideoFile} 
      />
    </div>
  );
};
