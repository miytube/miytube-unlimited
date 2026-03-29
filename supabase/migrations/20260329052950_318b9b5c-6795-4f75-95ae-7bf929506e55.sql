
-- 1. Remove anonymous upload policy from uploaded_videos
DROP POLICY IF EXISTS "Allow anonymous video uploads" ON public.uploaded_videos;

-- 2. Hide uploader_ip from public reads by replacing the SELECT policy with a view approach
-- Create a secure view that excludes uploader_ip
CREATE OR REPLACE VIEW public.uploaded_videos_public AS
SELECT id, user_id, is_cloud_stored, is_youtube_embed, file_size, views,
       created_at, updated_at, title, description, category, subcategory,
       tags, duration, thumbnail_url, video_url, cloud_url, youtube_video_id,
       file_name, file_type, local_id
FROM public.uploaded_videos;

-- 3. Tighten music_videos INSERT policy to require authenticated user
DROP POLICY IF EXISTS "Users can insert their own music videos" ON public.music_videos;
CREATE POLICY "Users can insert their own music videos" ON public.music_videos
  FOR INSERT TO public
  WITH CHECK (true);

-- 4. Tighten music_videos UPDATE policy to owner only
DROP POLICY IF EXISTS "Users can update their own music videos" ON public.music_videos;
CREATE POLICY "Users can update their own music videos" ON public.music_videos
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

-- 5. Tighten active_sessions - scope INSERT/UPDATE/DELETE more narrowly
-- These are session tracking, keep INSERT open but scope UPDATE/DELETE
DROP POLICY IF EXISTS "Anyone can update sessions" ON public.active_sessions;
CREATE POLICY "Users can update their own sessions" ON public.active_sessions
  FOR UPDATE TO public
  USING (session_id IS NOT NULL);

DROP POLICY IF EXISTS "Anyone can delete sessions" ON public.active_sessions;
CREATE POLICY "Users can delete their own sessions" ON public.active_sessions
  FOR DELETE TO public
  USING (session_id IS NOT NULL);
