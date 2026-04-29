-- 1) Delete all .mob.mp4 preview clips (these are ~30s trailers)
DELETE FROM public.uploaded_videos
WHERE local_id LIKE 's3:%' AND file_name LIKE '%.mob.mp4';

-- 2) Delete 360p when a 480p/720p/1080p of the same base exists
DELETE FROM public.uploaded_videos a
WHERE a.local_id LIKE 's3:%'
  AND a.file_name LIKE '%.360p.mp4'
  AND EXISTS (
    SELECT 1 FROM public.uploaded_videos b
    WHERE b.local_id LIKE 's3:%'
      AND regexp_replace(b.file_name, '\.(360p|480p|720p|1080p)\.mp4$', '') 
        = regexp_replace(a.file_name, '\.(360p|480p|720p|1080p)\.mp4$', '')
      AND b.file_name ~ '\.(480p|720p|1080p)\.mp4$'
  );

-- 3) Delete 480p when a 720p/1080p of the same base exists
DELETE FROM public.uploaded_videos a
WHERE a.local_id LIKE 's3:%'
  AND a.file_name LIKE '%.480p.mp4'
  AND EXISTS (
    SELECT 1 FROM public.uploaded_videos b
    WHERE b.local_id LIKE 's3:%'
      AND regexp_replace(b.file_name, '\.(480p|720p|1080p)\.mp4$', '') 
        = regexp_replace(a.file_name, '\.(480p|720p|1080p)\.mp4$', '')
      AND b.file_name ~ '\.(720p|1080p)\.mp4$'
  );

-- 4) Delete 720p when a 1080p of the same base exists
DELETE FROM public.uploaded_videos a
WHERE a.local_id LIKE 's3:%'
  AND a.file_name LIKE '%.720p.mp4'
  AND EXISTS (
    SELECT 1 FROM public.uploaded_videos b
    WHERE b.local_id LIKE 's3:%'
      AND regexp_replace(b.file_name, '\.(720p|1080p)\.mp4$', '') 
        = regexp_replace(a.file_name, '\.(720p|1080p)\.mp4$', '')
      AND b.file_name LIKE '%.1080p.mp4'
  );