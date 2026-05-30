UPDATE public.uploaded_videos
SET category = 'people',
    subcategory = 'people-thefts',
    updated_at = now()
WHERE local_id = 's3:fb5082bfa672c4e2df89c3a5c32ff6b0.480p.mp4'
   OR title = 'Gas Station Surveillance: People in a Convenience Store';