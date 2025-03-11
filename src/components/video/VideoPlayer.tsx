
import React from 'react';
import { Maximize } from 'lucide-react';
import { useVideoPlayer } from './useVideoPlayer';
import { VideoPlayerControls } from './VideoPlayerControls';
import { getVideoSource } from './videoPlayerUtils';

interface VideoPlayerProps {
  videoId: string;
  title: string;
  format?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoId, title, format = 'mp4' }) => {
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
  } = useVideoPlayer();
  
  const videoSrc = getVideoSource(videoId, format);
  
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
