
import React, { useEffect, useState } from 'react';
import { Maximize } from 'lucide-react';
import { useVideoPlayer } from './useVideoPlayer';
import { VideoPlayerControls } from './VideoPlayerControls';
import { getVideoSource } from './videoPlayerUtils';

interface VideoPlayerProps {
  videoId?: string;
  title: string;
  format?: string;
  videoFile?: File | string; // Can be File object or data URL string
  autoPlay?: boolean;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  videoId, 
  title, 
  format = 'mp4', 
  videoFile,
  autoPlay = false
}) => {
  const [videoSrc, setVideoSrc] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  
  const {
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    controlsVisible,
    videoRef,
    containerRef,
    togglePlayPause,
    handleProgressChange,
    handleVolumeChange,
    toggleMute,
    toggleFullscreen,
    skip,
    handleMouseMove,
    setControlsVisible
  } = useVideoPlayer(autoPlay);
  
  useEffect(() => {
    // Set video source and handle object URL creation
    if (videoFile) {
      // Check if videoFile is already a string URL (data URL or http URL)
      if (typeof videoFile === 'string') {
        setVideoSrc(videoFile);
      } else {
        // It's a File object, create object URL
        const url = URL.createObjectURL(videoFile);
        setVideoSrc(url);
      }
    } else if (videoId) {
      setVideoSrc(getVideoSource(videoId, format));
    }
    
    setIsLoading(true);
  }, [videoFile, videoId, format]);
  
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
      videoRef.current.muted = isMuted;
      
      // Preload metadata to prevent flickering
      videoRef.current.preload = "metadata";
    }
  }, [volume, isMuted]);

  // Clean up object URL when component unmounts (only for File objects)
  useEffect(() => {
    return () => {
      if (videoFile && typeof videoFile !== 'string' && videoSrc && !videoSrc.startsWith('data:')) {
        URL.revokeObjectURL(videoSrc);
      }
    };
  }, [videoFile, videoSrc]);
  
  const handleVideoLoaded = () => {
    setIsLoading(false);
  };
  
  return (
    <div 
      ref={containerRef} 
      className="video-player-container relative w-full aspect-video rounded-lg overflow-hidden bg-black shadow-xl"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setControlsVisible(false)}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}
      
      <video
        ref={videoRef}
        src={videoSrc}
        className="w-full h-full object-contain"
        onClick={togglePlayPause}
        playsInline
        preload="metadata"
        poster={videoFile ? undefined : "https://images.unsplash.com/photo-1611162616475-46b635cb6868?auto=format&fit=crop&w=800&q=80"}
        controls={false}
        onLoadedData={handleVideoLoaded}
        onLoadedMetadata={handleVideoLoaded}
      />
      
      <VideoPlayerControls
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        volume={volume}
        isMuted={isMuted}
        onPlayPause={togglePlayPause}
        onProgressChange={handleProgressChange}
        onVolumeChange={handleVolumeChange}
        onToggleMute={toggleMute}
        onToggleFullscreen={toggleFullscreen}
        onSkip={skip}
        controlsVisible={controlsVisible}
      />
    </div>
  );
};
