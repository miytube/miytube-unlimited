// MiyTube Coin packs sold by card. Keep in sync with src/lib/coinPacks.ts.
// priceLookupKey matches the Stripe price lookup key; coins are granted from
// this server-side table, never from anything the browser sends.
export const COIN_PACKS: Record<string, { coins: number; priceLookupKey: string }> = {
  coin_pack_small: { coins: 500, priceLookupKey: "coin_pack_small_usd" },
  coin_pack_medium: { coins: 1200, priceLookupKey: "coin_pack_medium_usd" },
  coin_pack_large: { coins: 3000, priceLookupKey: "coin_pack_large_usd" },
};
