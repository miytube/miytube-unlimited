
-- Switch view to SECURITY INVOKER so it respects the querying user's RLS
ALTER VIEW public.uploaded_videos_public SET (security_invoker = true);

-- Ensure the view can be read by public browsers
GRANT SELECT ON public.uploaded_videos_public TO anon, authenticated;

-- Add a public SELECT policy on the base table so invoker-mode view returns rows,
-- but restrict column visibility via column-level GRANTs (uploader_ip excluded).
DROP POLICY IF EXISTS "Public can read non-sensitive video columns" ON public.uploaded_videos;
CREATE POLICY "Public can read non-sensitive video columns"
  ON public.uploaded_videos
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Revoke any prior blanket table SELECT, then grant only non-sensitive columns
REVOKE SELECT ON public.uploaded_videos FROM anon, authenticated;
GRANT SELECT (
  id, user_id, title, description, category, subcategory, tags, duration,
  thumbnail_url, video_url, cloud_url, is_cloud_stored, is_youtube_embed,
  youtube_video_id, file_name, file_size, file_type, views,
  created_at, updated_at, local_id
) ON public.uploaded_videos TO anon, authenticated;
