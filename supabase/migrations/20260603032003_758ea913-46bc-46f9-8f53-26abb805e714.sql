DROP POLICY IF EXISTS "Anyone can read ip cache" ON public.visitor_ip_cache;
REVOKE SELECT ON public.visitor_ip_cache FROM anon, authenticated;