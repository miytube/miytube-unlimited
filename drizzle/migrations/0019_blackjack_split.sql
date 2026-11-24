ALTER TABLE public.blackjack_hands
  ADD COLUMN split_hand smallint[],
  ADD COLUMN split_bet integer NOT NULL DEFAULT 0,
  ADD COLUMN split_doubled boolean NOT NULL DEFAULT false,
  ADD COLUMN split_status text CHECK (split_status IS NULL OR split_status IN ('win','push','lose','bust')),
  ADD COLUMN split_payout integer NOT NULL DEFAULT 0,
  ADD COLUMN active_hand smallint NOT NULL DEFAULT 1 CHECK (active_hand IN (1, 2));

-- What the member may see. Hole card stays hidden until every hand is finished.
CREATE OR REPLACE FUNCTION public.bj_view(_h public.blackjack_hands)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE
  _live boolean := _h.status = 'playing';
  _split boolean := _h.split_hand IS NOT NULL;
  _second boolean := _h.split_hand IS NOT NULL AND _h.active_hand = 2;
  _cards smallint[]; _stake int; _dbl boolean;
  _dealer smallint[]; _bal int;
BEGIN
  _dealer := CASE WHEN _live THEN _h.dealer[1:1] ELSE _h.dealer END;
  _cards := CASE WHEN _second THEN _h.split_hand ELSE _h.player END;
  _stake := CASE WHEN _second THEN _h.split_bet ELSE _h.bet END;
  _dbl := CASE WHEN _second THEN _h.split_doubled ELSE _h.doubled END;
  SELECT balance INTO _bal FROM public.user_coin_wallets WHERE user_id = _h.user_id;
  RETURN jsonb_build_object(
    'id', _h.id, 'bet', _h.bet, 'doubled', _h.doubled, 'status', _h.status, 'payout', _h.payout,
    'player', to_jsonb(_h.player), 'dealer', to_jsonb(_dealer),
    'dealer_hidden', CASE WHEN _live THEN 1 ELSE 0 END,
    'player_total', public.bj_hand_value(_h.player),
    'dealer_total', public.bj_hand_value(_dealer),
    'split', to_jsonb(_h.split_hand),
    'split_bet', _h.split_bet,
    'split_doubled', _h.split_doubled,
    'split_status', _h.split_status,
    'split_payout', _h.split_payout,
    'split_total', CASE WHEN _split THEN public.bj_hand_value(_h.split_hand) ELSE NULL END,
    'active_hand', _h.active_hand,
    'can_double', _live AND array_length(_cards, 1) = 2 AND NOT _dbl AND coalesce(_bal, 0) >= _stake,
    'can_split', _live AND NOT _split AND array_length(_h.player, 1) = 2 AND NOT _h.doubled
                 AND _h.player[1] % 13 = _h.player[2] % 13 AND coalesce(_bal, 0) >= _h.bet,
    'balance', coalesce(_bal, 0)
  );
END;
$$;

-- Dealer plays out (stands on all 17s) unless every hand busted; each hand is paid on its own.
CREATE OR REPLACE FUNCTION public.bj_settle(_hand_id uuid)
RETURNS public.blackjack_hands LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE
  _h public.blackjack_hands; _split boolean; _p int; _s int; _d int;
  _status text; _sstatus text; _payout int := 0; _spayout int := 0; _bal int;
BEGIN
  SELECT * INTO _h FROM public.blackjack_hands WHERE id = _hand_id FOR UPDATE;
  IF _h.status <> 'playing' THEN RETURN _h; END IF;
  _split := _h.split_hand IS NOT NULL;
  _p := public.bj_hand_value(_h.player);
  _s := CASE WHEN _split THEN public.bj_hand_value(_h.split_hand) ELSE 99 END;
  IF _p <= 21 OR _s <= 21 THEN
    WHILE public.bj_hand_value(_h.dealer) < 17 LOOP
      _h.dealer := _h.dealer || _h.deck[1];
      _h.deck := _h.deck[2:];
    END LOOP;
  END IF;
  _d := public.bj_hand_value(_h.dealer);

  IF _p > 21 THEN _status := 'bust';
  ELSIF _d > 21 OR _p > _d THEN _status := 'win'; _payout := _h.bet * 2;
  ELSIF _p = _d THEN _status := 'push'; _payout := _h.bet;
  ELSE _status := 'lose';
  END IF;

  IF _split THEN
    IF _s > 21 THEN _sstatus := 'bust';
    ELSIF _d > 21 OR _s > _d THEN _sstatus := 'win'; _spayout := _h.split_bet * 2;
    ELSIF _s = _d THEN _sstatus := 'push'; _spayout := _h.split_bet;
    ELSE _sstatus := 'lose';
    END IF;
  END IF;

  UPDATE public.blackjack_hands
     SET dealer = _h.dealer, deck = _h.deck, status = _status, payout = _payout,
         split_status = _sstatus, split_payout = _spayout, settled_at = now()
   WHERE id = _h.id RETURNING * INTO _h;
  IF _payout + _spayout > 0 THEN
    UPDATE public.user_coin_wallets SET balance = balance + _payout + _spayout, updated_at = now()
     WHERE user_id = _h.user_id RETURNING balance INTO _bal;
    INSERT INTO public.coin_transactions (user_id, amount, reason, balance_after)
      VALUES (_h.user_id, _payout + _spayout, 'game_payout', _bal);
  END IF;
  RETURN _h;
