
-- 1. Switch view to SECURITY INVOKER
ALTER VIEW public.uploaded_videos_public SET (security_invoker = true);

-- Ensure column-level grants so anon/authenticated can read via the view (excluding uploader_ip)
GRANT SELECT (id, user_id, title, description, category, subcategory, tags, duration, thumbnail_url, video_url, cloud_url, is_cloud_stored, is_youtube_embed, youtube_video_id, file_name, file_size, file_type, views, created_at, updated_at, local_id) ON public.uploaded_videos TO anon, authenticated;
REVOKE SELECT (uploader_ip) ON public.uploaded_videos FROM anon, authenticated;

-- Ensure a permissive base-table SELECT policy exists so the invoker-scoped view can read rows.
-- Column-level REVOKE above continues to protect uploader_ip.
DROP POLICY IF EXISTS "Public can view videos via public view" ON public.uploaded_videos;
CREATE POLICY "Public can view videos via public view"
  ON public.uploaded_videos FOR SELECT TO anon, authenticated USING (true);

-- 2. Scope active_sessions policies to explicit roles
DROP POLICY IF EXISTS "Admins can view all sessions" ON public.active_sessions;
CREATE POLICY "Admins can view all sessions"
  ON public.active_sessions FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Insert own session" ON public.active_sessions;
CREATE POLICY "Insert own session"
  ON public.active_sessions FOR INSERT TO anon, authenticated
  WITH CHECK (
    ((auth.uid() IS NULL) AND (user_id IS NULL))
    OR ((auth.uid() IS NOT NULL) AND (user_id = auth.uid()))
  );

-- 3. Scope email_send_state policy to service_role
DROP POLICY IF EXISTS "Service role can manage send state" ON public.email_send_state;
CREATE POLICY "Service role can manage send state"
  ON public.email_send_state FOR ALL TO service_role
  USING (true) WITH CHECK (true);
