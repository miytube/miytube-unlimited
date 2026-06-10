-- Restrict user_id column visibility on like tables so user-to-content linkage cannot be enumerated
REVOKE SELECT ON public.video_likes FROM anon, authenticated;
GRANT SELECT (id, video_id, is_like, created_at) ON public.video_likes TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.video_likes TO authenticated;

REVOKE SELECT ON public.comment_likes FROM anon, authenticated;
GRANT SELECT (id, comment_id, created_at) ON public.comment_likes TO anon, authenticated;
GRANT INSERT, DELETE ON public.comment_likes TO authenticated;

REVOKE SELECT ON public.discussion_likes FROM anon, authenticated;
GRANT SELECT (id, discussion_id, created_at) ON public.discussion_likes TO anon, authenticated;
GRANT INSERT, DELETE ON public.discussion_likes TO authenticated;

-- Service role keeps full access
GRANT ALL ON public.video_likes, public.comment_likes, public.discussion_likes TO service_role;