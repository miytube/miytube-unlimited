
-- 1) Create private table to hold uploader IPs, isolated from the main videos row
CREATE TABLE IF NOT EXISTS public.uploaded_video_ips (
  video_id uuid PRIMARY KEY REFERENCES public.uploaded_videos(id) ON DELETE CASCADE,
  uploader_ip text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.uploaded_video_ips TO service_role;
GRANT SELECT ON public.uploaded_video_ips TO authenticated;

ALTER TABLE public.uploaded_video_ips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view uploader IPs"
ON public.uploaded_video_ips
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 2) Backfill IPs from existing rows
INSERT INTO public.uploaded_video_ips (video_id, uploader_ip)
SELECT id, uploader_ip
FROM public.uploaded_videos
WHERE uploader_ip IS NOT NULL
ON CONFLICT (video_id) DO NOTHING;

-- 3) Update the duplicate-check function to read from the private table
CREATE OR REPLACE FUNCTION public.check_upload_duplicate_by_ip(
  _uploader_ip text,
  _file_name text,
  _file_size bigint,
  _category text,
  _subcategory text
)
RETURNS TABLE(id uuid, title text, file_name text, file_size bigint, category text, subcategory text)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT v.id, v.title, v.file_name, v.file_size, v.category, v.subcategory
    FROM public.uploaded_videos v
    JOIN public.uploaded_video_ips ips ON ips.video_id = v.id
   WHERE ips.uploader_ip = _uploader_ip
     AND v.file_name = _file_name
     AND v.file_size = _file_size
     AND v.category IS NOT DISTINCT FROM _category
     AND v.subcategory IS NOT DISTINCT FROM _subcategory
   LIMIT 1;
$function$;

-- 4) Trigger to mirror uploader_ip inserts/updates on uploaded_videos into the private table
CREATE OR REPLACE FUNCTION public.sync_uploaded_video_ip()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.uploader_ip IS NOT NULL THEN
    INSERT INTO public.uploaded_video_ips (video_id, uploader_ip)
    VALUES (NEW.id, NEW.uploader_ip)
    ON CONFLICT (video_id) DO UPDATE SET uploader_ip = EXCLUDED.uploader_ip;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_uploaded_video_ip ON public.uploaded_videos;
CREATE TRIGGER trg_sync_uploaded_video_ip
AFTER INSERT OR UPDATE OF uploader_ip ON public.uploaded_videos
FOR EACH ROW
EXECUTE FUNCTION public.sync_uploaded_video_ip();

-- 5) Drop the permissive public SELECT policy on the main table
DROP POLICY IF EXISTS "Public can read non-sensitive video columns" ON public.uploaded_videos;

-- 6) Re-create a SELECT policy that still allows public row visibility
--    (needed so the security_invoker view uploaded_videos_public returns rows for anon/authenticated).
--    Column-level GRANTs continue to keep uploader_ip unreadable by anon/authenticated.
CREATE POLICY "Public rows visible via column-grants only"
ON public.uploaded_videos
FOR SELECT
TO anon, authenticated
USING (true);

-- 7) Reaffirm: revoke uploader_ip column SELECT from public roles (defense-in-depth)
REVOKE SELECT (uploader_ip) ON public.uploaded_videos FROM anon, authenticated;
