CREATE OR REPLACE FUNCTION public.get_active_preroll_ads()
RETURNS TABLE(id uuid, headline text, description text, business_name text, call_to_action text, destination_url text, media_url text, ad_format text)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT id, headline, description, business_name, call_to_action, destination_url, media_url, ad_format::text
    FROM public.ad_campaigns
   WHERE status = 'active'
     AND placement = 'preroll'
     AND payment_status = 'paid'
     AND media_url IS NOT NULL
     AND ad_format IN ('skippable_instream','non_skippable_instream','bumper')
     AND (end_date IS NULL OR end_date >= CURRENT_DATE)
     AND start_date <= CURRENT_DATE
   ORDER BY random()
   LIMIT 5;
$$;

GRANT EXECUTE ON FUNCTION public.get_active_preroll_ads() TO anon, authenticated;