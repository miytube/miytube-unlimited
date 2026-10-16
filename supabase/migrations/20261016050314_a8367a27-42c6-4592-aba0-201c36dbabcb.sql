CREATE TABLE public.rate_card_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  company text NOT NULL,
  email text NOT NULL,
  role text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.rate_card_requests ENABLE ROW LEVEL SECURITY;
GRANT ALL ON public.rate_card_requests TO service_role;
CREATE POLICY "Admins can view rate card requests" ON public.rate_card_requests
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
GRANT SELECT ON public.rate_card_requests TO authenticated;