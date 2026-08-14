
-- 1. Normalize MMA & Fighting category name
UPDATE public.custom_categories SET name='MMA & Fighting' WHERE id='fe501222-cfb4-4caa-85ab-91a7c5b67914';

-- 2. Remove duplicate "MMA & Fighting" subcategory page by making it the general bucket
UPDATE public.custom_subcategories
SET name='All MMA & Fighting', slug='all-mma-and-fighting'
WHERE id='1526a844-3f8e-4470-97f2-adffbbb7bf50';

-- 3. Weight watch pages under MMA & Fighting
INSERT INTO public.custom_watch_pages (subcategory_id, name, slug, sort_order, is_active, site)
VALUES
 ('1526a844-3f8e-4470-97f2-adffbbb7bf50','Flyweight (up to 125 lbs)','flyweight',1,true,'miytube'),
 ('1526a844-3f8e-4470-97f2-adffbbb7bf50','Bantamweight (126-135 lbs)','bantamweight',2,true,'miytube'),
 ('1526a844-3f8e-4470-97f2-adffbbb7bf50','Featherweight (136-145 lbs)','featherweight',3,true,'miytube'),
 ('1526a844-3f8e-4470-97f2-adffbbb7bf50','Lightweight (146-155 lbs)','lightweight',4,true,'miytube'),
 ('1526a844-3f8e-4470-97f2-adffbbb7bf50','Welterweight (156-170 lbs)','welterweight',5,true,'miytube'),
 ('1526a844-3f8e-4470-97f2-adffbbb7bf50','Middleweight (171-185 lbs)','middleweight',6,true,'miytube'),
 ('1526a844-3f8e-4470-97f2-adffbbb7bf50','Light Heavyweight (186-205 lbs)','light-heavyweight',7,true,'miytube'),
 ('1526a844-3f8e-4470-97f2-adffbbb7bf50','Heavyweight (206-265 lbs)','heavyweight',8,true,'miytube');

-- 4. UFC Fighting category + bucket subcategory + weight watch pages
WITH cat AS (
  INSERT INTO public.custom_categories (name, slug, sort_order, is_active, site)
  VALUES ('UFC Fighting','ufc-fighting',0,true,'miytube')
  RETURNING id
), sub AS (
  INSERT INTO public.custom_subcategories (category_id, name, slug, sort_order, is_active, site)
  SELECT id,'All UFC Fighting','all-ufc-fighting',0,true,'miytube' FROM cat
  RETURNING id
)
INSERT INTO public.custom_watch_pages (subcategory_id, name, slug, sort_order, is_active, site)
SELECT sub.id, v.name, v.slug, v.ord, true, 'miytube'
FROM sub, (VALUES
 ('Flyweight (up to 125 lbs)','flyweight',1),
 ('Bantamweight (126-135 lbs)','bantamweight',2),
 ('Featherweight (136-145 lbs)','featherweight',3),
 ('Lightweight (146-155 lbs)','lightweight',4),
 ('Welterweight (156-170 lbs)','welterweight',5),
 ('Middleweight (171-185 lbs)','middleweight',6),
 ('Light Heavyweight (186-205 lbs)','light-heavyweight',7),
 ('Heavyweight (206-265 lbs)','heavyweight',8)
) AS v(name, slug, ord);

-- 5. Move existing UFC videos into the new UFC Fighting pages
UPDATE public.uploaded_videos SET category='ufc-fighting', subcategory='heavyweight'
WHERE id IN ('f229f7c1-3138-4b89-9c99-e347bc96b79e','0d0e330a-7ae0-44e7-bac8-aab5539068bf','c21a8bdf-91b1-4178-bd89-efb89f24b6fd');

UPDATE public.uploaded_videos SET category='ufc-fighting', subcategory='middleweight'
WHERE id IN ('d248d4ce-4f28-4cc0-a312-f9affbdfaa85','b5c430ab-fe8c-4533-aac6-a658fa18ff40');

UPDATE public.uploaded_videos SET category='ufc-fighting', subcategory='lightweight'
WHERE id = '4c1a5cf9-ce68-4be1-a9bd-8ff10c48238e';

UPDATE public.uploaded_videos SET category='ufc-fighting', subcategory='all-ufc-fighting'
WHERE id = 'ad08cd74-fee7-4679-966b-eaa1c2da9cd0';

-- Existing Bellator heavyweight brawl -> MMA heavyweight
UPDATE public.uploaded_videos SET category='mma-and-fighting', subcategory='heavyweight'
WHERE id = '074e07e1-29a3-43b4-a797-6948e7b717ce';
