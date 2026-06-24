
DROP POLICY IF EXISTS "Anyone can view uploaded videos" ON public.uploaded_videos;

CREATE POLICY "Users can view their own uploaded videos"
  ON public.uploaded_videos
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all uploaded videos"
  ON public.uploaded_videos
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
