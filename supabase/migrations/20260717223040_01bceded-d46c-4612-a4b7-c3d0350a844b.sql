-- 1) Remove permissive public SELECT on base table so direct anon/authenticated
--    queries to uploaded_videos can never expose uploader_ip.
DROP POLICY IF EXISTS "Public can view videos via public view" ON public.uploaded_videos;

-- Also revoke residual column-level SELECT grants to anon/authenticated on the
-- base table. Public reads must go through the uploaded_videos_public view.
REVOKE SELECT ON public.uploaded_videos FROM anon, authenticated;

-- 2) Recreate uploaded_videos_public as SECURITY DEFINER so anon/authenticated
--    can read it without needing base-table SELECT. The view intentionally
--    excludes uploader_ip.
ALTER VIEW public.uploaded_videos_public SET (security_invoker = false);

GRANT SELECT ON public.uploaded_videos_public TO anon, authenticated;

-- Preserve owner/admin access on the base table via existing RLS policies.
-- Grant just what those policies need.
GRANT SELECT, INSERT, UPDATE, DELETE ON public.uploaded_videos TO authenticated;
GRANT ALL ON public.uploaded_videos TO service_role;

-- 3) Ad campaign URL scheme hardening: reject javascript:/data:/vbscript: etc.
ALTER TABLE public.ad_campaigns
  DROP CONSTRAINT IF EXISTS ad_campaigns_destination_url_scheme_chk;
ALTER TABLE public.ad_campaigns
  ADD CONSTRAINT ad_campaigns_destination_url_scheme_chk
  CHECK (destination_url IS NULL OR destination_url ~* '^https?://');

ALTER TABLE public.ad_campaigns
  DROP CONSTRAINT IF EXISTS ad_campaigns_media_url_scheme_chk;
ALTER TABLE public.ad_campaigns
  ADD CONSTRAINT ad_campaigns_media_url_scheme_chk
  CHECK (media_url IS NULL OR media_url ~* '^https?://');
