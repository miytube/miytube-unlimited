
INSERT INTO public.custom_watch_pages (subcategory_id, name, slug, sort_order, is_active, site)
VALUES
 ('c16e010c-7a91-458a-8049-9663c04d2d71','Boxing (105 - 126 weight)','boxing-105-126-weight',1,true,'miytube'),
 ('c16e010c-7a91-458a-8049-9663c04d2d71','Boxing (130 - 154 weight)','boxing-130-154-weight',2,true,'miytube'),
 ('c16e010c-7a91-458a-8049-9663c04d2d71','Boxing (160 - 200 weight)','boxing-160-200-weight',3,true,'miytube')
ON CONFLICT DO NOTHING;

DELETE FROM public.custom_subcategories WHERE category_id = '8dffd9be-2e76-42c8-af77-2e98ccca9ec6';
DELETE FROM public.custom_categories WHERE id = '8dffd9be-2e76-42c8-af77-2e98ccca9ec6';

UPDATE public.uploaded_videos SET subcategory = 'boxing-heavyweight-fighting' WHERE subcategory = 'boxing-heavyweight-fighting0';
UPDATE public.uploaded_videos SET category = 'sports-boxing' WHERE subcategory IN ('boxing-105-126-weight','boxing-130-154-weight','boxing-160-200-weight');
