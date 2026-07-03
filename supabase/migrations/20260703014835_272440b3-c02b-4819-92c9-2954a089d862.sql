-- Explicitly grant SELECT on every column of uploaded_videos EXCEPT uploader_ip
-- to anon and authenticated. service_role retains full access.
GRANT SELECT (
  id, user_id, title, description, category, subcategory, tags, duration,
  thumbnail_url, video_url, cloud_url, is_cloud_stored, is_youtube_embed,
  youtube_video_id, file_name, file_size, file_type, views, created_at,
  updated_at, local_id
) ON public.uploaded_videos TO anon, authenticated;

-- Ensure uploader_ip has no SELECT privilege for anon/authenticated
REVOKE SELECT (uploader_ip) ON public.uploaded_videos FROM anon, authenticated;
