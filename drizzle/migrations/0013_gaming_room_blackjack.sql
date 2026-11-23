-- Gaming Room: server-dealt Blackjack for MiyTube Coins.
ALTER TABLE public.coin_transactions DROP CONSTRAINT coin_transactions_reason_check;
ALTER TABLE public.coin_transactions ADD CONSTRAINT coin_transactions_reason_check CHECK (reason = ANY (ARRAY[
  'welcome_bonus','daily_bonus','shop_purchase','admin_adjustment','coin_pack','coin_pack_refund',
  'portrait','portrait_refund','booksem_pass','game_bet','game_payout'
]));

-- Cards are 0..51: rank = card % 13 (0 = Ace, 1..9 = 2..10, 10 J, 11 Q, 12 K), suit = card / 13.
CREATE TABLE public.blackjack_hands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  bet integer NOT NULL CHECK (bet > 0),
  doubled boolean NOT NULL DEFAULT false,
  deck smallint[] NOT NULL,
  player smallint[] NOT NULL,
  dealer smallint[] NOT NULL,
  status text NOT NULL DEFAULT 'playing'
    CHECK (status IN ('playing','blackjack','win','push','lose','bust','dealer_blackjack')),
  payout integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  settled_at timestamptz
);
CREATE UNIQUE INDEX blackjack_hands_one_live_per_user ON public.blackjack_hands (user_id) WHERE status = 'playing';
CREATE INDEX blackjack_hands_user_idx ON public.blackjack_hands (user_id, created_at DESC);

-- The deck must stay secret, so no member access at all: play goes through the functions below.
GRANT ALL ON public.blackjack_hands TO service_role;
ALTER TABLE public.blackjack_hands ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.bj_hand_value(_cards smallint[])
RETURNS integer LANGUAGE plpgsql IMMUTABLE SET search_path TO 'public' AS $$
DECLARE _total int := 0; _aces int := 0; _c smallint; _r int;
BEGIN
  FOREACH _c IN ARRAY coalesce(_cards, '{}'::smallint[]) LOOP
    _r := _c % 13;
    IF _r = 0 THEN _aces := _aces + 1; _total := _total + 11;
    ELSIF _r >= 9 THEN _total := _total + 10;
    ELSE _total := _total + _r + 1;
    END IF;
  END LOOP;
  WHILE _total > 21 AND _aces > 0 LOOP _total := _total - 10; _aces := _aces - 1; END LOOP;
  RETURN _total;
END;
$$;

-- What the member is allowed to see: the dealer's hole card stays hidden until the hand ends.
CREATE OR REPLACE FUNCTION public.bj_view(_h public.blackjack_hands)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE _live boolean := _h.status = 'playing'; _dealer smallint[]; _bal int;
BEGIN
  _dealer := CASE WHEN _live THEN _h.dealer[1:1] ELSE _h.dealer END;
  SELECT balance INTO _bal FROM public.user_coin_wallets WHERE user_id = _h.user_id;
  RETURN jsonb_build_object(
    'id', _h.id, 'bet', _h.bet, 'doubled', _h.doubled, 'status', _h.status, 'payout', _h.payout,
    'player', to_jsonb(_h.player), 'dealer', to_jsonb(_dealer),
    'dealer_hidden', CASE WHEN _live THEN 1 ELSE 0 END,
    'player_total', public.bj_hand_value(_h.player),
    'dealer_total', public.bj_hand_value(_dealer),
    'can_double', _live AND array_length(_h.player, 1) = 2 AND NOT _h.doubled AND coalesce(_bal, 0) >= _h.bet,
    'balance', coalesce(_bal, 0)
  );
END;
$$;

