import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Coins, ExternalLink, Gift, Loader2, Lock, ShoppingBag, Sparkles, Store } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { usePageSEO } from '@/hooks/usePageSEO';
import { supabase } from '@/integrations/supabase/client';
import { AvatarFigure } from '@/components/avatar/AvatarFigure';
import { setCachedAvatar, useAvatarCatalog, useSavedAvatars } from '@/hooks/useAvatars';
import { setCoinBalance, useCoinWallet } from '@/hooks/useCoinWallet';
import { SPORTS_LEGENDS } from '@/data/sportsBeginEndLegends';
import {
  AvatarConfig,
  AvatarEquipped,
  AvatarItem,
  COIN_DAILY_BONUS,
  COIN_WELCOME_BONUS,
  DEFAULT_AVATAR_CONFIG,
  Rarity,
  SHOP_KIOSKS,
  itemsInKiosk,
  resolveEquippedItems,
  sanitizeEquipped,
  shopStatus,
} from '@/lib/avatar';
import { cn } from '@/lib/utils';

const RARITY_CLASS: Record<Rarity, string> = {
  common: 'border-rarity-common text-rarity-common',
  rare: 'border-rarity-rare text-rarity-rare',
  epic: 'border-rarity-epic text-rarity-epic',
  legendary: 'border-rarity-legendary text-rarity-legendary',
};

