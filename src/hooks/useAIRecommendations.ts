import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface RecommendedVideo {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  category: string | null;
  views: number | null;
  created_at: string;
  cloud_url: string | null;
  video_url: string | null;
  duration: string | null;
}

export const useAIRecommendations = (
  videoId?: string,
  category?: string,
  tags?: string[]
) => {
  const [recommendations, setRecommendations] = useState<RecommendedVideo[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.functions.invoke('ai-recommendations', {
          body: { videoId, category, tags, limit: 8 },
        });

        if (error) {
          console.error('Recommendations error:', error);
          return;
        }

        setRecommendations(data?.recommendations || []);
      } catch (err) {
        console.error('Failed to fetch recommendations:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, [videoId, category]);

  return { recommendations, isLoading };
};
