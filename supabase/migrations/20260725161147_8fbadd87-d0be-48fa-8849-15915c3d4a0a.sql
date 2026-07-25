DROP TRIGGER IF EXISTS trg_sync_uploaded_video_ip ON public.uploaded_videos;
DROP FUNCTION IF EXISTS public.sync_uploaded_video_ip();

CREATE OR REPLACE FUNCTION public.record_uploader_ip(_local_id text, _uploader_ip text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE v_id uuid;
BEGIN
  IF _uploader_ip IS NULL OR btrim(_uploader_ip) = '' THEN
    RETURN;
  END IF;

  SELECT id INTO v_id FROM public.uploaded_videos
   WHERE local_id = _local_id OR id::text = _local_id
   LIMIT 1;

  IF v_id IS NULL THEN
    RETURN;
  END IF;

  INSERT INTO public.uploaded_video_ips (video_id, uploader_ip)
  VALUES (v_id, _uploader_ip)
  ON CONFLICT (video_id) DO UPDATE SET uploader_ip = EXCLUDED.uploader_ip;
END;
$$;

GRANT EXECUTE ON FUNCTION public.record_uploader_ip(text, text) TO anon, authenticated, service_role;

ALTER TABLE public.uploaded_videos DROP COLUMN IF EXISTS uploader_ip;