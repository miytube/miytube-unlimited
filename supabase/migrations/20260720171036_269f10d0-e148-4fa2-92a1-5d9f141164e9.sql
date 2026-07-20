-- Restore the Data API permissions needed by the upload flow without exposing uploader_ip.

-- uploaded_videos: authenticated users need to create rows and read safe fields used by upload/edit code.
GRANT INSERT ON public.uploaded_videos TO authenticated;
GRANT UPDATE (title, description, category, subcategory, tags, thumbnail_url) ON public.uploaded_videos TO authenticated;
GRANT DELETE ON public.uploaded_videos TO authenticated;
GRANT SELECT (
  id,
  local_id,
  user_id,
  title,
  description,
  category,
  subcategory,
  tags,
  duration,
  thumbnail_url,
  video_url,
  cloud_url,
  is_cloud_stored,
  is_youtube_embed,
  youtube_video_id,
  file_name,
  file_size,
  file_type,
  views,
  created_at,
  updated_at
) ON public.uploaded_videos TO authenticated;
GRANT ALL ON public.uploaded_videos TO service_role;

-- blocked_uploads: upload code records duplicate/incompatible attempts and users can see their own notices.
GRANT SELECT, INSERT, DELETE ON public.blocked_uploads TO authenticated;
GRANT ALL ON public.blocked_uploads TO service_role;

-- uploaded_video_ips remains admin-only through RLS, but the table still needs Data API grants.
GRANT SELECT ON public.uploaded_video_ips TO authenticated;
GRANT ALL ON public.uploaded_video_ips TO service_role;

-- The client-side duplicate check uses this function before publishing a row.
GRANT EXECUTE ON FUNCTION public.check_upload_duplicate_by_ip(text, text, bigint, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_upload_duplicate_by_ip(text, text, bigint, text, text) TO service_role;