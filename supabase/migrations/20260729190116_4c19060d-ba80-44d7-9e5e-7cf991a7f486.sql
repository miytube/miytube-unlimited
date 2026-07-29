ALTER TABLE public.custom_categories DROP CONSTRAINT IF EXISTS custom_categories_slug_key;
ALTER TABLE public.custom_categories ADD CONSTRAINT custom_categories_site_slug_key UNIQUE (site, slug);