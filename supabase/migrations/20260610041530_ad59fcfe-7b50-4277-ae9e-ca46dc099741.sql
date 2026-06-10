-- 1) Replace table-level SELECT with explicit column-level SELECT that excludes uploader_ip
REVOKE SELECT ON TABLE public.uploaded_videos FROM anon, authenticated, PUBLIC;

GRANT SELECT (id, user_id, title, description, category, subcategory, tags, duration, thumbnail_url, video_url, cloud_url, is_cloud_stored, is_youtube_embed, youtube_video_id, file_name, file_size, file_type, views, created_at, updated_at, local_id)
ON public.uploaded_videos TO anon, authenticated;

-- Service role keeps full access for admin/edge-function use
GRANT ALL ON public.uploaded_videos TO service_role;

-- 2) Tighten active_sessions UPDATE: drop anonymous branch that trusted the client-supplied x-session-id header
DROP POLICY IF EXISTS "Update own session" ON public.active_sessions;
CREATE POLICY "Update own session"
ON public.active_sessions
FOR UPDATE
TO authenticated
USING (auth.uid() IS NOT NULL AND user_id = auth.uid())
WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

-- Same for DELETE — remove anonymous spoof path
DROP POLICY IF EXISTS "Delete own session" ON public.active_sessions;
CREATE POLICY "Delete own session"
ON public.active_sessions
FOR DELETE
TO authenticated
USING (auth.uid() IS NOT NULL AND user_id = auth.uid());