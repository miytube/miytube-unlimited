
-- Restore public browsing of videos while keeping uploader_ip private.
-- Grant column-level SELECT on all safe columns to anon and authenticated,
-- excluding uploader_ip.
DO $$
DECLARE
  col_list text;
BEGIN
  SELECT string_agg(quote_ident(column_name), ', ')
    INTO col_list
    FROM information_schema.columns
   WHERE table_schema='public'
     AND table_name='uploaded_videos'
     AND column_name <> 'uploader_ip';

  EXECUTE format('GRANT SELECT (%s) ON public.uploaded_videos TO anon', col_list);
  EXECUTE format('GRANT SELECT (%s) ON public.uploaded_videos TO authenticated', col_list);
END $$;

GRANT SELECT ON public.uploaded_videos_public TO anon;
GRANT SELECT ON public.uploaded_videos_public TO authenticated;

-- Add a public SELECT policy that excludes the uploader_ip via column privileges above.
DROP POLICY IF EXISTS "Public can view uploaded videos" ON public.uploaded_videos;
CREATE POLICY "Public can view uploaded videos"
ON public.uploaded_videos
FOR SELECT
TO anon, authenticated
USING (true);
