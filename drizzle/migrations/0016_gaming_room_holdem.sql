-- Shared poker hand scoring (cards 0..51; rank = card % 13 with 0 = Ace; suit = card / 13).
-- Score = category << 20 | five tiebreak ranks (2..14) in 4-bit slots. Categories:
-- 0 high card, 1 pair, 2 two pair, 3 trips, 4 straight, 5 flush, 6 full house, 7 quads, 8 straight flush.
CREATE OR REPLACE FUNCTION public.poker_score5(_c smallint[])
RETURNS integer LANGUAGE plpgsql IMMUTABLE SET search_path TO 'public' AS $$
DECLARE
  _v int[]; _flush boolean; _straight boolean := false; _high int := 0; _cat int; _tb int[]; _counts int[];
  _i int; _score int := 0;
BEGIN
  SELECT array_agg(CASE WHEN x % 13 = 0 THEN 14 ELSE x % 13 + 1 END ORDER BY CASE WHEN x % 13 = 0 THEN 14 ELSE x % 13 + 1 END DESC)
    INTO _v FROM unnest(_c) x;
  _flush := (SELECT count(DISTINCT x / 13) FROM unnest(_c) x) = 1;
  IF (SELECT count(DISTINCT v) FROM unnest(_v) v) = 5 THEN
    IF _v[1] - _v[5] = 4 THEN _straight := true; _high := _v[1];
    ELSIF _v = ARRAY[14,5,4,3,2] THEN _straight := true; _high := 5;
    END IF;
  END IF;
  -- ranks grouped by (count desc, rank desc)
  SELECT array_agg(v ORDER BY n DESC, v DESC), array_agg(n ORDER BY n DESC, v DESC)
    INTO _tb, _counts FROM (SELECT v, count(*)::int n FROM unnest(_v) v GROUP BY v) g;
  IF _straight AND _flush THEN _cat := 8; _tb := ARRAY[_high];
  ELSIF _counts[1] = 4 THEN _cat := 7;
  ELSIF _counts[1] = 3 AND _counts[2] = 2 THEN _cat := 6;
  ELSIF _flush THEN _cat := 5; _tb := _v;
  ELSIF _straight THEN _cat := 4; _tb := ARRAY[_high];
  ELSIF _counts[1] = 3 THEN _cat := 3;
  ELSIF _counts[1] = 2 AND _counts[2] = 2 THEN _cat := 2;
  ELSIF _counts[1] = 2 THEN _cat := 1;
  ELSE _cat := 0; _tb := _v;
  END IF;
  FOR _i IN 1..5 LOOP
    _score := _score * 16 + coalesce(_tb[_i], 0);
  END LOOP;
  RETURN (_cat << 20) | _score;
END;
$$;

-- Best five-card score from any 5..7 cards.
CREATE OR REPLACE FUNCTION public.poker_best(_c smallint[])
RETURNS integer LANGUAGE plpgsql IMMUTABLE SET search_path TO 'public' AS $$
DECLARE _n int := array_length(_c, 1); _best int := -1; _s int; a int; b int; c int; d int; e int;
BEGIN
  FOR a IN 1.._n-4 LOOP FOR b IN a+1.._n-3 LOOP FOR c IN b+1.._n-2 LOOP FOR d IN c+1.._n-1 LOOP FOR e IN d+1.._n LOOP
    _s := public.poker_score5(ARRAY[_c[a], _c[b], _c[c], _c[d], _c[e]]);
    IF _s > _best THEN _best := _s; END IF;
  END LOOP; END LOOP; END LOOP; END LOOP; END LOOP;
  RETURN _best;
END;
$$;

