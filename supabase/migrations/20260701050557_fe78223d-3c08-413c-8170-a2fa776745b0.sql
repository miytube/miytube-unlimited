-- 1. Switch view to security_invoker so it enforces the caller's RLS.
ALTER VIEW public.uploaded_videos_public SET (security_invoker = on);

-- 2. Grant column-level SELECT on non-sensitive columns only (uploader_ip stays private).
GRANT SELECT (
  id, user_id, local_id, title, description, category, subcategory, tags,
  duration, thumbnail_url, video_url, cloud_url, is_cloud_stored,
  is_youtube_embed, youtube_video_id, file_name, file_size, file_type,
  views, created_at, updated_at
) ON public.uploaded_videos TO anon, authenticated;

GRANT SELECT ON public.uploaded_videos_public TO anon, authenticated;
GRANT ALL ON public.uploaded_videos TO service_role;

-- 3. Add a public SELECT policy on the base table so the invoker view returns rows.
--    Column privileges above prevent uploader_ip from being read by anon/authenticated.
DROP POLICY IF EXISTS "Public can view uploaded videos" ON public.uploaded_videos;
CREATE POLICY "Public can view uploaded videos"
  ON public.uploaded_videos
  FOR SELECT
  TO anon, authenticated
  USING (true);