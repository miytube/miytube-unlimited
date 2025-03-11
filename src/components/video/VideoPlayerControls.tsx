
import React from 'react';
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward, Maximize } from 'lucide-react';
import { formatTime } from './videoPlayerUtils';

interface VideoPlayerControlsProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  onPlayPause: () => void;
  onProgressChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleMute: () => void;
  onToggleFullscreen: () => void;
  onSkip: (seconds: number) => void;
  controlsVisible: boolean;
}

export const VideoPlayerControls: React.FC<VideoPlayerControlsProps> = ({
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  onPlayPause,
  onProgressChange,
  onVolumeChange,
  onToggleMute,
  onToggleFullscreen,
  onSkip,
  controlsVisible
}) => {
  return (
    <div className={`video-controls transition-opacity duration-300 ${controlsVisible || !isPlaying ? 'opacity-100' : 'opacity-0'}`}>
      <div className="relative">
        <input
          type="range"
          min="0"
          max={duration || 100}
          value={currentTime}
          onChange={onProgressChange}
          className="absolute top-0 left-0 w-full opacity-0 h-2 cursor-pointer z-10"
        />
        <div className="video-progress">
          <div className="video-progress-bar" style={{ width: `${(currentTime / (duration || 1)) * 100}%` }} />
        </div>
      </div>
      
      <div className="video-controls-buttons">
        <div className="flex items-center gap-3">
          <button onClick={onPlayPause} className="hover:text-primary transition-colors">
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
          
          <button onClick={() => onSkip(-10)} className="hover:text-primary transition-colors">
            <SkipBack size={20} />
          </button>
          
          <button onClick={() => onSkip(10)} className="hover:text-primary transition-colors">
            <SkipForward size={20} />
          </button>
          
          <div className="flex items-center gap-2">
            <button onClick={onToggleMute} className="hover:text-primary transition-colors">
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={onVolumeChange}
              className="w-16 md:w-24 accent-white"
            />
          </div>
          
          <div className="text-sm">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>
        
        <div>
          <button onClick={onToggleFullscreen} className="hover:text-primary transition-colors">
            <Maximize size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
