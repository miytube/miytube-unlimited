CREATE POLICY "Owners and admins can delete music videos"
ON public.music_videos
FOR DELETE
TO authenticated
USING ((auth.uid() = user_id) OR has_role(auth.uid(), 'admin'::app_role));