END;
$$;

-- The hand in play is done: move to the second split hand, or let the dealer play.
CREATE OR REPLACE FUNCTION public.bj_finish_active(_hand_id uuid)
RETURNS public.blackjack_hands LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE _h public.blackjack_hands;
BEGIN
  SELECT * INTO _h FROM public.blackjack_hands WHERE id = _hand_id FOR UPDATE;
  IF _h.status <> 'playing' THEN RETURN _h; END IF;
  IF _h.split_hand IS NOT NULL AND _h.active_hand = 1 THEN
    UPDATE public.blackjack_hands SET active_hand = 2 WHERE id = _h.id RETURNING * INTO _h;
    IF public.bj_hand_value(_h.split_hand) < 21 THEN RETURN _h; END IF;
  END IF;
  RETURN public.bj_settle(_h.id);
END;
$$;

CREATE OR REPLACE FUNCTION public.blackjack_hit(_hand_id uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE _uid uuid := auth.uid(); _h public.blackjack_hands; _second boolean;
BEGIN
  IF _uid IS NULL THEN RAISE EXCEPTION 'Sign in required'; END IF;
  SELECT * INTO _h FROM public.blackjack_hands WHERE id = _hand_id AND user_id = _uid FOR UPDATE;
  IF NOT FOUND OR _h.status <> 'playing' THEN RAISE EXCEPTION 'That hand is already over'; END IF;
  _second := _h.split_hand IS NOT NULL AND _h.active_hand = 2;
  IF _second THEN
    UPDATE public.blackjack_hands SET split_hand = split_hand || deck[1], deck = deck[2:]
     WHERE id = _h.id RETURNING * INTO _h;
    IF public.bj_hand_value(_h.split_hand) >= 21 THEN _h := public.bj_finish_active(_h.id); END IF;
  ELSE
    UPDATE public.blackjack_hands SET player = player || deck[1], deck = deck[2:]
     WHERE id = _h.id RETURNING * INTO _h;
    IF public.bj_hand_value(_h.player) >= 21 THEN _h := public.bj_finish_active(_h.id); END IF;
  END IF;
  RETURN public.bj_view(_h);
END;
$$;

CREATE OR REPLACE FUNCTION public.blackjack_stand(_hand_id uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE _uid uuid := auth.uid(); _h public.blackjack_hands;
BEGIN
  IF _uid IS NULL THEN RAISE EXCEPTION 'Sign in required'; END IF;
  SELECT * INTO _h FROM public.blackjack_hands WHERE id = _hand_id AND user_id = _uid FOR UPDATE;
  IF NOT FOUND OR _h.status <> 'playing' THEN RAISE EXCEPTION 'That hand is already over'; END IF;
  _h := public.bj_finish_active(_h.id);
  RETURN public.bj_view(_h);
END;
$$;

CREATE OR REPLACE FUNCTION public.blackjack_double(_hand_id uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE
  _uid uuid := auth.uid(); _h public.blackjack_hands; _w public.user_coin_wallets;
  _second boolean; _cards smallint[]; _stake int; _dbl boolean;
BEGIN
  IF _uid IS NULL THEN RAISE EXCEPTION 'Sign in required'; END IF;
  SELECT * INTO _w FROM public.user_coin_wallets WHERE user_id = _uid FOR UPDATE;
  SELECT * INTO _h FROM public.blackjack_hands WHERE id = _hand_id AND user_id = _uid FOR UPDATE;
  IF NOT FOUND OR _h.status <> 'playing' THEN RAISE EXCEPTION 'That hand is already over'; END IF;
  _second := _h.split_hand IS NOT NULL AND _h.active_hand = 2;
  _cards := CASE WHEN _second THEN _h.split_hand ELSE _h.player END;
  _stake := CASE WHEN _second THEN _h.split_bet ELSE _h.bet END;
  _dbl := CASE WHEN _second THEN _h.split_doubled ELSE _h.doubled END;
  IF array_length(_cards, 1) <> 2 OR _dbl THEN RAISE EXCEPTION 'You can only double on your first two cards'; END IF;
  IF _w.balance < _stake THEN RAISE EXCEPTION 'Not enough coins to double'; END IF;
  UPDATE public.user_coin_wallets SET balance = balance - _stake, updated_at = now()
   WHERE user_id = _uid RETURNING * INTO _w;
  INSERT INTO public.coin_transactions (user_id, amount, reason, balance_after)
    VALUES (_uid, -_stake, 'game_bet', _w.balance);
  IF _second THEN
    UPDATE public.blackjack_hands
       SET split_bet = split_bet * 2, split_doubled = true, split_hand = split_hand || deck[1], deck = deck[2:]
     WHERE id = _h.id RETURNING * INTO _h;
  ELSE
    UPDATE public.blackjack_hands
       SET bet = bet * 2, doubled = true, player = player || deck[1], deck = deck[2:]
     WHERE id = _h.id RETURNING * INTO _h;
  END IF;
  _h := public.bj_finish_active(_h.id);
  RETURN public.bj_view(_h);
END;
$$;

-- Split a pair into two hands with a matching second bet. Once per hand; split aces get one card each.
CREATE OR REPLACE FUNCTION public.blackjack_split(_hand_id uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE _uid uuid := auth.uid(); _h public.blackjack_hands; _w public.user_coin_wallets; _aces boolean;
BEGIN
  IF _uid IS NULL THEN RAISE EXCEPTION 'Sign in required'; END IF;
  SELECT * INTO _w FROM public.user_coin_wallets WHERE user_id = _uid FOR UPDATE;
  SELECT * INTO _h FROM public.blackjack_hands WHERE id = _hand_id AND user_id = _uid FOR UPDATE;
  IF NOT FOUND OR _h.status <> 'playing' THEN RAISE EXCEPTION 'That hand is already over'; END IF;
  IF _h.split_hand IS NOT NULL THEN RAISE EXCEPTION 'You can only split once per hand'; END IF;
  IF array_length(_h.player, 1) <> 2 OR _h.doubled OR _h.player[1] % 13 <> _h.player[2] % 13 THEN
    RAISE EXCEPTION 'You can only split two cards of the same rank';
  END IF;
  IF _w.balance < _h.bet THEN RAISE EXCEPTION 'Not enough coins to split'; END IF;
  UPDATE public.user_coin_wallets SET balance = balance - _h.bet, updated_at = now()
   WHERE user_id = _uid RETURNING * INTO _w;
  INSERT INTO public.coin_transactions (user_id, amount, reason, balance_after)
    VALUES (_uid, -_h.bet, 'game_bet', _w.balance);
  _aces := _h.player[1] % 13 = 0;
  UPDATE public.blackjack_hands
     SET player = ARRAY[player[1], deck[1]],
         split_hand = ARRAY[player[2], deck[2]],
         deck = deck[3:],
         split_bet = bet,
         active_hand = 1
   WHERE id = _h.id RETURNING * INTO _h;
  IF _aces THEN
    _h := public.bj_settle(_h.id);
  ELSIF public.bj_hand_value(_h.player) = 21 THEN
    _h := public.bj_finish_active(_h.id);
  END IF;
  RETURN public.bj_view(_h);
END;
$$;

CREATE OR REPLACE FUNCTION public.blackjack_current()
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE _uid uuid := auth.uid(); _h public.blackjack_hands; _recent jsonb;
BEGIN
  IF _uid IS NULL THEN RAISE EXCEPTION 'Sign in required'; END IF;
  SELECT * INTO _h FROM public.blackjack_hands WHERE user_id = _uid AND status = 'playing' LIMIT 1;
  SELECT coalesce(jsonb_agg(jsonb_build_object('status', r.status, 'bet', r.bet, 'payout', r.payout) ORDER BY r.created_at DESC), '[]'::jsonb)
    INTO _recent
    FROM (SELECT CASE WHEN split_hand IS NOT NULL THEN 'split' ELSE status END AS status,
                 bet + split_bet AS bet, payout + split_payout AS payout, created_at
            FROM public.blackjack_hands
           WHERE user_id = _uid AND status <> 'playing' ORDER BY created_at DESC LIMIT 10) r;
  RETURN jsonb_build_object('hand', CASE WHEN _h.id IS NULL THEN NULL ELSE public.bj_view(_h) END, 'recent', _recent);
END;
$$;

REVOKE EXECUTE ON FUNCTION public.bj_view(public.blackjack_hands) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.bj_settle(uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.bj_finish_active(uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.blackjack_split(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.blackjack_split(uuid) TO authenticated;