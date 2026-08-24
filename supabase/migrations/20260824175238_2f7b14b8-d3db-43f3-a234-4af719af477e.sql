
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS category text;
CREATE INDEX IF NOT EXISTS blog_posts_category_idx ON public.blog_posts (category);

UPDATE public.blog_posts SET category = 'gmatrader'
WHERE user_id = '262efb9e-d2f5-4e52-b3e6-5e0916092b9b';

WITH cat AS (
  SELECT id, site FROM public.custom_categories WHERE slug = 'business' LIMIT 1
), ins_sub AS (
  INSERT INTO public.custom_subcategories (category_id, name, slug, description, sort_order, is_active, site)
  SELECT cat.id,
         'GmaTrader Nasdaq Futures Markets, Articles and Videos',
         'gmatrader-nasdaq-futures-markets',
         'Nasdaq futures market analysis, daily trading articles and videos from GmaTrader',
         0, true, cat.site
  FROM cat
  WHERE NOT EXISTS (
    SELECT 1 FROM public.custom_subcategories s
    WHERE s.slug = 'gmatrader-nasdaq-futures-markets' AND s.category_id = cat.id
  )
  RETURNING id
), sub AS (
  SELECT id FROM ins_sub
  UNION ALL
  SELECT s.id FROM public.custom_subcategories s, cat
  WHERE s.slug = 'gmatrader-nasdaq-futures-markets' AND s.category_id = cat.id
)
INSERT INTO public.custom_watch_pages (subcategory_id, name, slug, description, sort_order, is_active, site)
SELECT sub.id, 'GmaTrader Videos', 'gmatrader-videos',
       'Nasdaq futures trading videos from GmaTrader', 0, true,
       (SELECT site FROM cat)
FROM sub
WHERE NOT EXISTS (
  SELECT 1 FROM public.custom_watch_pages w WHERE w.slug = 'gmatrader-videos' AND w.subcategory_id = sub.id
)
LIMIT 1;
