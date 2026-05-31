-- Hide uploader_ip from public Data API responses.
-- The SELECT policy on uploaded_videos is `true` (public read), but uploader_ip
-- is an internal anti-abuse signal and must never reach anon/authenticated clients.
REVOKE SELECT (uploader_ip) ON public.uploaded_videos FROM anon, authenticated;

-- Reaffirm column grants on every other column so `select=*` keeps working.
GRANT SELECT (
  id, user_id, title, description, category, subcategory, tags, duration,
  thumbnail_url, video_url, cloud_url, is_cloud_stored, is_youtube_embed,
  youtube_video_id, file_name, file_type, file_size, views, local_id,
  created_at, updated_at
) ON public.uploaded_videos TO anon, authenticated;