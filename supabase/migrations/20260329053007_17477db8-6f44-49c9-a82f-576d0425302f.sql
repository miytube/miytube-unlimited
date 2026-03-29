
-- Fix the security definer view issue
DROP VIEW IF EXISTS public.uploaded_videos_public;
CREATE VIEW public.uploaded_videos_public 
WITH (security_invoker = true) AS
SELECT id, user_id, is_cloud_stored, is_youtube_embed, file_size, views,
       created_at, updated_at, title, description, category, subcategory,
       tags, duration, thumbnail_url, video_url, cloud_url, youtube_video_id,
       file_name, file_type, local_id
FROM public.uploaded_videos;
