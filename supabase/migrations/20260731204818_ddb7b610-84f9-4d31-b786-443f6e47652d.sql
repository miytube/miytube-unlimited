UPDATE public.uploaded_videos
SET category = 'fitness-and-workout',
    subcategory = CASE
      WHEN subcategory IN ('weightlifting-prank','fitness-weightlifting-prank') THEN 'fitness-weightlifting-prank'
      WHEN subcategory IN ('weightlifting-male','fitness-weightlifting-male') THEN 'fitness-weightlifting-male'
      WHEN subcategory IN ('weightlifting-female','fitness-weightlifting-female') THEN 'fitness-weightlifting-female'
      WHEN subcategory IN ('weightlifting','fitness-weight-lifting') THEN 'fitness-weight-lifting'
      ELSE subcategory
    END
WHERE category IN ('physical-fitness','fitness-and-workout','video','sports')
  AND subcategory IN ('weightlifting-prank','weightlifting-male','weightlifting-female','weightlifting','fitness-weightlifting-prank','fitness-weightlifting-male','fitness-weightlifting-female','fitness-weight-lifting');