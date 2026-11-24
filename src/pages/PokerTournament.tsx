import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ChevronUp, Loader2, RefreshCw, Spade, Trophy, Users } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { CasinoTable } from '@/components/games/CasinoTable';
import { PlayingCard } from '@/components/games/PlayingCard';
import { CasinoChip } from '@/components/games/CasinoChip';
import { TournamentSeat } from '@/components/games/TournamentSeat';
import { useAuth } from '@/hooks/useAuth';
import { usePageSEO } from '@/hooks/usePageSEO';
import { supabase } from '@/integrations/supabase/client';
import { BLIND_LEVELS, HANDS_PER_LEVEL, TOURNAMENT_BOTS, type TournamentAction, type TournamentView } from '@/lib/tournament';
import { cn } from '@/lib/utils';

const GOLD_BUTTON = 'bg-gold text-gold-foreground hover:bg-gold/90';
type Operation = 'current' | 'start' | 'step' | 'action' | 'next';
export default function PokerTournament() {
  usePageSEO({ title: 'Championship Poker — Free Sit & Go | MiyTube', description: 'Play six-seat no-limit Texas Hold’em against five bots. Free Sit & Go tournaments, rising blinds and 10,000 starting chips.', path: '/game-room/tournament' });
  const { user, loading: authLoading } = useAuth();
  const [table, setTable] = useState<TournamentView | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [raise, setRaise] = useState(200);
  const lock = useRef<number | null>(null);
  const generation = useRef(0);
  const current = useRef<TournamentView | null>(null);
  current.current = table;
  const request = useCallback(async (operation: Operation, action?: TournamentAction, amount?: number) => {
    if (lock.current === generation.current) return;
    lock.current = generation.current; setBusy(true); setError('');
    const epoch = generation.current;
    try {
      const previous = current.current;
      const body = { operation, ...(previous && operation !== 'current' ? { tournamentId: previous.id, version: previous.version } : {}), ...(action ? { action } : {}), ...(amount !== undefined ? { amount } : {}) };
      const response = await supabase.functions.invoke('poker-tournament', { body });
      if (epoch !== generation.current) return;
      if (response.error) {
        let message = 'The table could not connect. Try again.';
        let conflict = false;
        if (response.error.context instanceof Response) {
          const details = await response.error.context.json().catch(() => null);
          message = details?.error ?? message; conflict = details?.conflict === true;
        }
        if (conflict) {
          const latest = await supabase.functions.invoke('poker-tournament', { body: { operation: 'current' } });
          if (!latest.error && epoch === generation.current) setTable(latest.data.tournament);
        }
        throw new Error(message);
      }
      setTable(response.data.tournament); setLoaded(true);
    } catch (e) {
      if (epoch === generation.current) setError(e instanceof Error ? e.message : 'Please try again.');
    } finally {
      if (lock.current === epoch) lock.current = null;
      if (epoch === generation.current) setBusy(false);
    }
  }, []);
  useEffect(() => {
    generation.current += 1; setTable(null); current.current = null; setLoaded(false); setError(''); setBusy(false);
    if (user) void request('current');
    return () => { generation.current += 1; };
  }, [user?.id, request]);
  useEffect(() => {
    if (table?.minRaise !== null && table?.minRaise !== undefined) setRaise(table.minRaise);
  }, [table?.version, table?.minRaise]);
  useEffect(() => {
    if (!table || table.finished || table.actor === 0 || table.actor === null || busy || error) return;
    const timer = setTimeout(() => void request('step'), 700);
    return () => clearTimeout(timer);
  }, [table, busy, error, request]);
  const yourTurn = table?.actor === 0 && !table.finished;
  const canRaise = yourTurn && table.minRaise !== null && table.maxRaise !== null;
  const min = table?.minRaise ?? 0; const max = table?.maxRaise ?? 0;
  const validRaise = Number.isInteger(raise) && raise >= min && raise <= max;
  const place = table?.place;
  const ordinal = place ? `${place}${place === 1 ? 'st' : place === 2 ? 'nd' : place === 3 ? 'rd' : 'th'}` : '';
  return (
    <Layout>
      <div className="mx-auto max-w-6xl px-3 py-6 sm:px-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <Button asChild variant="ghost" size="sm"><Link to="/game-room"><ArrowLeft size={16} /> Gaming Room</Link></Button>
          <Button asChild variant="outline" size="sm"><Link to="/game-room/texas-holdem"><Spade size={15} /> Dealer poker</Link></Button>
        </div>
        <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div><p className="mb-1 text-xs font-semibold uppercase text-muted-foreground">MiyTube • No-limit Texas Hold’em</p><h1 className="font-serif text-3xl font-bold sm:text-4xl">Championship Poker</h1></div>
          <span className="inline-flex items-center gap-2 text-sm font-semibold"><Trophy size={18} className="text-gold" /> Free Sit & Go <span className="text-muted-foreground">• 6 seats</span></span>
        </header>
        <div className="mb-3 flex flex-wrap justify-between gap-x-4 gap-y-2 border-y py-3 text-xs sm:text-sm">
          <span>Hand <b data-testid="tournament-hand">{table?.hand ?? '—'}</b> · Level <b>{table?.level ?? 1}</b></span>
          <span>Blinds <b>{table?.smallBlind.toLocaleString() ?? '50'} / {table?.bigBlind.toLocaleString() ?? '100'}</b></span>
          <span><Users size={14} className="mr-1 inline" />{table ? table.seats.filter(s => !s.eliminated).length : 6} players left</span>
          <span className="text-muted-foreground">{table ? `${table.handsToNextLevel} hands to next level` : 'Starting stack T$10,000'}</span>
        </div>
        <CasinoTable shape="oval" className="championship-table">
          <div className="tournament-grid">
            {(table?.seats ?? Array.from({ length: 6 }, (_, seat) => ({ seat, name: seat === 0 ? 'You' : TOURNAMENT_BOTS[seat - 1].name, style: seat === 0 ? 'Member' : TOURNAMENT_BOTS[seat - 1].style, stack: 10000, bet: 0, cards: [], folded: false, eliminated: false, allIn: false, action: '', place: null }))).map(seat => (
              <TournamentSeat key={seat.seat} seat={seat} active={table?.actor === seat.seat} dealer={table?.button === seat.seat} winner={!!table?.finished && table.winners.includes(seat.seat)} hand={table?.hand ?? 0} userId={user?.id} />
            ))}
            <div className="tournament-board">
              <Trophy size={25} className="mb-1 text-gold/65" aria-hidden />
              <p className="font-serif text-sm font-bold uppercase text-gold sm:text-lg">MiyTube Championship</p>
              <p className="mb-3 text-[10px] uppercase text-felt-foreground/55">{table?.street ?? 'Final table'}</p>
              <div className="tournament-community">
                {Array.from({ length: 5 }, (_, i) => table?.board[i]).map((card, i) => card === undefined ? <div className="tournament-empty-card" key={`empty-${i}`} /> : <PlayingCard key={`${table?.hand}-board-${i}`} card={card} index={i} />)}
              </div>
              <div className="mt-3 flex items-center gap-2 text-sm font-bold text-gold"><CasinoChip value={100} size="sm" /><span data-testid="tournament-pot">Pot T${(table?.pot ?? 0).toLocaleString()}</span></div>
              {table && table.pots.length > 1 && <p className="mt-1 text-[10px] text-felt-foreground/70">Main T${table.pots[0].size.toLocaleString()} · {table.pots.length - 1} side {table.pots.length === 2 ? 'pot' : 'pots'}</p>}
            </div>
          </div>
        </CasinoTable>
        <section className="casino-console mt-4 rounded-lg px-3 py-5 text-felt-foreground sm:px-6" aria-label="Poker actions">
          {error && <div role="alert" className="mb-4 flex flex-wrap items-center justify-center gap-2 text-sm"><span>{error}</span><Button variant="outline" size="sm" disabled={busy} onClick={() => void request('current')}><RefreshCw size={14} /> Reconnect</Button></div>}
          {authLoading || (user && !loaded && !error) ? <p className="flex items-center justify-center gap-2"><Loader2 className="animate-spin" size={18} /> Loading your table…</p> : !user ? (
            <div className="flex flex-col items-center gap-3"><p>Free entry · T$10,000 starting chips</p><Button asChild className={GOLD_BUTTON}><Link to="/auth"><Users size={16} /> Sign in to take a seat</Link></Button></div>
          ) : !table ? <div className="text-center"><Button size="lg" className={GOLD_BUTTON} disabled={busy || !loaded} onClick={() => void request('start')}><Trophy size={19} /> Take a seat — free</Button></div> : table.status !== 'playing' ? (
            <div className="text-center" data-testid="tournament-finish"><Trophy size={38} className="mx-auto mb-2 text-gold" /><h2 className="font-serif text-2xl font-bold text-gold">{table.status === 'champion' ? 'You are the champion' : `${ordinal} place`}</h2><p className="my-3 text-sm text-felt-foreground/75">{table.status === 'champion' ? 'The final table is yours.' : `Tournament complete · ${table.hand} hands played`}</p><Button disabled={busy} onClick={() => void request('start')} className={GOLD_BUTTON}><RefreshCw size={16} /> New tournament</Button></div>
          ) : table.finished ? (
            <div className="text-center"><p className="mb-4 min-h-6 font-serif font-bold text-gold" role="status">{table.result}</p><Button disabled={busy} onClick={() => void request('next')} className={GOLD_BUTTON}>Next hand <ArrowRight size={16} /></Button></div>
          ) : (
            <div>
              <p className="mb-4 text-center text-sm" role="status">{yourTurn ? 'Your turn' : `${table.seats[table.actor ?? 0]?.name} is thinking…`}</p>
              <div className="flex flex-wrap justify-center gap-2">
                <Button variant="outline" disabled={busy || !yourTurn || !table.legal.includes('fold')} onClick={() => void request('action','fold')} className="border-gold/40 bg-transparent text-felt-foreground hover:bg-felt-deep hover:text-felt-foreground">Fold</Button>
                <Button disabled={busy || !yourTurn || (!table.legal.includes('check') && !table.legal.includes('call'))} onClick={() => void request('action',table.legal.includes('check')?'check':'call')} className={GOLD_BUTTON}>{table.legal.includes('check') ? 'Check' : `Call T$${table.callAmount.toLocaleString()}`}</Button>
                <Button variant="outline" disabled={busy || !canRaise} onClick={() => void request('action',table.legal.includes('raise')?'raise':'bet',max)} className="border-gold/40 bg-transparent text-gold hover:bg-felt-deep hover:text-gold">All-in</Button>
              </div>
              {canRaise && <div className="mx-auto mt-5 max-w-xl border-t border-gold/20 pt-4">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2"><label htmlFor="raise-total" className="text-xs">{table.legal.includes('raise') ? 'Raise to' : 'Bet'} · total this round</label><Input id="raise-total" aria-label="Raise total" type="number" min={min} max={max} step={1} value={raise} disabled={busy} onChange={e => setRaise(Number(e.target.value))} className="w-32 border-gold/30 bg-felt-deep text-felt-foreground" /></div>
                <Slider aria-label="Raise amount" min={min} max={max} step={1} value={[Math.min(max, Math.max(min, raise))]} onValueChange={v => setRaise(v[0])} disabled={busy || min === max} />
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3"><div className="flex gap-1">{[2,3,4].map(mult => <Button key={mult} size="sm" variant="ghost" disabled={busy} onClick={() => setRaise(Math.min(max, Math.max(min, table.bigBlind * mult)))} className="text-felt-foreground hover:bg-felt-deep hover:text-felt-foreground">{mult}× BB</Button>)}</div><Button className={GOLD_BUTTON} disabled={busy || !validRaise} onClick={() => void request('action',table.legal.includes('raise')?'raise':'bet',raise)}><ChevronUp size={16} /> {table.legal.includes('raise')?'Raise':'Bet'} T${raise.toLocaleString()}</Button></div>
              </div>}
            </div>
          )}
        </section>
        <div className="mt-7 grid gap-7 border-t pt-6 md:grid-cols-2">
          <section><h2 className="mb-3 font-serif text-xl font-bold">Table action</h2><ol className="space-y-1 text-sm text-muted-foreground" data-testid="tournament-log">{table?.log.length ? [...table.log].reverse().map((entry,i)=><li key={`${table.version}-${i}`}>{entry}</li>) : <li>No hands dealt.</li>}</ol></section>
          <section><h2 className="mb-3 font-serif text-xl font-bold">Your last hands</h2>{table?.recent.length ? <ul className="space-y-2 text-sm">{table.recent.map(h=><li className="flex justify-between gap-3" key={h.hand}><span className="min-w-0 text-muted-foreground">#{h.hand} · {h.result}</span><span className={cn('shrink-0 font-semibold tabular-nums',h.net>0?'text-jade':'text-muted-foreground')}>{h.net>0?'+':''}{h.net.toLocaleString()}</span></li>)}</ul> : <p className="text-sm text-muted-foreground">No completed hands.</p>}</section>
        </div>
        <details className="mt-7 border-y py-4 text-sm"><summary className="cursor-pointer font-semibold">Tournament structure</summary><p className="mt-3 text-muted-foreground">Free entry. Six seats, T$10,000 each. No rebuys. Blinds rise every {HANDS_PER_LEVEL} hands. Tournament chips cannot be spent, exchanged or cashed out. Five computer opponents; not a live multiplayer table.</p><div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-muted-foreground">{BLIND_LEVELS.map((bb,i)=><span key={bb}>Level {i+1}: {bb/2}/{bb}</span>)}</div></details>
        <p className="mt-4 text-center text-xs text-muted-foreground">Independent MiyTube tournament. Not affiliated with WSOP or the World Series of Poker.</p>
      </div>
    </Layout>
  );
}