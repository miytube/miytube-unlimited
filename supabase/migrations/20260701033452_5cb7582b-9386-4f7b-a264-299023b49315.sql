
-- Recreate view with SECURITY INVOKER to satisfy linter; enforce access via RLS + column grants
DROP VIEW IF EXISTS public.uploaded_videos_public;

CREATE VIEW public.uploaded_videos_public
WITH (security_invoker = true) AS
SELECT id, user_id, title, description, category, subcategory, tags, duration,
       thumbnail_url, video_url, cloud_url, is_cloud_stored, is_youtube_embed,
       youtube_video_id, file_name, file_size, file_type, views,
       created_at, updated_at, local_id
FROM public.uploaded_videos;

GRANT SELECT ON public.uploaded_videos_public TO anon, authenticated;

-- Restore public SELECT on base table, but only for non-sensitive columns
CREATE POLICY "Public can view uploaded videos"
ON public.uploaded_videos
FOR SELECT
USING (true);

REVOKE SELECT ON public.uploaded_videos FROM anon, authenticated;
GRANT SELECT (id, user_id, title, description, category, subcategory, tags, duration,
              thumbnail_url, video_url, cloud_url, is_cloud_stored, is_youtube_embed,
              youtube_video_id, file_name, file_size, file_type, views,
              created_at, updated_at, local_id)
ON public.uploaded_videos TO anon, authenticated;
GRANT ALL ON public.uploaded_videos TO service_role;
