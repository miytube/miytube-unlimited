CREATE POLICY "Admins can delete any uploaded videos"
ON public.uploaded_videos
FOR DELETE
TO public
USING (public.has_role(auth.uid(), 'admin'::app_role));