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
  ELSIF v IN (
    'thefts',
    'thiefts',
    'stealing',
    'thefts-stealing',
    'thiefts-stealing',
    'thefts-and-stealing',
    'thiefts-and-stealing',
    'people-thefts-and-stealing',
    'people-thiefts-and-stealing'
  ) THEN
    v := 'people-thefts';
  END IF;

  IF v = '' THEN RETURN NULL; END IF;
  RETURN v;
END;
$function$;

UPDATE public.uploaded_videos
SET category = 'people',
    subcategory = 'people-thefts',
    updated_at = now()
WHERE lower(coalesce(category, '')) IN ('people', 'people-blogs')
  AND lower(coalesce(subcategory, '')) IN (
    'thefts',
    'thiefts',
    'stealing',
    'thefts-stealing',
    'thiefts-stealing',
    'thefts-and-stealing',
    'thiefts-and-stealing',
    'people-thefts-and-stealing',
    'people-thiefts-and-stealing'
  );

DROP TRIGGER IF EXISTS normalize_uploaded_videos_categories ON public.uploaded_videos;

CREATE TRIGGER normalize_uploaded_videos_categories
BEFORE INSERT OR UPDATE OF category, subcategory ON public.uploaded_videos
FOR EACH ROW
EXECUTE FUNCTION public.normalize_video_categories();