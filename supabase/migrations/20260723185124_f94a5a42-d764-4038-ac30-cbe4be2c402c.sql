
-- Merge duplicate "How-to & Style" category into existing "how-to-style" (How To) category.
-- 1) Move the user's new "Sewing (machine, how to)" subcategory to the correct parent.
UPDATE public.custom_subcategories
   SET category_id = '5cae07a1-0254-4432-bcb7-1ef4b7f109bd'
 WHERE id = 'd671fab4-00fb-4551-b6d6-264621ee4998';

-- 2) Deactivate the empty duplicate category so it stops appearing.
UPDATE public.custom_categories
   SET is_active = false
 WHERE id = '0cc35f82-48db-449d-a0f7-850266ba703c';

-- 3) Route existing sewing videos into the new subcategory so it isn't empty.
UPDATE public.uploaded_videos
   SET category = 'how-to-style',
       subcategory = 'sewing-machine-how-to'
 WHERE (subcategory IN ('sewing-machine','sewing-tutorial','how-to-arts-crafts-sewing')
        OR title ILIKE '%sewing machine%'
        OR title ILIKE '%learn to sew%'
        OR title ILIKE '%how to sew%');
