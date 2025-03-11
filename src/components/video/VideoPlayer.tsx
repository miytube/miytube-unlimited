
import React, { useEffect } from 'react';
import { Maximize } from 'lucide-react';
import { useVideoPlayer } from './useVideoPlayer';
import { VideoPlayerControls } from './VideoPlayerControls';
import { getVideoSource } from './videoPlayerUtils';

interface VideoPlayerProps {
  videoId?: string;
  title: string;
  format?: string;
  videoFile?: File;
  autoPlay?: boolean;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  videoId, 
  title, 
  format = 'mp4', 
  videoFile,
  autoPlay = false
}) => {
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
  
  const videoSrc = videoFile ? URL.createObjectURL(videoFile) : (videoId ? getVideoSource(videoId, format) : '');
  
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
      videoRef.current.muted = isMuted;
      
      // Preload metadata to prevent flickering
      videoRef.current.preload = "metadata";
    }
  }, [volume, isMuted]);

  // Clean up object URL when component unmounts
  useEffect(() => {
    if (videoFile) {
      return () => {
        URL.revokeObjectURL(videoSrc);
      };
    }
  }, [videoFile, videoSrc]);
  
  return (
    <div 
      ref={containerRef} 
      className="video-player-container relative w-full aspect-video rounded-lg overflow-hidden bg-black shadow-xl"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setControlsVisible(false)}
    >
      <video
        ref={videoRef}
        src={videoSrc}
        className="w-full h-full object-contain"
        onClick={togglePlayPause}
        playsInline
        preload="metadata"
        poster={videoFile ? undefined : "https://images.unsplash.com/photo-1611162616475-46b635cb6868?auto=format&fit=crop&w=800&q=80"}
        controls={false}
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
