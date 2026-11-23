-- Booksem 50% Off Pass: members trade MiyTube Coins for a one-use half-price book pass.
ALTER TABLE public.coin_transactions DROP CONSTRAINT coin_transactions_reason_check;
ALTER TABLE public.coin_transactions ADD CONSTRAINT coin_transactions_reason_check CHECK (reason = ANY (ARRAY[
  'welcome_bonus','daily_bonus','shop_purchase','admin_adjustment','coin_pack','coin_pack_refund',
  'portrait','portrait_refund','booksem_pass'
]));

CREATE TABLE public.booksem_passes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  code text NOT NULL UNIQUE,
  discount_percent integer NOT NULL DEFAULT 50,
  coins_spent integer NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','reserved','redeemed')),
  stripe_session_id text UNIQUE,
  reserved_until timestamptz,
  book_id text,
  redeemed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX booksem_passes_user_idx ON public.booksem_passes (user_id, created_at DESC);

GRANT SELECT ON public.booksem_passes TO authenticated;
GRANT ALL ON public.booksem_passes TO service_role;
ALTER TABLE public.booksem_passes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members read their own Booksem passes" ON public.booksem_passes
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Member buys a pass with coins. One unused pass at a time.
CREATE OR REPLACE FUNCTION public.redeem_booksem_pass()
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE
  _uid uuid := auth.uid();
  _price constant integer := 250;
  _w public.user_coin_wallets;
  _code text;
  _pass public.booksem_passes;
BEGIN
  IF _uid IS NULL THEN RAISE EXCEPTION 'Sign in required'; END IF;
  PERFORM public.get_coin_wallet();
  SELECT * INTO _w FROM public.user_coin_wallets WHERE user_id = _uid FOR UPDATE;
  IF EXISTS (SELECT 1 FROM public.booksem_passes WHERE user_id = _uid AND status <> 'redeemed') THEN
    RAISE EXCEPTION 'You already have an unused Booksem pass';
  END IF;
  IF _w.balance < _price THEN RAISE EXCEPTION 'Not enough coins'; END IF;
  UPDATE public.user_coin_wallets SET balance = balance - _price, updated_at = now()
    WHERE user_id = _uid RETURNING * INTO _w;
  INSERT INTO public.coin_transactions (user_id, amount, reason, balance_after)
    VALUES (_uid, -_price, 'booksem_pass', _w.balance);
  _code := 'MIY-' || upper(substr(md5(gen_random_uuid()::text), 1, 4)) || '-' || upper(substr(md5(gen_random_uuid()::text), 1, 4));
  INSERT INTO public.booksem_passes (user_id, code, coins_spent) VALUES (_uid, _code, _price) RETURNING * INTO _pass;
  RETURN jsonb_build_object('balance', _w.balance, 'code', _pass.code, 'pass_id', _pass.id);
END;
$$;
REVOKE EXECUTE ON FUNCTION public.redeem_booksem_pass() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.redeem_booksem_pass() TO authenticated;

-- Checkout server holds the pass while the member pays (35 minutes).
CREATE OR REPLACE FUNCTION public.reserve_booksem_pass(_user_id uuid)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE _id uuid;
BEGIN
  SELECT id INTO _id FROM public.booksem_passes
   WHERE user_id = _user_id
     AND (status = 'active' OR (status = 'reserved' AND reserved_until < now()))
   ORDER BY created_at LIMIT 1 FOR UPDATE SKIP LOCKED;
  IF _id IS NULL THEN RETURN NULL; END IF;
  UPDATE public.booksem_passes
     SET status = 'reserved', reserved_until = now() + interval '35 minutes', stripe_session_id = NULL, updated_at = now()
   WHERE id = _id;
  RETURN _id;
END;
$$;

CREATE OR REPLACE FUNCTION public.attach_booksem_session(_pass_id uuid, _session_id text)
RETURNS void LANGUAGE sql SECURITY DEFINER SET search_path TO 'public' AS $$
  UPDATE public.booksem_passes SET stripe_session_id = _session_id, updated_at = now()
   WHERE id = _pass_id AND status = 'reserved';
$$;

CREATE OR REPLACE FUNCTION public.release_booksem_pass(_pass_id uuid)
RETURNS void LANGUAGE sql SECURITY DEFINER SET search_path TO 'public' AS $$
  UPDATE public.booksem_passes SET status = 'active', reserved_until = NULL, stripe_session_id = NULL, updated_at = now()
   WHERE id = _pass_id AND status = 'reserved';
$$;

-- Paid: mark the pass used and unlock the book on the member's Booksem account.
CREATE OR REPLACE FUNCTION public.complete_booksem_pass(_session_id text, _book_id text)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE _p public.booksem_passes;
BEGIN
  SELECT * INTO _p FROM public.booksem_passes WHERE stripe_session_id = _session_id FOR UPDATE;
  IF NOT FOUND THEN RETURN false; END IF;
  IF _p.status <> 'redeemed' THEN
    UPDATE public.booksem_passes
       SET status = 'redeemed', redeemed_at = now(), book_id = _book_id, reserved_until = NULL, updated_at = now()
     WHERE id = _p.id;
  END IF;
  INSERT INTO public.booksem_purchases (user_id, book_id, source)
    VALUES (_p.user_id, _book_id, 'miytube_pass')
    ON CONFLICT (user_id, book_id) DO NOTHING;
  RETURN true;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.reserve_booksem_pass(uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.attach_booksem_session(uuid, text) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.release_booksem_pass(uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.complete_booksem_pass(text, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.reserve_booksem_pass(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.attach_booksem_session(uuid, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.release_booksem_pass(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.complete_booksem_pass(text, text) TO service_role;