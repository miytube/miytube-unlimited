
CREATE OR REPLACE FUNCTION public.get_active_banner_ads(_placement text DEFAULT 'banner')
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
     AND ad_format::text = _placement
     AND payment_status = 'paid'
     AND (end_date IS NULL OR end_date >= CURRENT_DATE)
     AND start_date <= CURRENT_DATE
   ORDER BY random()
   LIMIT 5;
$$;

GRANT EXECUTE ON FUNCTION public.get_active_banner_ads(text) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.record_ad_event(_campaign_id uuid, _event text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF _event = 'impression' THEN
    UPDATE public.ad_campaigns SET impressions = COALESCE(impressions,0) + 1 WHERE id = _campaign_id;
  ELSIF _event = 'click' THEN
    UPDATE public.ad_campaigns SET clicks = COALESCE(clicks,0) + 1 WHERE id = _campaign_id;
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION public.record_ad_event(uuid, text) TO anon, authenticated;
