import { useState, useRef } from 'react';
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
  // Track the latest in-flight request so stale responses can't overwrite fresh ones
  const requestSeqRef = useRef(0);

  const search = async (
    query: string,
    options?: { category?: string; sortBy?: string; limit?: number }
  ): Promise<AISearchResults | null> => {
    if (!query.trim()) return null;

    const mySeq = ++requestSeqRef.current;
    setIsSearching(true);
    setError(null);

    try {
      // AI search requires authentication — skip silently for anonymous users
      // and let the local fallback handle results.
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        if (mySeq === requestSeqRef.current) setResults(null);
        return null;
      }

      const { data, error: fnError } = await supabase.functions.invoke('ai-search', {
        body: {
          query,
          category: options?.category,
          sortBy: options?.sortBy || 'relevance',
          limit: options?.limit || 20,
        },
      });

      if (mySeq !== requestSeqRef.current) return null;

      if (fnError) {
        console.error('AI search error:', fnError);
        // Don't surface as a hard error — local results still render.
        return null;
      }

      setResults(data);
      return data;
    } catch (err) {
      if (mySeq !== requestSeqRef.current) return null;
      console.error('AI search failed:', err);
      return null;
    } finally {
      if (mySeq === requestSeqRef.current) {
        setIsSearching(false);
      }
    }
  };

  return { search, isSearching, results, error, setResults };
};