const MiyTubeShop = () => {
  usePageSEO({
    title: 'MiyTube Shop — Legend jerseys and avatar gear | MiyTube',
    description:
      'Spend MiyTube Coins on legend jerseys, boxing gloves, gold gear and backdrops for your MiyTube avatar. 500 free coins when you join.',
    path: '/shop',
  });

  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const catalog = useAvatarCatalog();
  const wallet = useCoinWallet(user?.id);
  const saved = useSavedAvatars(user ? [user.id] : [])[user?.id ?? ''];

  const [ownedSkus, setOwnedSkus] = useState<Set<string>>(new Set());
  const [ownedLoaded, setOwnedLoaded] = useState(false);
  const [confirmItem, setConfirmItem] = useState<AvatarItem | null>(null);
  const [busySku, setBusySku] = useState<string | null>(null);
  const [claiming, setClaiming] = useState(false);

  const allItems = useMemo(() => (catalog ? Array.from(catalog.values()) : []), [catalog]);

  const loadOwned = useCallback(async () => {
    if (!user || !catalog) return;
    const { data } = await supabase.from('user_avatar_inventory').select('item_id').eq('user_id', user.id);
    const ids = new Set((data ?? []).map((r) => r.item_id));
    setOwnedSkus(new Set(allItems.filter((i) => ids.has(i.id)).map((i) => i.sku)));
    setOwnedLoaded(true);
  }, [user, catalog, allItems]);

  useEffect(() => {
    if (!user) {
      setOwnedSkus(new Set());
      setOwnedLoaded(false);
      return;
    }
    loadOwned();
  }, [user, loadOwned]);

  useEffect(() => {
    if (wallet.welcomeJustGranted) {
      toast({ title: `${COIN_WELCOME_BONUS} MiyTube Coins added`, description: 'Your welcome bonus is ready to spend.' });
      wallet.ackWelcome();
    }
  }, [wallet, toast]);

  const config: AvatarConfig = saved?.config ?? DEFAULT_AVATAR_CONFIG;
  const equipped: AvatarEquipped = saved?.equipped ?? {};
  const balance = wallet.balance ?? 0;

  const claimDaily = async () => {
    setClaiming(true);
    try {
      const claimed = await wallet.claimDaily();
      toast({
        title: claimed ? `+${COIN_DAILY_BONUS} coins` : 'Already claimed today',
        description: claimed ? 'Daily bonus collected. Come back tomorrow for more.' : 'Your next daily bonus unlocks tomorrow.',
      });
    } catch (e) {
      toast({ title: 'Could not claim the daily bonus', description: (e as Error).message, variant: 'destructive' });
    } finally {
      setClaiming(false);
    }
  };

  const buy = async (item: AvatarItem) => {
    setBusySku(item.sku);
    const { data, error } = await supabase.rpc('purchase_avatar_item', { _sku: item.sku });
    setBusySku(null);
    setConfirmItem(null);
    if (error) {
      toast({ title: 'Purchase failed', description: error.message, variant: 'destructive' });
      return;
    }
    const result = data as { balance?: number };
    if (typeof result?.balance === 'number') setCoinBalance(result.balance);
    setOwnedSkus((prev) => new Set(prev).add(item.sku));
    toast({ title: `${item.name} is yours`, description: 'Tap "Wear it" to put it on your avatar.' });
  };

  const toggleWear = async (item: AvatarItem) => {
    if (!user || !catalog) return;
    setBusySku(item.sku);
    const ownedItems = allItems.filter((i) => ownedSkus.has(i.sku));
    const next = sanitizeEquipped(equipped, ownedItems);
    if (next[item.slot] === item.sku) delete next[item.slot];
    else next[item.slot] = item.sku;
    const { error } = await supabase
      .from('user_avatars')
      .upsert({ user_id: user.id, config: { ...config }, equipped: { ...next } }, { onConflict: 'user_id' });
    setBusySku(null);
    if (error) {
      toast({ title: 'Could not update your avatar', description: error.message, variant: 'destructive' });
      return;
    }
    setCachedAvatar(user.id, { config, equipped: next });
    toast({ title: next[item.slot] ? `Wearing ${item.name}` : `Took off ${item.name}` });
  };

  if (authLoading || !catalog || (user && (!ownedLoaded || wallet.balance === null))) {
    return (
      <Layout>
        <div className="flex min-h-[50vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  const resolvedNow = resolveEquippedItems(equipped, catalog);

  return (
    <Layout>
      <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-6">
        <header className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
          <div className="space-y-1">
            <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-primary">
              <Sparkles className="h-4 w-4" /> MiyTube Passport
            </p>
            <h1 className="flex items-center gap-3 text-3xl font-black tracking-tight md:text-4xl">
              <Store className="h-8 w-8" /> MiyTube Shop
            </h1>
            <p className="max-w-2xl text-muted-foreground">
              Legend jerseys, fight gear and gold drops for your avatar. Buy with MiyTube Coins, wear it everywhere you comment.
            </p>
          </div>

          {user ? (
            <div className="flex items-center gap-4 rounded-2xl bg-studio-stage p-4 text-primary-foreground shadow-lg">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl ring-1 ring-primary-foreground/15">
                <AvatarFigure config={config} items={resolvedNow} crop="head" className="h-full w-full" title="Your avatar" />
              </div>
              <div className="space-y-1.5">
                <p className="text-xs uppercase tracking-wider text-primary-foreground/60">Your coins</p>
                <p className="flex items-center gap-1.5 text-2xl font-black tabular-nums" aria-label={`${balance} MiyTube Coins`}>
                  <Coins className="h-5 w-5 text-rarity-legendary" /> {balance.toLocaleString()}
                </p>
                <Button size="sm" variant="secondary" disabled={!wallet.dailyAvailable || claiming} onClick={claimDaily} className="h-7 gap-1.5">
                  {claiming ? <Loader2 className="h-3 w-3 animate-spin" /> : wallet.dailyAvailable ? <Gift className="h-3 w-3" /> : <Check className="h-3 w-3" />}
                  {wallet.dailyAvailable ? `Claim +${COIN_DAILY_BONUS} daily` : 'Daily bonus claimed'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3 rounded-2xl border border-primary/30 bg-primary/5 p-4">
              <p className="text-sm">
                <span className="font-semibold">{COIN_WELCOME_BONUS} free coins</span> when you sign in, plus {COIN_DAILY_BONUS} every day.
              </p>
              <Button asChild size="sm">
                <Link to="/auth">Sign in to shop</Link>
              </Button>
            </div>
          )}
        </header>

        <Tabs defaultValue={SHOP_KIOSKS[0].id}>
          <TabsList className="grid h-auto w-full grid-cols-3">
            {SHOP_KIOSKS.map((k) => (
              <TabsTrigger key={k.id} value={k.id} className="whitespace-normal py-2 text-xs sm:text-sm">
                {k.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {SHOP_KIOSKS.map((k) => (
            <TabsContent key={k.id} value={k.id} className="space-y-4 pt-4">
              <p className="text-sm text-muted-foreground">{k.blurb}</p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {itemsInKiosk(allItems, k.id).map((item) => (
                  <ShopCard
                    key={item.sku}
                    item={item}
                    config={config}
                    equipped={equipped}
                    catalog={catalog}
                    signedIn={Boolean(user)}
                    status={shopStatus(item, ownedSkus, balance)}
                    balance={balance}
                    busy={busySku === item.sku}
                    onBuy={() => setConfirmItem(item)}
                    onWear={() => toggleWear(item)}
                  />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
          Every item carries its own permanent item code, so it can move to a crypto wallet later. Your look and the rest of your
          closet live in the{' '}
          <Link to="/avatar" className="font-medium text-primary hover:underline">
            Avatar Studio
          </Link>
          .
        </p>
      </div>

      <AlertDialog open={Boolean(confirmItem)} onOpenChange={(open) => !open && !busySku && setConfirmItem(null)}>
        <AlertDialogContent>
          {confirmItem && (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle>Buy {confirmItem.name}?</AlertDialogTitle>
                <AlertDialogDescription>
                  {confirmItem.price_credits.toLocaleString()} coins will come out of your balance. You'll have{' '}
                  {(balance - confirmItem.price_credits).toLocaleString()} left.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={Boolean(busySku)}>Not now</AlertDialogCancel>
                <AlertDialogAction
                  disabled={Boolean(busySku)}
                  onClick={(e) => {
                    e.preventDefault();
                    buy(confirmItem);
                  }}
                >
                  {busySku ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Coins className="mr-2 h-4 w-4" />}
                  Buy for {confirmItem.price_credits.toLocaleString()}
                </AlertDialogAction>
              </AlertDialogFooter>
            </>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

const ShopCard: React.FC<{
  item: AvatarItem;
  config: AvatarConfig;
  equipped: AvatarEquipped;
  catalog: Map<string, AvatarItem>;
  signedIn: boolean;
  status: ReturnType<typeof shopStatus>;
  balance: number;
  busy: boolean;
  onBuy: () => void;
  onWear: () => void;
}> = ({ item, config, equipped, catalog, signedIn, status, balance, busy, onBuy, onWear }) => {
  const preview = resolveEquippedItems({ ...equipped, [item.slot]: item.sku }, catalog);
  const legend = item.legend_id ? SPORTS_LEGENDS.find((l) => l.id === item.legend_id) : undefined;
  const wearing = equipped[item.slot] === item.sku;
  return (
    <div className={cn('flex flex-col overflow-hidden rounded-xl border bg-card', wearing && 'border-primary ring-2 ring-primary/20')}>
      <div className="relative aspect-square overflow-hidden bg-muted">
        <AvatarFigure config={config} items={preview} className="h-full w-full" title={`Preview: ${item.name}`} />
        {status === 'owned' && (
          <span className="absolute left-2 top-2 rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground">
            {wearing ? 'Wearing' : 'Owned'}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3">
        <div className="flex items-start justify-between gap-2">
          <p className="font-semibold leading-tight">{item.name}</p>
          <Badge variant="outline" className={cn('shrink-0 capitalize', RARITY_CLASS[item.rarity])}>
            {item.rarity}
          </Badge>
        </div>
        {item.description && <p className="text-xs text-muted-foreground">{item.description}</p>}
        {legend && (
          <a
            href={`https://sportsbeginend.com/profile/${legend.id}?utm_source=miytube&utm_medium=shop&utm_campaign=legend_gear`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            {legend.name}'s story <ExternalLink className="h-3 w-3" />
          </a>
        )}
        <div className="mt-auto flex items-center justify-between gap-2 pt-1">
          <span className="flex items-center gap-1 font-bold tabular-nums">
            <Coins className="h-4 w-4 text-rarity-legendary" /> {item.price_credits.toLocaleString()}
          </span>
          <span className="font-mono text-[10px] text-muted-foreground">{item.sku}</span>
        </div>
        {!signedIn ? (
          <Button asChild size="sm" variant="outline">
            <Link to="/auth">
              <Lock className="mr-1 h-3 w-3" /> Sign in to buy
            </Link>
          </Button>
        ) : status === 'owned' ? (
          <Button size="sm" variant={wearing ? 'outline' : 'default'} disabled={busy} onClick={onWear}>
            {busy && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
            {wearing ? 'Take off' : 'Wear it'}
          </Button>
        ) : status === 'affordable' ? (
          <Button size="sm" disabled={busy} onClick={onBuy} className="gap-1">
            <ShoppingBag className="h-3 w-3" /> Buy
          </Button>
        ) : (
          <Button size="sm" variant="outline" disabled>
            Need {(item.price_credits - balance).toLocaleString()} more coins
          </Button>
        )}
      </div>
    </div>
  );
};

export default MiyTubeShop;
