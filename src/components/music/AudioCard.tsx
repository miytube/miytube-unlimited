
import React from 'react';
import { Play, Clock, Heart, MoreHorizontal } from 'lucide-react';

export interface AudioTrack {
  id: string;
  title: string;
  artist: string;
  duration: string;
  plays: string;
  image: string;
}

interface AudioCardProps {
  audio: AudioTrack;
}

export const AudioCard: React.FC<AudioCardProps> = ({ audio }) => {
  return (
    <div className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow bg-card">
      <div className="aspect-square relative overflow-hidden">
        <img 
          src={audio.image} 
          alt={audio.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
          <button className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center">
            <Play size={24} />
          </button>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-medium">{audio.title}</h3>
        <p className="text-sm text-muted-foreground mb-2">{audio.artist}</p>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-muted-foreground">
              <Clock size={14} />
              {audio.duration}
            </span>
            <span className="text-muted-foreground">{audio.plays} plays</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="text-muted-foreground hover:text-primary transition-colors">
              <Heart size={18} />
            </button>
            <button className="text-muted-foreground hover:text-foreground transition-colors">
              <MoreHorizontal size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
