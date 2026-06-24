DELETE FROM public.uploaded_videos
WHERE title ~ '^[0-9a-f]{20,}(\.\d+p)?$';