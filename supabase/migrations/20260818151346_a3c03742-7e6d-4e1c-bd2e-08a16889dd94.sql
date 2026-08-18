ALTER POLICY "Owners can update their avatars" ON storage.objects
  WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

ALTER POLICY "Owners can update their thumbnails" ON storage.objects
  WITH CHECK (bucket_id = 'thumbnails' AND (storage.foldername(name))[1] = auth.uid()::text);

ALTER POLICY "Owners can update their videos" ON storage.objects
  WITH CHECK (bucket_id = 'videos' AND (storage.foldername(name))[1] = auth.uid()::text);

ALTER POLICY "Users can update their own avatar" ON storage.objects
  WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

ALTER POLICY "Users can update their own documents in bucket" ON storage.objects
  WITH CHECK (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

ALTER POLICY "Users can update their own pictures in bucket" ON storage.objects
  WITH CHECK (bucket_id = 'pictures' AND auth.uid()::text = (storage.foldername(name))[1]);