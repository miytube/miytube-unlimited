
-- Recreate the public-facing view as SECURITY DEFINER (default) so it can read
-- the underlying uploaded_videos table on behalf of anon/authenticated users
-- without exposing uploader_ip. Base table SELECT remains revoked.
DROP VIEW IF EXISTS public.uploaded_videos_public;
CREATE VIEW public.uploaded_videos_public AS
SELECT id, user_id, is_cloud_stored, is_youtube_embed, file_size, views,
       created_at, updated_at, title, description, category, subcategory,
       tags, duration, thumbnail_url, video_url, cloud_url, youtube_video_id,
       file_name, file_type, local_id
FROM public.uploaded_videos;

ALTER VIEW public.uploaded_videos_public OWNER TO postgres;
GRANT SELECT ON public.uploaded_videos_public TO anon, authenticated;
GRANT ALL ON public.uploaded_videos_public TO service_role;
