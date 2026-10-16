import { supabase } from '@/integrations/supabase/client';
import { createVideoViewCountsStore } from './videoViewCountsStore';

export const videoViewCounts = createVideoViewCountsStore(async ids => {
  const { data, error } = await supabase.rpc('get_video_view_counts', { _video_ids: ids });
  if (error) throw error;
  return data ?? [];
});

if (typeof window !== 'undefined') {
  window.addEventListener('focus', videoViewCounts.schedule);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') videoViewCounts.schedule();
  });
}