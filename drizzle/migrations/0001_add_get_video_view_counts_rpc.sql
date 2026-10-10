CREATE OR REPLACE FUNCTION public.get_video_view_counts(_video_ids text[])
RETURNS TABLE(video_id text, views bigint)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT v.id::text,
         COALESCE(v.views, 0) + COUNT(e.id) AS views
    FROM public.uploaded_videos v
    LEFT JOIN public.video_engagement_events e
      ON e.video_id = v.id::text
     AND e.video_table = 'uploaded_videos'
     AND e.event_type = 'view'
   WHERE v.id::text = ANY(_video_ids)
   GROUP BY v.id, v.views
$function$;

GRANT EXECUTE ON FUNCTION public.get_video_view_counts(text[]) TO anon, authenticated;