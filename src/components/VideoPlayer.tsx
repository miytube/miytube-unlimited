import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward } from 'lucide-react';

interface VideoPlayerProps {
  videoId: string;
  title: string;
  format?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoId, title, format = 'mp4' }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(false);
  const [hideControlsTimeout, setHideControlsTimeout] = useState<NodeJS.Timeout | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const videoSrc = `https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.${format}`;
  
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };
  
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
  };
  
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };
  
  const toggleFullscreen = () => {
    if (containerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        containerRef.current.requestFullscreen();
      }
    }
  };
  
  const skip = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };
  
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  useEffect(() => {
    const video = videoRef.current;
    
    const handleTimeUpdate = () => {
      if (video) {
        setCurrentTime(video.currentTime);
      }
    };
    
    const handleDurationChange = () => {
      if (video) {
        setDuration(video.duration);
      }
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
    };
    
    if (video) {
      video.addEventListener('timeupdate', handleTimeUpdate);
      video.addEventListener('durationchange', handleDurationChange);
      video.addEventListener('ended', handleEnded);
    }
    
    return () => {
      if (video) {
        video.removeEventListener('timeupdate', handleTimeUpdate);
        video.removeEventListener('durationchange', handleDurationChange);
        video.removeEventListener('ended', handleEnded);
      }
    };
  }, []);
  
  const handleMouseMove = () => {
    setControlsVisible(true);
    
    if (hideControlsTimeout) {
      clearTimeout(hideControlsTimeout);
    }
    
    const timeout = setTimeout(() => {
      if (isPlaying) {
        setControlsVisible(false);
      }
    }, 3000);
    
    setHideControlsTimeout(timeout);
  };
  
  useEffect(() => {
    return () => {
      if (hideControlsTimeout) {
        clearTimeout(hideControlsTimeout);
      }
    };
  }, [hideControlsTimeout]);

  return (
    <div 
      ref={containerRef} 
      className="video-player-container rounded-lg overflow-hidden bg-black shadow-xl"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setControlsVisible(false)}
    >
      <video
        ref={videoRef}
        src={videoSrc}
        className="w-full h-full"
        onClick={togglePlayPause}
        playsInline
      />
      
      <div className={`video-controls transition-opacity duration-300 ${controlsVisible || !isPlaying ? 'opacity-100' : 'opacity-0'}`}>
        <div className="relative">
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={handleProgressChange}
            className="absolute top-0 left-0 w-full opacity-0 h-2 cursor-pointer z-10"
          />
          <div className="video-progress">
            <div className="video-progress-bar" style={{ width: `${(currentTime / (duration || 1)) * 100}%` }} />
          </div>
        </div>
        
        <div className="video-controls-buttons">
          <div className="flex items-center gap-3">
            <button onClick={togglePlayPause} className="hover:text-primary transition-colors">
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
            
            <button onClick={() => skip(-10)} className="hover:text-primary transition-colors">
              <SkipBack size={20} />
            </button>
            
            <button onClick={() => skip(10)} className="hover:text-primary transition-colors">
              <SkipForward size={20} />
            </button>
            
            <div className="flex items-center gap-2">
              <button onClick={toggleMute} className="hover:text-primary transition-colors">
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 md:w-24 accent-white"
              />
            </div>
            
            <div className="text-sm">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>
          
          <div>
            <button onClick={toggleFullscreen} className="hover:text-primary transition-colors">
              <Maximize size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
