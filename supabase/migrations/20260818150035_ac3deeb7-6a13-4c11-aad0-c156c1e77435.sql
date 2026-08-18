CREATE TABLE public.cha_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  site text NOT NULL DEFAULT 'miytube',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, site)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cha_conversations TO authenticated;
GRANT ALL ON public.cha_conversations TO service_role;
ALTER TABLE public.cha_conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own conversation select" ON public.cha_conversations FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own conversation insert" ON public.cha_conversations FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own conversation update" ON public.cha_conversations FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own conversation delete" ON public.cha_conversations FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TABLE public.cha_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES public.cha_conversations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user','assistant','system')),
  parts jsonb NOT NULL DEFAULT '[]'::jsonb,
  message_key text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX cha_messages_conversation_idx ON public.cha_messages (conversation_id, created_at);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cha_messages TO authenticated;
GRANT ALL ON public.cha_messages TO service_role;
ALTER TABLE public.cha_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own messages select" ON public.cha_messages FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own messages insert" ON public.cha_messages FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own messages delete" ON public.cha_messages FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TABLE public.cha_rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  emoji text NOT NULL DEFAULT '💬',
  description text,
  topic text,
  site text NOT NULL DEFAULT 'miytube',
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.cha_rooms TO anon, authenticated;
GRANT ALL ON public.cha_rooms TO service_role;
ALTER TABLE public.cha_rooms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "rooms are public" ON public.cha_rooms FOR SELECT TO anon, authenticated USING (is_active);

CREATE TABLE public.cha_room_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid NOT NULL REFERENCES public.cha_rooms(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name text NOT NULL,
  role text NOT NULL DEFAULT 'user' CHECK (role IN ('user','assistant')),
  content text NOT NULL CHECK (char_length(content) BETWEEN 1 AND 4000),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX cha_room_messages_room_idx ON public.cha_room_messages (room_id, created_at);
GRANT SELECT ON public.cha_room_messages TO anon, authenticated;
GRANT INSERT, DELETE ON public.cha_room_messages TO authenticated;
GRANT ALL ON public.cha_room_messages TO service_role;
ALTER TABLE public.cha_room_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "room messages are public" ON public.cha_room_messages FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "members post as themselves" ON public.cha_room_messages FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id AND role = 'user');
CREATE POLICY "members delete own room messages" ON public.cha_room_messages FOR DELETE TO authenticated USING (auth.uid() = user_id);

ALTER TABLE public.cha_room_messages REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.cha_room_messages;

INSERT INTO public.cha_rooms (slug, name, emoji, description, topic, sort_order) VALUES
  ('the-lounge','The Lounge','🛋️','Anything goes. Say what''s on your mind.','open casual conversation', 1),
  ('music-room','Music Room','🎧','Songs, artists, playlists, hot takes.','music, artists and playlists', 2),
  ('sports-bar','Sports Bar','🏈','Games, fights, highlights, arguments.','sports, games and highlights', 3),
  ('news-desk','News Desk','📰','What''s happening and how it hits you.','news and current events', 4),
  ('late-night','Late Night','🌙','Deep thoughts after dark.','late night thoughts and venting', 5);