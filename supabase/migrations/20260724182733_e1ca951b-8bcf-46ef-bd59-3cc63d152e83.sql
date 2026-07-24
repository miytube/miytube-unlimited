
-- Switch view from SECURITY DEFINER to SECURITY INVOKER, and add a
-- public SELECT policy on the base table that excludes IP exposure by
-- restricting the anon/authenticated SELECT grants to non-IP columns only.

ALTER VIEW public.uploaded_videos_public SET (security_invoker = true);

-- Ensure public reads work through the view without exposing uploader_ip.
-- Revoke any prior column privileges and re-grant only the safe columns.
REVOKE ALL ON TABLE public.uploaded_videos FROM anon, authenticated;

GRANT SELECT (
  id, user_id, title, description, category, subcategory, tags, duration,
  thumbnail_url, video_url, cloud_url, is_cloud_stored, is_youtube_embed,
  youtube_video_id, file_name, file_size, file_type, views,
  created_at, updated_at, local_id
) ON public.uploaded_videos TO anon, authenticated;

GRANT INSERT, UPDATE, DELETE ON public.uploaded_videos TO authenticated;
GRANT ALL ON public.uploaded_videos TO service_role;

-- Public SELECT policy (column-level grants above prevent IP leak).
DROP POLICY IF EXISTS "Public can view non-ip video fields" ON public.uploaded_videos;
CREATE POLICY "Public can view non-ip video fields"
  ON public.uploaded_videos
  FOR SELECT
  TO anon, authenticated
  USING (true);
