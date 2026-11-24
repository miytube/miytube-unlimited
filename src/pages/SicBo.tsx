import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Coins, Gift, Loader2, Trash2 } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { usePageSEO } from '@/hooks/usePageSEO';
import { supabase } from '@/integrations/supabase/client';
import { setCoinBalance, useCoinWallet } from '@/hooks/useCoinWallet';
import { Die } from '@/components/games/Die';
import { TableActivity } from '@/components/games/TableActivity';
import { COIN_DAILY_BONUS } from '@/lib/avatar';
import {
  ODDS_LABEL,
  SICBO_CHIPS,
  SICBO_MAX_BETS,
  SICBO_MAX_STAKE,
  SicBoBet,
  SicBoBetType,
  SicBoResult,
  betKey,
  betReturn,
  stakeOf,
  totalOdds,
} from '@/lib/sicbo';
import { cn } from '@/lib/utils';

const FACES = [1, 2, 3, 4, 5, 6];
const TOTALS = Array.from({ length: 14 }, (_, i) => i + 4);
const randomFace = () => Math.floor(Math.random() * 6) + 1;

interface RecentRound {
  dice: number[];
  stake: number;
  payout: number;
}

const SicBo = () => {
  usePageSEO({
    title: 'Sic Bo — Chinese dice | MiyTube Gaming Room',
    description: 'Play Sic Bo, the classic Chinese three-dice game, for MiyTube Coins. Big, Small, totals, doubles and triples up to 180 to 1.',
    path: '/game-room/sic-bo',
  });
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const wallet = useCoinWallet(user?.id);

  const [chip, setChip] = useState<number>(25);
  const [bets, setBets] = useState<Record<string, SicBoBet>>({});
  const [dice, setDice] = useState<number[]>([4, 5, 6]);
  const [rolling, setRolling] = useState(false);
  const [result, setResult] = useState<SicBoResult | null>(null);
  const [recent, setRecent] = useState<RecentRound[]>([]);
  const flicker = useRef<number | null>(null);

  const balance = wallet.balance ?? 0;
  const betList = useMemo(() => Object.values(bets), [bets]);
  const stake = stakeOf(betList);

  const loadRecent = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('sicbo_rounds')
      .select('dice, stake, payout')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);
    setRecent((data ?? []) as RecentRound[]);
  }, [user]);

  useEffect(() => {
    if (user) loadRecent();
    else setRecent([]);
  }, [user, loadRecent]);

  useEffect(() => () => {
    if (flicker.current) window.clearInterval(flicker.current);
  }, []);

  const place = (type: SicBoBetType, value = 0) => {
    if (rolling) return;
    const key = betKey(type, value);
    if (stake + chip > SICBO_MAX_STAKE) {
      toast({ title: `Up to ${SICBO_MAX_STAKE} coins per roll`, description: 'Clear a bet or pick a smaller chip.' });
      return;
    }
    if (!bets[key] && betList.length >= SICBO_MAX_BETS) {
      toast({ title: `Up to ${SICBO_MAX_BETS} bets per roll` });
      return;
    }
    setResult(null);
    setBets((b) => ({ ...b, [key]: { type, value, amount: (b[key]?.amount ?? 0) + chip } }));
  };

  const roll = async () => {
    if (!betList.length) return;
    setRolling(true);
    setResult(null);
    flicker.current = window.setInterval(() => setDice([randomFace(), randomFace(), randomFace()]), 90);
    const started = Date.now();
    try {
      const { data, error } = await supabase.rpc('sicbo_roll', { _bets: betList as unknown as never });
      if (error) throw error;
      const res = data as unknown as SicBoResult;
      const wait = Math.max(0, 900 - (Date.now() - started));
      await new Promise((r) => setTimeout(r, wait));
      if (flicker.current) window.clearInterval(flicker.current);
      setDice(res.dice);
      setResult(res);
      setCoinBalance(res.balance);
      setRecent((r) => [{ dice: res.dice, stake: res.stake, payout: res.payout }, ...r].slice(0, 10));
    } catch (e) {
      if (flicker.current) window.clearInterval(flicker.current);
      toast({ title: "Couldn't roll", description: (e as { message?: string })?.message || 'Please try again.', variant: 'destructive' });
    } finally {
      flicker.current = null;
      setRolling(false);
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

  const outcome = (type: SicBoBetType, value = 0): 'win' | 'lose' | null => {
    if (!result) return null;
    return betReturn({ type, value, amount: 1 }, result.dice) > 0 ? 'win' : 'lose';
  };

  const Spot: React.FC<{ type: SicBoBetType; value?: number; className?: string; children: React.ReactNode; label: string }> = ({
    type,
    value = 0,
    className,
    children,
    label,
  }) => {
    const amount = bets[betKey(type, value)]?.amount;
    const o = outcome(type, value);
    return (
      <Button
        variant="ghost"
        type="button"
        aria-label={`${label}${amount ? `, ${amount} coins on it` : ''}`}
        onClick={() => place(type, value)}
        disabled={rolling || !user}
        className={cn(
          'sicbo-spot relative flex h-auto min-h-24 flex-col whitespace-normal items-center justify-center rounded-lg border border-gold/40 bg-felt-deep/40 px-2 py-3 text-base text-felt-foreground transition-all hover:border-gold hover:bg-felt-deep/70 hover:text-felt-foreground disabled:cursor-not-allowed',
          o === 'win' && 'border-gold bg-gold/25 ring-2 ring-gold',
          o === 'lose' && 'opacity-50',
          className,
        )}
      >
        {children}
        {amount ? (
          <span className="mt-2 flex min-h-8 min-w-10 items-center justify-center rounded-full border-2 border-dashed border-gold-foreground/40 bg-gold px-2 text-base font-bold text-gold-foreground shadow">
            {amount}
          </span>
        ) : null}
      </Button>
    );
  };

  const net = result ? result.payout - result.stake : 0;
  const sum = dice[0] + dice[1] + dice[2];

  return (
    <Layout>
      <div className="game-page mx-auto max-w-5xl px-4 py-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <Link to="/game-room" className="inline-flex items-center gap-1 text-base text-muted-foreground hover:text-foreground">
            <ArrowLeft size={16} /> Gaming Room
          </Link>
          {user && (
            <div className="flex flex-wrap items-center gap-2">
              {wallet.dailyAvailable && (
                <Button data-game-command size="sm" variant="outline" onClick={claimDaily} className="gap-1">
                  <Gift size={14} /> Claim {COIN_DAILY_BONUS}
                </Button>
              )}
              <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-base font-semibold">
                <Coins size={16} className="text-gold" />
                <span data-testid="coin-balance">{wallet.balance === null ? '…' : balance.toLocaleString()}</span>
              </span>
            </div>
          )}
        </div>

        <TableActivity />
        <section className="overflow-hidden rounded-[2rem] border-4 border-gold/70 bg-table-felt px-3 py-6 text-felt-foreground shadow-2xl sm:px-6">
          <h1 className="text-center font-serif text-3xl font-bold">
            Sic Bo <span className="text-gold">骰寶</span>
          </h1>
          <p className="text-center text-base uppercase text-gold">Three dice · Big or small · Triples pay 180 to 1</p>

          {/* Dice */}
          <div className="mt-5 flex flex-col items-center gap-3">
            <div className="sicbo-dice flex max-w-full gap-2 rounded-lg border border-gold/40 bg-felt-deep/60 px-2 py-4 sm:gap-3 sm:px-6">
              {dice.map((d, i) => (
                <Die key={i} value={d} rolling={rolling} className={rolling ? `[animation-delay:${i * 80}ms]` : ''} />
              ))}
            </div>
            <div className="flex min-h-10 items-center" aria-live="polite" data-testid="sicbo-result">
              {result && (
                <div
                  className={cn(
                    'rounded-full px-5 py-1.5 font-serif text-lg font-bold shadow-lg animate-in zoom-in-90 duration-300',
                    net > 0 ? 'bg-gold text-gold-foreground' : net === 0 ? 'bg-felt-foreground text-felt-deep' : 'bg-felt-deep text-felt-foreground ring-1 ring-felt-foreground/30',
                  )}
                >
                  {sum} · {net > 0 ? `You win +${net.toLocaleString()}` : net === 0 ? 'Even — stake back' : `−${(-net).toLocaleString()} coins`}
                </div>
              )}
            </div>
          </div>

          {/* Board */}
          <div className="mt-2 space-y-2">
            <div className="grid grid-cols-1 gap-2 min-[400px]:grid-cols-3">
              <Spot type="small" label="Small, 4 to 10" className="py-4">
                <span className="font-serif text-xl font-bold">SMALL 小</span>
                <span className="text-base text-felt-foreground">4–10 · {ODDS_LABEL.small}</span>
              </Spot>
              <Spot type="any_triple" label="Any triple" className="py-4">
                <span className="font-serif text-lg font-bold">ANY TRIPLE</span>
                <span className="text-base text-felt-foreground">{ODDS_LABEL.any_triple}</span>
              </Spot>
              <Spot type="big" label="Big, 11 to 17" className="py-4">
                <span className="font-serif text-xl font-bold">BIG 大</span>
                <span className="text-base text-felt-foreground">11–17 · {ODDS_LABEL.big}</span>
              </Spot>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Spot type="odd" label="Odd total">
                <span className="font-serif font-bold">ODD 單</span>
                <span className="text-base text-felt-foreground">{ODDS_LABEL.odd}</span>
              </Spot>
              <Spot type="even" label="Even total">
                <span className="font-serif font-bold">EVEN 雙</span>
                <span className="text-base text-felt-foreground">{ODDS_LABEL.even}</span>
              </Spot>
            </div>

            <p className="pt-1 text-center text-base uppercase text-gold">Doubles · {ODDS_LABEL.double}</p>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
              {FACES.map((f) => (
                <Spot key={`d${f}`} type="double" value={f} label={`Double ${f}`}>
                  <span className="flex flex-wrap justify-center gap-0.5">
                    <Die value={f} size="sm" />
                    <Die value={f} size="sm" />
                  </span>
                </Spot>
              ))}
            </div>

            <p className="pt-1 text-center text-base uppercase text-gold">Triples · {ODDS_LABEL.triple}</p>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
              {FACES.map((f) => (
                <Spot key={`t${f}`} type="triple" value={f} label={`Triple ${f}`}>
                  <span className="flex flex-wrap justify-center gap-0.5">
                    <Die value={f} size="sm" />
                    <Die value={f} size="sm" />
                    <Die value={f} size="sm" />
                  </span>
                </Spot>
              ))}
            </div>

            <p className="pt-1 text-center text-base uppercase text-gold">Totals</p>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
              {TOTALS.map((t) => (
                <Spot key={`s${t}`} type="total" value={t} label={`Total ${t}`}>
                  <span className="font-serif text-lg font-bold">{t}</span>
                  <span className="text-base text-felt-foreground">{totalOdds(t)}:1</span>
                </Spot>
              ))}
            </div>

            <p className="pt-1 text-center text-base uppercase text-gold">Single number · {ODDS_LABEL.single}</p>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
              {FACES.map((f) => (
                <Spot key={`n${f}`} type="single" value={f} label={`Single ${f}`}>
                  <Die value={f} size="sm" />
                </Spot>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="mt-5 border-t border-gold/30 pt-5">
            {authLoading ? null : !user ? (
              <div className="flex flex-col items-center gap-3 text-center">
                <p className="text-felt-foreground">Sign in to play. New members get 500 free coins.</p>
                <Button data-game-command asChild className="bg-gold text-gold-foreground hover:bg-gold/90">
                  <Link to="/auth">Sign in to play</Link>
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <div className="flex flex-wrap justify-center gap-2" role="radiogroup" aria-label="Choose your chip">
                  {SICBO_CHIPS.map((v) => (
                    <Button
                      variant="ghost"
                      key={v}
                      type="button"
                      role="radio"
                      aria-checked={chip === v}
                      onClick={() => setChip(v)}
                      className={cn(
                        'flex h-14 w-14 rounded-full p-0 text-lg items-center justify-center rounded-full border-4 border-dashed font-bold shadow-md transition-transform',
                        chip === v ? 'scale-110 border-gold-foreground/40 bg-gold text-gold-foreground' : 'border-felt-foreground/40 bg-felt-deep text-felt-foreground hover:bg-felt-deep hover:text-felt-foreground hover:scale-105',
                      )}
                    >
                      {v}
                    </Button>
                  ))}
                </div>
                <p className="text-base text-felt-foreground">
                  {betList.length ? (
                    <>
                      On the table: <strong>{stake.toLocaleString()}</strong> / {SICBO_MAX_STAKE} coins
                    </>
                  ) : (
                    'Pick a chip, then tap the spots you want to bet on.'
                  )}
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Button data-game-command
                    size="lg"
                    onClick={roll}
                    disabled={rolling || !betList.length || stake > balance}
                    className="min-w-44 bg-gold text-lg font-bold text-gold-foreground hover:bg-gold/90"
                  >
                    {rolling ? <Loader2 className="animate-spin" /> : result ? 'Roll again' : 'Roll the dice'}
                  </Button>
                  <Button data-game-command
                    size="lg"
                    variant="outline"
                    onClick={() => {
                      setBets({});
                      setResult(null);
                    }}
                    disabled={rolling || !betList.length}
                    className="gap-1 border-gold bg-transparent text-felt-foreground hover:bg-felt-deep hover:text-felt-foreground"
                  >
                    <Trash2 size={16} /> Clear bets
                  </Button>
                </div>
                {stake > balance && wallet.balance !== null && (
                  <p className="text-base text-felt-foreground">
                    Not enough coins for these bets.{' '}
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
          <div className="rounded-xl border bg-card p-4 text-base">
            <h2 className="mb-2 font-serif text-lg font-bold">How to play</h2>
            <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
              <li>Three dice are rolled. Bet on the total, a number, or a pair or triple.</li>
              <li>Big, Small, Odd and Even pay 1 to 1 but lose on any triple.</li>
              <li>Single number pays 1 to 1 per die that shows it (up to 3 to 1).</li>
              <li>Each bet at least 10 coins, up to {SICBO_MAX_STAKE} coins per roll. Your bets stay on the table so you can roll again.</li>
            </ul>
          </div>
          <div className="rounded-xl border bg-card p-4 text-base">
            <h2 className="mb-2 font-serif text-lg font-bold">Your last rolls</h2>
            {recent.length === 0 ? (
              <p className="text-muted-foreground">No rolls yet.</p>
            ) : (
              <ul className="space-y-1.5">
                {recent.map((r, i) => {
                  const n = r.payout - r.stake;
                  return (
                    <li key={i} className="flex flex-wrap items-center justify-between gap-2">
                      <span className="flex items-center gap-1">
                        {r.dice.map((d, j) => (
                          <Die key={j} value={d} size="sm" />
                        ))}
                        <span className="ml-2 text-muted-foreground">= {r.dice[0] + r.dice[1] + r.dice[2]}</span>
                      </span>
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

        <p className="mt-6 text-center text-base text-muted-foreground">For fun only. MiyTube Coins have no cash value and can't be cashed out.</p>
      </div>
    </Layout>
  );
};

export default SicBo;
