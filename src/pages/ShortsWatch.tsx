
import React, { useState, useEffect, useRef } from 'react';
import { Layout } from '@/components/Layout';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useUploadedVideos } from '@/context/UploadedVideosContext';
import { ArrowLeft, Play, Pause, Volume2, VolumeX, ThumbsUp, MessageCircle, Share, Edit, Trash2, Film } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VideoEditDialog } from '@/components/watch/VideoEditDialog';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const ShortsWatch = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { uploadedVideos, updateUploadedVideo, deleteUploadedVideo } = useUploadedVideos();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [video, setVideo] = useState<any>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Get regular videos and other shorts for sidebar
  const regularVideos = uploadedVideos.filter(v => v.category !== 'shorts');
  const otherShorts = uploadedVideos.filter(v => v.category === 'shorts' && v.id !== id);

  useEffect(() => {
    if (id) {
      const foundVideo = uploadedVideos.find(v => v.id === id);
      if (foundVideo) {
        setVideo(foundVideo);
      }
    }
  }, [id, uploadedVideos]);

  useEffect(() => {
    if (videoRef.current) {
      let url: string | null = null;
      
      // Handle cloud-stored videos
      if (video?.isCloudStored && video?.cloudUrl) {
        videoRef.current.src = video.cloudUrl;
      } else if (video?.file) {
        url = URL.createObjectURL(video.file);
        videoRef.current.src = url;
      } else if (video?.fileDataUrl) {
        videoRef.current.src = video.fileDataUrl;
      }
      
      if (video) {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
      
      return () => {
        if (url) URL.revokeObjectURL(url);
      };
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

  const handleEditSave = (updates: {
    title: string;
    description: string;
    category?: string;
    subcategory?: string;
    tags: string[];
  }) => {
    if (id) {
      updateUploadedVideo(id, updates);
      setVideo((prev: any) => ({ ...prev, ...updates }));
      toast({
        title: "Short updated",
        description: "Your short has been updated successfully.",
      });
    }
  };

  const handleDelete = () => {
    if (id) {
      deleteUploadedVideo(id);
      toast({
        title: "Short deleted",
        description: "Your short has been deleted.",
      });
      navigate('/shorts');
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
      <div className="flex justify-center gap-6 min-h-[calc(100vh-120px)] py-4 px-4">
        {/* Main Short Player */}
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

          {/* Edit/Delete buttons */}
          <div className="absolute top-4 right-4 z-20 flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="bg-black/50 text-white hover:bg-black/70"
              onClick={() => setEditDialogOpen(true)}
            >
              <Edit className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="bg-black/50 text-white hover:bg-red-500/70"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>

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

        {/* Right Sidebar */}
        <div className="w-72 hidden lg:block space-y-6">
          {/* Other Shorts */}
          {otherShorts.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Film className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold">More Shorts</h3>
              </div>
              <div className="grid grid-cols-4 gap-1">
                {otherShorts.slice(0, 4).map((short) => (
                  <Link 
                    key={short.id} 
                    to={`/shorts/${short.id}`}
                    className="relative aspect-[9/16] rounded overflow-hidden bg-muted group"
                  >
                    <img 
                      src={short.thumbnail} 
                      alt={short.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Regular Videos */}
          {regularVideos.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-3">Videos</h3>
              <div className="space-y-2">
                {regularVideos.slice(0, 6).map((vid) => (
                  <Link 
                    key={vid.id} 
                    to={`/watch?v=${vid.id}`}
                    className="flex gap-2 group hover:bg-muted/50 rounded-lg p-1 transition-colors"
                  >
                    <div className="relative w-28 h-16 flex-shrink-0 rounded overflow-hidden bg-muted">
                      <img 
                        src={vid.thumbnail} 
                        alt={vid.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] px-1 rounded">
                        {vid.duration}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-medium line-clamp-2 group-hover:text-primary">
                        {vid.title}
                      </h4>
                      <p className="text-[10px] text-muted-foreground mt-1">{vid.views} views</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {regularVideos.length === 0 && otherShorts.length === 0 && (
            <div className="text-center p-4 bg-muted/20 rounded-lg">
              <p className="text-sm text-muted-foreground">No other videos uploaded yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Dialog */}
      <VideoEditDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        video={{
          id: video.id,
          title: video.title,
          description: video.description || '',
          category: video.category,
          subcategory: video.subcategory,
          tags: video.tags || [],
        }}
        onSave={handleEditSave}
      />

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Short</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this short? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default ShortsWatch;
