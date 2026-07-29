-- 1. Add site column to content tables
ALTER TABLE public.uploaded_videos      ADD COLUMN IF NOT EXISTS site text NOT NULL DEFAULT 'miytube';
ALTER TABLE public.music_videos         ADD COLUMN IF NOT EXISTS site text NOT NULL DEFAULT 'miytube';
ALTER TABLE public.custom_categories    ADD COLUMN IF NOT EXISTS site text NOT NULL DEFAULT 'miytube';
ALTER TABLE public.custom_subcategories ADD COLUMN IF NOT EXISTS site text NOT NULL DEFAULT 'miytube';
ALTER TABLE public.custom_watch_pages   ADD COLUMN IF NOT EXISTS site text NOT NULL DEFAULT 'miytube';
ALTER TABLE public.blog_posts           ADD COLUMN IF NOT EXISTS site text NOT NULL DEFAULT 'miytube';
ALTER TABLE public.breaking_news        ADD COLUMN IF NOT EXISTS site text NOT NULL DEFAULT 'miytube';
ALTER TABLE public.discussions          ADD COLUMN IF NOT EXISTS site text NOT NULL DEFAULT 'miytube';
ALTER TABLE public.pictures             ADD COLUMN IF NOT EXISTS site text NOT NULL DEFAULT 'miytube';
ALTER TABLE public.documents            ADD COLUMN IF NOT EXISTS site text NOT NULL DEFAULT 'miytube';
ALTER TABLE public.ad_campaigns         ADD COLUMN IF NOT EXISTS site text NOT NULL DEFAULT 'miytube';

-- 2. Indexes for fast per-site filtering
CREATE INDEX IF NOT EXISTS idx_uploaded_videos_site      ON public.uploaded_videos (site);
CREATE INDEX IF NOT EXISTS idx_music_videos_site         ON public.music_videos (site);
CREATE INDEX IF NOT EXISTS idx_custom_categories_site    ON public.custom_categories (site);
CREATE INDEX IF NOT EXISTS idx_custom_subcategories_site ON public.custom_subcategories (site);
CREATE INDEX IF NOT EXISTS idx_custom_watch_pages_site   ON public.custom_watch_pages (site);
CREATE INDEX IF NOT EXISTS idx_blog_posts_site           ON public.blog_posts (site);
CREATE INDEX IF NOT EXISTS idx_breaking_news_site        ON public.breaking_news (site);
CREATE INDEX IF NOT EXISTS idx_discussions_site          ON public.discussions (site);
CREATE INDEX IF NOT EXISTS idx_pictures_site             ON public.pictures (site);
CREATE INDEX IF NOT EXISTS idx_documents_site            ON public.documents (site);
CREATE INDEX IF NOT EXISTS idx_ad_campaigns_site         ON public.ad_campaigns (site);

-- 3. Rebuild the public videos view to expose the site tag (still excludes uploader IP)
DROP VIEW IF EXISTS public.uploaded_videos_public;
CREATE VIEW public.uploaded_videos_public
WITH (security_invoker = true) AS
SELECT id, user_id, title, description, category, subcategory, tags, duration,
       thumbnail_url, video_url, cloud_url, is_cloud_stored, is_youtube_embed,
       youtube_video_id, file_name, file_size, file_type, views,
       created_at, updated_at, local_id, site
  FROM public.uploaded_videos;

GRANT SELECT ON public.uploaded_videos_public TO anon, authenticated;
GRANT ALL ON public.uploaded_videos_public TO service_role;

-- 4. Per-site ad targeting
CREATE OR REPLACE FUNCTION public.get_active_banner_ads(_placement text DEFAULT 'watch'::text, _site text DEFAULT 'miytube'::text)
 RETURNS TABLE(id uuid, headline text, description text, business_name text, call_to_action text, destination_url text, media_url text)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT id, headline, description, business_name, call_to_action, destination_url, media_url
    FROM public.ad_campaigns
   WHERE status = 'active'
     AND placement = _placement
     AND site = _site
     AND payment_status = 'paid'
     AND (end_date IS NULL OR end_date >= CURRENT_DATE)
     AND start_date <= CURRENT_DATE
   ORDER BY random()
   LIMIT 5;
$function$;

CREATE OR REPLACE FUNCTION public.get_active_preroll_ads(_site text DEFAULT 'miytube'::text)
 RETURNS TABLE(id uuid, headline text, description text, business_name text, call_to_action text, destination_url text, media_url text, ad_format text)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT id, headline, description, business_name, call_to_action, destination_url, media_url, ad_format::text
    FROM public.ad_campaigns
   WHERE status = 'active'
     AND placement = 'preroll'
     AND site = _site
     AND payment_status = 'paid'
     AND media_url IS NOT NULL
     AND ad_format IN ('skippable_instream','non_skippable_instream','bumper')
     AND (end_date IS NULL OR end_date >= CURRENT_DATE)
     AND start_date <= CURRENT_DATE
   ORDER BY random()
   LIMIT 5;
$function$;