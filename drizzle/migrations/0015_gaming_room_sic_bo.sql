-- Gaming Room: Sic Bo (three dice) for MiyTube Coins. The roll and payout happen in one server call.
CREATE TABLE public.sicbo_rounds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  dice smallint[] NOT NULL,
  bets jsonb NOT NULL,
  stake integer NOT NULL CHECK (stake > 0),
  payout integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX sicbo_rounds_user_idx ON public.sicbo_rounds (user_id, created_at DESC);

GRANT SELECT ON public.sicbo_rounds TO authenticated;
GRANT ALL ON public.sicbo_rounds TO service_role;
ALTER TABLE public.sicbo_rounds ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members read their own Sic Bo rounds" ON public.sicbo_rounds
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Coins returned for one bet (stake included); 0 when it loses.
CREATE OR REPLACE FUNCTION public.sicbo_bet_return(_type text, _value integer, _amount integer, _dice smallint[])
RETURNS integer LANGUAGE plpgsql IMMUTABLE SET search_path TO 'public' AS $$
DECLARE
  _sum int := _dice[1] + _dice[2] + _dice[3];
  _triple boolean := _dice[1] = _dice[2] AND _dice[2] = _dice[3];
  _hits int := (CASE WHEN _dice[1] = _value THEN 1 ELSE 0 END) + (CASE WHEN _dice[2] = _value THEN 1 ELSE 0 END) + (CASE WHEN _dice[3] = _value THEN 1 ELSE 0 END);
  _odds int := 0;
BEGIN
  IF _type = 'small' THEN IF NOT _triple AND _sum BETWEEN 4 AND 10 THEN _odds := 1; END IF;
  ELSIF _type = 'big' THEN IF NOT _triple AND _sum BETWEEN 11 AND 17 THEN _odds := 1; END IF;
  ELSIF _type = 'odd' THEN IF NOT _triple AND _sum % 2 = 1 THEN _odds := 1; END IF;
  ELSIF _type = 'even' THEN IF NOT _triple AND _sum % 2 = 0 THEN _odds := 1; END IF;
  ELSIF _type = 'total' THEN
    IF _sum = _value THEN
      _odds := CASE WHEN _value IN (4, 17) THEN 60 WHEN _value IN (5, 16) THEN 30 WHEN _value IN (6, 15) THEN 17
                    WHEN _value IN (7, 14) THEN 12 WHEN _value IN (8, 13) THEN 8 ELSE 6 END;
    END IF;
  ELSIF _type = 'any_triple' THEN IF _triple THEN _odds := 30; END IF;
  ELSIF _type = 'triple' THEN IF _triple AND _dice[1] = _value THEN _odds := 180; END IF;
  ELSIF _type = 'double' THEN IF _hits >= 2 THEN _odds := 10; END IF;
  ELSIF _type = 'single' THEN _odds := _hits;
  END IF;
  RETURN CASE WHEN _odds > 0 THEN _amount * (_odds + 1) ELSE 0 END;
END;
$$;

-- One fair die from secure random bytes (rejection sampling keeps 1..6 equally likely).
CREATE OR REPLACE FUNCTION public.sicbo_die()
RETURNS smallint LANGUAGE plpgsql VOLATILE SET search_path TO 'public' AS $$
DECLARE _b bytea; _i int; _v int;
BEGIN
  LOOP
    _b := uuid_send(gen_random_uuid());
    FOR _i IN 0..15 LOOP
      IF _i = 6 OR _i = 8 THEN CONTINUE; END IF; -- skip uuid version/variant bytes
      _v := get_byte(_b, _i);
      IF _v < 252 THEN RETURN (_v % 6 + 1)::smallint; END IF;
    END LOOP;
  END LOOP;
END;
$$;

