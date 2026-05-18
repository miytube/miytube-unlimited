CREATE POLICY "Admins can update any uploaded videos"
ON public.uploaded_videos
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

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

  IF v = 'courts-police-trails' THEN
    v := 'courts-trials';
  END IF;

  IF v = '' THEN RETURN NULL; END IF;
  RETURN v;
END;
$function$;