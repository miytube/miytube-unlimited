import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Coins, Gift, Hand, Layers, Loader2, RefreshCw, User } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { CasinoTable, ChipRack, SeatTag } from '@/components/games/CasinoTable';
import { BetSpot, ChipPicker } from '@/components/games/CasinoChip';
import { PlayingCard } from '@/components/games/PlayingCard';
import { UserAvatarBubble } from '@/components/avatar/UserAvatarBubble';
import { useAuth } from '@/hooks/useAuth';
import { usePageSEO } from '@/hooks/usePageSEO';
import { setCoinBalance, useCoinWallet } from '@/hooks/useCoinWallet';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { COIN_DAILY_BONUS } from '@/lib/avatar';
import { LUCKY9_CHIPS, lucky9BetSchema, lucky9CurrentSchema, lucky9ViewSchema, type Lucky9Recent, type Lucky9View } from '@/lib/lucky9';
import { cn } from '@/lib/utils';

function CardRow({ cards, hidden = false, handId, label }: { cards: number[]; hidden?: boolean; handId: string; label: string }) {
  return (
    <div role="group" aria-label={label} className="flex h-24 items-center justify-center gap-2 sm:h-36 sm:gap-3">
      {[0, 1, 2].map(index => (
        index < 2 || cards[index] !== undefined ? (
          <PlayingCard key={`${handId}-${index}`} card={cards[index]} faceDown={hidden} index={index}
            flipDelay={hidden ? 0 : index * 100} className="h-24 w-16 sm:h-36 sm:w-24" />
        ) : (
          <div key={`${handId}-${index}`} aria-hidden="true" className="flex h-24 w-16 shrink-0 items-center justify-center rounded-md border border-dashed border-gold/25 text-2xl text-gold/35 sm:h-36 sm:w-24">+</div>
        )
      ))}
    </div>
  );
}

