
-- 1) Restrict likes SELECT policies to the owner only
DROP POLICY IF EXISTS "Anyone can view video likes" ON public.video_likes;
DROP POLICY IF EXISTS "Anyone can view comment likes" ON public.comment_likes;
DROP POLICY IF EXISTS "Anyone can view discussion likes" ON public.discussion_likes;

CREATE POLICY "Users can view their own video likes"
  ON public.video_likes FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own comment likes"
  ON public.comment_likes FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own discussion likes"
  ON public.discussion_likes FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- 2) SECURITY DEFINER aggregate functions so public can still see counts (no per-user data)
CREATE OR REPLACE FUNCTION public.get_video_like_counts(_video_ids text[])
RETURNS TABLE(video_id text, likes bigint, dislikes bigint)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT video_id,
         COUNT(*) FILTER (WHERE is_like) AS likes,
         COUNT(*) FILTER (WHERE NOT is_like) AS dislikes
    FROM public.video_likes
   WHERE video_id = ANY(_video_ids)
   GROUP BY video_id
$$;

CREATE OR REPLACE FUNCTION public.get_discussion_like_counts(_discussion_ids uuid[])
RETURNS TABLE(discussion_id uuid, likes bigint)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT discussion_id, COUNT(*) AS likes
    FROM public.discussion_likes
   WHERE discussion_id = ANY(_discussion_ids)
   GROUP BY discussion_id
$$;

GRANT EXECUTE ON FUNCTION public.get_video_like_counts(text[]) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_discussion_like_counts(uuid[]) TO anon, authenticated;

-- 3) Prevent direct reads of uploader_ip on uploaded_videos by client roles.
-- Clients must use the uploaded_videos_public view; only service_role keeps full column access.
REVOKE SELECT (uploader_ip) ON public.uploaded_videos FROM anon, authenticated;