-- Dealer plays out (stands on all 17s), result is decided and coins are paid in one step.
CREATE OR REPLACE FUNCTION public.bj_settle(_hand_id uuid)
RETURNS public.blackjack_hands LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE _h public.blackjack_hands; _p int; _d int; _status text; _payout int := 0; _bal int;
BEGIN
  SELECT * INTO _h FROM public.blackjack_hands WHERE id = _hand_id FOR UPDATE;
  IF _h.status <> 'playing' THEN RETURN _h; END IF;
  _p := public.bj_hand_value(_h.player);
  IF _p > 21 THEN
    _status := 'bust';
  ELSE
    WHILE public.bj_hand_value(_h.dealer) < 17 LOOP
      _h.dealer := _h.dealer || _h.deck[1];
      _h.deck := _h.deck[2:];
    END LOOP;
    _d := public.bj_hand_value(_h.dealer);
    IF _d > 21 OR _p > _d THEN _status := 'win'; _payout := _h.bet * 2;
    ELSIF _p = _d THEN _status := 'push'; _payout := _h.bet;
    ELSE _status := 'lose';
    END IF;
  END IF;
  UPDATE public.blackjack_hands
     SET dealer = _h.dealer, deck = _h.deck, status = _status, payout = _payout, settled_at = now()
   WHERE id = _h.id RETURNING * INTO _h;
  IF _payout > 0 THEN
    UPDATE public.user_coin_wallets SET balance = balance + _payout, updated_at = now()
     WHERE user_id = _h.user_id RETURNING balance INTO _bal;
    INSERT INTO public.coin_transactions (user_id, amount, reason, balance_after)
      VALUES (_h.user_id, _payout, 'game_payout', _bal);
  END IF;
  RETURN _h;
END;
$$;

CREATE OR REPLACE FUNCTION public.blackjack_deal(_bet integer)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE
  _uid uuid := auth.uid();
  _w public.user_coin_wallets;
  _deck smallint[];
  _h public.blackjack_hands;
  _pbj boolean; _dbj boolean; _status text := 'playing'; _payout int := 0;
BEGIN
  IF _uid IS NULL THEN RAISE EXCEPTION 'Sign in required'; END IF;
  IF _bet IS NULL OR _bet < 10 OR _bet > 500 THEN RAISE EXCEPTION 'Bets are 10 to 500 coins'; END IF;
  PERFORM public.get_coin_wallet();
  SELECT * INTO _w FROM public.user_coin_wallets WHERE user_id = _uid FOR UPDATE;
  IF EXISTS (SELECT 1 FROM public.blackjack_hands WHERE user_id = _uid AND status = 'playing') THEN
    RAISE EXCEPTION 'Finish your current hand first';
  END IF;
  IF _w.balance < _bet THEN RAISE EXCEPTION 'Not enough coins'; END IF;

  UPDATE public.user_coin_wallets SET balance = balance - _bet, updated_at = now()
   WHERE user_id = _uid RETURNING * INTO _w;
  INSERT INTO public.coin_transactions (user_id, amount, reason, balance_after)
    VALUES (_uid, -_bet, 'game_bet', _w.balance);

  -- Fresh shuffled 52-card deck every hand (gen_random_uuid uses a secure random source).
  SELECT array_agg(c::smallint ORDER BY gen_random_uuid()) INTO _deck FROM generate_series(0, 51) c;

  INSERT INTO public.blackjack_hands (user_id, bet, deck, player, dealer)
    VALUES (_uid, _bet, _deck[5:], ARRAY[_deck[1], _deck[3]], ARRAY[_deck[2], _deck[4]])
    RETURNING * INTO _h;

  _pbj := public.bj_hand_value(_h.player) = 21;
  _dbj := public.bj_hand_value(_h.dealer) = 21;
  IF _pbj OR _dbj THEN
    IF _pbj AND _dbj THEN _status := 'push'; _payout := _bet;
    ELSIF _pbj THEN _status := 'blackjack'; _payout := _bet + (_bet * 3) / 2;
    ELSE _status := 'dealer_blackjack';
    END IF;
    UPDATE public.blackjack_hands SET status = _status, payout = _payout, settled_at = now()
     WHERE id = _h.id RETURNING * INTO _h;
    IF _payout > 0 THEN
      UPDATE public.user_coin_wallets SET balance = balance + _payout, updated_at = now()
       WHERE user_id = _uid RETURNING * INTO _w;
      INSERT INTO public.coin_transactions (user_id, amount, reason, balance_after)
        VALUES (_uid, _payout, 'game_payout', _w.balance);
    END IF;
  END IF;
  RETURN public.bj_view(_h);
