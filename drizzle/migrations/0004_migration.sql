CREATE TABLE public.announcement_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  announcement_key text NOT NULL,
  viewer_key text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (announcement_key, viewer_key)
);
GRANT ALL ON public.announcement_views TO service_role;
ALTER TABLE public.announcement_views ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.record_announcement_view(_key text, _viewer text)
RETURNS bigint LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF length(_key) > 100 OR length(_viewer) > 100 THEN RAISE EXCEPTION 'invalid'; END IF;
  INSERT INTO public.announcement_views(announcement_key, viewer_key) VALUES (_key, _viewer)
  ON CONFLICT DO NOTHING;
  RETURN (SELECT count(*) FROM public.announcement_views WHERE announcement_key = _key);
END $$;
GRANT EXECUTE ON FUNCTION public.record_announcement_view(text, text) TO anon, authenticated;