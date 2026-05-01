-- Canonical normalization for category / subcategory text
CREATE OR REPLACE FUNCTION public.normalize_category_value(val text)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
SET search_path = public
AS $$
DECLARE
  v text;
BEGIN
  IF val IS NULL THEN RETURN NULL; END IF;
  v := lower(trim(val));
  IF v = '' THEN RETURN NULL; END IF;

  -- Drop obvious garbage placeholders
  IF v IN ('uncategorized', 'undefined', 'null', 'none', 'v') THEN RETURN NULL; END IF;
  -- Drop pure-numeric "ids" (e.g. "1662320983") that are not real categories
  IF v ~ '^[0-9]+$' THEN RETURN NULL; END IF;

  v := regexp_replace(v, '^/+|/+$', '', 'g');           -- strip leading/trailing slashes
  v := replace(v, '&', 'and');
  v := regexp_replace(v, '[/\s_]+', '-', 'g');          -- slashes, spaces, underscores -> hyphen
  v := regexp_replace(v, '[^a-z0-9-]+', '-', 'g');      -- other punctuation -> hyphen
  v := regexp_replace(v, '-+', '-', 'g');               -- collapse repeated hyphens
  v := regexp_replace(v, '^-+|-+$', '', 'g');           -- trim hyphens

  IF v = '' THEN RETURN NULL; END IF;
  RETURN v;
END;
$$;

-- Trigger function: apply normalization on insert/update
CREATE OR REPLACE FUNCTION public.normalize_video_categories()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.category := public.normalize_category_value(NEW.category);
  NEW.subcategory := public.normalize_category_value(NEW.subcategory);
  RETURN NEW;
END;
$$;

-- Attach triggers to uploaded_videos
DROP TRIGGER IF EXISTS trg_normalize_uploaded_video_categories ON public.uploaded_videos;
CREATE TRIGGER trg_normalize_uploaded_video_categories
  BEFORE INSERT OR UPDATE OF category, subcategory ON public.uploaded_videos
  FOR EACH ROW EXECUTE FUNCTION public.normalize_video_categories();

-- Attach triggers to music_videos
DROP TRIGGER IF EXISTS trg_normalize_music_video_categories ON public.music_videos;
CREATE TRIGGER trg_normalize_music_video_categories
  BEFORE INSERT OR UPDATE OF category, subcategory ON public.music_videos
  FOR EACH ROW EXECUTE FUNCTION public.normalize_video_categories();

-- Backfill existing rows
UPDATE public.uploaded_videos
   SET category = public.normalize_category_value(category),
       subcategory = public.normalize_category_value(subcategory)
 WHERE category IS NOT NULL OR subcategory IS NOT NULL;

UPDATE public.music_videos
   SET category = public.normalize_category_value(category),
       subcategory = public.normalize_category_value(subcategory)
 WHERE category IS NOT NULL OR subcategory IS NOT NULL;