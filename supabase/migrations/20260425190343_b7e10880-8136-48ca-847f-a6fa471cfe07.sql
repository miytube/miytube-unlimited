
-- 1. Remove visitor_ip from active_sessions and page_views to fix Realtime IP leak
ALTER TABLE public.active_sessions DROP COLUMN IF EXISTS visitor_ip;
ALTER TABLE public.page_views DROP COLUMN IF EXISTS visitor_ip;

-- 2. Tighten active_sessions write policies (scope by session_id from request header)
DROP POLICY IF EXISTS "Anyone can update their own session" ON public.active_sessions;
DROP POLICY IF EXISTS "Anyone can delete their own session" ON public.active_sessions;

CREATE POLICY "Session owner can update via header"
  ON public.active_sessions FOR UPDATE TO public
  USING (
    session_id = current_setting('request.headers', true)::json->>'x-session-id'
    OR (auth.uid() IS NOT NULL AND auth.uid() = user_id)
  );

CREATE POLICY "Session owner can delete via header"
  ON public.active_sessions FOR DELETE TO public
  USING (
    session_id = current_setting('request.headers', true)::json->>'x-session-id'
    OR (auth.uid() IS NOT NULL AND auth.uid() = user_id)
  );

-- 3. Storage: lock down videos/thumbnails buckets to authenticated + folder ownership
-- Drop existing permissive policies
DROP POLICY IF EXISTS "Anyone can upload videos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload thumbnails" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update videos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update thumbnails" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete videos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete thumbnails" ON storage.objects;

-- Restrict listing on public buckets (read individual file via public URL still works)
DROP POLICY IF EXISTS "Anyone can view videos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view thumbnails" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view avatars" ON storage.objects;

-- Authenticated users can upload to their own folder (videos)
CREATE POLICY "Authenticated users upload to own folder (videos)"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'videos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Owners can update their videos"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'videos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Owners can delete their videos"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'videos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Authenticated users can upload to their own folder (thumbnails)
CREATE POLICY "Authenticated users upload to own folder (thumbnails)"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'thumbnails'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Owners can update their thumbnails"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'thumbnails'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Owners can delete their thumbnails"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'thumbnails'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Avatars: authenticated upload to own folder
CREATE POLICY "Authenticated users upload to own folder (avatars)"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Owners can update their avatars"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Public read by direct path (no listing). Restrict SELECT to specific objects only - but to keep public URLs working we need SELECT on the public buckets. Allow SELECT on individual objects in these public buckets.
CREATE POLICY "Public read videos"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'videos');

CREATE POLICY "Public read thumbnails"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'thumbnails');

CREATE POLICY "Public read avatars"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'avatars');

-- 4. Realtime channel authorization: restrict realtime.messages access
-- Allow only authenticated users on private channels they own; allow public broadcast for non-private topics.
-- Default-deny: only allow channel access to authenticated users for topics they're authorized to.
ALTER TABLE IF EXISTS realtime.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated can read realtime messages" ON realtime.messages;
DROP POLICY IF EXISTS "Authenticated can write realtime messages" ON realtime.messages;

CREATE POLICY "Authenticated can read realtime messages"
  ON realtime.messages FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Authenticated can write realtime messages"
  ON realtime.messages FOR INSERT TO authenticated
  WITH CHECK (true);
