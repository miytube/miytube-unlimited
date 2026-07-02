DROP POLICY IF EXISTS "Public can view uploaded videos" ON public.uploaded_videos;
REVOKE SELECT ON public.uploaded_videos FROM anon, authenticated;
GRANT SELECT (id, user_id, local_id, title, description, category, subcategory, tags, duration, thumbnail_url, video_url, cloud_url, is_cloud_stored, is_youtube_embed, youtube_video_id, file_name, file_size, file_type, views, created_at, updated_at) ON public.uploaded_videos TO anon, authenticated;
CREATE POLICY "Public can view uploaded videos (no ip)" ON public.uploaded_videos FOR SELECT TO anon, authenticated USING (true);