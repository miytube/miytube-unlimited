import { Link } from 'react-router-dom';
import { Coins, ExternalLink, Loader2, Lock, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AvatarFigure } from '@/components/avatar/AvatarFigure';
import { SPORTS_LEGENDS } from '@/data/sportsBeginEndLegends';
import { resolveEquippedItems, shopStatus, type AvatarConfig, type AvatarEquipped, type AvatarItem, type Rarity } from '@/lib/avatar';
import { cn } from '@/lib/utils';

const RARITY_CLASS: Record<Rarity, string> = {
  common: 'border-rarity-common text-rarity-common',
  rare: 'border-rarity-rare text-rarity-rare',
  epic: 'border-rarity-epic text-rarity-epic',
  legendary: 'border-rarity-legendary text-rarity-legendary',
};

export function ShopProductCard({ item, config, equipped, catalog, signedIn, status, balance, busy, onBuy, onWear }: {
  item: AvatarItem; config: AvatarConfig; equipped: AvatarEquipped; catalog: Map<string, AvatarItem>;
  signedIn: boolean; status: ReturnType<typeof shopStatus>; balance: number; busy: boolean;
  onBuy: () => void; onWear: () => void;
}) {
  const preview = resolveEquippedItems({ ...equipped, [item.slot]: item.sku }, catalog);
  const legend = item.legend_id ? SPORTS_LEGENDS.find((l) => l.id === item.legend_id) : undefined;
  const wearing = equipped[item.slot] === item.sku;
  return (
    <article className={cn('flex min-w-0 flex-col overflow-hidden rounded-lg border bg-card', wearing && 'border-primary ring-2 ring-primary/20')} aria-label={item.name}>
      <div className="relative aspect-square overflow-hidden bg-muted">
        <AvatarFigure config={config} items={preview} className="h-full w-full" title={`Preview: ${item.name}`} />
        {status === 'owned' && <span className="absolute left-2 top-2 rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground">{wearing ? 'Wearing' : 'Owned'}</span>}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h3 className="font-semibold leading-tight">{item.name}</h3>
          <Badge variant="outline" className={cn('shrink-0 capitalize', RARITY_CLASS[item.rarity])}>{item.rarity}</Badge>
        </div>
        {item.description && <p className="text-xs text-muted-foreground">{item.description}</p>}
        {legend && <a href={`https://sportsbeginend.com/profile/${legend.id}?utm_source=miytube&utm_medium=shop&utm_campaign=legend_gear`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">{legend.name}'s story <ExternalLink className="h-3 w-3" /></a>}
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-1">
          <span className="flex items-center gap-1 font-bold tabular-nums"><Coins className="h-4 w-4 text-rarity-legendary" />{item.price_credits.toLocaleString()}</span>
          <span className="break-all font-mono text-[10px] text-muted-foreground">{item.sku}</span>
        </div>
        {!signedIn ? <Button asChild size="sm" variant="outline"><Link to="/auth"><Lock className="h-3 w-3" />Sign in to buy</Link></Button>
          : status === 'owned' ? <Button size="sm" variant={wearing ? 'outline' : 'default'} disabled={busy} onClick={onWear}>{busy && <Loader2 className="h-3 w-3 animate-spin" />}{wearing ? 'Take off' : 'Wear it'}</Button>
          : status === 'affordable' ? <Button size="sm" disabled={busy} onClick={onBuy}><ShoppingBag className="h-3 w-3" />Buy</Button>
          : <Button size="sm" variant="outline" disabled className="h-auto min-h-9 whitespace-normal">Need {(item.price_credits - balance).toLocaleString()} more coins</Button>}
      </div>
    </article>
  );
}