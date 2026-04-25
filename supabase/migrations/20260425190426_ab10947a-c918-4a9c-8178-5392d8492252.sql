
-- Drop broad public read policies on storage; public buckets still serve files via direct URL
DROP POLICY IF EXISTS "Public read videos" ON storage.objects;
DROP POLICY IF EXISTS "Public read thumbnails" ON storage.objects;
DROP POLICY IF EXISTS "Public read avatars" ON storage.objects;

-- Tighten realtime.messages policies (drop true-based ones)
DROP POLICY IF EXISTS "Authenticated can read realtime messages" ON realtime.messages;
DROP POLICY IF EXISTS "Authenticated can write realtime messages" ON realtime.messages;

-- Authenticated users can subscribe/publish to channels they're authorized for.
-- Scope by topic prefix matching auth.uid() OR by allowing standard public table-change channels.
-- Allow read access only to authenticated users on topics that are public table-change broadcasts
-- (Supabase uses topic 'realtime:public:<table>' or similar). We restrict to authenticated users only.
CREATE POLICY "Authenticated read own or public topics"
  ON realtime.messages FOR SELECT TO authenticated
  USING (
    -- Allow access to standard postgres_changes broadcasts (public schema tables)
    extension = 'postgres_changes'
    OR (extension = 'broadcast' AND topic LIKE auth.uid()::text || '%')
    OR (extension = 'presence' AND topic LIKE auth.uid()::text || '%')
  );

CREATE POLICY "Authenticated write to own topics"
  ON realtime.messages FOR INSERT TO authenticated
  WITH CHECK (
    extension = 'postgres_changes'
    OR (extension = 'broadcast' AND topic LIKE auth.uid()::text || '%')
    OR (extension = 'presence' AND topic LIKE auth.uid()::text || '%')
  );