-- Deck layout per hand: [1..2] player, [3..4] dealer, [5..9] board.
CREATE TABLE public.holdem_hands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  ante integer NOT NULL CHECK (ante > 0),
  call_bet integer NOT NULL DEFAULT 0,
  cards smallint[] NOT NULL,
  status text NOT NULL DEFAULT 'playing'
    CHECK (status IN ('playing','folded','win','lose','push','dealer_no_qualify')),
  payout integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  settled_at timestamptz
);
CREATE UNIQUE INDEX holdem_hands_one_live_per_user ON public.holdem_hands (user_id) WHERE status = 'playing';
CREATE INDEX holdem_hands_user_idx ON public.holdem_hands (user_id, created_at DESC);
REVOKE ALL ON public.holdem_hands FROM PUBLIC, anon, authenticated;
GRANT ALL ON public.holdem_hands TO service_role;
ALTER TABLE public.holdem_hands ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.holdem_ante_odds(_score integer)
RETURNS integer LANGUAGE sql IMMUTABLE SET search_path TO 'public' AS $$
  SELECT CASE
    WHEN _score >> 20 = 8 AND (_score >> 16) & 15 = 14 THEN 100
    WHEN _score >> 20 = 8 THEN 20
    WHEN _score >> 20 = 7 THEN 10
    WHEN _score >> 20 = 6 THEN 3
    WHEN _score >> 20 = 5 THEN 2
    ELSE 1 END;
$$;

