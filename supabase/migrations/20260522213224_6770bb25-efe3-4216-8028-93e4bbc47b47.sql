CREATE TABLE public.advertiser_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  company text,
  budget_range text,
  message text,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.advertiser_inquiries ENABLE ROW LEVEL SECURITY;

-- Anyone can submit an inquiry
CREATE POLICY "Anyone can submit inquiries" ON public.advertiser_inquiries
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Only authenticated users can view their own inquiry (by email match)
CREATE POLICY "Users can view own inquiries by email" ON public.advertiser_inquiries
  FOR SELECT TO authenticated
  USING (email = auth.jwt() ->> 'email');

-- Admins can view all inquiries
CREATE POLICY "Admins can view all inquiries" ON public.advertiser_inquiries
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));