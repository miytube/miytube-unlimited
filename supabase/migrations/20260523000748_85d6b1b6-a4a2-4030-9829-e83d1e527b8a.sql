UPDATE public.uploaded_videos
SET category = 'sports',
    subcategory = 'sports-nba-season',
    title = 'SUNS at RAPTORS | FULL GAME HIGHLIGHTS | February 23, 2025'
WHERE id = 'b19bdc66-54c2-462a-b159-1257a1c72205';

-- Also move any other orphaned videos in the same bad bucket onto the canonical sports/NBA category
UPDATE public.uploaded_videos
SET category = 'sports',
    subcategory = 'sports-nba-season'
WHERE category IN ('nba-basketball', 'sports-nba-basketball')
  AND (subcategory IN ('nba-basketball-season', 'nba-season') OR subcategory IS NULL);