-- Update the videos bucket to allow larger files (10GB)
UPDATE storage.buckets 
SET file_size_limit = 10737418240
WHERE id = 'videos';

-- Also ensure the INSERT policy allows public/anon uploads for now (no auth required yet)
DROP POLICY IF EXISTS "Authenticated users can upload videos" ON storage.objects;

CREATE POLICY "Anyone can upload videos"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'videos');