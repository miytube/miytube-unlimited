import { Link } from 'react-router-dom';
import { ArrowUpRight, BookOpen, Coins } from 'lucide-react';
import { AvatarFigure } from '@/components/avatar/AvatarFigure';
import { Button } from '@/components/ui/button';
import { DEFAULT_AVATAR_CONFIG, itemsInKiosk, resolveEquippedItems, type AvatarItem, type AvatarEquipped, type ShopKiosk } from '@/lib/avatar';
import { BOOKSEM_PASS_DISCOUNT_PERCENT, BOOKSEM_PASS_PRICE_COINS } from '@/lib/booksemPass';
import { MALL_STORES } from '@/lib/mall';

export function MallStorefronts({ catalog }: { catalog: Map<string, AvatarItem> }) {
  const allItems = Array.from(catalog.values());
  return (
    <section aria-labelledby="mall-stores-title" className="space-y-4">
      <div className="flex items-baseline justify-between gap-3">
        <h2 id="mall-stores-title" className="text-xl font-bold">The storefronts</h2>
        <span className="text-xs text-muted-foreground">Avatar gear & member offers</span>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {MALL_STORES.map((store) => {
          const products = store.kind === 'gear' ? itemsInKiosk(allItems, store.id as ShopKiosk) : [];
          const preview: AvatarEquipped = {};
          products.forEach((item) => { if (!preview[item.slot]) preview[item.slot] = item.sku; });
          const minPrice = products.length ? Math.min(...products.map((item) => item.price_credits)) : null;
          return (
            <article key={store.id} className="flex min-w-0 flex-col overflow-hidden rounded-lg border bg-card">
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                {store.kind === 'gear' && products.length > 0 ? (
                  <AvatarFigure config={{ ...DEFAULT_AVATAR_CONFIG, backdrop: store.id === 'fitness' ? 'turf' : 'night' }} items={resolveEquippedItems(preview, catalog)} className="h-full w-full" title={`${store.label} avatar gear`} />
                ) : store.kind === 'books' ? (
                  <div className="flex h-full flex-col items-center justify-center gap-2 bg-primary/10 text-primary">
                    <BookOpen className="h-12 w-12" strokeWidth={1.5} />
                    <p className="text-3xl font-black">{BOOKSEM_PASS_DISCOUNT_PERCENT}% OFF</p>
                    <span className="text-sm font-medium">One audiobook</span>
                  </div>
                ) : <div className="flex h-full items-center justify-center text-sm text-muted-foreground">No gear available</div>}
              </div>
              <div className="flex flex-1 flex-col gap-3 p-4">
                <div>
                  <h3 className="font-bold">{store.label}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{store.blurb}</p>
                </div>
                <p className="mt-auto flex items-center gap-1 text-xs font-medium">
                  <Coins className="h-3.5 w-3.5 text-rarity-legendary" />
                  {store.kind === 'books' ? `${BOOKSEM_PASS_PRICE_COINS} coins per pass` : minPrice !== null ? `From ${minPrice} coins · ${products.length} items` : 'No items available'}
                </p>
                <Button asChild variant="outline" className="w-full justify-between">
                  <Link to={`/shop/${store.id}`} aria-label={`Visit ${store.label}`}>Visit store <ArrowUpRight /></Link>
                </Button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}