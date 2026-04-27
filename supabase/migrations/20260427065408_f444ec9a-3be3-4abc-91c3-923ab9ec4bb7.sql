-- Track per-event engagement so we can chart over time and count clicks
CREATE TABLE IF NOT EXISTS public.video_engagement_events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  video_id text NOT NULL,
  video_table text NOT NULL DEFAULT 'uploaded_videos', -- 'uploaded_videos' | 'music_videos'
  event_type text NOT NULL, -- 'view' | 'click' | 'like' | 'share'
  user_id uuid,
  session_id text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_vee_created_at ON public.video_engagement_events (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_vee_video ON public.video_engagement_events (video_id);
CREATE INDEX IF NOT EXISTS idx_vee_type ON public.video_engagement_events (event_type);

ALTER TABLE public.video_engagement_events ENABLE ROW LEVEL SECURITY;

-- Anyone can record an event (anonymous viewers count too)
CREATE POLICY "Anyone can insert engagement events"
ON public.video_engagement_events
FOR INSERT
WITH CHECK (true);

-- Only admins can read raw events
CREATE POLICY "Admins can view all engagement events"
ON public.video_engagement_events
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));