CREATE OR REPLACE FUNCTION public.sicbo_roll(_bets jsonb)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE
  _uid uuid := auth.uid();
  _w public.user_coin_wallets;
  _bet jsonb;
  _type text; _value int; _amount int;
  _stake int := 0; _payout int := 0; _ret int;
  _dice smallint[];
  _results jsonb := '[]'::jsonb;
  _round public.sicbo_rounds;
BEGIN
  IF _uid IS NULL THEN RAISE EXCEPTION 'Sign in required'; END IF;
  IF _bets IS NULL OR jsonb_typeof(_bets) <> 'array' OR jsonb_array_length(_bets) = 0 THEN
    RAISE EXCEPTION 'Place at least one bet';
  END IF;
  IF jsonb_array_length(_bets) > 20 THEN RAISE EXCEPTION 'Up to 20 bets per roll'; END IF;

  FOR _bet IN SELECT * FROM jsonb_array_elements(_bets) LOOP
    _type := _bet->>'type';
    _value := coalesce((_bet->>'value')::int, 0);
    _amount := (_bet->>'amount')::int;
    IF _type NOT IN ('small','big','odd','even','total','any_triple','triple','double','single') THEN
      RAISE EXCEPTION 'Unknown bet';
    END IF;
    IF _type = 'total' AND _value NOT BETWEEN 4 AND 17 THEN RAISE EXCEPTION 'Totals are 4 to 17'; END IF;
    IF _type IN ('triple','double','single') AND _value NOT BETWEEN 1 AND 6 THEN RAISE EXCEPTION 'Dice numbers are 1 to 6'; END IF;
    IF _amount IS NULL OR _amount < 10 THEN RAISE EXCEPTION 'Each bet is at least 10 coins'; END IF;
    _stake := _stake + _amount;
  END LOOP;
  IF _stake > 500 THEN RAISE EXCEPTION 'Up to 500 coins per roll'; END IF;

  PERFORM public.get_coin_wallet();
  SELECT * INTO _w FROM public.user_coin_wallets WHERE user_id = _uid FOR UPDATE;
  IF _w.balance < _stake THEN RAISE EXCEPTION 'Not enough coins'; END IF;

  UPDATE public.user_coin_wallets SET balance = balance - _stake, updated_at = now()
   WHERE user_id = _uid RETURNING * INTO _w;
  INSERT INTO public.coin_transactions (user_id, amount, reason, balance_after)
    VALUES (_uid, -_stake, 'game_bet', _w.balance);

  _dice := ARRAY[public.sicbo_die(), public.sicbo_die(), public.sicbo_die()];

  FOR _bet IN SELECT * FROM jsonb_array_elements(_bets) LOOP
    _ret := public.sicbo_bet_return(_bet->>'type', coalesce((_bet->>'value')::int, 0), (_bet->>'amount')::int, _dice);
    _payout := _payout + _ret;
    _results := _results || jsonb_build_array(jsonb_build_object(
      'type', _bet->>'type', 'value', coalesce((_bet->>'value')::int, 0), 'amount', (_bet->>'amount')::int, 'return', _ret));
  END LOOP;

  IF _payout > 0 THEN
    UPDATE public.user_coin_wallets SET balance = balance + _payout, updated_at = now()
     WHERE user_id = _uid RETURNING * INTO _w;
    INSERT INTO public.coin_transactions (user_id, amount, reason, balance_after)
      VALUES (_uid, _payout, 'game_payout', _w.balance);
  END IF;

  INSERT INTO public.sicbo_rounds (user_id, dice, bets, stake, payout)
    VALUES (_uid, _dice, _results, _stake, _payout) RETURNING * INTO _round;

  RETURN jsonb_build_object('id', _round.id, 'dice', to_jsonb(_dice), 'bets', _results,
    'stake', _stake, 'payout', _payout, 'balance', _w.balance);
END;
$$;

REVOKE EXECUTE ON FUNCTION public.sicbo_die() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.sicbo_roll(jsonb) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.sicbo_roll(jsonb) TO authenticated;