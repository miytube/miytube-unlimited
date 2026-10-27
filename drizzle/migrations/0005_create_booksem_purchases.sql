CREATE TABLE public.booksem_purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  book_id text not null,
  source text not null default 'single',
  created_at timestamptz not null default now(),
  unique (user_id, book_id)
);

GRANT SELECT, INSERT ON public.booksem_purchases TO authenticated;
GRANT ALL ON public.booksem_purchases TO service_role;

ALTER TABLE public.booksem_purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read their own Booksem purchases"
  ON public.booksem_purchases FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users record their own Booksem purchases"
  ON public.booksem_purchases FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX booksem_purchases_user_idx ON public.booksem_purchases (user_id);