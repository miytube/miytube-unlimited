CREATE TABLE public.poker_tournament_sessions (
  user_id uuid PRIMARY KEY,
  state jsonb NOT NULL,
  version integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.poker_tournament_sessions TO service_role;
ALTER TABLE public.poker_tournament_sessions ENABLE ROW LEVEL SECURITY;
COMMENT ON TABLE public.poker_tournament_sessions IS 'Server-only free Sit & Go tournament state; no client access to hidden cards or chip results.';