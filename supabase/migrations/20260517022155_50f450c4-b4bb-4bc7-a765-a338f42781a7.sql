
INSERT INTO public.custom_categories (name, slug, description, is_active, sort_order)
VALUES ('High School Track & Field', 'high-school-track-field', 'High school track and field competitions and events', true, 0)
ON CONFLICT (slug) DO NOTHING;

WITH cat AS (SELECT id FROM public.custom_categories WHERE slug='high-school-track-field')
INSERT INTO public.custom_subcategories (category_id, name, slug, description, is_active, sort_order)
SELECT cat.id, 'Meets & Events', 'meets-events', 'High school track and field meets and events', true, 0 FROM cat;

WITH sub AS (
  SELECT s.id FROM public.custom_subcategories s
  JOIN public.custom_categories c ON c.id=s.category_id
  WHERE c.slug='high-school-track-field' AND s.slug='meets-events'
)
INSERT INTO public.custom_watch_pages (subcategory_id, name, slug, description, is_active, sort_order)
SELECT sub.id, 'High School Track & Field', 'high-school-track-field', 'High school track and field meets and events', true, 0 FROM sub
UNION ALL
SELECT sub.id, 'CIF Track & Field', 'cif-track-field', 'California Interscholastic Federation track and field', true, 1 FROM sub;
