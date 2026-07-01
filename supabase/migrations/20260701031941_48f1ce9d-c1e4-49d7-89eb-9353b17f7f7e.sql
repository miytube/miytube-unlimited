REVOKE SELECT ON public.uploaded_videos FROM anon, authenticated;
DROP POLICY IF EXISTS "Admins can view all uploaded videos" ON public.uploaded_videos;
DROP POLICY IF EXISTS "Users can view their own uploaded videos" ON public.uploaded_videos;