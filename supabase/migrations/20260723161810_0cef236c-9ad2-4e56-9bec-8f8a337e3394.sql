
-- Move uploader_ip out of uploaded_videos base table so the permissive
-- "Public can view uploaded videos" row policy can no longer expose it,
-- even if column-level REVOKEs are altered in the future.

-- 1) Backfill uploaded_video_ips from any existing IP values
INSERT INTO public.uploaded_video_ips (video_id, uploader_ip)
SELECT id, uploader_ip
  FROM public.uploaded_videos
 WHERE uploader_ip IS NOT NULL
ON CONFLICT (video_id) DO UPDATE SET uploader_ip = EXCLUDED.uploader_ip;

-- 2) Replace the sync function with a BEFORE INSERT/UPDATE version that
--    copies the IP to uploaded_video_ips and then blanks the base column
CREATE OR REPLACE FUNCTION public.sync_uploaded_video_ip()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.uploader_ip IS NOT NULL THEN
    INSERT INTO public.uploaded_video_ips (video_id, uploader_ip)
    VALUES (NEW.id, NEW.uploader_ip)
    ON CONFLICT (video_id) DO UPDATE SET uploader_ip = EXCLUDED.uploader_ip;
    -- Strip from base table so it is never stored where the permissive
    -- public SELECT policy could read it.
    NEW.uploader_ip := NULL;
  END IF;
  RETURN NEW;
END;
$function$;

-- 3) Recreate trigger as BEFORE INSERT OR UPDATE
DROP TRIGGER IF EXISTS trg_sync_uploaded_video_ip ON public.uploaded_videos;
CREATE TRIGGER trg_sync_uploaded_video_ip
BEFORE INSERT OR UPDATE OF uploader_ip ON public.uploaded_videos
FOR EACH ROW EXECUTE FUNCTION public.sync_uploaded_video_ip();

-- 4) Null out any lingering IPs stored on the base table
UPDATE public.uploaded_videos SET uploader_ip = NULL WHERE uploader_ip IS NOT NULL;
