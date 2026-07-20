ALTER VIEW public.uploaded_videos_public SET (security_invoker = true);
GRANT SELECT ON public.uploaded_videos_public TO anon, authenticated;