CREATE OR REPLACE FUNCTION public.holdem_view(_h public.holdem_hands)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE _live boolean := _h.status = 'playing'; _folded boolean := _h.status = 'folded'; _bal int; _board smallint[];
BEGIN
  SELECT balance INTO _bal FROM public.user_coin_wallets WHERE user_id = _h.user_id;
  _board := CASE WHEN _live OR _folded THEN _h.cards[5:7] ELSE _h.cards[5:9] END;
  RETURN jsonb_build_object(
    'id', _h.id, 'ante', _h.ante, 'call_bet', _h.call_bet, 'status', _h.status, 'payout', _h.payout,
    'player', to_jsonb(_h.cards[1:2]),
    'dealer', CASE WHEN _live OR _folded THEN '[]'::jsonb ELSE to_jsonb(_h.cards[3:4]) END,
    'board', to_jsonb(_board),
    'player_score', public.poker_best(_h.cards[1:2] || _board),
    'dealer_score', CASE WHEN _live OR _folded THEN NULL ELSE public.poker_best(_h.cards[3:4] || _board) END,
    'can_call', _live AND coalesce(_bal, 0) >= _h.ante * 2,
    'balance', coalesce(_bal, 0)
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.holdem_deal(_ante integer)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE _uid uuid := auth.uid(); _w public.user_coin_wallets; _deck smallint[]; _h public.holdem_hands;
BEGIN
  IF _uid IS NULL THEN RAISE EXCEPTION 'Sign in required'; END IF;
  IF _ante IS NULL OR _ante < 10 OR _ante > 100 THEN RAISE EXCEPTION 'Antes are 10 to 100 coins'; END IF;
  PERFORM public.get_coin_wallet();
  SELECT * INTO _w FROM public.user_coin_wallets WHERE user_id = _uid FOR UPDATE;
  IF EXISTS (SELECT 1 FROM public.holdem_hands WHERE user_id = _uid AND status = 'playing') THEN
    RAISE EXCEPTION 'Finish your current hand first';
  END IF;
  IF _w.balance < _ante THEN RAISE EXCEPTION 'Not enough coins'; END IF;
  UPDATE public.user_coin_wallets SET balance = balance - _ante, updated_at = now() WHERE user_id = _uid RETURNING * INTO _w;
  INSERT INTO public.coin_transactions (user_id, amount, reason, balance_after) VALUES (_uid, -_ante, 'game_bet', _w.balance);
  SELECT array_agg(c::smallint ORDER BY gen_random_uuid()) INTO _deck FROM generate_series(0, 51) c;
  INSERT INTO public.holdem_hands (user_id, ante, cards) VALUES (_uid, _ante, _deck[1:9]) RETURNING * INTO _h;
  RETURN public.holdem_view(_h);
END;
$$;

CREATE OR REPLACE FUNCTION public.holdem_fold(_hand_id uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE _uid uuid := auth.uid(); _h public.holdem_hands;
BEGIN
  IF _uid IS NULL THEN RAISE EXCEPTION 'Sign in required'; END IF;
  UPDATE public.holdem_hands SET status = 'folded', settled_at = now()
   WHERE id = _hand_id AND user_id = _uid AND status = 'playing' RETURNING * INTO _h;
  IF NOT FOUND THEN RAISE EXCEPTION 'That hand is already over'; END IF;
  RETURN public.holdem_view(_h);
END;
$$;

CREATE OR REPLACE FUNCTION public.holdem_call(_hand_id uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE
  _uid uuid := auth.uid(); _w public.user_coin_wallets; _h public.holdem_hands;
  _ps int; _ds int; _call int; _status text; _payout int; _qualifies boolean;
BEGIN
  IF _uid IS NULL THEN RAISE EXCEPTION 'Sign in required'; END IF;
  SELECT * INTO _w FROM public.user_coin_wallets WHERE user_id = _uid FOR UPDATE;
  SELECT * INTO _h FROM public.holdem_hands WHERE id = _hand_id AND user_id = _uid FOR UPDATE;
  IF NOT FOUND OR _h.status <> 'playing' THEN RAISE EXCEPTION 'That hand is already over'; END IF;
  _call := _h.ante * 2;
  IF _w.balance < _call THEN RAISE EXCEPTION 'Not enough coins to call'; END IF;
  UPDATE public.user_coin_wallets SET balance = balance - _call, updated_at = now() WHERE user_id = _uid RETURNING * INTO _w;
  INSERT INTO public.coin_transactions (user_id, amount, reason, balance_after) VALUES (_uid, -_call, 'game_bet', _w.balance);

  _ps := public.poker_best(_h.cards[1:2] || _h.cards[5:9]);
  _ds := public.poker_best(_h.cards[3:4] || _h.cards[5:9]);
  -- Dealer qualifies with a pair of 4s or better.
  _qualifies := (_ds >> 20) >= 2 OR ((_ds >> 20) = 1 AND ((_ds >> 16) & 15) >= 4);
  IF NOT _qualifies THEN
    _status := 'dealer_no_qualify'; _payout := _h.ante * (public.holdem_ante_odds(_ps) + 1) + _call;
  ELSIF _ps > _ds THEN
    _status := 'win'; _payout := _h.ante * (public.holdem_ante_odds(_ps) + 1) + _call * 2;
  ELSIF _ps = _ds THEN
    _status := 'push'; _payout := _h.ante + _call;
  ELSE
    _status := 'lose'; _payout := 0;
  END IF;

  UPDATE public.holdem_hands SET call_bet = _call, status = _status, payout = _payout, settled_at = now()
   WHERE id = _h.id RETURNING * INTO _h;
  IF _payout > 0 THEN
    UPDATE public.user_coin_wallets SET balance = balance + _payout, updated_at = now() WHERE user_id = _uid RETURNING * INTO _w;
    INSERT INTO public.coin_transactions (user_id, amount, reason, balance_after) VALUES (_uid, _payout, 'game_payout', _w.balance);
  END IF;
  RETURN public.holdem_view(_h);
END;
$$;

CREATE OR REPLACE FUNCTION public.holdem_current()
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE _uid uuid := auth.uid(); _h public.holdem_hands; _recent jsonb;
BEGIN
  IF _uid IS NULL THEN RAISE EXCEPTION 'Sign in required'; END IF;
  SELECT * INTO _h FROM public.holdem_hands WHERE user_id = _uid AND status = 'playing' LIMIT 1;
  SELECT coalesce(jsonb_agg(jsonb_build_object('status', r.status, 'staked', r.ante + r.call_bet, 'payout', r.payout) ORDER BY r.created_at DESC), '[]'::jsonb)
    INTO _recent
    FROM (SELECT status, ante, call_bet, payout, created_at FROM public.holdem_hands
           WHERE user_id = _uid AND status <> 'playing' ORDER BY created_at DESC LIMIT 10) r;
  RETURN jsonb_build_object('hand', CASE WHEN _h.id IS NULL THEN NULL ELSE public.holdem_view(_h) END, 'recent', _recent);
END;
$$;

REVOKE EXECUTE ON FUNCTION public.holdem_view(public.holdem_hands) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.holdem_deal(integer) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.holdem_call(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.holdem_fold(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.holdem_current() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.holdem_deal(integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.holdem_call(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.holdem_fold(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.holdem_current() TO authenticated;