REVOKE ALL ON public.poker_tournament_sessions FROM anon, authenticated;
GRANT ALL ON public.poker_tournament_sessions TO service_role;