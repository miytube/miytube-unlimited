import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

/**
 * Fetches real view counts (from video_engagement_events) for a list of
 * video ids. The stored `views` column on videos stays 0, so listing pages
 * should use this instead of video.views.
 *
 * Returns a map of videoId -> view count, plus a helper `viewsFor` that
 * falls back to the video's stored views string while counts load.
 */
export const useVideoViewCounts = (ids: string[]) => {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const key = ids.join(',');

  useEffect(() => {
    const list = key ? key.split(',') : [];
    if (list.length === 0) return;
    (async () => {
      const { data } = await supabase.rpc('get_video_view_counts', { _video_ids: list });
      const map: Record<string, number> = {};
      (data || []).forEach((row: any) => {
        map[row.video_id] = Number(row.views ?? 0);
      });
      setCounts((prev) => ({ ...prev, ...map }));
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const viewsFor = (id: string, fallback: string) =>
    counts[id] !== undefined ? String(counts[id]) : fallback;

  return { counts, viewsFor };
};
