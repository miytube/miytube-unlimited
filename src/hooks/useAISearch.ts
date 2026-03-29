import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SearchResult {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  category: string | null;
  subcategory: string | null;
  views: number | null;
  created_at: string;
  cloud_url: string | null;
  video_url: string | null;
  tags: string[] | null;
  duration: string | null;
}

interface AISearchResults {
  videos: SearchResult[];
  musicVideos: SearchResult[];
  searchIntent: string;
  detectedCategory: string | null;
  totalResults: number;
}

export const useAISearch = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<AISearchResults | null>(null);
  const [error, setError] = useState<string | null>(null);

  const search = async (
    query: string,
    options?: { category?: string; sortBy?: string; limit?: number }
  ): Promise<AISearchResults | null> => {
    if (!query.trim()) return null;

    setIsSearching(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('ai-search', {
        body: {
          query,
          category: options?.category,
          sortBy: options?.sortBy || 'relevance',
          limit: options?.limit || 20,
        },
      });

      if (fnError) {
        console.error('AI search error:', fnError);
        setError('Search failed. Please try again.');
        return null;
      }

      setResults(data);
      return data;
    } catch (err) {
      console.error('AI search failed:', err);
      setError('Search unavailable. Please try again later.');
      return null;
    } finally {
      setIsSearching(false);
    }
  };

  return { search, isSearching, results, error, setResults };
};
