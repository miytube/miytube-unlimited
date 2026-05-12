UPDATE public.uploaded_videos
SET category = 'boats'
WHERE subcategory = 'boats-all'
  AND category IN ('boats-and-ships', 'all-boats-and-ships', 'all-boats', 'shorts', 'all');