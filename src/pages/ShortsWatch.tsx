
import React, { useState, useEffect, useRef } from 'react';
import { Layout } from '@/components/Layout';
import { useParams, useNavigate } from 'react-router-dom';
import { useUploadedVideos } from '@/context/UploadedVideosContext';
import { ArrowLeft, Play, Pause, Volume2, VolumeX, ThumbsUp, MessageCircle, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ShortsWatch = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { uploadedVideos } = useUploadedVideos();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [video, setVideo] = useState<any>(null);

  useEffect(() => {
    if (id) {
      const foundVideo = uploadedVideos.find(v => v.id === id);
      if (foundVideo) {
        setVideo(foundVideo);
      }
    }
  }, [id, uploadedVideos]);

  useEffect(() => {
    if (video?.file && videoRef.current) {
      const url = URL.createObjectURL(video.file);
      videoRef.current.src = url;
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      
      return () => URL.revokeObjectURL(url);
    }
  }, [video]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  if (!video) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-[calc(100vh-80px)]">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Short not found</h2>
            <p className="text-muted-foreground">The short you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/shorts')} className="mt-4">
              Back to Shorts
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex justify-center items-center min-h-[calc(100vh-120px)] py-4">
        <div className="relative max-w-[400px] w-full">
          {/* Back button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 left-4 z-20 bg-black/50 text-white hover:bg-black/70"
            onClick={() => navigate('/shorts')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          {/* Video container */}
          <div className="relative aspect-[9/16] bg-black rounded-xl overflow-hidden">
            <video
              ref={videoRef}
              className="w-full h-full object-contain"
              loop
              playsInline
              onClick={togglePlay}
            />
            
            {/* Play/Pause overlay */}
            {!isPlaying && (
              <div 
                className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
                onClick={togglePlay}
              >
                <Play className="h-16 w-16 text-white" fill="white" />
              </div>
            )}

            {/* Bottom gradient */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />

            {/* Video info */}
            <div className="absolute bottom-4 left-4 right-16 text-white">
              <h3 className="font-semibold text-lg line-clamp-2">{video.title}</h3>
              <p className="text-sm opacity-80 mt-1">Your Channel</p>
              {video.description && (
                <p className="text-sm opacity-70 mt-2 line-clamp-2">{video.description}</p>
              )}
            </div>

            {/* Side actions */}
            <div className="absolute right-3 bottom-20 flex flex-col gap-4">
              <button className="flex flex-col items-center text-white">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <ThumbsUp className="h-5 w-5" />
                </div>
                <span className="text-xs mt-1">Like</span>
              </button>
              <button className="flex flex-col items-center text-white">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <span className="text-xs mt-1">Comment</span>
              </button>
              <button className="flex flex-col items-center text-white">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Share className="h-5 w-5" />
                </div>
                <span className="text-xs mt-1">Share</span>
              </button>
              <button 
                className="flex flex-col items-center text-white"
                onClick={toggleMute}
              >
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </div>
                <span className="text-xs mt-1">{isMuted ? 'Unmute' : 'Mute'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ShortsWatch;
