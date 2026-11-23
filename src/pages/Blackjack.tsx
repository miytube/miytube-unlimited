import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Coins, Gift, Loader2, User } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { usePageSEO } from '@/hooks/usePageSEO';
import { supabase } from '@/integrations/supabase/client';
import { setCoinBalance, useCoinWallet } from '@/hooks/useCoinWallet';
import { UserAvatarBubble } from '@/components/avatar/UserAvatarBubble';
import { PlayingCard } from '@/components/games/PlayingCard';
import { BET_MAX, BET_MIN, BlackjackView, CHIP_VALUES, RecentHand, resultLabel } from '@/lib/blackjack';
import { COIN_DAILY_BONUS } from '@/lib/avatar';
import { cn } from '@/lib/utils';

type Action = 'deal' | 'hit' | 'stand' | 'double';

const errorText = (e: unknown) => {
  const msg = (e as { message?: string })?.message ?? '';
  return msg || 'Something went wrong. Please try again.';
};

const Blackjack = () => {
  usePageSEO({
    title: 'Blackjack — MiyTube Gaming Room',
    description: 'Play Blackjack for MiyTube Coins. Blackjack pays 3 to 2, dealer stands on 17. Bets from 10 to 500 coins.',
    path: '/game-room/blackjack',
  });
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const wallet = useCoinWallet(user?.id);

  const [hand, setHand] = useState<BlackjackView | null>(null);
  const [recent, setRecent] = useState<RecentHand[]>([]);
  const [bet, setBet] = useState(25);
  const [busy, setBusy] = useState<Action | null>(null);
  const [loaded, setLoaded] = useState(false);

  const live = hand?.status === 'playing';
  const balance = wallet.balance ?? 0;

  const loadCurrent = useCallback(async () => {
    const { data, error } = await supabase.rpc('blackjack_current');
    if (error) return;
    const payload = data as unknown as { hand: BlackjackView | null; recent: RecentHand[] };
    if (payload.hand) setHand(payload.hand);
    setRecent(payload.recent ?? []);
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!user) {
      setHand(null);
      setRecent([]);
      setLoaded(false);
      return;
    }
    loadCurrent();
  }, [user, loadCurrent]);

  const apply = (view: BlackjackView) => {
    setHand(view);
    setCoinBalance(view.balance);
    if (view.status !== 'playing') {
      setRecent((r) => [{ status: view.status, bet: view.bet, payout: view.payout }, ...r].slice(0, 10));
    }
  };

  const run = async (action: Action) => {
    setBusy(action);
    try {
      const res =
        action === 'deal'
          ? await supabase.rpc('blackjack_deal', { _bet: bet })
          : action === 'hit'
            ? await supabase.rpc('blackjack_hit', { _hand_id: hand!.id })
            : action === 'stand'
              ? await supabase.rpc('blackjack_stand', { _hand_id: hand!.id })
              : await supabase.rpc('blackjack_double', { _hand_id: hand!.id });
      if (res.error) throw res.error;
      apply(res.data as unknown as BlackjackView);
    } catch (e) {
      toast({ title: "Couldn't do that", description: errorText(e), variant: 'destructive' });
      if (action !== 'deal') loadCurrent();
    } finally {
      setBusy(null);
    }
  };

  const claimDaily = async () => {
    try {
      const claimed = await wallet.claimDaily();
      toast({ title: claimed ? `+${COIN_DAILY_BONUS} coins` : 'Already claimed today' });
    } catch (e) {
      toast({ title: "Couldn't claim", description: errorText(e), variant: 'destructive' });
    }
  };

  const result = hand && !live ? resultLabel(hand.status, hand.bet, hand.payout) : null;
  const canAffordBet = balance >= bet;

  return (
    <Layout>
      <div className="mx-auto max-w-5xl px-4 py-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <Link to="/game-room" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft size={16} /> Gaming Room
          </Link>
          {user && (
            <div className="flex items-center gap-2">
              {wallet.dailyAvailable && (
                <Button size="sm" variant="outline" onClick={claimDaily} className="gap-1">
                  <Gift size={14} /> Claim {COIN_DAILY_BONUS}
                </Button>
              )}
              <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-sm font-semibold">
                <Coins size={16} className="text-gold" />
                <span data-testid="coin-balance">{wallet.balance === null ? '…' : balance.toLocaleString()}</span>
              </span>
            </div>
          )}
        </div>

        <section className="relative overflow-hidden rounded-[2rem] border-4 border-gold/70 bg-table-felt px-4 py-6 text-felt-foreground shadow-2xl sm:px-8">
          <h1 className="text-center font-serif text-3xl font-bold tracking-wide">Blackjack</h1>
          <p className="text-center text-xs uppercase tracking-[0.25em] text-gold">
            Blackjack pays 3 to 2 · Dealer stands on 17
          </p>

          {/* Dealer */}
          <div className="mt-6 flex flex-col items-center gap-2">
            <span className="text-sm font-semibold uppercase tracking-widest text-felt-foreground/80">
              Dealer{hand ? ` · ${hand.dealer_total}${live ? ' showing' : ''}` : ''}
            </span>
            <div className="flex min-h-28 gap-2 sm:min-h-36">
              {hand ? (
                <>
                  {hand.dealer.map((c, i) => (
                    <PlayingCard key={`d-${hand.id}-${i}`} card={c} index={i} />
                  ))}
                  {Array.from({ length: hand.dealer_hidden }).map((_, i) => (
                    <PlayingCard key={`dh-${hand.id}-${i}`} faceDown index={hand.dealer.length + i} />
                  ))}
                </>
              ) : (
                <div className="flex items-center gap-2 opacity-40">
                  <PlayingCard faceDown />
                  <PlayingCard faceDown />
                </div>
              )}
            </div>
          </div>

          {/* Result */}
          <div className="my-5 flex min-h-12 items-center justify-center" aria-live="polite">
            {result && (
              <div
                className={cn(
                  'rounded-full px-6 py-2 font-serif text-lg font-bold shadow-lg animate-in zoom-in-90 duration-300',
                  result.tone === 'win' && 'bg-gold text-gold-foreground',
                  result.tone === 'push' && 'bg-felt-foreground text-felt-deep',
                  result.tone === 'lose' && 'bg-felt-deep text-felt-foreground ring-1 ring-felt-foreground/30',
                )}
              >
                {result.title}
              </div>
            )}
          </div>

          {/* Player */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex min-h-28 gap-2 sm:min-h-36">
              {hand?.player.map((c, i) => <PlayingCard key={`p-${hand.id}-${i}`} card={c} index={i} />)}
            </div>
            <div className="flex items-center gap-2">
              {user && (
                <UserAvatarBubble
                  userId={user.id}
                  className="h-9 w-9 ring-2 ring-gold"
                  fallback={
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-felt-deep ring-2 ring-gold">
                      <User size={18} />
                    </span>
                  }
                />
              )}
              <span className="text-sm font-semibold uppercase tracking-widest text-felt-foreground/80">
                You{hand ? ` · ${hand.player_total}` : ''}
                {hand ? ` · bet ${hand.bet.toLocaleString()}${hand.doubled ? ' (doubled)' : ''}` : ''}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="mt-6 border-t border-gold/30 pt-5">
            {authLoading ? null : !user ? (
              <div className="flex flex-col items-center gap-3 text-center">
                <p className="text-felt-foreground/85">Sign in to play. New members get 500 free coins.</p>
                <Button asChild className="bg-gold text-gold-foreground hover:bg-gold/90">
                  <Link to="/auth">Sign in to play</Link>
                </Button>
              </div>
            ) : live ? (
              <div className="flex flex-wrap justify-center gap-3">
                <Button size="lg" onClick={() => run('hit')} disabled={!!busy} className="min-w-28 bg-gold text-gold-foreground hover:bg-gold/90">
                  {busy === 'hit' ? <Loader2 className="animate-spin" /> : 'Hit'}
                </Button>
                <Button size="lg" onClick={() => run('stand')} disabled={!!busy} className="min-w-28 bg-felt-foreground text-felt-deep hover:bg-felt-foreground/90">
                  {busy === 'stand' ? <Loader2 className="animate-spin" /> : 'Stand'}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => run('double')}
                  disabled={!!busy || !hand?.can_double}
                  className="min-w-28 border-gold bg-transparent text-felt-foreground hover:bg-felt-deep hover:text-felt-foreground"
                >
                  {busy === 'double' ? <Loader2 className="animate-spin" /> : `Double (${hand!.bet.toLocaleString()})`}
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <div className="flex flex-wrap justify-center gap-2" role="radiogroup" aria-label="Choose your bet">
                  {CHIP_VALUES.map((v) => (
                    <button
                      key={v}
                      type="button"
                      role="radio"
                      aria-checked={bet === v}
                      onClick={() => setBet(v)}
                      disabled={!!busy}
                      className={cn(
                        'flex h-14 w-14 items-center justify-center rounded-full border-4 border-dashed font-bold shadow-md transition-transform',
                        bet === v
                          ? 'scale-110 border-gold-foreground/40 bg-gold text-gold-foreground'
                          : 'border-felt-foreground/40 bg-felt-deep text-felt-foreground hover:scale-105',
                        v > balance && 'opacity-40',
                      )}
                    >
                      {v}
                    </button>
                  ))}
                </div>
                <Button
                  size="lg"
                  onClick={() => run('deal')}
                  disabled={!!busy || !loaded || !canAffordBet}
                  className="min-w-48 bg-gold text-lg font-bold text-gold-foreground hover:bg-gold/90"
                >
                  {busy === 'deal' ? <Loader2 className="animate-spin" /> : `${hand ? 'Deal again' : 'Deal'} · ${bet} coins`}
                </Button>
                {!canAffordBet && wallet.balance !== null && (
                  <p className="text-sm text-felt-foreground/85">
                    Not enough coins for this bet.{' '}
                    <Link to="/shop" className="font-semibold text-gold underline">
                      Get more coins
                    </Link>
                  </p>
                )}
              </div>
            )}
          </div>
        </section>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border bg-card p-4 text-sm">
            <h2 className="mb-2 font-serif text-lg font-bold">House rules</h2>
            <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
              <li>Bets from {BET_MIN} to {BET_MAX} coins. One deck, shuffled fresh every hand.</li>
              <li>Blackjack pays 3 to 2. Other wins pay 1 to 1. Ties give your bet back.</li>
              <li>Dealer draws to 16 and stands on all 17s.</li>
              <li>Double down on your first two cards for one more card.</li>
            </ul>
          </div>
          <div className="rounded-xl border bg-card p-4 text-sm">
            <h2 className="mb-2 font-serif text-lg font-bold">Your last hands</h2>
            {recent.length === 0 ? (
              <p className="text-muted-foreground">No hands yet. Pick a chip and deal.</p>
            ) : (
              <ul className="space-y-1">
                {recent.map((r, i) => {
                  const net = r.payout - r.bet;
                  return (
                    <li key={i} className="flex justify-between">
                      <span className="capitalize text-muted-foreground">{r.status.replace('_', ' ')}</span>
                      <span className={cn('font-semibold', net > 0 ? 'text-felt' : net < 0 ? 'text-destructive' : 'text-muted-foreground')}>
                        {net > 0 ? '+' : ''}
                        {net.toLocaleString()}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          For fun only. MiyTube Coins have no cash value and can't be cashed out.
        </p>
      </div>
    </Layout>
  );
};

export default Blackjack;
