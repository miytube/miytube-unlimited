CREATE TABLE public.avatar_portraits (
  user_id uuid PRIMARY KEY,
  image_url text NOT NULL,
  look jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.avatar_portraits TO authenticated;
GRANT ALL ON public.avatar_portraits TO service_role;
ALTER TABLE public.avatar_portraits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members view their own portrait" ON public.avatar_portraits
  FOR SELECT TO authenticated USING (user_id = auth.uid());

ALTER TABLE public.coin_transactions DROP CONSTRAINT IF EXISTS coin_transactions_reason_check;
ALTER TABLE public.coin_transactions ADD CONSTRAINT coin_transactions_reason_check
  CHECK (reason IN ('welcome_bonus','daily_bonus','shop_purchase','admin_adjustment','coin_pack','coin_pack_refund','portrait','portrait_refund'));

-- Service-role only: take coins for one portrait (max 5 per UTC day). Returns the ledger row id.
CREATE OR REPLACE FUNCTION public.charge_portrait(_user_id uuid, _price integer)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _w public.user_coin_wallets;
  _today_count integer;
  _tx uuid;
BEGIN
  IF _price <= 0 THEN RAISE EXCEPTION 'Invalid price'; END IF;
  INSERT INTO public.user_coin_wallets (user_id) VALUES (_user_id) ON CONFLICT (user_id) DO NOTHING;
  SELECT * INTO _w FROM public.user_coin_wallets WHERE user_id = _user_id FOR UPDATE;
  SELECT count(*) INTO _today_count FROM public.coin_transactions
    WHERE user_id = _user_id AND reason = 'portrait'
      AND created_at >= date_trunc('day', now() AT TIME ZONE 'utc') AT TIME ZONE 'utc';
  IF _today_count >= 5 THEN RAISE EXCEPTION 'Daily portrait limit reached'; END IF;
  IF _w.balance < _price THEN RAISE EXCEPTION 'Not enough coins'; END IF;
  UPDATE public.user_coin_wallets SET balance = balance - _price, updated_at = now()
    WHERE user_id = _user_id RETURNING * INTO _w;
  INSERT INTO public.coin_transactions (user_id, amount, reason, balance_after)
    VALUES (_user_id, -_price, 'portrait', _w.balance) RETURNING id INTO _tx;
  RETURN jsonb_build_object('transaction_id', _tx, 'balance', _w.balance);
END;
$$;

-- Service-role only: give the coins back once if generation failed.
CREATE OR REPLACE FUNCTION public.refund_portrait(_transaction_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _t public.coin_transactions;
  _w public.user_coin_wallets;
BEGIN
  SELECT * INTO _t FROM public.coin_transactions WHERE id = _transaction_id AND reason = 'portrait' FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Charge not found'; END IF;
  UPDATE public.user_coin_wallets SET balance = balance + (-_t.amount), updated_at = now()
    WHERE user_id = _t.user_id RETURNING * INTO _w;
  UPDATE public.coin_transactions SET reason = 'portrait_refund' WHERE id = _t.id;
  INSERT INTO public.coin_transactions (user_id, amount, reason, balance_after)
    VALUES (_t.user_id, -_t.amount, 'portrait_refund', _w.balance);
  RETURN jsonb_build_object('balance', _w.balance);
END;
$$;

REVOKE ALL ON FUNCTION public.charge_portrait(uuid, integer) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.refund_portrait(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.charge_portrait(uuid, integer) TO service_role;
GRANT EXECUTE ON FUNCTION public.refund_portrait(uuid) TO service_role;

DROP FUNCTION IF EXISTS public.get_user_avatars(uuid[]);
CREATE FUNCTION public.get_user_avatars(_user_ids uuid[])
RETURNS TABLE(user_id uuid, config jsonb, equipped jsonb, portrait_url text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT a.user_id, a.config, a.equipped, p.image_url
  FROM public.user_avatars a
  LEFT JOIN public.avatar_portraits p ON p.user_id = a.user_id
  WHERE _user_ids IS NOT NULL
    AND cardinality(_user_ids) <= 100
    AND a.user_id = ANY(_user_ids)
$$;
REVOKE ALL ON FUNCTION public.get_user_avatars(uuid[]) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_user_avatars(uuid[]) TO anon, authenticated;