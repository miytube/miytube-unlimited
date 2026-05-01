
CREATE TABLE public.featured_discussion_video (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  video_url text NOT NULL,
  title text NOT NULL,
  description text,
  thumbnail_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_by uuid
);

ALTER TABLE public.featured_discussion_video ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view featured discussion video"
  ON public.featured_discussion_video FOR SELECT
  TO public USING (true);

CREATE POLICY "Admins can insert featured discussion video"
  ON public.featured_discussion_video FOR INSERT
  TO public WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update featured discussion video"
  ON public.featured_discussion_video FOR UPDATE
  TO public USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete featured discussion video"
  ON public.featured_discussion_video FOR DELETE
  TO public USING (has_role(auth.uid(), 'admin'::app_role));
