import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface WatchlistItem {
  id: string;
  video_id: string;
  video_type: string;
  created_at: string;
}

export const useWatchlist = (userId: string | undefined) => {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchWatchlist = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('watchlist')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching watchlist:', error);
    } else {
      setWatchlist(data || []);
    }
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchWatchlist();
  }, [fetchWatchlist]);

  const isInWatchlist = useCallback((videoId: string) => {
    return watchlist.some(item => item.video_id === videoId);
  }, [watchlist]);

  const addToWatchlist = async (videoId: string, videoType: string = 'video') => {
    if (!userId) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add videos to your watchlist",
        variant: "destructive"
      });
      return false;
    }

    const { error } = await supabase
      .from('watchlist')
      .insert({ user_id: userId, video_id: videoId, video_type: videoType });

    if (error) {
      if (error.code === '23505') {
        toast({
          title: "Already in watchlist",
          description: "This video is already in your watchlist"
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to add to watchlist",
          variant: "destructive"
        });
      }
      return false;
    }

    toast({
      title: "Added to watchlist",
      description: "Video added to your watchlist"
    });
    await fetchWatchlist();
    return true;
  };

  const removeFromWatchlist = async (videoId: string) => {
    if (!userId) return false;

    const { error } = await supabase
      .from('watchlist')
      .delete()
      .eq('user_id', userId)
      .eq('video_id', videoId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to remove from watchlist",
        variant: "destructive"
      });
      return false;
    }

    toast({
      title: "Removed from watchlist",
      description: "Video removed from your watchlist"
    });
    await fetchWatchlist();
    return true;
  };

  const toggleWatchlist = async (videoId: string, videoType: string = 'video') => {
    if (isInWatchlist(videoId)) {
      return removeFromWatchlist(videoId);
    } else {
      return addToWatchlist(videoId, videoType);
    }
  };

  return {
    watchlist,
    loading,
    isInWatchlist,
    addToWatchlist,
    removeFromWatchlist,
    toggleWatchlist,
    refetch: fetchWatchlist
  };
};
