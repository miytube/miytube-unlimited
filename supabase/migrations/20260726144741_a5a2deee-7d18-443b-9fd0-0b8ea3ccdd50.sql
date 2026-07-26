ALTER TABLE public.blocked_uploads ALTER COLUMN user_id SET DEFAULT auth.uid();

UPDATE public.blocked_uploads SET user_id = user_id WHERE false;

DROP POLICY IF EXISTS "Users can insert their own blocked uploads" ON public.blocked_uploads;

CREATE POLICY "Users can insert their own blocked uploads"
  ON public.blocked_uploads FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

REVOKE INSERT ON public.blocked_uploads FROM anon;