END;
$$;

CREATE OR REPLACE FUNCTION public.blackjack_hit(_hand_id uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE _uid uuid := auth.uid(); _h public.blackjack_hands;
BEGIN
  IF _uid IS NULL THEN RAISE EXCEPTION 'Sign in required'; END IF;
  SELECT * INTO _h FROM public.blackjack_hands WHERE id = _hand_id AND user_id = _uid FOR UPDATE;
  IF NOT FOUND OR _h.status <> 'playing' THEN RAISE EXCEPTION 'That hand is already over'; END IF;
  UPDATE public.blackjack_hands SET player = player || deck[1], deck = deck[2:]
   WHERE id = _h.id RETURNING * INTO _h;
  IF public.bj_hand_value(_h.player) >= 21 THEN _h := public.bj_settle(_h.id); END IF;
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
  _h := public.bj_settle(_h.id);
  RETURN public.bj_view(_h);
END;
$$;

CREATE OR REPLACE FUNCTION public.blackjack_double(_hand_id uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE _uid uuid := auth.uid(); _h public.blackjack_hands; _w public.user_coin_wallets;
BEGIN
  IF _uid IS NULL THEN RAISE EXCEPTION 'Sign in required'; END IF;
  SELECT * INTO _w FROM public.user_coin_wallets WHERE user_id = _uid FOR UPDATE;
  SELECT * INTO _h FROM public.blackjack_hands WHERE id = _hand_id AND user_id = _uid FOR UPDATE;
  IF NOT FOUND OR _h.status <> 'playing' THEN RAISE EXCEPTION 'That hand is already over'; END IF;
  IF array_length(_h.player, 1) <> 2 OR _h.doubled THEN RAISE EXCEPTION 'You can only double on your first two cards'; END IF;
  IF _w.balance < _h.bet THEN RAISE EXCEPTION 'Not enough coins to double'; END IF;
  UPDATE public.user_coin_wallets SET balance = balance - _h.bet, updated_at = now()
   WHERE user_id = _uid RETURNING * INTO _w;
  INSERT INTO public.coin_transactions (user_id, amount, reason, balance_after)
    VALUES (_uid, -_h.bet, 'game_bet', _w.balance);
  UPDATE public.blackjack_hands
     SET bet = bet * 2, doubled = true, player = player || deck[1], deck = deck[2:]
   WHERE id = _h.id RETURNING * INTO _h;
  _h := public.bj_settle(_h.id);
  RETURN public.bj_view(_h);
END;
$$;

-- Resume an unfinished hand after a refresh, plus the member's recent results.
CREATE OR REPLACE FUNCTION public.blackjack_current()
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE _uid uuid := auth.uid(); _h public.blackjack_hands; _recent jsonb;
BEGIN
  IF _uid IS NULL THEN RAISE EXCEPTION 'Sign in required'; END IF;
  SELECT * INTO _h FROM public.blackjack_hands WHERE user_id = _uid AND status = 'playing' LIMIT 1;
  SELECT coalesce(jsonb_agg(jsonb_build_object('status', r.status, 'bet', r.bet, 'payout', r.payout) ORDER BY r.created_at DESC), '[]'::jsonb)
    INTO _recent
    FROM (SELECT status, bet, payout, created_at FROM public.blackjack_hands
           WHERE user_id = _uid AND status <> 'playing' ORDER BY created_at DESC LIMIT 10) r;
  RETURN jsonb_build_object('hand', CASE WHEN _h.id IS NULL THEN NULL ELSE public.bj_view(_h) END, 'recent', _recent);
END;
$$;

REVOKE EXECUTE ON FUNCTION public.bj_view(public.blackjack_hands) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.bj_settle(uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.blackjack_deal(integer) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.blackjack_hit(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.blackjack_stand(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.blackjack_double(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.blackjack_current() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.blackjack_deal(integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.blackjack_hit(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.blackjack_stand(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.blackjack_double(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.blackjack_current() TO authenticated;