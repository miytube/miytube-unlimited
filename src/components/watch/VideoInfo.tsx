import React, { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, Share, Download, Flag, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import WatchlistButton from '@/components/WatchlistButton';
import { trackEngagement } from '@/hooks/useTrackEngagement';

interface VideoInfoProps {
  title: string;
  channelName: string;
  channelAvatar: string;
  subscribers: string;
  views: string;
  timestamp: string;
  likes: string;
  tags?: string[];
  isUploadedVideo?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  videoId?: string;
}

export const VideoInfo: React.FC<VideoInfoProps> = ({
  title,
  channelName,
  channelAvatar,
  subscribers,
  views,
  timestamp,
  likes: initialLikes,
  tags = [],
  isUploadedVideo = false,
  onEdit,
  onDelete,
  videoId,
}) => {
  const [userLikeStatus, setUserLikeStatus] = useState<'like' | 'dislike' | null>(null);
  const [likesCount, setLikesCount] = useState(parseInt(initialLikes) || 0);
  const [dislikesCount, setDislikesCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    if (videoId) {
      fetchLikeStatus();
      fetchLikeCounts();
    }
  }, [videoId]);

  const fetchLikeStatus = async () => {
    if (!videoId) return;
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('video_likes')
      .select('is_like')
      .eq('video_id', videoId)
      .eq('user_id', user.id)
      .maybeSingle();

    if (data) {
      setUserLikeStatus(data.is_like ? 'like' : 'dislike');
    }
  };

  const fetchLikeCounts = async () => {
    if (!videoId) return;

    const { data: likes } = await supabase
      .from('video_likes')
      .select('is_like')
      .eq('video_id', videoId);

    if (likes) {
      setLikesCount(likes.filter(l => l.is_like).length);
      setDislikesCount(likes.filter(l => !l.is_like).length);
    }
  };

  const handleLike = async (isLike: boolean) => {
    if (!videoId) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to like or dislike videos.",
        variant: "destructive",
      });
      return;
    }

    try {
      const currentAction = isLike ? 'like' : 'dislike';
      
      if (userLikeStatus === currentAction) {
        // Remove like/dislike
        await supabase
          .from('video_likes')
          .delete()
          .eq('video_id', videoId)
          .eq('user_id', user.id);
        
        setUserLikeStatus(null);
        if (isLike) {
          setLikesCount(prev => Math.max(0, prev - 1));
        } else {
          setDislikesCount(prev => Math.max(0, prev - 1));
        }
      } else {
        // Update or insert
        const { error } = await supabase
          .from('video_likes')
          .upsert({
            video_id: videoId,
            user_id: user.id,
            is_like: isLike,
          }, {
            onConflict: 'user_id,video_id'
          });

        if (error) throw error;

        // Adjust counts
        if (userLikeStatus === 'like') {
          setLikesCount(prev => Math.max(0, prev - 1));
        } else if (userLikeStatus === 'dislike') {
          setDislikesCount(prev => Math.max(0, prev - 1));
        }
        
        if (isLike) {
          setLikesCount(prev => prev + 1);
        } else {
          setDislikesCount(prev => prev + 1);
        }
        
        setUserLikeStatus(currentAction);
      }
    } catch (error) {
      console.error('Error updating like:', error);
      toast({
        title: "Error",
        description: "Failed to update. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="mb-6 animate-fade-in">
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-xl md:text-2xl font-medium mb-2 flex-1">{title}</h1>
        
        {isUploadedVideo && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
              className="flex items-center gap-1"
            >
              <Pencil size={16} />
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={onDelete}
              className="flex items-center gap-1"
            >
              <Trash2 size={16} />
              Delete
            </Button>
          </div>
        )}
      </div>
      
      <div className="flex flex-wrap justify-between items-center gap-4 py-3 border-b">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-lg font-bold overflow-hidden">
            {channelAvatar ? (
              <img src={channelAvatar} alt={channelName} className="w-full h-full object-cover" />
            ) : (
              channelName.charAt(0)
            )}
          </div>
          <div>
            <h3 className="font-medium">{channelName}</h3>
            <p className="text-sm text-muted-foreground">{subscribers} subscribers</p>
          </div>
          <button className="ml-4 px-4 py-1.5 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary/90 transition-colors">
            Subscribe
          </button>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex rounded-full overflow-hidden bg-secondary">
            <button 
              onClick={() => handleLike(true)}
              className={`flex items-center gap-1 px-4 py-1.5 transition-colors ${
                userLikeStatus === 'like' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'hover:bg-secondary/80'
              }`}
            >
              <ThumbsUp size={18} className={userLikeStatus === 'like' ? 'fill-current' : ''} />
              <span className="text-sm font-medium">{likesCount}</span>
            </button>
            <div className="w-px bg-border h-full"></div>
            <button 
              onClick={() => handleLike(false)}
              className={`flex items-center gap-1 px-4 py-1.5 transition-colors ${
                userLikeStatus === 'dislike' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'hover:bg-secondary/80'
              }`}
            >
              <ThumbsDown size={18} className={userLikeStatus === 'dislike' ? 'fill-current' : ''} />
              {dislikesCount > 0 && <span className="text-sm font-medium">{dislikesCount}</span>}
            </button>
          </div>
          
          <button className="flex items-center gap-1 px-4 py-1.5 bg-secondary rounded-full hover:bg-secondary/80 transition-colors">
            <Share size={18} />
            <span className="text-sm font-medium">Share</span>
          </button>
          
          <button className="flex items-center gap-1 px-4 py-1.5 bg-secondary rounded-full hover:bg-secondary/80 transition-colors">
            <Download size={18} />
            <span className="text-sm font-medium">Download</span>
          </button>
          
          {videoId && (
            <WatchlistButton videoId={videoId} videoType="video" variant="full" size="sm" />
          )}
          
          <button className="p-2 rounded-full hover:bg-secondary transition-colors">
            <Flag size={18} />
          </button>
        </div>
      </div>
      
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3 mb-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-secondary px-1.5 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      
      <div className="mt-4 p-4 bg-secondary/50 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-medium">{views}</span>
          <span className="text-xs">•</span>
          <span>{timestamp}</span>
        </div>
      </div>
    </div>
  );
};
