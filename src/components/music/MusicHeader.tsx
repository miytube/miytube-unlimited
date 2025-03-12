
import React from 'react';
import { Music, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';

export const MusicHeader = () => {
  return (
    <div className="flex items-center justify-between gap-3 mb-8">
      <div className="flex items-center gap-3">
        <Music className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Music</h1>
        <p className="text-muted-foreground ml-2">
          Discover and enjoy music tracks
        </p>
      </div>
      <Link 
        to="/upload/music" 
        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
      >
        <Upload size={18} />
        <span>Upload Music</span>
      </Link>
    </div>
  );
};
