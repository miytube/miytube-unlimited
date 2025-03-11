
import React from 'react';
import { Music as MusicIcon, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const MusicHeader: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-3">
        <MusicIcon className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Music</h1>
      </div>
      <button 
        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
        onClick={() => navigate('/upload')}
      >
        <Upload size={18} />
        <span>Upload Music</span>
      </button>
    </div>
  );
};
