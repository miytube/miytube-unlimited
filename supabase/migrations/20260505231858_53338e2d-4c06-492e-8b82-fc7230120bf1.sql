UPDATE public.uploaded_videos
SET category = 'entertainment', subcategory = 'entertainment-late-night'
WHERE subcategory IN ('late-night-shows','late-night-show','entertainment-late-night')
   OR (category IN ('enteratinment','entertaiment') AND subcategory ILIKE '%late%');