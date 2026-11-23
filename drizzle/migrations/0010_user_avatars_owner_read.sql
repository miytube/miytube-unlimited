DROP POLICY IF EXISTS "Avatars are viewable by everyone" ON public.user_avatars;
REVOKE SELECT ON public.user_avatars FROM anon;
CREATE POLICY "Users view their own avatar" ON public.user_avatars
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.get_user_avatars(_user_ids uuid[])
RETURNS TABLE(user_id uuid, config jsonb, equipped jsonb)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT a.user_id, a.config, a.equipped
  FROM public.user_avatars a
  WHERE _user_ids IS NOT NULL
    AND cardinality(_user_ids) <= 100
    AND a.user_id = ANY(_user_ids)
$$;
REVOKE ALL ON FUNCTION public.get_user_avatars(uuid[]) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_user_avatars(uuid[]) TO anon, authenticated;