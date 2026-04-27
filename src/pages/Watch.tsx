import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { VideoPlayer } from '@/components/video/VideoPlayer';
import { YouTubeEmbed } from '@/components/video/YouTubeEmbed';
import { VideoInfo } from '@/components/watch/VideoInfo';
import { VideoDescription } from '@/components/watch/VideoDescription';
import { VideoComments } from '@/components/watch/VideoComments';
import { VideoEditDialog } from '@/components/watch/VideoEditDialog';
import { useVideos } from '@/hooks/useVideos';
import { useUploadedVideos } from '@/context/UploadedVideosContext';
import { useToast } from '@/hooks/use-toast';
import { Film, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAIRecommendations } from '@/hooks/useAIRecommendations';
import { trackEngagement } from '@/hooks/useTrackEngagement';
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
  const [isYouTubeVideo, setIsYouTubeVideo] = useState(false);
  const [youtubeVideoId, setYoutubeVideoId] = useState<string | null>(null);

  // Get regular videos and shorts for sidebar
  const actualVideoId = videoId || musicVideoId;
  const regularVideos = uploadedVideos.filter(v => v.category !== 'shorts' && v.id !== actualVideoId);
  const shortVideos = uploadedVideos.filter(v => v.category === 'shorts');

  // AI Recommendations
  const { recommendations: aiRecommendations, isLoading: aiLoading } = useAIRecommendations(
    actualVideoId || undefined,
    video?.category,
    video?.tags
  );
  
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
          // Check if it's a YouTube embed
          if (uploadedVideo.isYouTubeEmbed && uploadedVideo.youtubeId) {
            setIsYouTubeVideo(true);
            setYoutubeVideoId(uploadedVideo.youtubeId);
          } else {
            setIsYouTubeVideo(false);
            setYoutubeVideoId(null);
          }
          
          // Prefer cloud URL if available; otherwise fall back to local file/data URL
          const videoSource = uploadedVideo.cloudUrl || uploadedVideo.file || uploadedVideo.fileDataUrl;
          
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
            file: videoSource,
            tags: uploadedVideo.tags || [],
            category: uploadedVideo.category,
            subcategory: uploadedVideo.subcategory,
            isYouTubeEmbed: uploadedVideo.isYouTubeEmbed,
            youtubeId: uploadedVideo.youtubeId
          });
          setLoading(false);
        } else {
          // Try to find video directly in Supabase by local_id or UUID
          try {
            // Check if videoId looks like a UUID (for direct UUID lookups)
            const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(videoId);
            
            let cloudVideo = null;
            
            // First try to find by local_id
            const { data: byLocalId } = await supabase
              .from('uploaded_videos')
              .select('*')
              .eq('local_id', videoId)
              .maybeSingle();
            
            if (byLocalId) {
              cloudVideo = byLocalId;
            } else if (isUUID) {
              // Only try UUID lookup if videoId is a valid UUID format
              const { data: byUUID } = await supabase
                .from('uploaded_videos')
                .select('*')
                .eq('id', videoId)
                .maybeSingle();
              cloudVideo = byUUID;
            }
            
            if (cloudVideo) {
              const videoSource = cloudVideo.cloud_url || cloudVideo.video_url;
              setVideo({
                id: cloudVideo.local_id || cloudVideo.id,
                title: cloudVideo.title,
                description: cloudVideo.description || '',
                channelName: 'Your Channel',
                channelAvatar: 'https://ui-avatars.com/api/?name=Your+Channel&background=random',
                views: `${cloudVideo.views || 0} views`,
                timestamp: new Date(cloudVideo.created_at).toLocaleDateString(),
                likes: '0',
                subscribers: '0',
                file: videoSource,
                tags: cloudVideo.tags || [],
                category: cloudVideo.category,
                subcategory: cloudVideo.subcategory,
                isYouTubeEmbed: cloudVideo.is_youtube_embed,
                youtubeId: cloudVideo.youtube_video_id
              });
              setLoading(false);
              return;
            }
          } catch (err) {
            console.log('Video not found in Supabase:', err);
          }
          
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

  // Record a view event once per page load
  useEffect(() => {
    const id = videoId || musicVideoId;
    if (!id || !video) return;
    trackEngagement(
      video.id || id,
      'view',
      isMusicVideo ? 'music_videos' : 'uploaded_videos'
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [video?.id]);

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

  // Check if video source is missing
  const hasVideoSource = video.file || (isYouTubeVideo && youtubeVideoId);
  
  return (
    <Layout>
      <div className="py-6 animate-fade-in">
        <div className="flex gap-6 max-w-[1400px] mx-auto px-2 sm:px-4">
          {/* Main Video Section */}
          <div className="flex-1 max-w-4xl space-y-6">
            <div className="bg-card rounded-lg overflow-hidden shadow-md">
              {!hasVideoSource ? (
                <div className="aspect-video bg-muted flex flex-col items-center justify-center text-center p-8">
                  <Film className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Video file unavailable</h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    The video file for "{video.title}" was not saved properly. Please re-upload the video to watch it.
                  </p>
                </div>
              ) : isYouTubeVideo && youtubeVideoId ? (
                <YouTubeEmbed videoId={youtubeVideoId} title={video.title} />
              ) : (
                <VideoPlayer videoFile={video.file} title={video.title} />
              )}
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
              videoId={actualVideoId || undefined}
            />
            
            <VideoDescription description={video.description} />
            
            {actualVideoId && <VideoComments videoId={actualVideoId} />}
            
            
          </div>

          {/* Right Sidebar */}
          <div className="w-80 hidden lg:block space-y-4">
            <h3 className="text-sm font-semibold">Up Next</h3>
            
            {/* First Video */}
            {regularVideos.length > 0 && (
              <Link 
                key={regularVideos[0].id} 
                to={`/watch?v=${regularVideos[0].id}`}
                className="flex gap-2 group hover:bg-muted/50 rounded-lg p-1 transition-colors"
              >
                <div className="relative w-40 h-24 flex-shrink-0 rounded overflow-hidden bg-muted">
                  <img 
                    src={regularVideos[0].thumbnail} 
                    alt={regularVideos[0].title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
                    {regularVideos[0].duration}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium line-clamp-2 group-hover:text-primary">
                    {regularVideos[0].title}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">Your Channel</p>
                  <p className="text-xs text-muted-foreground">{regularVideos[0].views} views</p>
                </div>
              </Link>
            )}

            {/* Shorts Section - Right after first video */}
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

            {/* Remaining Videos */}
            {regularVideos.length > 1 && (
              <div className="space-y-2">
                {regularVideos.slice(1, 8).map((vid) => (
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
            )}

            {/* AI Recommendations */}
            {aiRecommendations.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-semibold">AI Recommended</h3>
                </div>
                {aiRecommendations.slice(0, 5).map((rec) => (
                  <Link
                    key={rec.id}
                    to={`/watch?v=${rec.id}`}
                    className="flex gap-2 group hover:bg-muted/50 rounded-lg p-1 transition-colors"
                  >
                    <div className="relative w-40 h-24 flex-shrink-0 rounded overflow-hidden bg-muted">
                      <img
                        src={rec.thumbnail_url || rec.cloud_url || 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?auto=format&fit=crop&w=800&q=80'}
                        alt={rec.title}
                        className="w-full h-full object-cover"
                      />
                      {rec.duration && (
                        <span className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
                          {rec.duration}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium line-clamp-2 group-hover:text-primary">
                        {rec.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">{rec.category || 'MiyTube'}</p>
                      <p className="text-xs text-muted-foreground">{rec.views || 0} views</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Empty State */}
            {regularVideos.length === 0 && shortVideos.length === 0 && aiRecommendations.length === 0 && (
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
