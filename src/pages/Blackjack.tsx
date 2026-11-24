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
import { BetSpot, ChipPicker } from '@/components/games/CasinoChip';
import { CasinoTable, ChipRack, DealerShoe, DiscardTray, ResultBanner, SeatTag, TableArc } from '@/components/games/CasinoTable';
import { BET_MAX, BET_MIN, BlackjackView, CHIP_VALUES, RecentHand, resultLabel } from '@/lib/blackjack';
import { COIN_DAILY_BONUS } from '@/lib/avatar';
import { cn } from '@/lib/utils';

type Action = 'deal' | 'hit' | 'stand' | 'double';

const DEAL_STEP = 180;
const DEALER_DRAW_START = 700;
const DEALER_DRAW_STEP = 450;


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
  const [justDealt, setJustDealt] = useState(false);

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
      setJustDealt(action === 'deal');
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

  // Deal order like a real table: player, dealer, player, dealer (hole card).
  // Dealer draws after a stand land one by one once the hole card has turned.
  const dealerSlots: (number | undefined)[] = hand
    ? [...hand.dealer, ...Array<undefined>(hand.dealer_hidden).fill(undefined)]
    : [];
  const dealDelay = (who: 'player' | 'dealer', i: number) => {
    if (i < 2) return (i * 2 + (who === 'dealer' ? 1 : 0)) * DEAL_STEP;
    return who === 'dealer' ? DEALER_DRAW_START + (i - 2) * DEALER_DRAW_STEP : 0;
  };
  const extraDealer = hand ? Math.max(0, hand.dealer.length - 2) : 0;
  const resultDelay = justDealt
    ? 4 * DEAL_STEP + 500
    : extraDealer > 0
      ? DEALER_DRAW_START + (extraDealer - 1) * DEALER_DRAW_STEP + 550
      : 650;
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

        <CasinoTable shape="half-moon">
          <div className="relative px-3 pb-10 sm:px-10 sm:pb-20">
            <div className="grid grid-cols-3 items-start">
              <DiscardTray className="mt-5 hidden justify-self-start sm:block" />
              <ChipRack className="justify-self-center" />
              <DealerShoe className="mt-4 hidden justify-self-end sm:block" />
            </div>
            <h1 className="mt-2 text-center font-serif text-2xl font-bold uppercase tracking-[0.3em] text-gold drop-shadow sm:text-3xl">Blackjack</h1>

            {/* Dealer */}
            <div className="mt-3 flex flex-col items-center gap-2">
              <SeatTag label="Dealer" value={hand ? `${hand.dealer_total}${live ? ' showing' : ''}` : undefined} />
              <div className="flex min-h-28 gap-2 sm:min-h-36">
                {hand ? (
                  dealerSlots.map((c, i) => (
                    <PlayingCard
                      key={`d-${hand.id}-${i}`}
                      card={c}
                      faceDown={c === undefined}
                      dealDelay={dealDelay('dealer', i)}
                      flipDelay={0}
                    />
                  ))
                ) : (
                  <div className="flex items-center gap-2 opacity-40">
                    <PlayingCard faceDown dealDelay={0} />
                    <PlayingCard faceDown dealDelay={0} />
                  </div>
                )}
              </div>
            </div>

            <TableArc lines={['BLACKJACK PAYS 3 TO 2', 'DEALER MUST DRAW TO 16 AND STAND ON ALL 17s']} className="mx-auto -mb-3 mt-1" />

            {/* Result */}
            <div className="flex min-h-12 items-center justify-center" aria-live="polite">
              {result && <ResultBanner key={hand!.id} title={result.title} tone={result.tone} delay={resultDelay} />}
            </div>

            {/* Player */}
            <div className="mt-1 flex flex-col items-center gap-3">
              <div className="flex min-h-28 gap-2 sm:min-h-36">
                {hand?.player.map((c, i) => (
                  <PlayingCard key={`p-${hand.id}-${i}`} card={c} dealDelay={dealDelay('player', i)} />
                ))}
              </div>
              <BetSpot
                label="Bet"
                amount={hand ? hand.bet : bet}
                payout={result?.tone === 'win' ? hand!.payout - hand!.bet : 0}
                payoutDelay={resultDelay}
                lost={result?.tone === 'lose'}
              />
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
                <SeatTag label="You" value={hand ? `${hand.player_total}${hand.doubled ? ' · doubled' : ''}` : undefined} />
              </div>
            </div>
          </div>
        </CasinoTable>

        {/* Controls */}
        <div className="casino-console mt-4 rounded-2xl px-2 py-5 text-felt-foreground sm:px-4">
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
              <ChipPicker
                values={CHIP_VALUES}
                value={bet}
                onChange={setBet}
                disabled={!!busy}
                isAffordable={(v) => v <= balance}
                label="Choose your bet"
              />
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
