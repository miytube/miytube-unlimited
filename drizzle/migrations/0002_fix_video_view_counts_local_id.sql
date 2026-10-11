CREATE OR REPLACE FUNCTION public.get_video_view_counts(_video_ids text[])
 RETURNS TABLE(video_id text, views bigint)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT COALESCE(v.local_id, v.id::text) AS video_id,
         COALESCE(v.views, 0) + COUNT(e.id) AS views
    FROM public.uploaded_videos v
    LEFT JOIN public.video_engagement_events e
      ON (e.video_id = v.id::text OR (v.local_id IS NOT NULL AND e.video_id = v.local_id))
     AND e.video_table = 'uploaded_videos'
     AND e.event_type = 'view'
   WHERE v.id::text = ANY(_video_ids)
      OR (v.local_id IS NOT NULL AND v.local_id = ANY(_video_ids))
   GROUP BY v.id, v.views, v.local_id
$function$;