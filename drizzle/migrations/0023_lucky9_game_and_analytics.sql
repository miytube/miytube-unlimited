CREATE TABLE public.lucky9_hands (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL,
 bet integer NOT NULL CHECK (bet BETWEEN 10 AND 500), deck smallint[] NOT NULL,
 player smallint[] NOT NULL, dealer smallint[] NOT NULL,
 status text NOT NULL DEFAULT 'playing' CHECK (status IN ('playing','win','push','lose')),
 payout integer NOT NULL DEFAULT 0 CHECK (payout >= 0), is_natural boolean NOT NULL DEFAULT false,
 created_at timestamptz NOT NULL DEFAULT now(), settled_at timestamptz
);
GRANT ALL ON public.lucky9_hands TO service_role;
REVOKE ALL ON public.lucky9_hands FROM PUBLIC, anon, authenticated;
ALTER TABLE public.lucky9_hands ENABLE ROW LEVEL SECURITY;
-- No member policies: all card access passes through redacted RPC views.
CREATE UNIQUE INDEX lucky9_one_live_hand ON public.lucky9_hands(user_id) WHERE status = 'playing';
CREATE INDEX lucky9_member_history ON public.lucky9_hands(user_id, created_at DESC);
CREATE INDEX lucky9_analytics_date ON public.lucky9_hands(created_at);
COMMENT ON TABLE public.lucky9_hands IS 'Server-only cards and settlement. Private deck and banker cards never leave a live hand.';

CREATE FUNCTION public.lucky9_value(_cards smallint[]) RETURNS integer
LANGUAGE sql IMMUTABLE SET search_path = public AS $$
 SELECT (coalesce(sum(CASE WHEN c % 13 < 9 THEN c % 13 + 1 ELSE 0 END),0) % 10)::integer FROM unnest(_cards) c;
$$;
REVOKE EXECUTE ON FUNCTION public.lucky9_value(smallint[]) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.lucky9_value(smallint[]) TO authenticated, service_role;

CREATE FUNCTION public.lucky9_view(_h public.lucky9_hands) RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE _live boolean := _h.status = 'playing'; _balance integer;
BEGIN
 SELECT balance INTO _balance FROM public.user_coin_wallets WHERE user_id = _h.user_id;
 RETURN jsonb_build_object('id',_h.id,'bet',_h.bet,'status',_h.status,'payout',_h.payout,
 'player',to_jsonb(_h.player),'dealer',CASE WHEN _live THEN '[]'::jsonb ELSE to_jsonb(_h.dealer) END,
 'dealer_hidden',CASE WHEN _live THEN 2 ELSE 0 END,'player_total',public.lucky9_value(_h.player),
 'dealer_total',CASE WHEN _live THEN NULL ELSE public.lucky9_value(_h.dealer) END,
 'natural',_h.is_natural,'balance',coalesce(_balance,0));
END;
$$;
REVOKE EXECUTE ON FUNCTION public.lucky9_view(public.lucky9_hands) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.lucky9_view(public.lucky9_hands) TO service_role;

CREATE FUNCTION public.lucky9_finish(_hand_id uuid, _draw boolean) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _uid uuid := auth.uid(); _h public.lucky9_hands; _balance integer; _p integer; _d integer; _payout integer; _status text; _natural boolean;
BEGIN
 IF _uid IS NULL THEN RAISE EXCEPTION 'Sign in required'; END IF;
 IF _draw IS NULL THEN RAISE EXCEPTION 'Choose draw or stand'; END IF;
 -- Shared wallet-before-hand lock order prevents tab races and duplicate payments.
 SELECT balance INTO _balance FROM public.user_coin_wallets WHERE user_id = _uid FOR UPDATE;
 SELECT * INTO _h FROM public.lucky9_hands WHERE id = _hand_id AND user_id = _uid FOR UPDATE;
 IF NOT FOUND OR _h.status <> 'playing' THEN RAISE EXCEPTION 'That hand is already over'; END IF;
 _natural := public.lucky9_value(_h.player) >= 8 OR public.lucky9_value(_h.dealer) >= 8;
 IF NOT _natural THEN
  IF _draw THEN _h.player := _h.player || _h.deck[1]; _h.deck := _h.deck[2:]; END IF;
  IF public.lucky9_value(_h.dealer) <= 5 THEN _h.dealer := _h.dealer || _h.deck[1]; _h.deck := _h.deck[2:]; END IF;
 END IF;
 _p := public.lucky9_value(_h.player); _d := public.lucky9_value(_h.dealer);
 IF _p > _d THEN _status := 'win'; _payout := _h.bet * 2;
 ELSIF _p = _d THEN _status := 'push'; _payout := _h.bet;
 ELSE _status := 'lose'; _payout := 0; END IF;
 UPDATE public.lucky9_hands SET player = _h.player, dealer = _h.dealer, deck = _h.deck,
 status = _status, payout = _payout, is_natural = _natural, settled_at = now() WHERE id = _h.id RETURNING * INTO _h;
 IF _payout > 0 THEN
  UPDATE public.user_coin_wallets SET balance = balance + _payout, updated_at = now() WHERE user_id = _uid RETURNING balance INTO _balance;
  INSERT INTO public.coin_transactions(user_id,amount,reason,balance_after) VALUES (_uid,_payout,'game_payout',_balance);
 END IF;
 RETURN public.lucky9_view(_h);
