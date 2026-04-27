import React, { useEffect, useMemo, useState } from 'react';
import { useVideoPlayer } from './useVideoPlayer';
import { VideoPlayerControls } from './VideoPlayerControls';
import { getVideoSource } from './videoPlayerUtils';

interface VideoPlayerProps {
  videoId?: string;
  title: string;
  format?: string;
  videoFile?: File | string; // Can be File object or URL string (http(s) or data:)
  autoPlay?: boolean;
}

const isUuidLike = (value: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);

const getMediaErrorMessage = (code?: number) => {
  // https://developer.mozilla.org/en-US/docs/Web/API/MediaError/code
  switch (code) {
    case 1:
      return 'Playback was aborted. Please try again.';
    case 2:
      return 'Network error while loading the video. Please check your connection.';
    case 3:
      return 'This video can’t be decoded in your browser (unsupported codec). Re-upload encoded as H.264/AAC (MP4).';
    case 4:
      return 'Video source not supported or the file is unavailable.';
    default:
      return 'Video failed to load. Please try re-uploading the file.';
  }
};

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoId,
  title,
  format = 'mp4',
  videoFile,
  autoPlay = false,
}) => {
  const [videoSrc, setVideoSrc] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const resolvedSrc = useMemo(() => {
    if (videoFile) {
      return typeof videoFile === 'string' ? videoFile : URL.createObjectURL(videoFile);
    }
    if (videoId) return getVideoSource(videoId, format);
    return '';
  }, [videoFile, videoId, format]);

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
    setControlsVisible,
  } = useVideoPlayer(autoPlay);

  useEffect(() => {
    setVideoSrc(resolvedSrc);
    setErrorMessage(null);
    setIsLoading(true);

    return () => {
      // Clean up object URL (only for File objects)
      if (videoFile && typeof videoFile !== 'string' && resolvedSrc && !resolvedSrc.startsWith('data:')) {
        URL.revokeObjectURL(resolvedSrc);
      }
    };
  }, [resolvedSrc, videoFile]);

  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.volume = volume;
    videoRef.current.muted = isMuted;
    videoRef.current.preload = 'metadata';
  }, [volume, isMuted, videoRef]);

  const handleVideoLoaded = () => {
    setIsLoading(false);
  };

  const handleVideoError = () => {
    const err = videoRef.current?.error;
    const msg = getMediaErrorMessage(err?.code);

    console.error('Video playback error', {
      title,
      src: videoSrc,
      mediaError: err,
      code: err?.code,
      isUuidLikeId: videoId ? isUuidLike(videoId) : undefined,
    });

    setIsLoading(false);
    setErrorMessage(msg);
  };

  return (
    <div
      ref={containerRef}
      className="video-player-container relative w-full aspect-video rounded-lg overflow-hidden bg-black shadow-xl"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setControlsVisible(false)}
    >
      {isLoading && !errorMessage && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
        </div>
      )}

      {errorMessage && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center p-6 bg-black/70">
          <h3 className="text-base font-semibold text-white">Video can’t play</h3>
          <p className="mt-2 text-sm text-white/80 max-w-lg">{errorMessage}</p>
          <p className="mt-3 text-xs text-white/60 max-w-lg break-all">
            Source: {videoSrc || '—'}
          </p>
        </div>
      )}

      <video
        ref={videoRef}
        src={videoSrc}
        className="w-full h-full object-contain"
        onClick={togglePlayPause}
        playsInline
        preload="metadata"
        poster={videoFile ? undefined : 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?auto=format&fit=crop&w=800&q=80'}
        controls={false}
        muted={isMuted}
        onLoadedData={handleVideoLoaded}
        onLoadedMetadata={handleVideoLoaded}
        onError={handleVideoError}
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

