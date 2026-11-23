-- Pai Gow Tiles: 32 Chinese dominoes. Tile ids 0-21 = 11 civil pairs, 22-29 = military singles
-- pairing by total (9s, 8s, 7s, 5s), 30/31 = Gee Joon (1-2, 2-4). Mirrors src/lib/paigowTiles.ts.
CREATE OR REPLACE FUNCTION public.pgtiles_rank(_t smallint)
RETURNS integer LANGUAGE sql IMMUTABLE SET search_path TO 'public' AS $$
  SELECT CASE WHEN _t < 22 THEN _t / 2 + 1 ELSE 12 + (_t - 22) / 2 END;
$$;

CREATE OR REPLACE FUNCTION public.pgtiles_pips(_t smallint)
RETURNS integer LANGUAGE sql IMMUTABLE SET search_path TO 'public' AS $$
  SELECT (ARRAY[12,12,2,2,8,8,4,4,10,10,6,6,4,4,11,11,10,10,7,7,6,6,9,9,8,8,7,7,5,5,3,6])[_t + 1];
$$;

-- Pairs 3001-3016 (Gee Joon best) > Wong 2001-2002 > Gong 1901-1902 > 100*points + better tile; 0 points = 0.
CREATE OR REPLACE FUNCTION public.pgtiles_score(_a smallint, _b smallint)
RETURNS integer LANGUAGE plpgsql IMMUTABLE SET search_path TO 'public' AS $$
DECLARE _ra int := public.pgtiles_rank(_a); _rb int := public.pgtiles_rank(_b);
        _va int[]; _vb int[]; _x int; _y int; _pts int := 0;
BEGIN
  IF _ra = _rb THEN RETURN 3000 + 16 - CASE WHEN _ra = 16 THEN 0 ELSE _ra END; END IF;
  IF _ra <= 2 AND _b IN (22, 23) THEN RETURN 2003 - _ra; END IF;
  IF _rb <= 2 AND _a IN (22, 23) THEN RETURN 2003 - _rb; END IF;
  IF _ra <= 2 AND _b IN (4, 5, 24, 25) THEN RETURN 1903 - _ra; END IF;
  IF _rb <= 2 AND _a IN (4, 5, 24, 25) THEN RETURN 1903 - _rb; END IF;
  _va := CASE WHEN _a >= 30 THEN ARRAY[3, 6] ELSE ARRAY[public.pgtiles_pips(_a)] END;
  _vb := CASE WHEN _b >= 30 THEN ARRAY[3, 6] ELSE ARRAY[public.pgtiles_pips(_b)] END;
  FOREACH _x IN ARRAY _va LOOP
    FOREACH _y IN ARRAY _vb LOOP
      _pts := greatest(_pts, (_x + _y) % 10);
    END LOOP;
  END LOOP;
  IF _pts = 0 THEN RETURN 0; END IF;
  RETURN 100 * _pts + 17 - least(_ra, _rb);
END;
$$;

CREATE OR REPLACE FUNCTION public.pgtiles_score2(_h smallint[])
RETURNS integer LANGUAGE sql IMMUTABLE SET search_path TO 'public' AS $$
  SELECT public.pgtiles_score(_h[1], _h[2]);
$$;

-- Given 4 tiles and a 2-tile pairing, the stronger pairing (the high hand).
CREATE OR REPLACE FUNCTION public.pgtiles_high_of(_t smallint[], _pair smallint[])
RETURNS smallint[] LANGUAGE plpgsql IMMUTABLE SET search_path TO 'public' AS $$
DECLARE _rest smallint[] := public.paigow_rest(_t, _pair);
BEGIN
  IF public.pgtiles_score2(_pair) >= public.pgtiles_score2(_rest) THEN RETURN _pair; END IF;
  RETURN _rest;
END;
$$;

