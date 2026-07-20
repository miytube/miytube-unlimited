
DROP VIEW IF EXISTS public.uploaded_videos_public;

CREATE VIEW public.uploaded_videos_public
WITH (security_invoker = false, security_barrier = true) AS
SELECT
  id, user_id, title, description, category, subcategory, tags, duration,
  thumbnail_url, video_url, cloud_url, is_cloud_stored, is_youtube_embed,
  youtube_video_id, file_name, file_size, file_type, views,
  created_at, updated_at, local_id
FROM public.uploaded_videos;

ALTER VIEW public.uploaded_videos_public OWNER TO postgres;

GRANT SELECT ON public.uploaded_videos_public TO anon, authenticated;

DROP POLICY IF EXISTS "Public can view videos via public view" ON public.uploaded_videos;
DROP POLICY IF EXISTS "Public rows visible via column-grants only" ON public.uploaded_videos;
DROP POLICY IF EXISTS "Public can view uploaded videos" ON public.uploaded_videos;

REVOKE SELECT ON public.uploaded_videos FROM anon;
REVOKE SELECT ON public.uploaded_videos FROM authenticated;
