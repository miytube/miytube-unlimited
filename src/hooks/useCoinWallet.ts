import { useCallback, useEffect, useSyncExternalStore } from 'react';
import { supabase } from '@/integrations/supabase/client';

/**
 * Shared MiyTube Coin wallet for the signed-in member. Balances only change
 * through backend functions (join bonus, daily bonus, purchases), so the
 * browser just mirrors what the backend returns.
 */
export interface CoinWalletState {
  userId: string | null;
  balance: number | null;
  dailyAvailable: boolean;
  welcomeJustGranted: boolean;
}

let state: CoinWalletState = { userId: null, balance: null, dailyAvailable: false, welcomeJustGranted: false };
const listeners = new Set<() => void>();
let inflight: Promise<void> | null = null;

const set = (patch: Partial<CoinWalletState>) => {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
};

type WalletPayload = { balance?: number; daily_available?: boolean; welcome_granted?: boolean; claimed?: boolean };

async function load(userId: string) {
  const { data, error } = await supabase.rpc('get_coin_wallet');
  if (error || !data) return;
  const w = data as WalletPayload;
  if (state.userId !== userId) return;
  set({ balance: w.balance ?? 0, dailyAvailable: Boolean(w.daily_available), welcomeJustGranted: Boolean(w.welcome_granted) });
}

export function setCoinBalance(balance: number) {
  set({ balance });
}

export function useCoinWallet(userId: string | null | undefined) {
  const snapshot = useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => state,
  );

  useEffect(() => {
    const id = userId ?? null;
    if (id === state.userId && (state.balance !== null || inflight)) return;
    set({ userId: id, balance: null, dailyAvailable: false, welcomeJustGranted: false });
    if (!id) return;
    inflight = load(id).finally(() => {
      inflight = null;
    });
  }, [userId]);

  const claimDaily = useCallback(async () => {
    const { data, error } = await supabase.rpc('claim_daily_coins');
    if (error) throw error;
    const w = data as WalletPayload;
    set({ balance: w.balance ?? state.balance, dailyAvailable: false });
    return Boolean(w.claimed);
  }, []);

  const ackWelcome = useCallback(() => set({ welcomeJustGranted: false }), []);

  const mine = snapshot.userId === (userId ?? null);
  return {
    balance: mine ? snapshot.balance : null,
    dailyAvailable: mine && snapshot.dailyAvailable,
    welcomeJustGranted: mine && snapshot.welcomeJustGranted,
    claimDaily,
    ackWelcome,
  };
}