END;
$$;
REVOKE EXECUTE ON FUNCTION public.lucky9_finish(uuid,boolean) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.lucky9_finish(uuid,boolean) TO service_role;

CREATE FUNCTION public.lucky9_deal(_bet integer) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _uid uuid := auth.uid(); _balance integer; _deck smallint[]; _h public.lucky9_hands;
BEGIN
 IF _uid IS NULL THEN RAISE EXCEPTION 'Sign in required'; END IF;
 IF _bet IS NULL OR _bet < 10 OR _bet > 500 THEN RAISE EXCEPTION 'Bets are 10 to 500 coins'; END IF;
 PERFORM public.get_coin_wallet();
 SELECT balance INTO _balance FROM public.user_coin_wallets WHERE user_id = _uid FOR UPDATE;
 IF EXISTS(SELECT 1 FROM public.lucky9_hands WHERE user_id = _uid AND status = 'playing') THEN RAISE EXCEPTION 'Finish your current hand first'; END IF;
 IF _balance < _bet THEN RAISE EXCEPTION 'Not enough coins'; END IF;
 UPDATE public.user_coin_wallets SET balance = balance - _bet, updated_at = now() WHERE user_id = _uid RETURNING balance INTO _balance;
 INSERT INTO public.coin_transactions(user_id,amount,reason,balance_after) VALUES (_uid,-_bet,'game_bet',_balance);
 SELECT array_agg(c::smallint ORDER BY gen_random_uuid()) INTO _deck FROM generate_series(0,51) c;
 INSERT INTO public.lucky9_hands(user_id,bet,deck,player,dealer) VALUES (_uid,_bet,_deck[5:],ARRAY[_deck[1],_deck[3]],ARRAY[_deck[2],_deck[4]]) RETURNING * INTO _h;
 IF public.lucky9_value(_h.player) >= 8 OR public.lucky9_value(_h.dealer) >= 8 THEN RETURN public.lucky9_finish(_h.id,false); END IF;
 RETURN public.lucky9_view(_h);
