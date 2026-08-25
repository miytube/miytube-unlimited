WITH cat AS (
  INSERT INTO public.custom_categories (name, slug, site, is_active, sort_order)
  VALUES ('High School Sports', 'high-school-sports', 'miytube', true, 0)
  ON CONFLICT DO NOTHING
  RETURNING id
), c AS (
  SELECT id FROM cat
  UNION ALL
  SELECT id FROM public.custom_categories WHERE slug = 'high-school-sports' AND site = 'miytube'
  LIMIT 1
)
INSERT INTO public.custom_subcategories (category_id, name, slug, site, is_active, sort_order)
SELECT c.id, v.name, v.slug, 'miytube', true, v.ord
FROM c, (VALUES
  ('Football', 'high-school-football-hs', 1),
  ('Basketball', 'high-school-basketball', 2),
  ('Baseball', 'high-school-baseball', 3),
  ('Softball', 'high-school-softball', 4),
  ('Track & Field', 'high-school-track-and-field', 5),
  ('Wrestling', 'high-school-wrestling', 6)
) AS v(name, slug, ord);