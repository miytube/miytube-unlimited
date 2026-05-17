INSERT INTO public.custom_watch_pages (subcategory_id, name, slug, description, is_active, sort_order)
SELECT s.id, 'Track & Field', 'track-field', 'Professional track and field videos', true, 0
FROM public.custom_subcategories s
JOIN public.custom_categories c ON c.id = s.category_id
WHERE c.slug = 'track-field'
  AND s.slug = 'professional'
  AND NOT EXISTS (
    SELECT 1
    FROM public.custom_watch_pages w
    WHERE w.subcategory_id = s.id
      AND w.slug = 'track-field'
  );