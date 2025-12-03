import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface FeaturedMusicVideo {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  video_url: string | null;
  category: string | null;
  duration: string | null;
  views: number;
  likes: number;
  shares: number;
  featured_score: number;
  thumbnail_quality_score: number;
  content_clarity_score: number;
  title_effectiveness_score: number;
  click_through_rate: number;
  conversion_rate: number;
}

export const useFeaturedMusicVideo = () => {
  const [featuredVideo, setFeaturedVideo] = useState<FeaturedMusicVideo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedVideo = async () => {
      try {
        setLoading(true);
        
        // Get the video with the highest featured_score
        const { data, error: fetchError } = await supabase
          .from('music_videos')
          .select('*')
          .order('featured_score', { ascending: false })
          .limit(1)
          .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
          throw fetchError;
        }

        setFeaturedVideo(data as FeaturedMusicVideo | null);
      } catch (err) {
        console.error('Error fetching featured video:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch featured video');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedVideo();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('music-videos-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'music_videos'
        },
        () => {
          fetchFeaturedVideo();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const trackView = async (videoId: string) => {
    const { error } = await supabase
      .from('music_videos')
      .update({ views: (featuredVideo?.views || 0) + 1 })
      .eq('id', videoId);
    if (error) console.error('Error tracking view:', error);
  };

  const trackLike = async (videoId: string) => {
    const { error } = await supabase
      .from('music_videos')
      .update({ likes: (featuredVideo?.likes || 0) + 1 })
      .eq('id', videoId);
    if (error) console.error('Error tracking like:', error);
  };

  const trackShare = async (videoId: string) => {
    const { error } = await supabase
      .from('music_videos')
      .update({ shares: (featuredVideo?.shares || 0) + 1 })
      .eq('id', videoId);
    if (error) console.error('Error tracking share:', error);
  };

  return { featuredVideo, loading, error, trackView, trackLike, trackShare };
};
