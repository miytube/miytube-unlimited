import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Coins, Gift, Loader2, User, Wand2 } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { usePageSEO } from '@/hooks/usePageSEO';
import { supabase } from '@/integrations/supabase/client';
import { setCoinBalance, useCoinWallet } from '@/hooks/useCoinWallet';
import { UserAvatarBubble } from '@/components/avatar/UserAvatarBubble';
import { PlayingCard } from '@/components/games/PlayingCard';
import { COIN_DAILY_BONUS } from '@/lib/avatar';
import { handName, score5 } from '@/lib/poker';
import { PAIGOW_BET_MAX, PAIGOW_BET_MIN, PAIGOW_CHIPS, PaiGowStatus, lowName, score2, splitIsValid } from '@/lib/paigow';
import { cn } from '@/lib/utils';

interface PaiGowView {
  id: string;
  bet: number;
  status: PaiGowStatus;
  payout: number;
  player: number[];
  suggested_low: number[];
  player_low: number[] | null;
  dealer: number[];
  dealer_low: number[] | null;
  player_high_score: number | null;
  player_low_score: number | null;
  dealer_high_score: number | null;
  dealer_low_score: number | null;
  balance: number;
}
interface RecentHand {
  status: PaiGowStatus;
  bet: number;
  payout: number;
}

const HandRow: React.FC<{ label: string; cards: number[]; name: string; outcome?: 'win' | 'lose' | null }> = ({ label, cards, name, outcome }) => (
  <div className="flex flex-col items-center gap-1">
    <span className="text-xs font-semibold uppercase tracking-widest text-felt-foreground/80">
      {label}
      {name ? ` · ${name}` : ''}
      {outcome === 'win' && <span className="ml-1 text-gold">✓</span>}
    </span>
    <div className="flex gap-1">
      {cards.map((c, i) => (
        <PlayingCard key={`${label}-${c}`} card={c} index={i} className="h-20 w-14 sm:h-28 sm:w-20" />
      ))}
    </div>
  </div>
);

