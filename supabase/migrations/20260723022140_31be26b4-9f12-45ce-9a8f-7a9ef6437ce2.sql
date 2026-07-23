
ALTER TABLE public.ad_campaigns
  ADD COLUMN IF NOT EXISTS placement text NOT NULL DEFAULT 'watch';

ALTER TABLE public.ad_campaigns
  DROP CONSTRAINT IF EXISTS ad_campaigns_placement_check;
ALTER TABLE public.ad_campaigns
  ADD CONSTRAINT ad_campaigns_placement_check
  CHECK (placement IN ('watch','homepage'));

UPDATE public.ad_campaigns SET placement = 'watch' WHERE placement IS NULL;

CREATE OR REPLACE FUNCTION public.get_active_banner_ads(_placement text DEFAULT 'watch')
RETURNS TABLE (
  id uuid,
  headline text,
  description text,
  business_name text,
  call_to_action text,
  destination_url text,
  media_url text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id, headline, description, business_name, call_to_action, destination_url, media_url
    FROM public.ad_campaigns
   WHERE status = 'active'
     AND placement = _placement
     AND payment_status = 'paid'
     AND (end_date IS NULL OR end_date >= CURRENT_DATE)
     AND start_date <= CURRENT_DATE
   ORDER BY random()
   LIMIT 5;
$$;
