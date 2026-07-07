ALTER TABLE public.ad_campaigns
  ADD COLUMN IF NOT EXISTS rejection_reason text,
  ADD COLUMN IF NOT EXISTS admin_notes text,
  ADD COLUMN IF NOT EXISTS reviewed_at timestamptz,
  ADD COLUMN IF NOT EXISTS reviewed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS dispute_status text,
  ADD COLUMN IF NOT EXISTS last_payment_error text;

DROP POLICY IF EXISTS "Admins can update any ad campaign" ON public.ad_campaigns;
CREATE POLICY "Admins can update any ad campaign"
  ON public.ad_campaigns
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can view any ad campaign" ON public.ad_campaigns;
CREATE POLICY "Admins can view any ad campaign"
  ON public.ad_campaigns
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));