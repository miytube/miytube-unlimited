DROP POLICY IF EXISTS "Anyone can submit inquiries" ON public.advertiser_inquiries;
CREATE POLICY "Anyone can submit valid inquiries"
ON public.advertiser_inquiries
FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(btrim(name)) BETWEEN 1 AND 200
  AND length(email) <= 255
  AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND (company IS NULL OR length(company) <= 200)
  AND (budget_range IS NULL OR length(budget_range) <= 100)
  AND (message IS NULL OR length(message) <= 5000)
  AND status = 'new'
);

DROP POLICY IF EXISTS "Anyone can subscribe" ON public.newsletter_subscribers;
CREATE POLICY "Anyone can subscribe with a valid email"
ON public.newsletter_subscribers
FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(email) <= 255
  AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND source IN ('miytube', 'iwantinformationnow')
);