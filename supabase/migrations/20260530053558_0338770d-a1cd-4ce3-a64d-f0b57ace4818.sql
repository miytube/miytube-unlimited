-- Normalize singular "explosion" to canonical plural "explosions"
CREATE OR REPLACE FUNCTION public.normalize_category_value(val text)
 RETURNS text
 LANGUAGE plpgsql
 IMMUTABLE
 SET search_path TO 'public'
AS $function$
DECLARE
  v text;
BEGIN
  IF val IS NULL THEN RETURN NULL; END IF;
  v := lower(trim(val));
  IF v = '' THEN RETURN NULL; END IF;

  IF v IN ('uncategorized', 'undefined', 'null', 'none', 'v') THEN RETURN NULL; END IF;
  IF v ~ '^[0-9]+$' THEN RETURN NULL; END IF;

  v := regexp_replace(v, '^/+|/+$', '', 'g');
  v := replace(v, '&', 'and');
  v := regexp_replace(v, '[/\s_]+', '-', 'g');
  v := regexp_replace(v, '[^a-z0-9-]+', '-', 'g');
  v := regexp_replace(v, '-+', '-', 'g');
  v := regexp_replace(v, '^-+|-+$', '', 'g');

  IF v IN ('courts-police-trails', 'courts-police-trials', 'court-trials') THEN
    v := 'courts-trials';
  ELSIF v IN ('music-spanish','mexican-spanish','music-mexican-spanish','spanish-mexican-music','spanich-mexican-music') THEN
    v := 'spanish';
  ELSIF v IN ('music-lyrics-spanish-and-mexican') THEN
    v := 'music-lyrics-spanish';
  ELSIF v IN ('alternative-and-others','alternative-music','alternative-pop-and-electropop','indie-alternative') THEN
    v := 'alternative';
  ELSIF v IN ('eulogy-or-funeral-honor','eulogy-or-funeral','eulogy-and-memorial','eulogy-memorial-and-funeral') THEN
    v := 'eulogy';
  ELSIF v IN ('thefts','thiefts','stealing','thefts-stealing','thiefts-stealing','thefts-and-stealing','thiefts-and-stealing','people-thefts-and-stealing','people-thiefts-and-stealing') THEN
    v := 'people-thefts';
  ELSIF v IN ('sports-college','college-sport','college-sports-category') THEN
    v := 'college-sports';
  ELSIF v IN ('sports-college-bowl','sports-college-football-bowl','college-football-bowl','college-football-bowl-games','football-bowl-game','bowl-games') THEN
    v := 'football-bowl-games';
  ELSIF v IN ('explosion','disasters-explosion','disasters-explosions','blast','blasts','explosions-blasts') THEN
    v := 'explosions';
  END IF;

  IF v = '' THEN RETURN NULL; END IF;
  RETURN v;
END;
$function$;

-- Fix existing rows
UPDATE public.uploaded_videos
SET subcategory = 'explosions'
WHERE subcategory IN ('explosion','disasters-explosion','disasters-explosions','blast','blasts');