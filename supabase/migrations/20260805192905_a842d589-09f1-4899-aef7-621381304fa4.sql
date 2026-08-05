UPDATE public.custom_subcategories
SET name = 'NBA Basketball (players amazing, players fails)',
    slug = 'nba-basketball-players-amazing-players-fails',
    updated_at = now()
WHERE id = 'e842e2c4-b72a-41b3-8b78-fda822ef5571';

UPDATE public.uploaded_videos
SET subcategory = 'nba-basketball-players-amazing-players-fails'
WHERE lower(subcategory) IN ('nba-basketall-players-amazing-players-fails','nba basketall (players amazing, players fails)');

UPDATE public.uploaded_videos
SET category = 'nba-basketball-players-amazing-players-fails'
WHERE lower(category) IN ('nba-basketall-players-amazing-players-fails','nba basketall (players amazing, players fails)');