/**
 * MiyTube Coin packs sold by card. Coins granted are decided by the backend
 * (supabase/functions/_shared/coinPacks.ts); keep both lists in sync.
 */
export interface CoinPack {
  id: 'coin_pack_small' | 'coin_pack_medium' | 'coin_pack_large';
  label: string;
  coins: number;
  priceCents: number;
  tag?: string;
}

export const COIN_PACKS: CoinPack[] = [
  { id: 'coin_pack_small', label: 'Starter Stack', coins: 500, priceCents: 499 },
  { id: 'coin_pack_medium', label: 'Pro Stack', coins: 1200, priceCents: 999, tag: 'Popular' },
  { id: 'coin_pack_large', label: 'Legend Vault', coins: 3000, priceCents: 1999, tag: 'Best value' },
];

export const formatUsd = (cents: number) => `$${(cents / 100).toFixed(2)}`;

/** Coins per dollar, rounded down. */
export const coinsPerDollar = (pack: Pick<CoinPack, 'coins' | 'priceCents'>) => Math.floor((pack.coins * 100) / pack.priceCents);