export default function Lucky9() {
  usePageSEO({ title: 'Lucky 9 — MiyTube Gaming Room',
    description: 'Play Lucky 9 with MiyTube Coins. Two cards or three, natural 8 and 9, and a chance to beat the banker.', path: '/game-room/lucky-9' });
  const { user, loading: authLoading } = useAuth();
  const wallet = useCoinWallet(user?.id);
  const { toast } = useToast();
  const [hand, setHand] = useState<Lucky9View | null>(null);
  const [recent, setRecent] = useState<Lucky9Recent[]>([]);
  const [bet, setBet] = useState(25);
  const [busy, setBusy] = useState<'deal' | 'draw' | 'stand' | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [retry, setRetry] = useState(0);
  const lock = useRef(false);
  const request = useRef(0);
  const member = useRef(user?.id);
  member.current = user?.id;

  useEffect(() => {
    const id = ++request.current;
    setHand(null); setRecent([]); setLoaded(false); setLoadError(false); setBusy(null); lock.current = false;
    if (!user) return;
    let cancelled = false;
    async function load() {
      const { data, error } = await supabase.rpc('lucky9_current');
      if (cancelled || id !== request.current) return;
      const parsed = lucky9CurrentSchema.safeParse(data);
      if (error || !parsed.success) { setLoadError(true); return; }
      setHand(parsed.data.hand); setRecent(parsed.data.recent);
      if (parsed.data.hand) setCoinBalance(parsed.data.hand.balance);
      setLoaded(true);
    }
    void load();
    return () => { cancelled = true; };
  }, [user?.id, retry]);

  const play = async (action: 'deal' | 'draw' | 'stand') => {
    if (!user || lock.current || !loaded) return;
    const owner = user.id;
    if (action !== 'deal' && (!hand || hand.status !== 'playing')) return;
    if (action === 'deal' && (!lucky9BetSchema.safeParse(bet).success || hand?.status === 'playing')) return;
    lock.current = true; setBusy(action);
    const id = ++request.current;
    try {
      const response = action === 'deal'
        ? await supabase.rpc('lucky9_deal', { _bet: bet })
        : hand
          ? await supabase.rpc(action === 'draw' ? 'lucky9_draw' : 'lucky9_stand', { _hand_id: hand.id })
          : null;
      if (!response) return;
      if (response.error) throw response.error;
      const view = lucky9ViewSchema.parse(response.data);
      if (member.current !== owner || id !== request.current) return;
      setHand(view); setCoinBalance(view.balance);
      if (view.status !== 'playing') {
        setRecent(previous => [{ status: view.status as Lucky9Recent['status'], bet: view.bet, payout: view.payout }, ...previous].slice(0, 10));
      }
    } catch (error) {
      if (member.current !== owner || id !== request.current) return;
      toast({ title: "Couldn't finish that action", description: error instanceof Error ? error.message : (error as { message?: string })?.message || 'Please try again.', variant: 'destructive' });
      // Recover the saved hand after a lost response; never automatically repeat a wager.
      const { data, error: recoveryError } = await supabase.rpc('lucky9_current');
      const current = lucky9CurrentSchema.safeParse(data);
      if (member.current !== owner || id !== request.current) return;
      if (!recoveryError && current.success) {
        setHand(current.data.hand); setRecent(current.data.recent);
        if (current.data.hand) setCoinBalance(current.data.hand.balance);
      } else { setLoaded(false); setLoadError(true); }
    } finally {
      if (member.current === owner && id === request.current) { lock.current = false; setBusy(null); }
    }
  };

  const claim = async () => {
    try { const claimed = await wallet.claimDaily(); toast({ title: claimed ? `+${COIN_DAILY_BONUS} coins` : 'Already claimed today' }); }
    catch { toast({ title: "Couldn't claim coins", description: 'Please try again.', variant: 'destructive' }); }
  };
  const live = hand?.status === 'playing';
  const balance = wallet.balance ?? 0;
  const net = hand ? hand.payout - hand.bet : 0;
  const result = hand && !live
    ? hand.status === 'win' ? `You win · +${net.toLocaleString()} coins`
      : hand.status === 'push' ? 'Tie · Bet returned' : `Banker wins · −${hand.bet.toLocaleString()} coins`
    : null;

  return (
    <Layout>
      <div className="game-page mx-auto max-w-4xl px-4 py-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <Link to="/game-room" className="inline-flex items-center gap-1 text-base text-muted-foreground hover:text-foreground"><ArrowLeft size={16} /> Gaming Room</Link>
          {user && <div className="flex flex-wrap items-center gap-2">
            {wallet.dailyAvailable && <Button data-game-command size="sm" variant="outline" onClick={claim} disabled={Boolean(busy)} className="gap-1"><Gift size={14} /> Claim {COIN_DAILY_BONUS}</Button>}
            <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-base font-semibold"><Coins size={16} className="text-gold" /><span data-testid="coin-balance">{wallet.balance === null ? '…' : balance.toLocaleString()}</span></span>
          </div>}
        </div>

        <CasinoTable shape="half-moon">
          <div className="flex flex-col items-center px-3 pb-6 pt-2 sm:px-8">
            <ChipRack />
            <h1 className="mt-3 font-serif text-3xl font-bold sm:text-4xl">Lucky <span className="text-gold">9</span></h1>
            <p className="mt-1 text-base font-semibold uppercase text-gold">MiyTube Gaming Room</p>
            <div className="mt-5 flex flex-col items-center gap-2">
              <SeatTag label="Banker" value={hand && !live ? String(hand.dealer_total) : '?'} />
              <CardRow label="Banker cards" cards={hand?.dealer ?? []} hidden={!hand || live} handId={`banker-${hand?.id ?? 'empty'}`} />
            </div>
            <div className="my-3 flex min-h-20 w-full items-center justify-center px-1 text-center" aria-live="polite" data-testid="lucky9-result">
              {result ? <div className={cn('max-w-full rounded-lg px-4 py-2 font-serif text-lg font-bold',
                hand?.status === 'win' ? 'bg-gold text-gold-foreground' : 'bg-rail-leather/80 text-felt-foreground')}>
                {hand?.natural && <span className="mb-1 block text-base font-semibold uppercase">Natural {Math.max(hand.player_total, hand.dealer_total ?? 0)}</span>}
                {result}
              </div> : <p className="text-base font-semibold uppercase text-gold">{live ? 'Draw or stand' : 'Closest to nine wins'}</p>}
            </div>
            <div className="flex flex-col items-center gap-2">
              <CardRow label="Your cards" cards={hand?.player ?? []} hidden={!hand} handId={`player-${hand?.id ?? 'empty'}`} />
              <div className="flex flex-wrap items-center gap-2">
                {user && <UserAvatarBubble userId={user.id} className="h-8 w-8 ring-2 ring-gold" fallback={<span className="flex h-8 w-8 items-center justify-center rounded-full bg-felt-deep ring-2 ring-gold"><User size={16} /></span>} />}
                <SeatTag label="You" value={hand ? String(hand.player_total) : '—'} />
              </div>
            </div>
            <div className="mt-4 flex h-28 items-center justify-center">
              <BetSpot label="Bet" amount={hand?.bet ?? 0} payout={!live ? hand?.payout : 0} />
            </div>
          </div>
        </CasinoTable>

        <div className="casino-console mt-5 rounded-lg px-3 py-5 text-felt-foreground sm:px-6">
          {authLoading ? <div className="flex h-28 items-center justify-center"><Loader2 className="animate-spin" aria-label="Loading account" /></div>
            : !user ? <div className="flex flex-col items-center gap-3 text-center"><p>Sign in to play Lucky 9.</p><Button data-game-command asChild className="bg-gold text-gold-foreground hover:bg-gold/90"><Link to="/auth">Sign in to play</Link></Button></div>
              : loadError ? <div role="alert" className="flex flex-col items-center gap-3 text-center"><p>Couldn't load your saved hand.</p><Button data-game-command variant="outline" onClick={() => setRetry(value => value + 1)} className="gap-2"><RefreshCw size={16} /> Try again</Button></div>
                : !loaded ? <div className="flex h-28 items-center justify-center"><Loader2 className="animate-spin" aria-label="Loading saved hand" /></div>
                  : live ? <div className="flex flex-wrap items-center justify-center gap-3 py-3">
                    <Button data-game-command size="lg" disabled={Boolean(busy)} onClick={() => play('draw')} className="min-w-32 gap-2 bg-gold text-gold-foreground hover:bg-gold/90">{busy === 'draw' ? <Loader2 className="animate-spin" size={18} /> : <Layers size={18} />} Draw</Button>
                    <Button data-game-command size="lg" disabled={Boolean(busy)} onClick={() => play('stand')} variant="outline" className="min-w-32 gap-2 border-gold/60 bg-transparent text-felt-foreground hover:bg-felt-deep hover:text-felt-foreground">{busy === 'stand' ? <Loader2 className="animate-spin" size={18} /> : <Hand size={18} />} Stand</Button>
                  </div> : <div className="flex flex-col items-center gap-4">
                    <ChipPicker values={LUCKY9_CHIPS} value={bet} onChange={setBet} disabled={Boolean(busy)} isAffordable={value => value <= balance} label="Choose your bet" />
                    <Button data-game-command size="lg" disabled={Boolean(busy) || balance < bet || wallet.balance === null} onClick={() => play('deal')} className="min-w-48 gap-2 bg-gold text-lg font-bold text-gold-foreground hover:bg-gold/90">{busy === 'deal' ? <Loader2 className="animate-spin" size={18} /> : <Layers size={18} />}{hand ? 'Deal again' : 'Deal'} · {bet} coins</Button>
                    {wallet.balance !== null && balance < bet && <Link to="/shop" className="text-base text-gold underline">Get more coins</Link>}
                  </div>}
        </div>

        <div className="mt-8 grid gap-6 border-t pt-5 text-base md:grid-cols-2">
          <section>
            <h2 className="mb-3 font-serif text-lg font-bold">House rules</h2>
            <ul className="space-y-2 text-muted-foreground">
              <li>Bet 10–500 coins. A = 1, 2–9 = face value, 10/J/Q/K = 0. Only the last digit counts.</li>
              <li>A two-card 8 or 9 on either side ends the deal immediately. Otherwise, draw one card or stand.</li>
              <li>The banker draws on 0–5 and stands on 6–7. Higher total wins; equal totals tie.</li>
              <li>Wins pay 1:1 plus your original bet. Ties return your bet. No commission or side bets.</li>
            </ul>
          </section>
          <section>
            <h2 className="mb-3 font-serif text-lg font-bold">Your last hands</h2>
            {recent.length === 0 ? <p className="text-muted-foreground">No hands yet.</p> : <ol data-testid="lucky9-history" className="divide-y">
              {recent.map((round, index) => {
                const change = round.payout - round.bet;
                return <li key={index} className="flex justify-between gap-2 py-1.5"><span className="capitalize text-muted-foreground">{round.status === 'push' ? 'Tie' : round.status} · {round.bet} coins</span><span className={cn('font-semibold tabular-nums', change > 0 ? 'text-felt' : change < 0 ? 'text-destructive' : 'text-muted-foreground')}>{change > 0 ? '+' : ''}{change.toLocaleString()}</span></li>;
              })}
            </ol>}
          </section>
        </div>
        <p className="mt-6 text-center text-base text-muted-foreground">For fun only. MiyTube Coins have no cash value and can't be cashed out.</p>
      </div>
    </Layout>
  );
}