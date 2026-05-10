
-- Delete duplicates, keep the oldest per (subcategory_id, slug)
DELETE FROM public.custom_watch_pages a
USING public.custom_watch_pages b
WHERE a.subcategory_id = b.subcategory_id
  AND a.slug = b.slug
  AND a.created_at > b.created_at;

CREATE UNIQUE INDEX IF NOT EXISTS custom_watch_pages_subcategory_slug_unique
  ON public.custom_watch_pages (subcategory_id, slug);
