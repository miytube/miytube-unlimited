
-- Remove permissive public SELECT on base table
DROP POLICY IF EXISTS "Public can view uploaded videos" ON public.uploaded_videos;

-- Make the safe public view run with definer (owner) rights so anon/authenticated
-- can read via the view without needing base-table SELECT access.
ALTER VIEW public.uploaded_videos_public SET (security_invoker = false, security_barrier = true);

-- Ensure roles can still read the view
GRANT SELECT ON public.uploaded_videos_public TO anon, authenticated;
