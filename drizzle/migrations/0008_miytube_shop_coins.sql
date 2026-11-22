CREATE TABLE public.user_coin_wallets (
  user_id uuid PRIMARY KEY,
  balance integer NOT NULL DEFAULT 0 CHECK (balance >= 0),
  welcome_granted_at timestamptz,
  last_daily_bonus_on date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.user_coin_wallets TO authenticated;
GRANT ALL ON public.user_coin_wallets TO service_role;
ALTER TABLE public.user_coin_wallets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members view their own wallet" ON public.user_coin_wallets
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE TABLE public.coin_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  amount integer NOT NULL,
  reason text NOT NULL CHECK (reason IN ('welcome_bonus','daily_bonus','shop_purchase','admin_adjustment')),
  item_id uuid REFERENCES public.avatar_items(id) ON DELETE SET NULL,
  balance_after integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.coin_transactions TO authenticated;
GRANT ALL ON public.coin_transactions TO service_role;
ALTER TABLE public.coin_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members view their own coin history" ON public.coin_transactions
  FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE INDEX coin_transactions_user_idx ON public.coin_transactions(user_id, created_at DESC);

-- Opens the wallet (first call grants the one-time 500-coin join bonus).
CREATE OR REPLACE FUNCTION public.get_coin_wallet()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _uid uuid := auth.uid();
  _w public.user_coin_wallets;
  _welcome boolean := false;
BEGIN
  IF _uid IS NULL THEN
    RAISE EXCEPTION 'Sign in required';
  END IF;
  INSERT INTO public.user_coin_wallets (user_id) VALUES (_uid) ON CONFLICT (user_id) DO NOTHING;
  SELECT * INTO _w FROM public.user_coin_wallets WHERE user_id = _uid FOR UPDATE;
  IF _w.welcome_granted_at IS NULL THEN
    UPDATE public.user_coin_wallets
      SET balance = balance + 500, welcome_granted_at = now(), updated_at = now()
      WHERE user_id = _uid RETURNING * INTO _w;
    INSERT INTO public.coin_transactions (user_id, amount, reason, balance_after)
      VALUES (_uid, 500, 'welcome_bonus', _w.balance);
    _welcome := true;
  END IF;
  RETURN jsonb_build_object(
    'balance', _w.balance,
    'welcome_granted', _welcome,
    'daily_available', _w.last_daily_bonus_on IS DISTINCT FROM (now() AT TIME ZONE 'utc')::date
  );
END;
$$;

-- 50 coins, once per UTC day.
CREATE OR REPLACE FUNCTION public.claim_daily_coins()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _uid uuid := auth.uid();
  _today date := (now() AT TIME ZONE 'utc')::date;
  _w public.user_coin_wallets;
BEGIN
  IF _uid IS NULL THEN
    RAISE EXCEPTION 'Sign in required';
  END IF;
  PERFORM public.get_coin_wallet();
  SELECT * INTO _w FROM public.user_coin_wallets WHERE user_id = _uid FOR UPDATE;
  IF _w.last_daily_bonus_on = _today THEN
    RETURN jsonb_build_object('balance', _w.balance, 'claimed', false, 'daily_available', false);
  END IF;
  UPDATE public.user_coin_wallets
    SET balance = balance + 50, last_daily_bonus_on = _today, updated_at = now()
    WHERE user_id = _uid RETURNING * INTO _w;
  INSERT INTO public.coin_transactions (user_id, amount, reason, balance_after)
    VALUES (_uid, 50, 'daily_bonus', _w.balance);
  RETURN jsonb_build_object('balance', _w.balance, 'claimed', true, 'daily_available', false);
END;
$$;

-- Buy one shop item with coins; everything is checked here, never in the browser.
CREATE OR REPLACE FUNCTION public.purchase_avatar_item(_sku text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _uid uuid := auth.uid();
  _item public.avatar_items;
  _w public.user_coin_wallets;
BEGIN
  IF _uid IS NULL THEN
    RAISE EXCEPTION 'Sign in required';
  END IF;
  SELECT * INTO _item FROM public.avatar_items WHERE sku = _sku AND is_active;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Item not found';
  END IF;
  IF _item.is_starter OR _item.price_credits <= 0 THEN
    RAISE EXCEPTION 'This item is not sold in the shop';
  END IF;
  PERFORM public.get_coin_wallet();
  SELECT * INTO _w FROM public.user_coin_wallets WHERE user_id = _uid FOR UPDATE;
  IF EXISTS (SELECT 1 FROM public.user_avatar_inventory WHERE user_id = _uid AND item_id = _item.id) THEN
    RAISE EXCEPTION 'You already own this item';
  END IF;
  IF _w.balance < _item.price_credits THEN
    RAISE EXCEPTION 'Not enough coins';
  END IF;
  UPDATE public.user_coin_wallets
    SET balance = balance - _item.price_credits, updated_at = now()
    WHERE user_id = _uid RETURNING * INTO _w;
  INSERT INTO public.user_avatar_inventory (user_id, item_id, acquired_via) VALUES (_uid, _item.id, 'shop');
  INSERT INTO public.coin_transactions (user_id, amount, reason, item_id, balance_after)
    VALUES (_uid, -_item.price_credits, 'shop_purchase', _item.id, _w.balance);
  RETURN jsonb_build_object('balance', _w.balance, 'sku', _item.sku);
END;
$$;

REVOKE ALL ON FUNCTION public.get_coin_wallet() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.claim_daily_coins() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.purchase_avatar_item(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_coin_wallet() TO authenticated;
GRANT EXECUTE ON FUNCTION public.claim_daily_coins() TO authenticated;
GRANT EXECUTE ON FUNCTION public.purchase_avatar_item(text) TO authenticated;

INSERT INTO public.avatar_items (sku, slug, name, description, slot, rarity, legend_id, is_starter, price_credits, asset_uri, metadata, sort_order) VALUES
('MIY-AV-0101','jersey-boston-6','Boston #6 Jersey','Eleven rings. The ultimate winner.','top','legendary',15,false,500,'miytube://avatar/items/MIY-AV-0101','{"kiosk":"legends","style":"jersey","primary":"#007A33","trim":"#FFFFFF","text":"#FFFFFF","number":"6","label":"BOSTON"}',101),
('MIY-AV-0102','jersey-brazil-10','Brazil #10 Jersey','O Rei. Three World Cups.','top','legendary',20,false,500,'miytube://avatar/items/MIY-AV-0102','{"kiosk":"legends","style":"jersey","primary":"#FEDD00","trim":"#009C3B","text":"#009C3B","number":"10","label":"BRASIL"}',102),
('MIY-AV-0103','jersey-argentina-10','Argentina #10 Jersey','The little one who conquered the world.','top','legendary',6,false,500,'miytube://avatar/items/MIY-AV-0103','{"kiosk":"legends","style":"jersey","primary":"#75AADB","trim":"#FFFFFF","text":"#0B2A4A","number":"10","label":"ARGENTINA"}',103),
('MIY-AV-0104','jersey-edmonton-99','Edmonton #99 Jersey','The Great One. Number retired league-wide.','top','legendary',8,false,500,'miytube://avatar/items/MIY-AV-0104','{"kiosk":"legends","style":"jersey","primary":"#041E42","trim":"#FF4C00","text":"#FFFFFF","number":"99","label":"EDMONTON"}',104),
('MIY-AV-0105','jersey-brooklyn-42','Brooklyn #42 Jersey','He changed the game and the country.','top','legendary',25,false,500,'miytube://avatar/items/MIY-AV-0105','{"kiosk":"legends","style":"jersey","primary":"#F5F5F5","trim":"#005A9C","text":"#005A9C","number":"42","label":"BROOKLYN"}',105),
('MIY-AV-0106','jersey-new-york-3','New York #3 Jersey','The Sultan of Swat.','top','legendary',12,false,500,'miytube://avatar/items/MIY-AV-0106','{"kiosk":"legends","style":"jersey","primary":"#F5F5F5","trim":"#0C2340","text":"#0C2340","number":"3","label":"NEW YORK"}',106),
('MIY-AV-0107','jersey-cleveland-23','Cleveland #23 Jersey','Akron kid. Promise kept.','top','epic',1,false,300,'miytube://avatar/items/MIY-AV-0107','{"kiosk":"legends","style":"jersey","primary":"#6F263D","trim":"#FFB81C","text":"#FFB81C","number":"23","label":"CLEVELAND"}',107),
('MIY-AV-0108','jersey-iowa-22','Iowa #22 Jersey','Logo range. Every night.','top','epic',5,false,300,'miytube://avatar/items/MIY-AV-0108','{"kiosk":"legends","style":"jersey","primary":"#111111","trim":"#FFCD00","text":"#FFCD00","number":"22","label":"IOWA"}',108),
('MIY-AV-0109','jersey-chicago-34','Chicago #34 Jersey','Sweetness. Never die easy.','top','epic',23,false,300,'miytube://avatar/items/MIY-AV-0109','{"kiosk":"legends","style":"jersey","primary":"#0B162A","trim":"#C83803","text":"#FFFFFF","number":"34","label":"CHICAGO"}',109),
('MIY-AV-0110','jersey-san-francisco-80','San Francisco #80 Jersey','The greatest receiver ever to run a route.','top','epic',22,false,300,'miytube://avatar/items/MIY-AV-0110','{"kiosk":"legends","style":"jersey","primary":"#AA0000","trim":"#B3995D","text":"#FFFFFF","number":"80","label":"SAN FRANCISCO"}',110),
('MIY-AV-0111','jersey-portugal-7','Portugal #7 Jersey','Work rate that never switches off.','top','epic',21,false,300,'miytube://avatar/items/MIY-AV-0111','{"kiosk":"legends","style":"jersey","primary":"#DA291C","trim":"#046A38","text":"#FFFFFF","number":"7","label":"PORTUGAL"}',111),
('MIY-AV-0112','polo-sunday-red','Sunday Red Polo','Final round. Everyone knows what red means.','top','legendary',9,false,500,'miytube://avatar/items/MIY-AV-0112','{"kiosk":"legends","style":"polo","primary":"#C8102E","trim":"#8E0B20"}',112),
('MIY-AV-0113','jacket-champions-green','Champion''s Green Jacket','Six times for the Golden Bear.','top','epic',16,false,400,'miytube://avatar/items/MIY-AV-0113','{"kiosk":"legends","style":"jacket","primary":"#0B5D2A","trim":"#F2C14E"}',113),
('MIY-AV-0201','gloves-black-boxing','Iron Black Gloves','No robe. No socks. No mercy.','gloves','epic',26,false,300,'miytube://avatar/items/MIY-AV-0201','{"kiosk":"fitness","style":"boxing","primary":"#111111","trim":"#C8102E"}',201),
('MIY-AV-0202','gloves-gold-boxing','Gold Boxing Gloves','Speed, flash and a perfect smile.','gloves','epic',27,false,300,'miytube://avatar/items/MIY-AV-0202','{"kiosk":"fitness","style":"boxing","primary":"#E0A526","trim":"#FFFFFF"}',202),
('MIY-AV-0203','wraps-calisthenics','Calisthenics Hand Wraps','For the bar, the rings and the grind.','gloves','rare',NULL,false,150,'miytube://avatar/items/MIY-AV-0203','{"kiosk":"fitness","style":"wraps","primary":"#F5F5F5","trim":"#1F6FEB"}',203),
('MIY-AV-0204','headband-centre-court','Centre Court Headband','You cannot be serious.','headwear','rare',13,false,150,'miytube://avatar/items/MIY-AV-0204','{"kiosk":"fitness","style":"headband","primary":"#FFFFFF","trim":"#1B5E20"}',204),
('MIY-AV-0205','bg-boxing-ring','Title Fight Ring','Lights up. Ropes tight. Twelve rounds.','background','epic',11,false,300,'miytube://avatar/items/MIY-AV-0205','{"kiosk":"fitness","style":"ring","primary":"#3B0A0A","trim":"#D7263D"}',205),
('MIY-AV-0301','cap-miytube-gold','MiyTube Gold Cap','Only for the ones who show up every day.','headwear','legendary',NULL,false,500,'miytube://avatar/items/MIY-AV-0301','{"kiosk":"miytube","style":"cap","primary":"#E0A526","trim":"#111111"}',301),
('MIY-AV-0302','jacket-miytube-creator','MiyTube Creator Jacket','Upload. Edit. Repeat.','top','epic',NULL,false,300,'miytube://avatar/items/MIY-AV-0302','{"kiosk":"miytube","style":"jacket","primary":"#1F4FD1","trim":"#F5F5F5"}',302),
('MIY-AV-0303','chain-gold','Gold Chain','Earned, not given.','accessory','rare',NULL,false,200,'miytube://avatar/items/MIY-AV-0303','{"kiosk":"miytube","style":"chain","primary":"#E0A526"}',303),
('MIY-AV-0304','shades-game-day','Game Day Shades','Walk in like you own the building.','accessory','common',NULL,false,100,'miytube://avatar/items/MIY-AV-0304','{"kiosk":"miytube","style":"shades","primary":"#111111"}',304),
('MIY-AV-0305','bg-championship-gold','Championship Gold','Confetti falling. Trophy raised.','background','legendary',NULL,false,500,'miytube://avatar/items/MIY-AV-0305','{"kiosk":"miytube","style":"arena","primary":"#3A2A05","trim":"#F2C14E"}',305);