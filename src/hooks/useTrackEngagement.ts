import { supabase } from '@/integrations/supabase/client';

type EventType = 'view' | 'click' | 'like' | 'share' | 'play';
type VideoTable = 'uploaded_videos' | 'music_videos' | 'featured_discussion_video';

const getSessionId = (): string => {
  const stored = sessionStorage.getItem('analytics_session_id');
  if (stored) return stored;
  const newId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  sessionStorage.setItem('analytics_session_id', newId);
  return newId;
};

/**
 * Fire-and-forget engagement event recorder.
 * Use for views, clicks, likes, shares on videos/audio.
 */
export const trackEngagement = async (
  videoId: string,
  eventType: EventType,
  videoTable: VideoTable = 'uploaded_videos'
): Promise<void> => {
  if (!videoId) return;
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    await supabase.from('video_engagement_events').insert({
      video_id: videoId,
      video_table: videoTable,
      event_type: eventType,
      user_id: sessionData?.session?.user?.id || null,
      session_id: getSessionId(),
    });
  } catch (err) {
    // non-blocking
    console.warn('engagement track failed', err);
  }
};
