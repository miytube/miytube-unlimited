
-- Discussions
CREATE TABLE public.discussions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  author_name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'General',
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.discussions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.discussions TO authenticated;
GRANT ALL ON public.discussions TO service_role;
ALTER TABLE public.discussions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view discussions" ON public.discussions FOR SELECT USING (true);
CREATE POLICY "Authenticated can create discussions" ON public.discussions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Author or admin can update discussions" ON public.discussions FOR UPDATE TO authenticated USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Author or admin can delete discussions" ON public.discussions FOR DELETE TO authenticated USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_discussions_updated_at BEFORE UPDATE ON public.discussions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Replies
CREATE TABLE public.discussion_replies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  discussion_id UUID NOT NULL REFERENCES public.discussions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  author_name TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.discussion_replies TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.discussion_replies TO authenticated;
GRANT ALL ON public.discussion_replies TO service_role;
ALTER TABLE public.discussion_replies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view replies" ON public.discussion_replies FOR SELECT USING (true);
CREATE POLICY "Authenticated can create replies" ON public.discussion_replies FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Author or admin can update replies" ON public.discussion_replies FOR UPDATE TO authenticated USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Author or admin can delete replies" ON public.discussion_replies FOR DELETE TO authenticated USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_discussion_replies_updated_at BEFORE UPDATE ON public.discussion_replies
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_discussion_replies_discussion_id ON public.discussion_replies(discussion_id);

-- Likes
CREATE TABLE public.discussion_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  discussion_id UUID NOT NULL REFERENCES public.discussions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (discussion_id, user_id)
);
GRANT SELECT ON public.discussion_likes TO anon;
GRANT SELECT, INSERT, DELETE ON public.discussion_likes TO authenticated;
GRANT ALL ON public.discussion_likes TO service_role;
ALTER TABLE public.discussion_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view discussion likes" ON public.discussion_likes FOR SELECT USING (true);
CREATE POLICY "Authenticated can like" ON public.discussion_likes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "User can remove own like" ON public.discussion_likes FOR DELETE TO authenticated USING (auth.uid() = user_id);
