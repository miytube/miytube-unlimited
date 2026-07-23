-- Enforce http(s) scheme for ad campaign URLs at the database layer
UPDATE public.ad_campaigns
   SET destination_url = 'https://' || destination_url
 WHERE destination_url IS NOT NULL
   AND destination_url !~* '^https?://';

ALTER TABLE public.ad_campaigns
  ADD CONSTRAINT ad_campaigns_destination_url_http_only
  CHECK (destination_url ~* '^https?://');

ALTER TABLE public.ad_campaigns
  ADD CONSTRAINT ad_campaigns_media_url_http_only
  CHECK (media_url IS NULL OR media_url ~* '^https?://');