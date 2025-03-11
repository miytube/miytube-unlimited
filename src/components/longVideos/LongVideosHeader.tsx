
import React from 'react';
import { Upload } from 'lucide-react';

interface LongVideosHeaderProps {
  onUploadClick: () => void;
}

export const LongVideosHeader: React.FC<LongVideosHeaderProps> = ({ onUploadClick }) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <h1 className="text-3xl font-bold">Long-Form Videos</h1>
      <button 
        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
        onClick={onUploadClick}
      >
        <Upload size={18} />
        <span>Upload Long Video</span>
      </button>
    </div>
  );
};
