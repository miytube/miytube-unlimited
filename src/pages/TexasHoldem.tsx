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
import { CasinoTable, ResultBanner, SeatTag } from '@/components/games/CasinoTable';
import { COIN_DAILY_BONUS } from '@/lib/avatar';
import { HOLDEM_ANTE_MAX, HOLDEM_ANTE_MIN, HOLDEM_CHIPS, HOLDEM_PAYTABLE, HoldemStatus, handName } from '@/lib/poker';
import { cn } from '@/lib/utils';

interface HoldemView {
  id: string;
  ante: number;
  call_bet: number;
  status: HoldemStatus;
  payout: number;
  player: number[];
  dealer: number[];
  board: number[];
  player_score: number;
  dealer_score: number | null;
  can_call: boolean;
  balance: number;
}
interface RecentHand {
  status: HoldemStatus;
  staked: number;
  payout: number;
}
type Action = 'deal' | 'call' | 'fold';

const DEAL_STEP = 160;
const FLOP_START = 800;
const STREET_STEP = 450;


const resultText = (h: HoldemView) => {
  const net = h.payout - h.ante - h.call_bet;
  const amt = Math.abs(net).toLocaleString();
  switch (h.status) {
    case 'win':
      return { title: `You win +${amt} coins`, tone: 'win' as const };
    case 'dealer_no_qualify':
      return { title: `Dealer doesn't qualify · +${amt} coins`, tone: 'win' as const };
    case 'push':
      return { title: 'Tie — bets returned', tone: 'push' as const };
    case 'folded':
      return { title: `Folded — −${amt} coins`, tone: 'lose' as const };
    default:
      return { title: `Dealer wins — −${amt} coins`, tone: 'lose' as const };
  }
};

