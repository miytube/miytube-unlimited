UPDATE public.uploaded_videos
SET category = 'soccer-and-football',
    subcategory = 'fifa-world-cup-soccer-football'
WHERE category = 'sports-soccer'
  AND subcategory IN (
    'fifa-word-cup-soocer-football',
    'fifa-world-cup-soocer-football',
    'fifa-word-cup-soccer-football',
    'fifa-world-cup-soccer-football'
  );