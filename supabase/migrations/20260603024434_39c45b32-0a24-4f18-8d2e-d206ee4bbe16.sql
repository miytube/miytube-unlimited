
CREATE TABLE IF NOT EXISTS public.visitor_ip_cache (
  ip text PRIMARY KEY,
  is_datacenter boolean NOT NULL DEFAULT false,
  is_proxy boolean NOT NULL DEFAULT false,
  country text,
  asn text,
  org text,
  checked_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.visitor_ip_cache TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.visitor_ip_cache TO anon;
GRANT ALL ON public.visitor_ip_cache TO service_role;

ALTER TABLE public.visitor_ip_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read ip cache" ON public.visitor_ip_cache
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Service role manages ip cache" ON public.visitor_ip_cache
  FOR ALL TO service_role USING (true) WITH CHECK (true);
