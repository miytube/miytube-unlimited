INSERT INTO public.custom_categories (name, slug, site, is_active, sort_order)
SELECT 'Entertainment', 'entertainment', 'miytube', true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.custom_categories WHERE slug = 'entertainment' AND site = 'miytube'
);

UPDATE public.custom_subcategories
SET category_id = (SELECT id FROM public.custom_categories WHERE slug = 'entertainment' AND site = 'miytube')
WHERE slug = 'entertainment-family-lifestyles-kids';