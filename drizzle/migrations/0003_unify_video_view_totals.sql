CREATE OR REPLACE FUNCTION public.get_video_view_counts(_video_ids text[])
RETURNS TABLE(video_id text, views bigint)
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $function$
  WITH requested AS (SELECT DISTINCT unnest(_video_ids) AS requested_id)
  SELECT r.requested_id AS video_id,
         GREATEST(COALESCE(v.views, 0)::bigint, (
           SELECT COUNT(*) FROM public.video_engagement_events e
           WHERE e.video_table = 'uploaded_videos' AND e.event_type = 'view'
             AND (e.video_id = v.id::text OR e.video_id = v.local_id)
         )) AS views
  FROM requested r
  JOIN public.uploaded_videos v ON r.requested_id = v.id::text OR r.requested_id = v.local_id
  UNION ALL
  SELECT r.requested_id AS video_id,
         GREATEST(COALESCE(m.views, 0)::bigint, (
           SELECT COUNT(*) FROM public.video_engagement_events e
           WHERE e.video_table = 'music_videos' AND e.event_type = 'view'
             AND e.video_id = m.id::text
         )) AS views
  FROM requested r
  JOIN public.music_videos m ON r.requested_id = m.id::text;
$function$;
GRANT EXECUTE ON FUNCTION public.get_video_view_counts(text[]) TO anon, authenticated, service_role;
COMMENT ON FUNCTION public.get_video_view_counts(text[]) IS 'Shared view totals: stored views already include trigger-counted events; never add them together. Return each requested UUID/local_id alias, including music videos.';