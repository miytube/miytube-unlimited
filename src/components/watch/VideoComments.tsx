import React, { useState, useEffect } from 'react';
import { MessageSquare, ThumbsUp, ThumbsDown, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

interface Comment {
  id: string;
  user_id: string;
  video_id: string;
  content: string;
  likes_count: number;
  created_at: string;
  user_liked?: boolean;
}

interface VideoCommentsProps {
  videoId: string;
}

export const VideoComments: React.FC<VideoCommentsProps> = ({ videoId }) => {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchComments();
    checkAuth();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('video-comments')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'video_comments',
          filter: `video_id=eq.${videoId}`,
        },
        () => {
          fetchComments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [videoId]);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUserId(user?.id || null);
  };

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('video_comments')
        .select('*')
        .eq('video_id', videoId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Check which comments the current user has liked
      const { data: { user } } = await supabase.auth.getUser();
      if (user && data) {
        const { data: likedComments } = await supabase
          .from('comment_likes')
          .select('comment_id')
          .eq('user_id', user.id);

        const likedIds = new Set(likedComments?.map(l => l.comment_id) || []);
        const commentsWithLikes = data.map(c => ({
          ...c,
          user_liked: likedIds.has(c.id)
        }));
        setComments(commentsWithLikes);
      } else {
        setComments(data || []);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to comment on videos.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('video_comments')
        .insert({
          user_id: user.id,
          video_id: videoId,
          content: comment.trim(),
        });

      if (error) throw error;

      setComment('');
      toast({
        title: "Comment added",
        description: "Your comment has been posted.",
      });
    } catch (error) {
      console.error('Error posting comment:', error);
      toast({
        title: "Error",
        description: "Failed to post comment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleLikeComment = async (commentId: string, currentlyLiked: boolean) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to like comments.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (currentlyLiked) {
        // Unlike
        await supabase
          .from('comment_likes')
          .delete()
          .eq('user_id', user.id)
          .eq('comment_id', commentId);

        // Update likes_count
        const comment = comments.find(c => c.id === commentId);
        if (comment) {
          await supabase
            .from('video_comments')
            .update({ likes_count: Math.max(0, comment.likes_count - 1) })
            .eq('id', commentId);
        }
      } else {
        // Like
        await supabase
          .from('comment_likes')
          .insert({ user_id: user.id, comment_id: commentId });

        // Update likes_count
        const comment = comments.find(c => c.id === commentId);
        if (comment) {
          await supabase
            .from('video_comments')
            .update({ likes_count: comment.likes_count + 1 })
            .eq('id', commentId);
        }
      }
      fetchComments();
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const { error } = await supabase
        .from('video_comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;

      toast({
        title: "Comment deleted",
        description: "Your comment has been removed.",
      });
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast({
        title: "Error",
        description: "Failed to delete comment.",
        variant: "destructive",
      });
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="mt-6 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare size={20} />
        <h3 className="font-medium">Comments</h3>
        <span className="text-sm text-muted-foreground">({comments.length})</span>
      </div>

      <form onSubmit={handleCommentSubmit} className="flex gap-3 mb-6">
        <div className="w-8 h-8 rounded-full bg-secondary flex-shrink-0 flex items-center justify-center text-sm">
          {currentUserId ? 'Y' : '?'}
        </div>
        <div className="w-full">
          <input
            type="text"
            placeholder={currentUserId ? "Add a comment..." : "Sign in to comment..."}
            className="w-full bg-transparent border-b border-border outline-none py-2 focus:border-primary transition-colors"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={!currentUserId}
          />
          {comment && (
            <div className="flex justify-end gap-2 mt-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setComment('')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={submitting}
              >
                {submitting ? 'Posting...' : 'Comment'}
              </Button>
            </div>
          )}
        </div>
      </form>

      {loading ? (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No comments yet. Be the first to comment!</p>
          ) : (
            comments.map((c) => (
              <div key={c.id} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary flex-shrink-0 flex items-center justify-center text-sm">
                  U
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">User</span>
                    <span className="text-xs text-muted-foreground">{formatTimeAgo(c.created_at)}</span>
                  </div>
                  <p className="text-sm mt-1">{c.content}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <button
                      onClick={() => handleLikeComment(c.id, c.user_liked || false)}
                      className={`flex items-center gap-1 text-sm transition-colors ${
                        c.user_liked ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <ThumbsUp size={14} className={c.user_liked ? 'fill-current' : ''} />
                      <span>{c.likes_count}</span>
                    </button>
                    <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                      <ThumbsDown size={14} />
                    </button>
                    <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      Reply
                    </button>
                    {currentUserId === c.user_id && (
                      <button
                        onClick={() => handleDeleteComment(c.id)}
                        className="text-sm text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
