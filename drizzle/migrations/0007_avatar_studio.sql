CREATE TABLE public.avatar_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sku text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  slot text NOT NULL CHECK (slot IN ('top','gloves','headwear','accessory','background')),
  rarity text NOT NULL DEFAULT 'common' CHECK (rarity IN ('common','rare','epic','legendary')),
  legend_id integer,
  is_starter boolean NOT NULL DEFAULT false,
  price_credits integer NOT NULL DEFAULT 0 CHECK (price_credits >= 0),
  asset_uri text NOT NULL,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.avatar_items TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.avatar_items TO authenticated;
GRANT ALL ON public.avatar_items TO service_role;
ALTER TABLE public.avatar_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active avatar items" ON public.avatar_items
  FOR SELECT USING (is_active OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage avatar items" ON public.avatar_items
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER avatar_items_updated_at BEFORE UPDATE ON public.avatar_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.user_avatar_inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  item_id uuid NOT NULL REFERENCES public.avatar_items(id) ON DELETE CASCADE,
  acquired_via text NOT NULL DEFAULT 'starter',
  chain text,
  token_id text,
  wallet_address text,
  acquired_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, item_id)
);
GRANT SELECT ON public.user_avatar_inventory TO authenticated;
GRANT ALL ON public.user_avatar_inventory TO service_role;
ALTER TABLE public.user_avatar_inventory ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view their own gear" ON public.user_avatar_inventory
  FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE INDEX user_avatar_inventory_user_idx ON public.user_avatar_inventory(user_id);

CREATE TABLE public.user_avatars (
  user_id uuid PRIMARY KEY,
  config jsonb NOT NULL DEFAULT '{}'::jsonb,
  equipped jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.user_avatars TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_avatars TO authenticated;
GRANT ALL ON public.user_avatars TO service_role;
ALTER TABLE public.user_avatars ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Avatars are viewable by everyone" ON public.user_avatars
  FOR SELECT USING (true);
CREATE POLICY "Users create their own avatar" ON public.user_avatars
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users update their own avatar" ON public.user_avatars
  FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users delete their own avatar" ON public.user_avatars
  FOR DELETE TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.validate_user_avatar_equipped()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _slot text;
  _sku text;
BEGIN
  IF jsonb_typeof(NEW.equipped) <> 'object' THEN
    RAISE EXCEPTION 'equipped must be an object';
  END IF;
  IF jsonb_typeof(NEW.config) <> 'object' THEN
    RAISE EXCEPTION 'config must be an object';
  END IF;
  FOR _slot, _sku IN SELECT key, value #>> '{}' FROM jsonb_each(NEW.equipped) LOOP
    IF _sku IS NULL OR _sku = '' THEN
      CONTINUE;
    END IF;
    IF NOT EXISTS (
      SELECT 1 FROM public.user_avatar_inventory inv
      JOIN public.avatar_items it ON it.id = inv.item_id
      WHERE inv.user_id = NEW.user_id AND it.sku = _sku AND it.slot = _slot
    ) THEN
      RAISE EXCEPTION 'Item % is not owned or does not fit slot %', _sku, _slot;
    END IF;
  END LOOP;
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;
CREATE TRIGGER user_avatars_validate BEFORE INSERT OR UPDATE ON public.user_avatars
  FOR EACH ROW EXECUTE FUNCTION public.validate_user_avatar_equipped();

CREATE OR REPLACE FUNCTION public.claim_starter_avatar_items()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _uid uuid := auth.uid();
  _count integer;
BEGIN
  IF _uid IS NULL THEN
    RAISE EXCEPTION 'Sign in required';
  END IF;
  INSERT INTO public.user_avatar_inventory (user_id, item_id, acquired_via)
  SELECT _uid, id, 'starter' FROM public.avatar_items WHERE is_starter AND is_active
  ON CONFLICT (user_id, item_id) DO NOTHING;
  GET DIAGNOSTICS _count = ROW_COUNT;
  RETURN _count;
END;
$$;
REVOKE ALL ON FUNCTION public.claim_starter_avatar_items() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.claim_starter_avatar_items() TO authenticated;

INSERT INTO public.avatar_items (sku, slug, name, description, slot, rarity, legend_id, is_starter, asset_uri, metadata, sort_order) VALUES
('MIY-AV-0001','jersey-chicago-23','Chicago #23 Jersey','The red home jersey of the greatest closer the game has seen.','top','legendary',10,true,'miytube://avatar/items/MIY-AV-0001','{"style":"jersey","primary":"#C8102E","trim":"#111111","text":"#FFFFFF","number":"23","label":"CHICAGO"}',1),
('MIY-AV-0002','jersey-los-angeles-24','Los Angeles #24 Jersey','Purple and gold, Mamba mentality.','top','legendary',4,true,'miytube://avatar/items/MIY-AV-0002','{"style":"jersey","primary":"#FDB927","trim":"#552583","text":"#552583","number":"24","label":"LOS ANGELES"}',2),
('MIY-AV-0003','jersey-new-england-12','New England #12 Jersey','Pick 199. Seven rings.','top','legendary',3,true,'miytube://avatar/items/MIY-AV-0003','{"style":"jersey","primary":"#002244","trim":"#C60C30","text":"#FFFFFF","number":"12","label":"NEW ENGLAND"}',3),
('MIY-AV-0004','gloves-red-boxing','Red Boxing Gloves','Float like a butterfly. Hit like a hammer.','gloves','epic',11,true,'miytube://avatar/items/MIY-AV-0004','{"style":"boxing","primary":"#D7263D","trim":"#FFFFFF"}',4),
('MIY-AV-0005','tee-miytube-classic','MiyTube Classic Tee','The original. Every member gets one.','top','common',NULL,true,'miytube://avatar/items/MIY-AV-0005','{"style":"tee","primary":"#1F6FEB","trim":"#0B3D91","text":"#FFFFFF","label":"MIYTUBE"}',5),
('MIY-AV-0006','cap-miytube','MiyTube Cap','Brim forward. Always.','headwear','common',NULL,true,'miytube://avatar/items/MIY-AV-0006','{"style":"cap","primary":"#111827","trim":"#1F6FEB"}',6),
('MIY-AV-0007','sweatband-white','Champion Sweatband','For the fourth quarter.','headwear','rare',NULL,true,'miytube://avatar/items/MIY-AV-0007','{"style":"headband","primary":"#F5F5F5","trim":"#C8102E"}',7),
('MIY-AV-0008','bg-arena-lights','Arena Lights','Sold-out crowd. Lights down. Your name on the board.','background','rare',NULL,true,'miytube://avatar/items/MIY-AV-0008','{"style":"arena","primary":"#0B1A33","trim":"#F2C14E"}',8);