
-- 1. active_sessions: tighten INSERT/UPDATE/DELETE
DROP POLICY IF EXISTS "Anyone can insert sessions" ON public.active_sessions;
DROP POLICY IF EXISTS "Session owner can update via header" ON public.active_sessions;
DROP POLICY IF EXISTS "Session owner can delete via header" ON public.active_sessions;

CREATE POLICY "Insert own session"
ON public.active_sessions FOR INSERT
WITH CHECK (
  (auth.uid() IS NULL AND user_id IS NULL)
  OR (auth.uid() IS NOT NULL AND user_id = auth.uid())
);

CREATE POLICY "Update own session"
ON public.active_sessions FOR UPDATE
USING (
  (
    auth.uid() IS NULL
    AND user_id IS NULL
    AND session_id = ((current_setting('request.headers', true))::json ->> 'x-session-id')
  )
  OR (auth.uid() IS NOT NULL AND user_id = auth.uid())
)
WITH CHECK (
  (auth.uid() IS NULL AND user_id IS NULL)
  OR (auth.uid() IS NOT NULL AND user_id = auth.uid())
);

CREATE POLICY "Delete own session"
ON public.active_sessions FOR DELETE
USING (
  (
    auth.uid() IS NULL
    AND user_id IS NULL
    AND session_id = ((current_setting('request.headers', true))::json ->> 'x-session-id')
  )
  OR (auth.uid() IS NOT NULL AND user_id = auth.uid())
);

-- 2. page_views: restrict INSERT
DROP POLICY IF EXISTS "Anyone can insert page views" ON public.page_views;
CREATE POLICY "Insert own page view"
ON public.page_views FOR INSERT
WITH CHECK (
  user_id IS NULL OR user_id = auth.uid()
);

-- 3. video_engagement_events: restrict INSERT
DROP POLICY IF EXISTS "Anyone can insert engagement events" ON public.video_engagement_events;
CREATE POLICY "Insert own engagement event"
ON public.video_engagement_events FOR INSERT
WITH CHECK (
  user_id IS NULL OR user_id = auth.uid()
);

-- 4. uploaded_videos.uploader_ip: revoke column-level SELECT from public roles
REVOKE SELECT (uploader_ip) ON public.uploaded_videos FROM anon, authenticated;

-- 5. Remove unsafe storage policies (overlap with the owner-scoped ones already in place)
DROP POLICY IF EXISTS "Users can delete own videos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own videos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own thumbnails" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own thumbnails" ON storage.objects;

-- 6. Realtime: stop broadcasting active_sessions changes
ALTER PUBLICATION supabase_realtime DROP TABLE public.active_sessions;

-- 7. Lock down SECURITY DEFINER pgmq wrapper functions (set search_path + revoke EXECUTE)
ALTER FUNCTION public.enqueue_email(text, jsonb) SET search_path = public, pgmq;
ALTER FUNCTION public.read_email_batch(text, integer, integer) SET search_path = public, pgmq;
ALTER FUNCTION public.delete_email(text, bigint) SET search_path = public, pgmq;
ALTER FUNCTION public.move_to_dlq(text, text, bigint, jsonb) SET search_path = public, pgmq;

REVOKE EXECUTE ON FUNCTION public.enqueue_email(text, jsonb) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.read_email_batch(text, integer, integer) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.delete_email(text, bigint) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.move_to_dlq(text, text, bigint, jsonb) FROM PUBLIC, anon, authenticated;
