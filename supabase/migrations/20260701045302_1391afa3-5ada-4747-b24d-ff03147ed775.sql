
-- 1. Drop the permissive public SELECT policy that exposed uploader_ip
DROP POLICY IF EXISTS "Public can view uploaded videos" ON public.uploaded_videos;

-- 2. Add scoped SELECT policies on the base table
DROP POLICY IF EXISTS "Users can view their own uploaded videos" ON public.uploaded_videos;
CREATE POLICY "Users can view their own uploaded videos"
  ON public.uploaded_videos FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all uploaded videos" ON public.uploaded_videos;
CREATE POLICY "Admins can view all uploaded videos"
  ON public.uploaded_videos FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 3. Grants: authenticated needs base-table SELECT for own-row queries; anon does not.
REVOKE SELECT ON public.uploaded_videos FROM anon;
GRANT SELECT ON public.uploaded_videos TO authenticated;
GRANT ALL ON public.uploaded_videos TO service_role;

-- 4. Recreate the public view as SECURITY DEFINER so anon/authenticated can browse
--    the catalog without direct base-table access. The view definition excludes
--    uploader_ip, so IP addresses remain unreachable through the view.
DROP VIEW IF EXISTS public.uploaded_videos_public;
CREATE VIEW public.uploaded_videos_public
WITH (security_invoker = false) AS
  SELECT id, user_id, title, description, category, subcategory, tags,
         duration, thumbnail_url, video_url, cloud_url, is_cloud_stored,
         is_youtube_embed, youtube_video_id, file_name, file_size, file_type,
         views, created_at, updated_at, local_id
  FROM public.uploaded_videos;

ALTER VIEW public.uploaded_videos_public OWNER TO postgres;
GRANT SELECT ON public.uploaded_videos_public TO anon, authenticated;
GRANT ALL ON public.uploaded_videos_public TO service_role;

-- 5. Duplicate-detection RPC so client uploads can still check for existing
--    files by IP without exposing uploader_ip to callers.
CREATE OR REPLACE FUNCTION public.check_upload_duplicate_by_ip(
  _uploader_ip text,
  _file_name text,
  _file_size bigint,
  _category text,
  _subcategory text
) RETURNS TABLE(id uuid, title text, file_name text, file_size bigint, category text, subcategory text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT v.id, v.title, v.file_name, v.file_size, v.category, v.subcategory
    FROM public.uploaded_videos v
   WHERE v.uploader_ip = _uploader_ip
     AND v.file_name = _file_name
     AND v.file_size = _file_size
     AND v.category IS NOT DISTINCT FROM _category
     AND v.subcategory IS NOT DISTINCT FROM _subcategory
   LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.check_upload_duplicate_by_ip(text, text, bigint, text, text) FROM public;
GRANT EXECUTE ON FUNCTION public.check_upload_duplicate_by_ip(text, text, bigint, text, text) TO authenticated, service_role;
