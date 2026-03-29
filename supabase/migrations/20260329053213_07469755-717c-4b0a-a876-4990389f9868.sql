
-- Tighten music_videos INSERT to require authentication
DROP POLICY IF EXISTS "Users can insert their own music videos" ON public.music_videos;
CREATE POLICY "Authenticated users can insert music videos" ON public.music_videos
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
