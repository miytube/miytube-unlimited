
ALTER TABLE public.uploaded_video_ips
  DROP CONSTRAINT IF EXISTS uploaded_video_ips_video_id_fkey;

ALTER TABLE public.uploaded_video_ips
  ADD CONSTRAINT uploaded_video_ips_video_id_fkey
  FOREIGN KEY (video_id) REFERENCES public.uploaded_videos(id) ON DELETE CASCADE
  DEFERRABLE INITIALLY DEFERRED;
