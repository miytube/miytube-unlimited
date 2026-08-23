-- Add nullable reference from blog_posts to the uploaded video it was generated from.
ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS generated_from_video_id uuid NULL REFERENCES public.uploaded_videos(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_blog_posts_generated_from_video_id
  ON public.blog_posts (generated_from_video_id);
