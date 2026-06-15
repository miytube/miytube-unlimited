GRANT SELECT ON public.video_likes TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.video_likes TO authenticated;
GRANT ALL ON public.video_likes TO service_role;