const PaiGow = () => {
  usePageSEO({
    title: 'Pai Gow Poker — MiyTube Gaming Room',
    description: 'Play Pai Gow Poker for MiyTube Coins. Split seven cards into a five-card and a two-card hand and beat the banker.',
    path: '/game-room/pai-gow',
  });
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const wallet = useCoinWallet(user?.id);

  const [hand, setHand] = useState<PaiGowView | null>(null);
  const [recent, setRecent] = useState<RecentHand[]>([]);
  const [bet, setBet] = useState(25);
  const [low, setLow] = useState<number[]>([]);
  const [busy, setBusy] = useState<'deal' | 'set' | null>(null);
  const [loaded, setLoaded] = useState(false);

  const live = hand?.status === 'playing';
  const balance = wallet.balance ?? 0;

  const loadCurrent = useCallback(async () => {
    const { data, error } = await supabase.rpc('paigow_current');
    if (error) return;
    const p = data as unknown as { hand: PaiGowView | null; recent: RecentHand[] };
    if (p.hand) {
      setHand(p.hand);
      setLow([]);
    }
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

  const deal = async () => {
    setBusy('deal');
    try {
      const { data, error } = await supabase.rpc('paigow_deal', { _bet: bet });
      if (error) throw error;
      const v = data as unknown as PaiGowView;
      setHand(v);
      setLow([]);
      setCoinBalance(v.balance);
    } catch (e) {
      toast({ title: "Couldn't deal", description: (e as { message?: string })?.message || 'Please try again.', variant: 'destructive' });
    } finally {
      setBusy(null);
    }
  };

  const setHands = async () => {
    if (!hand) return;
    setBusy('set');
    try {
      const { data, error } = await supabase.rpc('paigow_set', { _hand_id: hand.id, _low: low });
      if (error) throw error;
      const v = data as unknown as PaiGowView;
      setHand(v);
      setCoinBalance(v.balance);
      setRecent((r) => [{ status: v.status, bet: v.bet, payout: v.payout }, ...r].slice(0, 10));
    } catch (e) {
      toast({ title: "Couldn't set hands", description: (e as { message?: string })?.message || 'Please try again.', variant: 'destructive' });
    } finally {
      setBusy(null);
    }
  };

  const toggle = (c: number) => {
    if (!live) return;
    setLow((l) => (l.includes(c) ? l.filter((x) => x !== c) : l.length < 2 ? [...l, c] : [l[1], c]));
  };

  const claimDaily = async () => {
    try {
      const claimed = await wallet.claimDaily();
      toast({ title: claimed ? `+${COIN_DAILY_BONUS} coins` : 'Already claimed today' });
    } catch (e) {
      toast({ title: "Couldn't claim", description: (e as { message?: string })?.message, variant: 'destructive' });
    }
  };

  const high = hand ? hand.player.filter((c) => !low.includes(c)) : [];
  const valid = hand ? splitIsValid(hand.player, low) : false;

  const settled = hand && !live && hand.player_low && hand.dealer_low;
  const pHigh = settled ? hand.player.filter((c) => !hand.player_low!.includes(c)) : [];
  const dHigh = settled ? hand.dealer.filter((c) => !hand.dealer_low!.includes(c)) : [];
  const highWin = settled ? hand.player_high_score! > hand.dealer_high_score! : false;
  const lowWin = settled ? hand.player_low_score! > hand.dealer_low_score! : false;
  const net = hand ? hand.payout - hand.bet : 0;
  const result = settled
    ? hand.status === 'win'
      ? { title: `You win both · +${net.toLocaleString()} coins`, tone: 'win' }
      : hand.status === 'push'
        ? { title: 'One each — push, bet returned', tone: 'push' }
        : { title: `Banker wins — −${hand.bet.toLocaleString()} coins`, tone: 'lose' }
    : null;

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

        <section className="overflow-hidden rounded-[2rem] border-4 border-gold/70 bg-table-felt px-3 py-6 text-felt-foreground shadow-2xl sm:px-8">
          <h1 className="text-center font-serif text-3xl font-bold tracking-wide">
            Pai Gow Poker <span className="text-gold">牌九</span>
          </h1>
          <p className="text-center text-xs uppercase tracking-[0.25em] text-gold">Seven cards · Two hands · Beat the banker</p>

          {settled ? (
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <div className="flex flex-col items-center gap-3 rounded-2xl border border-gold/30 bg-felt-deep/40 p-3">
                <span className="font-serif text-lg font-bold">Banker</span>
                <HandRow label="High" cards={dHigh} name={handName(hand.dealer_high_score)} outcome={!highWin ? 'win' : null} />
                <HandRow label="Low" cards={hand.dealer_low!} name={lowName(hand.dealer_low_score!)} outcome={!lowWin ? 'win' : null} />
              </div>
              <div className="flex flex-col items-center gap-3 rounded-2xl border border-gold/30 bg-felt-deep/40 p-3">
                <span className="font-serif text-lg font-bold">You</span>
                <HandRow label="High" cards={pHigh} name={handName(hand.player_high_score)} outcome={highWin ? 'win' : null} />
                <HandRow label="Low" cards={hand.player_low!} name={lowName(hand.player_low_score!)} outcome={lowWin ? 'win' : null} />
              </div>
            </div>
          ) : (
            <div className="mt-5 flex flex-col items-center gap-3">
              <div className="flex gap-1">
                {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                  <PlayingCard key={i} faceDown className={cn('h-20 w-14 sm:h-28 sm:w-20', !hand && 'opacity-40')} />
                ))}
              </div>
              <span className="text-xs font-semibold uppercase tracking-widest text-felt-foreground/80">Banker</span>

              {hand && live && (
                <>
                  <p className="mt-3 text-sm text-felt-foreground/85">Tap 2 cards for your low hand. The other 5 are your high hand.</p>
                  <div className="flex flex-wrap justify-center gap-1.5" role="group" aria-label="Your seven cards">
                    {hand.player.map((c, i) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => toggle(c)}
                        aria-pressed={low.includes(c)}
                        className={cn('rounded-lg transition-transform', low.includes(c) && '-translate-y-3 ring-4 ring-gold')}
                      >
                        <PlayingCard card={c} index={i} className="h-24 w-16 sm:h-32 sm:w-[5.5rem]" />
                      </button>
                    ))}
                  </div>
                  <div className="grid w-full max-w-lg grid-cols-2 gap-2 text-center text-sm">
                    <div className="rounded-lg bg-felt-deep/50 p-2">
                      <div className="text-xs uppercase tracking-widest text-gold">High hand (5)</div>
                      <div className="font-semibold">{low.length === 2 ? handName(score5(high)) : '—'}</div>
                    </div>
                    <div className="rounded-lg bg-felt-deep/50 p-2">
                      <div className="text-xs uppercase tracking-widest text-gold">Low hand (2)</div>
                      <div className="font-semibold">{low.length === 2 ? lowName(score2(low)) : `${low.length}/2 picked`}</div>
                    </div>
                  </div>
                  {low.length === 2 && !valid && (
                    <p className="text-sm font-semibold text-gold">Your 5-card hand must beat your 2-card hand. Try another pair.</p>
                  )}
                </>
              )}
            </div>
          )}

          <div className="mt-3 flex min-h-11 items-center justify-center" aria-live="polite" data-testid="paigow-result">
            {result && (
              <div
                className={cn(
                  'rounded-full px-5 py-1.5 font-serif text-lg font-bold shadow-lg animate-in zoom-in-90 duration-300',
                  result.tone === 'win' && 'bg-gold text-gold-foreground',
                  result.tone === 'push' && 'bg-felt-foreground text-felt-deep',
                  result.tone === 'lose' && 'bg-felt-deep text-felt-foreground ring-1 ring-felt-foreground/30',
                )}
              >
                {result.title}
              </div>
            )}
          </div>

          {user && (
            <div className="flex items-center justify-center gap-2">
              <UserAvatarBubble
                userId={user.id}
                className="h-9 w-9 ring-2 ring-gold"
                fallback={
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-felt-deep ring-2 ring-gold">
                    <User size={18} />
                  </span>
                }
              />
              {hand && <span className="text-sm font-semibold uppercase tracking-widest text-felt-foreground/80">Bet {hand.bet.toLocaleString()}</span>}
            </div>
          )}

          <div className="mt-5 border-t border-gold/30 pt-5">
            {authLoading ? null : !user ? (
              <div className="flex flex-col items-center gap-3 text-center">
                <p className="text-felt-foreground/85">Sign in to play. New members get 500 free coins.</p>
                <Button asChild className="bg-gold text-gold-foreground hover:bg-gold/90">
                  <Link to="/auth">Sign in to play</Link>
                </Button>
              </div>
            ) : live ? (
              <div className="flex flex-wrap justify-center gap-3">
                <Button size="lg" onClick={setHands} disabled={!!busy || !valid} className="min-w-40 bg-gold text-gold-foreground hover:bg-gold/90">
                  {busy === 'set' ? <Loader2 className="animate-spin" /> : 'Set my hands'}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setLow(hand!.suggested_low)}
                  disabled={!!busy}
                  className="gap-1 border-gold bg-transparent text-felt-foreground hover:bg-felt-deep hover:text-felt-foreground"
                >
                  <Wand2 size={16} /> House way
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <div className="flex flex-wrap justify-center gap-2" role="radiogroup" aria-label="Choose your bet">
                  {PAIGOW_CHIPS.map((v) => (
                    <button
                      key={v}
                      type="button"
                      role="radio"
                      aria-checked={bet === v}
                      onClick={() => setBet(v)}
                      disabled={!!busy}
                      className={cn(
                        'flex h-14 w-14 items-center justify-center rounded-full border-4 border-dashed font-bold shadow-md transition-transform',
                        bet === v ? 'scale-110 border-gold-foreground/40 bg-gold text-gold-foreground' : 'border-felt-foreground/40 bg-felt-deep text-felt-foreground hover:scale-105',
                        v > balance && 'opacity-40',
                      )}
                    >
                      {v}
                    </button>
                  ))}
                </div>
                <Button
                  size="lg"
                  onClick={deal}
                  disabled={!!busy || !loaded || balance < bet}
                  className="min-w-48 bg-gold text-lg font-bold text-gold-foreground hover:bg-gold/90"
                >
                  {busy === 'deal' ? <Loader2 className="animate-spin" /> : `${hand ? 'Deal again' : 'Deal'} · ${bet} coins`}
                </Button>
              </div>
            )}
          </div>
        </section>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border bg-card p-4 text-sm">
            <h2 className="mb-2 font-serif text-lg font-bold">How to play</h2>
            <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
              <li>Bet {PAIGOW_BET_MIN}–{PAIGOW_BET_MAX} coins. You and the banker each get 7 cards.</li>
              <li>Split yours into a 5-card high hand and a 2-card low hand. The high hand must beat the low hand.</li>
              <li>Win both hands: paid 1 to 1, less a 5% house fee. Win one: your bet comes back.</li>
              <li>Ties go to the banker. Not sure? Tap House way and we'll split it for you.</li>
            </ul>
          </div>
          <div className="rounded-xl border bg-card p-4 text-sm">
            <h2 className="mb-2 font-serif text-lg font-bold">Your last hands</h2>
            {recent.length === 0 ? (
              <p className="text-muted-foreground">No hands yet.</p>
            ) : (
              <ul className="space-y-1">
                {recent.map((r, i) => {
                  const n = r.payout - r.bet;
                  return (
                    <li key={i} className="flex justify-between">
                      <span className="capitalize text-muted-foreground">{r.status}</span>
                      <span className={cn('font-semibold', n > 0 ? 'text-felt' : n < 0 ? 'text-destructive' : 'text-muted-foreground')}>
                        {n > 0 ? '+' : ''}
                        {n.toLocaleString()}
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

export default PaiGow;
