import { itemsInKiosk, shopItems, SHOP_KIOSKS, type AvatarItem, type ShopKiosk } from './avatar';

export const MALL_STORES = [
  ...SHOP_KIOSKS.map((store) => ({ ...store, kind: 'gear' as const })),
  { id: 'booksem', label: 'Booksem', blurb: 'Audiobooks and your member half-price pass.', kind: 'books' as const },
];

export function findMallStore(id: string | undefined) {
  return MALL_STORES.find((store) => store.id === id);
}

export function browseMallItems(
  items: AvatarItem[],
  options: { storeId?: string; query?: string; ownedOnly?: boolean; ownedSkus?: Set<string>; sort?: string } = {},
) {
  const store = findMallStore(options.storeId);
  if (options.storeId && (!store || store.kind !== 'gear')) return [];
  const source = store ? itemsInKiosk(items, store.id as ShopKiosk) : shopItems(items);
  const query = options.query?.trim().toLowerCase() ?? '';
  const filtered = source.filter((item) =>
    (!options.ownedOnly || options.ownedSkus?.has(item.sku)) &&
    (!query || `${item.name} ${item.description ?? ''} ${item.sku}`.toLowerCase().includes(query)),
  );
  if (options.sort === 'price-low') filtered.sort((a, b) => a.price_credits - b.price_credits || a.sort_order - b.sort_order);
  if (options.sort === 'price-high') filtered.sort((a, b) => b.price_credits - a.price_credits || a.sort_order - b.sort_order);
  return filtered;
}