DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'uploaded_videos'
  ) THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.uploaded_videos';
  END IF;
END $$;
ALTER TABLE public.uploaded_videos REPLICA IDENTITY FULL;