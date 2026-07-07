
-- Add 'pending_review' status for campaigns that have been paid but await admin approval
ALTER TYPE public.ad_campaign_status ADD VALUE IF NOT EXISTS 'pending_review';

-- Payment tracking columns
ALTER TABLE public.ad_campaigns
  ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
  ADD COLUMN IF NOT EXISTS refunded_amount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  ADD COLUMN IF NOT EXISTS budget_payments JSONB NOT NULL DEFAULT '[]'::jsonb;

-- Allow the service role (edge functions / webhooks) to manage all campaigns
DROP POLICY IF EXISTS "Service role can manage campaigns" ON public.ad_campaigns;
CREATE POLICY "Service role can manage campaigns"
  ON public.ad_campaigns FOR ALL
  TO service_role
  USING (true) WITH CHECK (true);

GRANT ALL ON public.ad_campaigns TO service_role;