const TexasHoldem = () => {
  usePageSEO({
    title: "Texas Hold'em — MiyTube Gaming Room",
    description: "Play Texas Hold'em against the dealer for MiyTube Coins. Royal flush pays 100 to 1. Antes from 10 to 100 coins.",
    path: '/game-room/texas-holdem',
  });
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const wallet = useCoinWallet(user?.id);

  const [hand, setHand] = useState<HoldemView | null>(null);
  const [recent, setRecent] = useState<RecentHand[]>([]);
  const [ante, setAnte] = useState(25);
  const [busy, setBusy] = useState<Action | null>(null);
  const [loaded, setLoaded] = useState(false);

  const live = hand?.status === 'playing';
  const balance = wallet.balance ?? 0;

  const loadCurrent = useCallback(async () => {
    const { data, error } = await supabase.rpc('holdem_current');
    if (error) return;
    const p = data as unknown as { hand: HoldemView | null; recent: RecentHand[] };
    if (p.hand) setHand(p.hand);
    setRecent(p.recent ?? []);
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

  const run = async (action: Action) => {
    setBusy(action);
    try {
      const res =
        action === 'deal'
          ? await supabase.rpc('holdem_deal', { _ante: ante })
          : action === 'call'
            ? await supabase.rpc('holdem_call', { _hand_id: hand!.id })
            : await supabase.rpc('holdem_fold', { _hand_id: hand!.id });
      if (res.error) throw res.error;
      const view = res.data as unknown as HoldemView;
      setHand(view);
      setCoinBalance(view.balance);
      if (view.status !== 'playing') {
        setRecent((r) => [{ status: view.status, staked: view.ante + view.call_bet, payout: view.payout }, ...r].slice(0, 10));
      }
    } catch (e) {
      toast({ title: "Couldn't do that", description: (e as { message?: string })?.message || 'Please try again.', variant: 'destructive' });
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
      toast({ title: "Couldn't claim", description: (e as { message?: string })?.message, variant: 'destructive' });
    }
  };

  const result = hand && !live ? resultText(hand) : null;
  const revealed = hand && hand.dealer.length > 0;
  const boardSlots: (number | undefined)[] = hand
    ? [...hand.board, ...Array<undefined>(5 - hand.board.length).fill(undefined)]
    : Array<undefined>(5).fill(undefined);
  // After a call the turn and river land first, then the dealer turns over.
  const called = !!hand && hand.call_bet > 0;
  const dealerFlipDelay = called ? 2 * STREET_STEP : 150;
  const resultDelay = called ? dealerFlipDelay + 750 : 700;

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

        <CasinoTable shape="oval">
          <div className="px-3 py-6 sm:px-16 sm:py-9">
            <h1 className="text-center font-serif text-2xl font-bold uppercase tracking-[0.25em] text-gold drop-shadow sm:text-3xl">Texas Hold'em</h1>
            <p className="text-center text-[11px] uppercase tracking-[0.25em] text-felt-foreground/70">You vs the dealer · Royal flush pays 100 to 1</p>

            {/* Dealer */}
            <div className="mt-4 flex flex-col items-center gap-2">
              <SeatTag label="Dealer" value={revealed && hand?.dealer_score != null ? handName(hand.dealer_score) : undefined} />
              <div className="flex gap-2">
                {[0, 1].map((i) => (
                  <PlayingCard
                    key={`d-${hand?.id ?? 'x'}-${i}`}
                    card={revealed ? hand!.dealer[i] : undefined}
                    faceDown={!revealed}
                    dealDelay={(i * 2 + 1) * DEAL_STEP}
                    flipDelay={dealerFlipDelay}
                    className={!hand ? 'opacity-40' : ''}
                  />
                ))}
              </div>
            </div>

            {/* Board */}
            <div className="my-4 flex flex-col items-center gap-2">
              <div className="relative flex flex-wrap justify-center gap-1.5 rounded-[1.25rem] border-2 border-gold/45 p-2 pt-4 sm:gap-2 sm:p-3 sm:pt-5">
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-felt-deep px-3 font-serif text-[10px] font-bold uppercase tracking-[0.3em] text-gold sm:text-xs">
                  The board
                </span>
                {boardSlots.map((c, i) =>
                  c === undefined ? (
                    <div
                      key={`b-empty-${i}`}
                      className="h-28 w-20 rounded-md border-2 border-dashed border-gold/25 bg-felt-deep/20 sm:h-36 sm:w-[6.5rem] sm:rounded-lg"
                    />
                  ) : (
                    <PlayingCard key={`b-${hand!.id}-${i}`} card={c} dealDelay={i < 3 ? FLOP_START + i * DEAL_STEP : (i - 3) * STREET_STEP} />
                  ),
                )}
              </div>
              <div className="flex min-h-11 items-center" aria-live="polite" data-testid="holdem-result">
                {result && <ResultBanner key={hand!.id} title={result.title} tone={result.tone} delay={resultDelay} />}
              </div>
            </div>

            {/* Player */}
            <div className="flex flex-col items-center gap-3">
              <div className="flex gap-2">
                {hand?.player.map((c, i) => <PlayingCard key={`p-${hand.id}-${i}`} card={c} dealDelay={i * 2 * DEAL_STEP} />)}
              </div>
              <div className="flex items-end justify-center gap-4 sm:gap-8">
                <BetSpot label="Ante" amount={hand ? hand.ante : ante} lost={result?.tone === 'lose'} payoutDelay={resultDelay} />
                <BetSpot
                  label="Call"
                  amount={hand?.call_bet ?? 0}
                  payout={result?.tone === 'win' ? hand!.payout - hand!.ante - hand!.call_bet : 0}
                  payoutDelay={resultDelay}
                  lost={result?.tone === 'lose'}
                />
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
                <SeatTag label="You" value={hand ? handName(hand.player_score) : undefined} />
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
            <div className="flex flex-col items-center gap-3">
              <p className="text-sm text-felt-foreground/85">Like your hand? Call to see the turn and river, or fold.</p>
              <div className="flex flex-wrap justify-center gap-3">
                <Button size="lg" onClick={() => run('call')} disabled={!!busy || !hand?.can_call} className="min-w-36 bg-gold text-gold-foreground hover:bg-gold/90">
                  {busy === 'call' ? <Loader2 className="animate-spin" /> : `Call (${(hand!.ante * 2).toLocaleString()})`}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => run('fold')}
                  disabled={!!busy}
                  className="min-w-28 border-gold bg-transparent text-felt-foreground hover:bg-felt-deep hover:text-felt-foreground"
                >
                  {busy === 'fold' ? <Loader2 className="animate-spin" /> : 'Fold'}
                </Button>
              </div>
              {!hand?.can_call && (
                <p className="text-sm text-felt-foreground/85">
                  Not enough coins to call.{' '}
                  <Link to="/shop" className="font-semibold text-gold underline">
                    Get more coins
                  </Link>
                </p>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <ChipPicker
                values={HOLDEM_CHIPS}
                value={ante}
                onChange={setAnte}
                disabled={!!busy}
                isAffordable={(v) => v * 3 <= balance}
                label="Choose your ante"
              />
              <Button
                size="lg"
                onClick={() => run('deal')}
                disabled={!!busy || !loaded || balance < ante}
                className="min-w-48 bg-gold text-lg font-bold text-gold-foreground hover:bg-gold/90"
              >
                {busy === 'deal' ? <Loader2 className="animate-spin" /> : `${hand ? 'Deal again' : 'Deal'} · ante ${ante}`}
              </Button>
              <p className="text-xs text-felt-foreground/75">Calling costs 2× your ante, so keep {ante * 3} coins to play the full hand.</p>
            </div>
          )}
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border bg-card p-4 text-sm md:col-span-1">
            <h2 className="mb-2 font-serif text-lg font-bold">How to play</h2>
            <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
              <li>Put up an ante ({HOLDEM_ANTE_MIN}–{HOLDEM_ANTE_MAX} coins). You get 2 cards and see the flop.</li>
              <li>Call (2× ante) to see the turn and river, or fold and lose the ante.</li>
              <li>Dealer needs a pair of 4s or better. If not, your ante pays and your call comes back.</li>
              <li>Beat a qualifying dealer: ante pays by the table, call pays 1 to 1.</li>
            </ul>
          </div>
          <div className="rounded-xl border bg-card p-4 text-sm">
            <h2 className="mb-2 font-serif text-lg font-bold">Ante pays</h2>
            <ul className="space-y-1">
              {HOLDEM_PAYTABLE.map((r) => (
                <li key={r.hand} className="flex justify-between">
                  <span className="text-muted-foreground">{r.hand}</span>
                  <span className="font-semibold">{r.odds} to 1</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border bg-card p-4 text-sm">
            <h2 className="mb-2 font-serif text-lg font-bold">Your last hands</h2>
            {recent.length === 0 ? (
              <p className="text-muted-foreground">No hands yet.</p>
            ) : (
              <ul className="space-y-1">
                {recent.map((r, i) => {
                  const net = r.payout - r.staked;
                  return (
                    <li key={i} className="flex justify-between">
                      <span className="capitalize text-muted-foreground">{r.status === 'dealer_no_qualify' ? 'Dealer no qualify' : r.status}</span>
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

        <p className="mt-6 text-center text-xs text-muted-foreground">For fun only. MiyTube Coins have no cash value and can't be cashed out.</p>
      </div>
    </Layout>
  );
};

export default TexasHoldem;
