DELETE FROM public.uploaded_videos
WHERE duration ~ '^0?:0[0-5]$';