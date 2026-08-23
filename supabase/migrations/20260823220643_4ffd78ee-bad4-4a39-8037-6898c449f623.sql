-- Tips table for creator tip jar
CREATE TABLE IF NOT EXISTS public.tips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payer_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  creator_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  video_id uuid REFERENCES public.uploaded_videos(id) ON DELETE SET NULL,
  amount_cents integer NOT NULL,
  currency text NOT NULL DEFAULT 'usd',
  stripe_payment_intent_id text,
  message text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'pending'
);

GRANT SELECT, INSERT ON public.tips TO authenticated;
GRANT ALL ON public.tips TO service_role;

ALTER TABLE public.tips ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Tips insert own" ON public.tips;
CREATE POLICY "Tips insert own" ON public.tips FOR INSERT TO authenticated WITH CHECK (payer_id = auth.uid());

DROP POLICY IF EXISTS "Tips select received" ON public.tips;
CREATE POLICY "Tips select received" ON public.tips FOR SELECT TO authenticated USING (creator_id = auth.uid() OR payer_id = auth.uid());

-- Link blog posts back to the video they were generated from
ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS generated_from_video_id uuid NULL REFERENCES public.uploaded_videos(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_blog_posts_generated_from_video_id
  ON public.blog_posts (generated_from_video_id);