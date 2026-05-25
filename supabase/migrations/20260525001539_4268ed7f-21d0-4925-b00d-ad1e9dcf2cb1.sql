CREATE TABLE public.blocked_uploads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  file_name TEXT NOT NULL,
  file_size BIGINT,
  title TEXT,
  category TEXT,
  subcategory TEXT,
  reason TEXT NOT NULL,
  details TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.blocked_uploads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own blocked uploads"
  ON public.blocked_uploads FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all blocked uploads"
  ON public.blocked_uploads FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can insert their own blocked uploads"
  ON public.blocked_uploads FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can delete their own blocked uploads"
  ON public.blocked_uploads FOR DELETE
  USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX idx_blocked_uploads_user_created ON public.blocked_uploads(user_id, created_at DESC);