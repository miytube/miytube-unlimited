UPDATE public.custom_subcategories
SET slug = 'bloopers-film-movies', name = 'Bloopers (film, movies)'
WHERE slug = 'bloopers-tv-animation'
  AND category_id = (
    SELECT id FROM public.custom_categories WHERE slug = 'film-animation' LIMIT 1
  );

UPDATE public.uploaded_videos
SET category = 'film-animation', subcategory = 'bloopers-film-movies'
WHERE category = 'film-animation'
  AND subcategory IN ('bloopers-tv-animation', 'bloopers-tv-flim-animation');