END;
$$;
REVOKE EXECUTE ON FUNCTION public.lucky9_deal(integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.lucky9_deal(integer) TO authenticated;
CREATE FUNCTION public.lucky9_draw(_hand_id uuid) RETURNS jsonb LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$ SELECT public.lucky9_finish(_hand_id,true); $$;
CREATE FUNCTION public.lucky9_stand(_hand_id uuid) RETURNS jsonb LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$ SELECT public.lucky9_finish(_hand_id,false); $$;
REVOKE EXECUTE ON FUNCTION public.lucky9_draw(uuid),public.lucky9_stand(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.lucky9_draw(uuid),public.lucky9_stand(uuid) TO authenticated;
CREATE FUNCTION public.lucky9_current() RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _uid uuid := auth.uid(); _h public.lucky9_hands; _recent jsonb;
BEGIN
 IF _uid IS NULL THEN RAISE EXCEPTION 'Sign in required'; END IF;
 SELECT * INTO _h FROM public.lucky9_hands WHERE user_id = _uid ORDER BY created_at DESC,id DESC LIMIT 1;
 SELECT coalesce(jsonb_agg(jsonb_build_object('status',r.status,'bet',r.bet,'payout',r.payout) ORDER BY r.created_at DESC,r.id DESC),'[]'::jsonb)
 INTO _recent FROM (SELECT id,status,bet,payout,created_at FROM public.lucky9_hands WHERE user_id = _uid AND status <> 'playing' ORDER BY created_at DESC,id DESC LIMIT 10) r;
 RETURN jsonb_build_object('hand',CASE WHEN _h.id IS NULL THEN NULL ELSE public.lucky9_view(_h) END,'recent',_recent);
END;
$$;
REVOKE EXECUTE ON FUNCTION public.lucky9_current() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.lucky9_current() TO authenticated;

CREATE OR REPLACE FUNCTION public.get_gaming_analytics(_since timestamptz DEFAULT NULL, _until timestamptz DEFAULT now())
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE _result jsonb;
BEGIN
 IF auth.uid() IS NULL OR NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN RAISE EXCEPTION 'Admin access required' USING ERRCODE = '42501'; END IF;
 IF _until IS NULL OR (_since IS NOT NULL AND _since >= _until) THEN RAISE EXCEPTION 'Invalid analytics date range' USING ERRCODE = '22023'; END IF;
 WITH rounds AS (
 SELECT 'blackjack'::text AS game,user_id,bet::bigint+split_bet AS stake,payout::bigint+split_payout AS returned,settled_at IS NOT NULL AS settled FROM public.blackjack_hands WHERE (_since IS NULL OR created_at >= _since) AND created_at < _until
 UNION ALL SELECT 'lucky-9',user_id,bet::bigint,payout::bigint,settled_at IS NOT NULL FROM public.lucky9_hands WHERE (_since IS NULL OR created_at >= _since) AND created_at < _until
 UNION ALL SELECT 'poker',user_id,ante::bigint+call_bet,payout::bigint,settled_at IS NOT NULL FROM public.holdem_hands WHERE (_since IS NULL OR created_at >= _since) AND created_at < _until
 UNION ALL SELECT 'sic-bo',user_id,stake::bigint,payout::bigint,true FROM public.sicbo_rounds WHERE (_since IS NULL OR created_at >= _since) AND created_at < _until
 UNION ALL SELECT 'pai-gow',user_id,bet::bigint,payout::bigint,settled_at IS NOT NULL FROM public.paigow_hands WHERE (_since IS NULL OR created_at >= _since) AND created_at < _until
 UNION ALL SELECT 'pai-gow-tiles',user_id,bet::bigint,payout::bigint,settled_at IS NOT NULL FROM public.pgtiles_hands WHERE (_since IS NULL OR created_at >= _since) AND created_at < _until
 ), table_totals AS (
 SELECT game,count(*) AS rounds,count(DISTINCT user_id) AS players,count(*) FILTER(WHERE settled) AS settled,
 count(*) FILTER(WHERE settled AND returned > stake) AS wins,count(*) FILTER(WHERE settled AND returned = stake) AS even,count(*) FILTER(WHERE settled AND returned < stake) AS losses FROM rounds GROUP BY game
 ), visits AS (
 SELECT CASE page_path WHEN '/game-room' THEN 'lobby' WHEN '/game-room/blackjack' THEN 'blackjack' WHEN '/game-room/lucky-9' THEN 'lucky-9' WHEN '/game-room/texas-holdem' THEN 'poker' WHEN '/game-room/sic-bo' THEN 'sic-bo' WHEN '/game-room/pai-gow' THEN 'pai-gow' WHEN '/game-room/pai-gow-tiles' THEN 'pai-gow-tiles' WHEN '/game-room/mahjong' THEN 'mahjong' END AS game,count(*) AS views
 FROM public.page_views WHERE page_path IN('/game-room','/game-room/blackjack','/game-room/lucky-9','/game-room/texas-holdem','/game-room/sic-bo','/game-room/pai-gow','/game-room/pai-gow-tiles','/game-room/mahjong') AND (_since IS NULL OR created_at >= _since) AND created_at < _until GROUP BY page_path
 ), coin_flow AS (
 SELECT coalesce(-sum(amount::bigint) FILTER(WHERE reason='game_bet'),0) AS wagered,coalesce(sum(amount::bigint) FILTER(WHERE reason='game_payout'),0) AS returned FROM public.coin_transactions WHERE reason IN('game_bet','game_payout') AND (_since IS NULL OR created_at >= _since) AND created_at < _until
 ), game_list(game) AS (VALUES('blackjack'),('lucky-9'),('poker'),('sic-bo'),('pai-gow'),('pai-gow-tiles'),('mahjong'))
 SELECT jsonb_build_object('rounds',(SELECT count(*) FROM rounds),'players',(SELECT count(DISTINCT user_id) FROM rounds),'unsettled',(SELECT count(*) FROM rounds WHERE NOT settled),
 'page_views',(SELECT coalesce(sum(views),0) FROM visits),'lobby_views',(SELECT coalesce(sum(views),0) FROM visits WHERE game='lobby'),
 'wagered',c.wagered,'returned',c.returned,'net_retained',c.wagered-c.returned,
 'games',(SELECT jsonb_agg(jsonb_build_object('game',g.game,'rounds',coalesce(t.rounds,0),'players',coalesce(t.players,0),'settled',coalesce(t.settled,0),'wins',coalesce(t.wins,0),'even',coalesce(t.even,0),'losses',coalesce(t.losses,0),'page_views',coalesce(v.views,0)) ORDER BY coalesce(t.rounds,0) DESC,g.game) FROM game_list g LEFT JOIN table_totals t USING(game) LEFT JOIN visits v USING(game))) INTO _result FROM coin_flow c;
 RETURN _result;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.get_gaming_analytics(timestamptz,timestamptz) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.get_gaming_analytics(timestamptz,timestamptz) TO authenticated;