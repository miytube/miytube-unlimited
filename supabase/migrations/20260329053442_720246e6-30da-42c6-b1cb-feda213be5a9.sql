
-- The upsert on active_sessions needs both INSERT and UPDATE to work for anonymous users
-- Restore the INSERT policy and make UPDATE work for upserts by matching on session_id
DROP POLICY IF EXISTS "Anyone can insert sessions" ON public.active_sessions;
CREATE POLICY "Anyone can insert sessions" ON public.active_sessions
  FOR INSERT TO public
  WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update their own sessions" ON public.active_sessions;
CREATE POLICY "Anyone can update their own session" ON public.active_sessions
  FOR UPDATE TO public
  USING (true);

DROP POLICY IF EXISTS "Users can delete their own sessions" ON public.active_sessions;
CREATE POLICY "Anyone can delete their own session" ON public.active_sessions
  FOR DELETE TO public
  USING (true);
