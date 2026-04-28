-- Function to increment views on the right table when a 'view' event is inserted
CREATE OR REPLACE FUNCTION public.increment_video_views_on_event()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.event_type <> 'view' THEN
    RETURN NEW;
  END IF;

  IF NEW.video_table = 'uploaded_videos' THEN
    -- video_id from client is the local_id (e.g. 'upload-1766...'), not the UUID
    UPDATE public.uploaded_videos
       SET views = COALESCE(views, 0) + 1
     WHERE local_id = NEW.video_id
        OR id::text = NEW.video_id;
  ELSIF NEW.video_table = 'music_videos' THEN
    UPDATE public.music_videos
       SET views = COALESCE(views, 0) + 1
     WHERE id::text = NEW.video_id;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_increment_video_views ON public.video_engagement_events;
CREATE TRIGGER trg_increment_video_views
AFTER INSERT ON public.video_engagement_events
FOR EACH ROW
EXECUTE FUNCTION public.increment_video_views_on_event();

-- Backfill existing uploaded_videos view counts from past events
WITH counts AS (
  SELECT video_id, COUNT(*)::int AS c
    FROM public.video_engagement_events
   WHERE event_type = 'view' AND video_table = 'uploaded_videos'
   GROUP BY video_id
)
UPDATE public.uploaded_videos uv
   SET views = counts.c
  FROM counts
 WHERE uv.local_id = counts.video_id
    OR uv.id::text = counts.video_id;

-- Backfill music_videos view counts
WITH counts AS (
  SELECT video_id, COUNT(*)::int AS c
    FROM public.video_engagement_events
   WHERE event_type = 'view' AND video_table = 'music_videos'
   GROUP BY video_id
)
UPDATE public.music_videos mv
   SET views = GREATEST(mv.views, counts.c)
  FROM counts
 WHERE mv.id::text = counts.video_id;