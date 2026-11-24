import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, Check, Coins, Gift, Loader2, Search, ShoppingBag, Sparkles, Store } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { refreshCoinWallet, setCoinBalance, useCoinWallet } from '@/hooks/useCoinWallet';
import { CoinPacks } from '@/components/shop/CoinPacks';
import { BooksemPassCard } from '@/components/shop/BooksemPassCard';
import { MallStorefronts } from '@/components/shop/MallStorefronts';
import { ShopProductCard } from '@/components/shop/ShopProductCard';
import { browseMallItems, findMallStore, MALL_STORES } from '@/lib/mall';
import {
  AvatarConfig,
  AvatarEquipped,
  AvatarItem,
  COIN_DAILY_BONUS,
  COIN_WELCOME_BONUS,
  DEFAULT_AVATAR_CONFIG,
  resolveEquippedItems,
  sanitizeEquipped,
  shopStatus,
} from '@/lib/avatar';

const MiyTubeShop = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const store = findMallStore(storeId);
  usePageSEO({
    title: store ? `${store.label} | MiyTube Mall` : 'MiyTube Mall — Avatar gear & Booksem | MiyTube',
    description: store?.blurb ?? 'Shop Legends Locker, Fight & Fitness, MiyTube Exclusives and the Booksem member offer with MiyTube Coins.',
    path: store ? `/shop/${store.id}` : '/shop',
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
  const [query, setQuery] = useState('');
  const [inventoryView, setInventoryView] = useState('all');
  const [sort, setSort] = useState('featured');

  useEffect(() => {
    setQuery('');
    setInventoryView('all');
    setSort('featured');
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [storeId]);

  const [searchParams, setSearchParams] = useSearchParams();
  const returnedFromCheckout = searchParams.get('coins') === 'success';

  // Back from a coin-pack checkout: the payment confirmation can take a few
  // seconds to reach the backend, so re-check the balance until it rises.
  useEffect(() => {
    if (!returnedFromCheckout || !user || wallet.balance === null) return;
    const start = wallet.balance;
    let tries = 0;
    let alive = true;
    const tick = async () => {
      if (!alive) return;
      tries += 1;
      const next = await refreshCoinWallet();
      if (next !== null && next > start) {
        toast({ title: `+${(next - start).toLocaleString()} coins`, description: 'Thanks! Your coins are ready to spend.' });
      } else if (tries < 10) {
        setTimeout(tick, 2000);
        return;
      } else {
        toast({ title: 'Payment received', description: 'Your coins are on the way. Refresh in a minute if they have not appeared.' });
      }
      setSearchParams({}, { replace: true });
    };
    tick();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [returnedFromCheckout, user?.id, wallet.balance === null]);

  const allItems = useMemo(() => (catalog ? Array.from(catalog.values()) : []), [catalog]);
  const visibleItems = useMemo(() => browseMallItems(allItems, { storeId, query, ownedOnly: inventoryView === 'owned', ownedSkus, sort }), [allItems, storeId, query, inventoryView, ownedSkus, sort]);

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
      <div className="mx-auto max-w-6xl space-y-8 py-6 md:py-8">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary">MiyTube</Link><span>/</span>
          {store ? <><Link to="/shop" className="hover:text-primary">Mall</Link><span>/</span><span className="text-foreground">{store.label}</span></> : <span className="text-foreground">Mall</span>}
        </nav>
        <header className="grid gap-5 border-b pb-6 md:grid-cols-[1fr_auto] md:items-center">
          <div className="min-w-0 space-y-3">
            <h1 className="flex items-center gap-3 text-3xl font-black md:text-4xl">
              <Store className="h-8 w-8 shrink-0 text-primary" />{store?.label ?? 'MiyTube Mall'}
            </h1>
            <p className="max-w-xl text-sm text-muted-foreground">{store?.blurb ?? 'Legends Locker. Fight & Fitness. Booksem. Your next stop.'}</p>
            <div className="flex flex-wrap gap-2">
              {store && <Button asChild variant="outline" size="sm"><Link to="/shop"><ArrowLeft />All stores</Link></Button>}
              <Button asChild variant="outline" size="sm"><Link to="/avatar"><Sparkles />My Avatar</Link></Button>
              <Button asChild variant="ghost" size="sm"><a href="#mall-coins"><Coins />Get coins</a></Button>
            </div>
          </div>
          {user ? (
            <div className="flex min-w-0 items-center gap-4 border-l-2 border-primary pl-4">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                {saved?.portraitUrl ? <img src={saved.portraitUrl} alt="Your avatar" className="h-full w-full object-cover" /> : <AvatarFigure config={config} items={resolvedNow} crop="head" className="h-full w-full" title="Your avatar" />}
              </div>
              <div className="min-w-0 space-y-1.5">
                <p className="text-xs font-medium text-muted-foreground">MiyTube Coins</p>
                <p className="flex items-center gap-1.5 text-2xl font-black tabular-nums" aria-label={`${balance} MiyTube Coins`}><Coins className="h-5 w-5 text-rarity-legendary" />{balance.toLocaleString()}</p>
                <Button size="sm" variant="secondary" disabled={!wallet.dailyAvailable || claiming} onClick={claimDaily} className="h-auto min-h-8 whitespace-normal">
                  {claiming ? <Loader2 className="animate-spin" /> : wallet.dailyAvailable ? <Gift /> : <Check />}
                  {wallet.dailyAvailable ? `Claim +${COIN_DAILY_BONUS} daily` : 'Daily bonus claimed'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3 border-l-2 border-primary pl-4">
              <p className="text-sm"><strong>{COIN_WELCOME_BONUS} free coins</strong> on joining<br /><span className="text-muted-foreground">Plus {COIN_DAILY_BONUS} coins daily</span></p>
              <Button asChild size="sm"><Link to="/auth">Sign in to shop</Link></Button>
            </div>
          )}
        </header>

        {!storeId && <MallStorefronts catalog={catalog} />}
        {store && (
          <nav aria-label="Mall storefronts" className="flex flex-wrap gap-2 border-b pb-4">
            {MALL_STORES.map((s) => <Button key={s.id} asChild size="sm" variant={s.id === storeId ? 'default' : 'outline'}><Link to={`/shop/${s.id}`} aria-current={s.id === storeId ? 'page' : undefined}>{s.label}</Link></Button>)}
          </nav>
        )}
        {storeId && !store ? (
          <section className="space-y-3 py-8 text-center"><h2 className="text-xl font-bold">Store not found</h2><Button asChild variant="outline"><Link to="/shop"><ArrowLeft />Back to the Mall</Link></Button></section>
        ) : store?.kind !== 'books' && (
          <section aria-labelledby="mall-products-title" className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div><h2 id="mall-products-title" className="text-xl font-bold">{store ? 'Avatar gear' : 'Browse avatar gear'}</h2><p className="mt-1 text-xs text-muted-foreground">{visibleItems.length} item{visibleItems.length === 1 ? '' : 's'} · Digital gear for your MiyTube avatar</p></div>
              {user && <Tabs value={inventoryView} onValueChange={setInventoryView}><TabsList><TabsTrigger value="all">Shop</TabsTrigger><TabsTrigger value="owned">My gear</TabsTrigger></TabsList></Tabs>}
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1"><Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input aria-label="Search avatar gear" placeholder="Search gear" value={query} onChange={(e) => setQuery(e.target.value)} className="pl-9" /></div>
              <Select value={sort} onValueChange={setSort}><SelectTrigger aria-label="Sort avatar gear" className="w-full sm:w-48"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="featured">Store order</SelectItem><SelectItem value="price-low">Price: low to high</SelectItem><SelectItem value="price-high">Price: high to low</SelectItem></SelectContent></Select>
            </div>
            {visibleItems.length > 0 ? <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {visibleItems.map((item) => <ShopProductCard key={item.sku} item={item} config={config} equipped={equipped} catalog={catalog} signedIn={Boolean(user)} status={shopStatus(item, ownedSkus, balance)} balance={balance} busy={busySku === item.sku} onBuy={() => setConfirmItem(item)} onWear={() => toggleWear(item)} />)}
            </div> : <div className="flex flex-col items-center gap-3 border-y py-12 text-center"><ShoppingBag className="h-8 w-8 text-muted-foreground" /><p className="text-sm text-muted-foreground">{query ? 'No gear matches your search.' : inventoryView === 'owned' ? 'No owned gear in this store yet.' : 'No gear available right now.'}</p>{(query || inventoryView === 'owned') && <Button variant="outline" onClick={() => { setQuery(''); setInventoryView('all'); }}>Show store gear</Button>}</div>}
          </section>
        )}
        {(!storeId || store?.kind === 'books') && <div className="border-y py-6"><BooksemPassCard userId={user?.id ?? null} balance={balance} />{store?.kind === 'books' && <Button asChild variant="link" className="mt-3"><a href="https://booksem.com" target="_blank" rel="noopener noreferrer">Browse audiobooks on Booksem<ArrowUpRight /></a></Button>}</div>}
        <div id="mall-coins" className="scroll-mt-40 border-t pt-6"><CoinPacks signedIn={Boolean(user)} /></div>
        {!storeId && <section className="flex flex-wrap items-center justify-between gap-3 border-t pt-5"><div><h2 className="font-bold">Creator storefronts</h2><p className="mt-1 text-sm text-muted-foreground">Creator merchandise · Coming soon</p></div><Button asChild variant="outline" size="sm"><Link to="/avatar"><Sparkles />Avatar Studio<ArrowUpRight /></Link></Button></section>}
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

export default MiyTubeShop;
