ALTER VIEW public.uploaded_videos_public SET (security_invoker = false);

GRANT SELECT ON public.uploaded_videos_public TO anon;
GRANT SELECT ON public.uploaded_videos_public TO authenticated;
GRANT ALL ON public.uploaded_videos_public TO service_role;