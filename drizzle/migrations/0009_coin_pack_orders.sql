CREATE TABLE public.coin_pack_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  pack_id text NOT NULL,
  coins integer NOT NULL CHECK (coins > 0),
  amount_cents integer NOT NULL CHECK (amount_cents >= 0),
  stripe_session_id text NOT NULL UNIQUE,
  stripe_payment_intent_id text,
  environment text NOT NULL CHECK (environment IN ('sandbox','live')),
  status text NOT NULL DEFAULT 'paid' CHECK (status IN ('paid','refunded')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.coin_pack_orders TO authenticated;
GRANT ALL ON public.coin_pack_orders TO service_role;
ALTER TABLE public.coin_pack_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members view their own coin pack orders" ON public.coin_pack_orders
  FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE INDEX coin_pack_orders_pi_idx ON public.coin_pack_orders(stripe_payment_intent_id);

ALTER TABLE public.coin_transactions DROP CONSTRAINT IF EXISTS coin_transactions_reason_check;
ALTER TABLE public.coin_transactions ADD CONSTRAINT coin_transactions_reason_check
  CHECK (reason IN ('welcome_bonus','daily_bonus','shop_purchase','admin_adjustment','coin_pack','coin_pack_refund'));

CREATE OR REPLACE FUNCTION public.grant_coin_pack(
  _user_id uuid, _session_id text, _payment_intent_id text, _pack_id text,
  _coins integer, _amount_cents integer, _env text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _order_id uuid;
  _balance integer;
BEGIN
  INSERT INTO public.coin_pack_orders (user_id, pack_id, coins, amount_cents, stripe_session_id, stripe_payment_intent_id, environment)
  VALUES (_user_id, _pack_id, _coins, _amount_cents, _session_id, _payment_intent_id, _env)
  ON CONFLICT (stripe_session_id) DO NOTHING
  RETURNING id INTO _order_id;
  IF _order_id IS NULL THEN
    RETURN false;
  END IF;
  INSERT INTO public.user_coin_wallets (user_id) VALUES (_user_id) ON CONFLICT (user_id) DO NOTHING;
  UPDATE public.user_coin_wallets SET balance = balance + _coins, updated_at = now()
    WHERE user_id = _user_id RETURNING balance INTO _balance;
  INSERT INTO public.coin_transactions (user_id, amount, reason, balance_after)
    VALUES (_user_id, _coins, 'coin_pack', _balance);
  RETURN true;
END;
$$;

CREATE OR REPLACE FUNCTION public.revoke_coin_pack(_payment_intent_id text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _o public.coin_pack_orders;
  _take integer;
  _balance integer;
BEGIN
  SELECT * INTO _o FROM public.coin_pack_orders
    WHERE stripe_payment_intent_id = _payment_intent_id AND status = 'paid' FOR UPDATE;
  IF NOT FOUND THEN
    RETURN false;
  END IF;
  UPDATE public.coin_pack_orders SET status = 'refunded', updated_at = now() WHERE id = _o.id;
  SELECT LEAST(balance, _o.coins) INTO _take FROM public.user_coin_wallets WHERE user_id = _o.user_id FOR UPDATE;
  _take := COALESCE(_take, 0);
  UPDATE public.user_coin_wallets SET balance = balance - _take, updated_at = now()
    WHERE user_id = _o.user_id RETURNING balance INTO _balance;
  INSERT INTO public.coin_transactions (user_id, amount, reason, balance_after)
    VALUES (_o.user_id, -_take, 'coin_pack_refund', COALESCE(_balance, 0));
  RETURN true;
END;
$$;

REVOKE ALL ON FUNCTION public.grant_coin_pack(uuid, text, text, text, integer, integer, text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.revoke_coin_pack(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.grant_coin_pack(uuid, text, text, text, integer, integer, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.revoke_coin_pack(text) TO service_role;