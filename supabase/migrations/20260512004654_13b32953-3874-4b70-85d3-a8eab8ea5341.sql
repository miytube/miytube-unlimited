UPDATE public.uploaded_videos
SET thumbnail_url = REPLACE(thumbnail_url, '/maxresdefault.', '/hqdefault.')
WHERE thumbnail_url LIKE '%img.youtube.com/vi/%/maxresdefault.%';