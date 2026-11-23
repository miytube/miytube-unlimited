-- Two-card low hand score on the same scale as poker_score5: pair = 1 << 20 | rank << 16; else ranks in the top slots.
CREATE OR REPLACE FUNCTION public.poker_score2(_c smallint[])
RETURNS integer LANGUAGE plpgsql IMMUTABLE SET search_path TO 'public' AS $$
DECLARE _a int := CASE WHEN _c[1] % 13 = 0 THEN 14 ELSE _c[1] % 13 + 1 END;
        _b int := CASE WHEN _c[2] % 13 = 0 THEN 14 ELSE _c[2] % 13 + 1 END;
BEGIN
  IF _a = _b THEN RETURN (1 << 20) | (_a << 16); END IF;
  RETURN (greatest(_a, _b) << 16) | (least(_a, _b) << 12);
END;
$$;

-- Cards of _c not in _low, in order.
CREATE OR REPLACE FUNCTION public.paigow_rest(_c smallint[], _low smallint[])
RETURNS smallint[] LANGUAGE sql IMMUTABLE SET search_path TO 'public' AS $$
  SELECT array_agg(x ORDER BY i) FROM unnest(_c) WITH ORDINALITY u(x, i) WHERE NOT (x = ANY (_low));
$$;

-- Dealer "house way": which 2 of 7 cards go to the low hand.
CREATE OR REPLACE FUNCTION public.paigow_house_low(_c smallint[])
RETURNS smallint[] LANGUAGE plpgsql IMMUTABLE SET search_path TO 'public' AS $$
DECLARE
  _pairs int[]; _trips int[]; _singles int[]; _low smallint[]; _best smallint[];
  _bk int[] := NULL; _k int[]; _hi int; _lo int; i int; j int;
BEGIN
  WITH v AS (SELECT x, CASE WHEN x % 13 = 0 THEN 14 ELSE x % 13 + 1 END r FROM unnest(_c) x),
       g AS (SELECT r, count(*) n FROM v GROUP BY r)
  SELECT array_agg(r ORDER BY r DESC) FILTER (WHERE n = 2),
         array_agg(r ORDER BY r DESC) FILTER (WHERE n = 3),
         array_agg(r ORDER BY r DESC) FILTER (WHERE n = 1)
    INTO _pairs, _trips, _singles FROM g;

  IF coalesce(array_length(_trips, 1), 0) = 2 THEN
    -- two sets of trips: a pair from the higher trips goes low
    SELECT array_agg(x) INTO _low FROM (SELECT x FROM unnest(_c) x WHERE (CASE WHEN x % 13 = 0 THEN 14 ELSE x % 13 + 1 END) = _trips[1] LIMIT 2) s;
  ELSIF coalesce(array_length(_trips, 1), 0) = 1 AND coalesce(array_length(_pairs, 1), 0) >= 1 THEN
    -- full house: trips high, highest pair low
    SELECT array_agg(x) INTO _low FROM unnest(_c) x WHERE (CASE WHEN x % 13 = 0 THEN 14 ELSE x % 13 + 1 END) = _pairs[1];
  ELSIF coalesce(array_length(_trips, 1), 0) = 0 AND coalesce(array_length(_pairs, 1), 0) = 3 THEN
    -- three pairs: highest pair low
    SELECT array_agg(x) INTO _low FROM unnest(_c) x WHERE (CASE WHEN x % 13 = 0 THEN 14 ELSE x % 13 + 1 END) = _pairs[1];
  ELSIF coalesce(array_length(_trips, 1), 0) = 0 AND coalesce(array_length(_pairs, 1), 0) = 2
        AND public.poker_best(_c) >> 20 < 4 THEN
    IF 14 = ANY (_singles) AND _pairs[1] < 11 THEN
      -- small two pair with an ace: keep both pairs high, ace + next best card low
      SELECT array_agg(x) INTO _low FROM unnest(_c) x
       WHERE (CASE WHEN x % 13 = 0 THEN 14 ELSE x % 13 + 1 END) IN (14, (SELECT max(s) FROM unnest(_singles) s WHERE s <> 14));
    ELSE
      -- split: lower pair goes low
      SELECT array_agg(x) INTO _low FROM unnest(_c) x WHERE (CASE WHEN x % 13 = 0 THEN 14 ELSE x % 13 + 1 END) = _pairs[2];
    END IF;
  END IF;

  IF _low IS NOT NULL AND public.poker_score5(public.paigow_rest(_c, _low)) > public.poker_score2(_low) THEN
    RETURN _low;
  END IF;

  -- Everything else: keep the strongest high hand, then the best low hand.
  FOR i IN 1..6 LOOP
    FOR j IN i+1..7 LOOP
      _low := ARRAY[_c[i], _c[j]];
      _hi := public.poker_score5(public.paigow_rest(_c, _low));
      _lo := public.poker_score2(_low);
      CONTINUE WHEN _hi <= _lo;
      _k := ARRAY[_hi >> 20, _lo, _hi];
      IF _bk IS NULL OR _k > _bk THEN _bk := _k; _best := _low; END IF;
    END LOOP;
  END LOOP;
  RETURN _best;
