import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { VideoPlayer } from '@/components/video/VideoPlayer';
import { VideoInfo } from '@/components/watch/VideoInfo';
import { VideoDescription } from '@/components/watch/VideoDescription';
import { VideoEditDialog } from '@/components/watch/VideoEditDialog';
import { useVideos } from '@/hooks/useVideos';
import { useUploadedVideos } from '@/context/UploadedVideosContext';
import { useToast } from '@/hooks/use-toast';
import { Film } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
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

const Watch = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const searchParams = new URLSearchParams(location.search);
  const videoId = searchParams.get('v');
  const musicVideoId = searchParams.get('id');
  const videoType = searchParams.get('type');
  
  const { getVideoById } = useVideos();
  const { uploadedVideos, isUploadedVideo, updateUploadedVideo, deleteUploadedVideo } = useUploadedVideos();
  const [video, setVideo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isMusicVideo, setIsMusicVideo] = useState(false);

  // Get regular videos and shorts for sidebar
  const actualVideoId = videoId || musicVideoId;
  const regularVideos = uploadedVideos.filter(v => v.category !== 'shorts' && v.id !== actualVideoId);
  const shortVideos = uploadedVideos.filter(v => v.category === 'shorts');
  
  useEffect(() => {
    const fetchVideo = async () => {
      // Handle music video from Supabase
      if (musicVideoId && videoType === 'music') {
        setIsMusicVideo(true);
        try {
          const { data, error } = await supabase
            .from('music_videos')
            .select('*')
            .eq('id', musicVideoId)
            .single();
          
          if (error) {
            console.error('Error fetching music video:', error);
            setLoading(false);
            return;
          }
          
          if (data) {
            setVideo({
              id: data.id,
              title: data.title,
              description: data.description,
              channelName: 'Music Channel',
              channelAvatar: 'https://ui-avatars.com/api/?name=Music&background=random',
              views: `${data.views} views`,
              timestamp: new Date(data.created_at).toLocaleDateString(),
              likes: data.likes.toString(),
              subscribers: '0',
              file: data.video_url, // This is the video data URL
              tags: data.tags || [],
              category: data.category,
              subcategory: data.subcategory
            });
          }
          setLoading(false);
        } catch (err) {
          console.error('Error:', err);
          setLoading(false);
        }
        return;
      }

      // Handle regular video from IndexedDB or mock data
      if (videoId) {
        console.log("Looking for video with ID:", videoId);
        
        const uploadedVideo = uploadedVideos.find(v => v.id === videoId);
        console.log("Found uploaded video:", uploadedVideo);
        
        if (uploadedVideo) {
          setVideo({
            id: uploadedVideo.id,
            title: uploadedVideo.title,
            description: uploadedVideo.description,
            channelName: 'Your Channel',
            channelAvatar: 'https://ui-avatars.com/api/?name=Your+Channel&background=random',
            views: '0 views',
            timestamp: 'Just now',
            likes: '0',
            subscribers: '0',
            file: uploadedVideo.file,
            tags: uploadedVideo.tags || [],
            category: uploadedVideo.category,
            subcategory: uploadedVideo.subcategory
          });
          setLoading(false);
        } else {
          const fetchedVideo = getVideoById(videoId);
          console.log("Found mock video:", fetchedVideo);
          if (fetchedVideo) {
            setVideo(fetchedVideo);
          }
          setLoading(false);
        }
      }
    };

    fetchVideo();
  }, [videoId, musicVideoId, videoType, getVideoById, uploadedVideos]);

  const handleEditSave = (updates: {
    title: string;
    description: string;
    category?: string;
    subcategory?: string;
    tags: string[];
  }) => {
    if (videoId) {
      updateUploadedVideo(videoId, updates);
      setVideo((prev: any) => ({ ...prev, ...updates }));
      toast({
        title: "Video updated",
        description: "Your video has been updated successfully.",
      });
    }
  };

  const handleDelete = () => {
    if (videoId) {
      deleteUploadedVideo(videoId);
      toast({
        title: "Video deleted",
        description: "Your video has been deleted.",
      });
      navigate('/');
    }
  };
  

  const isUserUpload = videoId ? isUploadedVideo(videoId) : isMusicVideo;
  
  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-[calc(100vh-80px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }
  
  if (!video) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-[calc(100vh-80px)]">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Video not found</h2>
            <p className="text-muted-foreground">The video you're looking for doesn't exist or has been removed.</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="py-6 animate-fade-in">
        <div className="flex gap-6 max-w-[1400px] mx-auto px-2 sm:px-4">
          {/* Main Video Section */}
          <div className="flex-1 max-w-4xl space-y-6">
            <div className="bg-card rounded-lg overflow-hidden shadow-md">
              <VideoPlayer videoFile={video.file} title={video.title} />
            </div>
            
            <VideoInfo 
              title={video.title}
              channelName={video.channelName}
              channelAvatar={video.channelAvatar}
              subscribers={video.subscribers}
              views={video.views}
              timestamp={video.timestamp}
              likes={video.likes}
              tags={video.tags}
              isUploadedVideo={isUserUpload}
              onEdit={() => setEditDialogOpen(true)}
              onDelete={() => setDeleteDialogOpen(true)}
            />
            
            <VideoDescription description={video.description} />
            
            
          </div>

          {/* Right Sidebar */}
          <div className="w-80 hidden lg:block space-y-6">
            {/* Regular Videos */}
            {regularVideos.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-3">Up Next</h3>
                <div className="space-y-2">
                  {regularVideos.slice(0, 8).map((vid) => (
                    <Link 
                      key={vid.id} 
                      to={`/watch?v=${vid.id}`}
                      className="flex gap-2 group hover:bg-muted/50 rounded-lg p-1 transition-colors"
                    >
                      <div className="relative w-40 h-24 flex-shrink-0 rounded overflow-hidden bg-muted">
                        <img 
                          src={vid.thumbnail} 
                          alt={vid.title}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
                          {vid.duration}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium line-clamp-2 group-hover:text-primary">
                          {vid.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">Your Channel</p>
                        <p className="text-xs text-muted-foreground">{vid.views} views</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Shorts Section */}
            {shortVideos.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Film className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-semibold">Shorts</h3>
                </div>
                <div className="grid grid-cols-4 gap-1">
                  {shortVideos.slice(0, 4).map((short) => (
                    <Link 
                      key={short.id} 
                      to={`/shorts/watch?v=${short.id}`}
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

            {/* Empty State */}
            {regularVideos.length === 0 && shortVideos.length === 0 && (
              <div className="text-center p-4 bg-muted/20 rounded-lg">
                <p className="text-sm text-muted-foreground">No other videos uploaded yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {isUserUpload && video && (
        <>
          <VideoEditDialog
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            video={{
              id: video.id,
              title: video.title,
              description: video.description,
              category: video.category,
              subcategory: video.subcategory,
              tags: video.tags,
            }}
            onSave={handleEditSave}
          />

          <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Video</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this video? This action cannot be undone.
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
        </>
      )}
    </Layout>
  );
};

export default Watch;