-- House way: keep a pair together when there is one; otherwise the strongest low hand, then high hand.
CREATE OR REPLACE FUNCTION public.pgtiles_house_high(_t smallint[])
RETURNS smallint[] LANGUAGE plpgsql IMMUTABLE SET search_path TO 'public' AS $$
DECLARE _j int; _hi smallint[]; _hs int; _ls int; _k int[]; _bk int[] := NULL; _best smallint[]; _pair_seen boolean := false;
BEGIN
  FOR _j IN 2..4 LOOP
    IF public.pgtiles_score2(public.pgtiles_high_of(_t, ARRAY[_t[1], _t[_j]])) >= 3000 THEN _pair_seen := true; END IF;
  END LOOP;
  FOR _j IN 2..4 LOOP
    _hi := public.pgtiles_high_of(_t, ARRAY[_t[1], _t[_j]]);
    _hs := public.pgtiles_score2(_hi);
    _ls := public.pgtiles_score2(public.paigow_rest(_t, _hi));
    CONTINUE WHEN _pair_seen AND _hs < 3000;
    _k := ARRAY[_ls, _hs];
    IF _bk IS NULL OR _k > _bk THEN _bk := _k; _best := _hi; END IF;
  END LOOP;
  RETURN _best;
END;
$$;

-- Tiles per hand: [1..4] player, [5..8] banker.
CREATE TABLE public.pgtiles_hands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  bet integer NOT NULL CHECK (bet > 0),
  tiles smallint[] NOT NULL,
  player_high smallint[],
  dealer_high smallint[],
  status text NOT NULL DEFAULT 'playing' CHECK (status IN ('playing','win','push','lose')),
  payout integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  settled_at timestamptz
);
CREATE UNIQUE INDEX pgtiles_hands_one_live_per_user ON public.pgtiles_hands (user_id) WHERE status = 'playing';
CREATE INDEX pgtiles_hands_user_idx ON public.pgtiles_hands (user_id, created_at DESC);
REVOKE ALL ON public.pgtiles_hands FROM PUBLIC, anon, authenticated;
GRANT ALL ON public.pgtiles_hands TO service_role;
ALTER TABLE public.pgtiles_hands ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.pgtiles_view(_h public.pgtiles_hands)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE _live boolean := _h.status = 'playing'; _bal int; _p smallint[] := _h.tiles[1:4]; _d smallint[] := _h.tiles[5:8];
BEGIN
  SELECT balance INTO _bal FROM public.user_coin_wallets WHERE user_id = _h.user_id;
  RETURN jsonb_build_object(
    'id', _h.id, 'bet', _h.bet, 'status', _h.status, 'payout', _h.payout,
    'player', to_jsonb(_p),
    'suggested_high', to_jsonb(public.pgtiles_house_high(_p)),
    'player_high', to_jsonb(_h.player_high),
    'dealer', CASE WHEN _live THEN '[]'::jsonb ELSE to_jsonb(_d) END,
    'dealer_high', CASE WHEN _live THEN NULL ELSE to_jsonb(_h.dealer_high) END,
    'player_high_score', CASE WHEN _live THEN NULL ELSE public.pgtiles_score2(_h.player_high) END,
    'player_low_score', CASE WHEN _live THEN NULL ELSE public.pgtiles_score2(public.paigow_rest(_p, _h.player_high)) END,
    'dealer_high_score', CASE WHEN _live THEN NULL ELSE public.pgtiles_score2(_h.dealer_high) END,
    'dealer_low_score', CASE WHEN _live THEN NULL ELSE public.pgtiles_score2(public.paigow_rest(_d, _h.dealer_high)) END,
    'balance', coalesce(_bal, 0)
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.pgtiles_deal(_bet integer)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE _uid uuid := auth.uid(); _w public.user_coin_wallets; _deck smallint[]; _h public.pgtiles_hands;
BEGIN
  IF _uid IS NULL THEN RAISE EXCEPTION 'Sign in required'; END IF;
  IF _bet IS NULL OR _bet < 10 OR _bet > 500 THEN RAISE EXCEPTION 'Bets are 10 to 500 coins'; END IF;
  PERFORM public.get_coin_wallet();
  SELECT * INTO _w FROM public.user_coin_wallets WHERE user_id = _uid FOR UPDATE;
  IF EXISTS (SELECT 1 FROM public.pgtiles_hands WHERE user_id = _uid AND status = 'playing') THEN
    RAISE EXCEPTION 'Finish your current hand first';
  END IF;
  IF _w.balance < _bet THEN RAISE EXCEPTION 'Not enough coins'; END IF;
  UPDATE public.user_coin_wallets SET balance = balance - _bet, updated_at = now() WHERE user_id = _uid RETURNING * INTO _w;
  INSERT INTO public.coin_transactions (user_id, amount, reason, balance_after) VALUES (_uid, -_bet, 'game_bet', _w.balance);
  SELECT array_agg(t::smallint ORDER BY gen_random_uuid()) INTO _deck FROM generate_series(0, 31) t;
  INSERT INTO public.pgtiles_hands (user_id, bet, tiles) VALUES (_uid, _bet, _deck[1:8]) RETURNING * INTO _h;
  RETURN public.pgtiles_view(_h);
END;
$$;

-- _pair: any 2 of the member's tiles played together; the stronger pairing becomes the high hand.
CREATE OR REPLACE FUNCTION public.pgtiles_set(_hand_id uuid, _pair smallint[])
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE
  _uid uuid := auth.uid(); _h public.pgtiles_hands; _p smallint[]; _d smallint[]; _phigh smallint[]; _dhigh smallint[];
  _wins int := 0; _status text; _payout int; _bal int;
BEGIN
  IF _uid IS NULL THEN RAISE EXCEPTION 'Sign in required'; END IF;
  SELECT * INTO _h FROM public.pgtiles_hands WHERE id = _hand_id AND user_id = _uid FOR UPDATE;
  IF NOT FOUND OR _h.status <> 'playing' THEN RAISE EXCEPTION 'That hand is already over'; END IF;
  _p := _h.tiles[1:4]; _d := _h.tiles[5:8];
  IF _pair IS NULL OR array_length(_pair, 1) <> 2 OR _pair[1] = _pair[2]
     OR NOT (_pair[1] = ANY (_p)) OR NOT (_pair[2] = ANY (_p)) THEN
    RAISE EXCEPTION 'Pick 2 of your tiles to play together';
  END IF;
  _phigh := public.pgtiles_high_of(_p, _pair);
  _dhigh := public.pgtiles_house_high(_d);
  -- Ties ("copies") go to the banker.
  IF public.pgtiles_score2(_phigh) > public.pgtiles_score2(_dhigh) THEN _wins := _wins + 1; END IF;
  IF public.pgtiles_score2(public.paigow_rest(_p, _phigh)) > public.pgtiles_score2(public.paigow_rest(_d, _dhigh)) THEN _wins := _wins + 1; END IF;
  IF _wins = 2 THEN _status := 'win'; _payout := _h.bet + (_h.bet * 95) / 100;
  ELSIF _wins = 1 THEN _status := 'push'; _payout := _h.bet;
  ELSE _status := 'lose'; _payout := 0;
  END IF;

  UPDATE public.pgtiles_hands SET player_high = _phigh, dealer_high = _dhigh, status = _status, payout = _payout, settled_at = now()
   WHERE id = _h.id RETURNING * INTO _h;
  IF _payout > 0 THEN
    UPDATE public.user_coin_wallets SET balance = balance + _payout, updated_at = now() WHERE user_id = _uid RETURNING balance INTO _bal;
    INSERT INTO public.coin_transactions (user_id, amount, reason, balance_after) VALUES (_uid, _payout, 'game_payout', _bal);
  END IF;
  RETURN public.pgtiles_view(_h);
END;
$$;

CREATE OR REPLACE FUNCTION public.pgtiles_current()
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE _uid uuid := auth.uid(); _h public.pgtiles_hands; _recent jsonb;
BEGIN
  IF _uid IS NULL THEN RAISE EXCEPTION 'Sign in required'; END IF;
  SELECT * INTO _h FROM public.pgtiles_hands WHERE user_id = _uid AND status = 'playing' LIMIT 1;
  SELECT coalesce(jsonb_agg(jsonb_build_object('status', r.status, 'bet', r.bet, 'payout', r.payout) ORDER BY r.created_at DESC), '[]'::jsonb)
    INTO _recent
    FROM (SELECT status, bet, payout, created_at FROM public.pgtiles_hands
           WHERE user_id = _uid AND status <> 'playing' ORDER BY created_at DESC LIMIT 10) r;
  RETURN jsonb_build_object('hand', CASE WHEN _h.id IS NULL THEN NULL ELSE public.pgtiles_view(_h) END, 'recent', _recent);
END;
$$;

REVOKE EXECUTE ON FUNCTION public.pgtiles_view(public.pgtiles_hands) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.pgtiles_deal(integer) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.pgtiles_set(uuid, smallint[]) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.pgtiles_current() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.pgtiles_deal(integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.pgtiles_set(uuid, smallint[]) TO authenticated;
GRANT EXECUTE ON FUNCTION public.pgtiles_current() TO authenticated;