END;
$$;

-- Cards per hand: [1..7] player, [8..14] dealer.
CREATE TABLE public.paigow_hands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  bet integer NOT NULL CHECK (bet > 0),
  cards smallint[] NOT NULL,
  player_low smallint[],
  dealer_low smallint[],
  status text NOT NULL DEFAULT 'playing' CHECK (status IN ('playing','win','push','lose')),
  payout integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  settled_at timestamptz
);
CREATE UNIQUE INDEX paigow_hands_one_live_per_user ON public.paigow_hands (user_id) WHERE status = 'playing';
CREATE INDEX paigow_hands_user_idx ON public.paigow_hands (user_id, created_at DESC);
REVOKE ALL ON public.paigow_hands FROM PUBLIC, anon, authenticated;
GRANT ALL ON public.paigow_hands TO service_role;
ALTER TABLE public.paigow_hands ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.paigow_view(_h public.paigow_hands)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE _live boolean := _h.status = 'playing'; _bal int; _p smallint[] := _h.cards[1:7]; _d smallint[] := _h.cards[8:14];
BEGIN
  SELECT balance INTO _bal FROM public.user_coin_wallets WHERE user_id = _h.user_id;
  RETURN jsonb_build_object(
    'id', _h.id, 'bet', _h.bet, 'status', _h.status, 'payout', _h.payout,
    'player', to_jsonb(_p),
    'suggested_low', to_jsonb(public.paigow_house_low(_p)),
    'player_low', to_jsonb(_h.player_low),
    'dealer', CASE WHEN _live THEN '[]'::jsonb ELSE to_jsonb(_d) END,
    'dealer_low', CASE WHEN _live THEN NULL ELSE to_jsonb(_h.dealer_low) END,
    'player_high_score', CASE WHEN _live THEN NULL ELSE public.poker_score5(public.paigow_rest(_p, _h.player_low)) END,
    'player_low_score', CASE WHEN _live THEN NULL ELSE public.poker_score2(_h.player_low) END,
    'dealer_high_score', CASE WHEN _live THEN NULL ELSE public.poker_score5(public.paigow_rest(_d, _h.dealer_low)) END,
    'dealer_low_score', CASE WHEN _live THEN NULL ELSE public.poker_score2(_h.dealer_low) END,
    'balance', coalesce(_bal, 0)
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.paigow_deal(_bet integer)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE _uid uuid := auth.uid(); _w public.user_coin_wallets; _deck smallint[]; _h public.paigow_hands;
BEGIN
  IF _uid IS NULL THEN RAISE EXCEPTION 'Sign in required'; END IF;
  IF _bet IS NULL OR _bet < 10 OR _bet > 500 THEN RAISE EXCEPTION 'Bets are 10 to 500 coins'; END IF;
  PERFORM public.get_coin_wallet();
  SELECT * INTO _w FROM public.user_coin_wallets WHERE user_id = _uid FOR UPDATE;
  IF EXISTS (SELECT 1 FROM public.paigow_hands WHERE user_id = _uid AND status = 'playing') THEN
    RAISE EXCEPTION 'Finish your current hand first';
  END IF;
  IF _w.balance < _bet THEN RAISE EXCEPTION 'Not enough coins'; END IF;
  UPDATE public.user_coin_wallets SET balance = balance - _bet, updated_at = now() WHERE user_id = _uid RETURNING * INTO _w;
  INSERT INTO public.coin_transactions (user_id, amount, reason, balance_after) VALUES (_uid, -_bet, 'game_bet', _w.balance);
  SELECT array_agg(c::smallint ORDER BY gen_random_uuid()) INTO _deck FROM generate_series(0, 51) c;
  INSERT INTO public.paigow_hands (user_id, bet, cards) VALUES (_uid, _bet, _deck[1:14]) RETURNING * INTO _h;
  RETURN public.paigow_view(_h);
END;
$$;

CREATE OR REPLACE FUNCTION public.paigow_set(_hand_id uuid, _low smallint[])
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE
  _uid uuid := auth.uid(); _h public.paigow_hands; _p smallint[]; _d smallint[]; _dlow smallint[];
  _ph int; _pl int; _dh int; _dl int; _wins int := 0; _status text; _payout int; _bal int;
BEGIN
  IF _uid IS NULL THEN RAISE EXCEPTION 'Sign in required'; END IF;
  SELECT * INTO _h FROM public.paigow_hands WHERE id = _hand_id AND user_id = _uid FOR UPDATE;
  IF NOT FOUND OR _h.status <> 'playing' THEN RAISE EXCEPTION 'That hand is already over'; END IF;
  _p := _h.cards[1:7]; _d := _h.cards[8:14];
  IF _low IS NULL OR array_length(_low, 1) <> 2 OR _low[1] = _low[2]
     OR NOT (_low[1] = ANY (_p)) OR NOT (_low[2] = ANY (_p)) THEN
    RAISE EXCEPTION 'Pick 2 of your cards for the low hand';
  END IF;
  _ph := public.poker_score5(public.paigow_rest(_p, _low));
  _pl := public.poker_score2(_low);
  IF _ph <= _pl THEN RAISE EXCEPTION 'Your 5-card hand must beat your 2-card hand'; END IF;

  _dlow := public.paigow_house_low(_d);
  _dh := public.poker_score5(public.paigow_rest(_d, _dlow));
  _dl := public.poker_score2(_dlow);
  -- Ties ("copies") go to the banker.
  IF _ph > _dh THEN _wins := _wins + 1; END IF;
  IF _pl > _dl THEN _wins := _wins + 1; END IF;
  IF _wins = 2 THEN _status := 'win'; _payout := _h.bet + (_h.bet * 95) / 100;
  ELSIF _wins = 1 THEN _status := 'push'; _payout := _h.bet;
  ELSE _status := 'lose'; _payout := 0;
  END IF;

  UPDATE public.paigow_hands SET player_low = _low, dealer_low = _dlow, status = _status, payout = _payout, settled_at = now()
   WHERE id = _h.id RETURNING * INTO _h;
  IF _payout > 0 THEN
    UPDATE public.user_coin_wallets SET balance = balance + _payout, updated_at = now() WHERE user_id = _uid RETURNING balance INTO _bal;
    INSERT INTO public.coin_transactions (user_id, amount, reason, balance_after) VALUES (_uid, _payout, 'game_payout', _bal);
  END IF;
  RETURN public.paigow_view(_h);
END;
$$;

CREATE OR REPLACE FUNCTION public.paigow_current()
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE _uid uuid := auth.uid(); _h public.paigow_hands; _recent jsonb;
BEGIN
  IF _uid IS NULL THEN RAISE EXCEPTION 'Sign in required'; END IF;
  SELECT * INTO _h FROM public.paigow_hands WHERE user_id = _uid AND status = 'playing' LIMIT 1;
  SELECT coalesce(jsonb_agg(jsonb_build_object('status', r.status, 'bet', r.bet, 'payout', r.payout) ORDER BY r.created_at DESC), '[]'::jsonb)
    INTO _recent
    FROM (SELECT status, bet, payout, created_at FROM public.paigow_hands
           WHERE user_id = _uid AND status <> 'playing' ORDER BY created_at DESC LIMIT 10) r;
  RETURN jsonb_build_object('hand', CASE WHEN _h.id IS NULL THEN NULL ELSE public.paigow_view(_h) END, 'recent', _recent);
END;
$$;

REVOKE EXECUTE ON FUNCTION public.paigow_view(public.paigow_hands) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.paigow_deal(integer) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.paigow_set(uuid, smallint[]) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.paigow_current() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.paigow_deal(integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.paigow_set(uuid, smallint[]) TO authenticated;
GRANT EXECUTE ON FUNCTION public.paigow_current() TO authenticated;