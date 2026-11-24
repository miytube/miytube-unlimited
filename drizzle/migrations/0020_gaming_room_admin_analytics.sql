CREATE OR REPLACE FUNCTION public.get_gaming_analytics(_since timestamptz DEFAULT NULL, _until timestamptz DEFAULT now())
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE _result jsonb;
BEGIN
  IF auth.uid() IS NULL OR NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RAISE EXCEPTION 'Admin access required' USING ERRCODE = '42501';
  END IF;
  IF _until IS NULL OR (_since IS NOT NULL AND _since >= _until) THEN
    RAISE EXCEPTION 'Invalid analytics date range' USING ERRCODE = '22023';
  END IF;
  WITH rounds AS (
    SELECT 'blackjack'::text AS game, user_id, bet::bigint + split_bet AS stake,
           payout::bigint + split_payout AS returned, settled_at IS NOT NULL AS settled
      FROM public.blackjack_hands WHERE (_since IS NULL OR created_at >= _since) AND created_at < _until
    UNION ALL
    SELECT 'poker', user_id, ante::bigint + call_bet, payout::bigint, settled_at IS NOT NULL
      FROM public.holdem_hands WHERE (_since IS NULL OR created_at >= _since) AND created_at < _until
    UNION ALL
    SELECT 'sic-bo', user_id, stake::bigint, payout::bigint, true
      FROM public.sicbo_rounds WHERE (_since IS NULL OR created_at >= _since) AND created_at < _until
    UNION ALL
    SELECT 'pai-gow', user_id, bet::bigint, payout::bigint, settled_at IS NOT NULL
      FROM public.paigow_hands WHERE (_since IS NULL OR created_at >= _since) AND created_at < _until
    UNION ALL
    SELECT 'pai-gow-tiles', user_id, bet::bigint, payout::bigint, settled_at IS NOT NULL
      FROM public.pgtiles_hands WHERE (_since IS NULL OR created_at >= _since) AND created_at < _until
  ), table_totals AS (
    SELECT game, count(*) AS rounds, count(DISTINCT user_id) AS players,
           count(*) FILTER (WHERE settled) AS settled,
           count(*) FILTER (WHERE settled AND returned > stake) AS wins,
           count(*) FILTER (WHERE settled AND returned = stake) AS even,
           count(*) FILTER (WHERE settled AND returned < stake) AS losses
      FROM rounds GROUP BY game
  ), visits AS (
    SELECT CASE page_path
      WHEN '/game-room' THEN 'lobby'
      WHEN '/game-room/blackjack' THEN 'blackjack'
      WHEN '/game-room/texas-holdem' THEN 'poker'
      WHEN '/game-room/sic-bo' THEN 'sic-bo'
      WHEN '/game-room/pai-gow' THEN 'pai-gow'
      WHEN '/game-room/pai-gow-tiles' THEN 'pai-gow-tiles'
      WHEN '/game-room/mahjong' THEN 'mahjong' END AS game, count(*) AS views
    FROM public.page_views
    WHERE page_path IN ('/game-room','/game-room/blackjack','/game-room/texas-holdem','/game-room/sic-bo','/game-room/pai-gow','/game-room/pai-gow-tiles','/game-room/mahjong')
      AND (_since IS NULL OR created_at >= _since) AND created_at < _until
    GROUP BY page_path
  ), coin_flow AS (
    SELECT coalesce(-sum(amount::bigint) FILTER (WHERE reason = 'game_bet'), 0) AS wagered,
           coalesce(sum(amount::bigint) FILTER (WHERE reason = 'game_payout'), 0) AS returned
    FROM public.coin_transactions
    WHERE reason IN ('game_bet','game_payout')
      AND (_since IS NULL OR created_at >= _since) AND created_at < _until
  ), game_list(game) AS (
    VALUES ('blackjack'), ('poker'), ('sic-bo'), ('pai-gow'), ('pai-gow-tiles'), ('mahjong')
  )
  SELECT jsonb_build_object(
    'rounds', (SELECT count(*) FROM rounds),
    'players', (SELECT count(DISTINCT user_id) FROM rounds),
    'unsettled', (SELECT count(*) FROM rounds WHERE NOT settled),
    'page_views', (SELECT coalesce(sum(views), 0) FROM visits),
    'lobby_views', (SELECT coalesce(sum(views), 0) FROM visits WHERE game = 'lobby'),
    'wagered', c.wagered, 'returned', c.returned, 'net_retained', c.wagered - c.returned,
    'games', (SELECT jsonb_agg(jsonb_build_object(
      'game', g.game, 'rounds', coalesce(t.rounds, 0), 'players', coalesce(t.players, 0),
      'settled', coalesce(t.settled, 0), 'wins', coalesce(t.wins, 0),
      'even', coalesce(t.even, 0), 'losses', coalesce(t.losses, 0), 'page_views', coalesce(v.views, 0)
    ) ORDER BY coalesce(t.rounds, 0) DESC, g.game)
    FROM game_list g LEFT JOIN table_totals t USING (game) LEFT JOIN visits v USING (game))
  ) INTO _result FROM coin_flow c;
  RETURN _result;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.get_gaming_analytics(timestamptz, timestamptz) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_gaming_analytics(timestamptz, timestamptz) TO authenticated;
COMMENT ON FUNCTION public.get_gaming_analytics(timestamptz, timestamptz) IS 'Admin-only aggregates: rounds by start date, outcomes by net return per round, coin flow by transaction date. No private cards or user IDs returned; Mahjong is visits-only.';