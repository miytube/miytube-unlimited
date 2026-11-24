import React from 'react';
import { Link } from 'react-router-dom';
import { Club, Coins, Dices, Flag, Grid3x3, Lock, RefreshCw, Spade, Trophy, type LucideIcon } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useCoinWallet } from '@/hooks/useCoinWallet';
import { usePageSEO } from '@/hooks/usePageSEO';
import { GAME_TABLES, GameTable } from '@/lib/gameRoom';
import { cn } from '@/lib/utils';
import { LobbyTableActivity } from '@/components/games/TableActivity';
import { useGamingPresence } from '@/context/GamingPresenceContext';

const ICONS: Record<string, LucideIcon> = {
  blackjack: Spade,
  poker: Club,
  tournament: Trophy,
  'sic-bo': Dices,
  'pai-gow': Grid3x3,
  mahjong: Grid3x3,
  golf: Flag,
  bowling: Trophy,
};

const GROUPS: GameTable['group'][] = ['Cards', 'Chinese games', 'Sports'];

const TableTile: React.FC<{ table: GameTable }> = ({ table }) => {
  const Icon = ICONS[table.id] ?? Spade;
  const path = table.status === 'open' ? table.path : undefined;
  const open = Boolean(path);
  const body = (
    <div
      className={cn(
        'group relative flex h-full flex-col gap-3 rounded-xl border p-5 transition-all',
        open
          ? 'border-gold/60 bg-table-felt text-felt-foreground shadow-lg hover:-translate-y-0.5 hover:shadow-xl'
          : 'border-border bg-card text-card-foreground opacity-80',
      )}
    >
      <div className="flex items-start justify-between">
        <span
          className={cn(
            'flex h-11 w-11 items-center justify-center rounded-full',
            open ? 'bg-gold text-gold-foreground' : 'bg-secondary text-muted-foreground',
          )}
        >
          <Icon size={22} />
        </span>
        {open ? (
          <Badge className="bg-gold text-gold-foreground hover:bg-gold">Open now</Badge>
        ) : (
          <Badge variant="secondary" className="gap-1">
            <Lock size={12} /> Coming soon
          </Badge>
        )}
      </div>
      <div>
        <h3 className="font-serif text-xl font-bold">{table.name}</h3>
        <p className={cn('mt-1 text-sm', open ? 'text-felt-foreground/80' : 'text-muted-foreground')}>{table.tagline}</p>
      </div>
      {open && <div className="mt-auto space-y-2">
        <LobbyTableActivity tableId={table.id} />
        <span className="block text-base font-semibold text-gold group-hover:underline">Take a seat →</span>
      </div>}
    </div>
  );
  return path ? (
    <Link to={path} className="block h-full" aria-label={`Play ${table.name}`}>
      {body}
    </Link>
  ) : (
    body
  );
};

const GameRoom = () => {
  usePageSEO({
    title: 'Gaming Room — Blackjack, Chinese games, golf & bowling | MiyTube',
    description:
      'Play Blackjack, Lucky 9, poker, Sic Bo and Pai Gow with MiyTube Coins, or join free Championship Poker Sit & Go tournaments and Mahjong in the MiyTube Gaming Room.',
    path: '/game-room',
  });
  const { user } = useAuth();
  const wallet = useCoinWallet(user?.id);
  const { connection, retry } = useGamingPresence();

  return (
    <Layout>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <section className="relative overflow-hidden rounded-2xl border border-gold/50 bg-table-felt p-8 text-felt-foreground shadow-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">MiyTube</p>
          <h1 className="mt-2 font-serif text-4xl font-bold sm:text-5xl">The Gaming Room</h1>
          <p className="mt-3 max-w-xl text-felt-foreground/85">
            Pull up a chair. Play with your MiyTube Coins, win more, and spend them on gear for your avatar.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {user ? (
              <span className="inline-flex items-center gap-2 rounded-full bg-felt-deep/70 px-4 py-2 text-sm font-semibold">
                <Coins size={16} className="text-gold" />
                {wallet.balance === null ? '…' : wallet.balance.toLocaleString()} coins
              </span>
            ) : (
              <Button asChild className="bg-gold text-gold-foreground hover:bg-gold/90">
                <Link to="/auth">Sign in for 500 free coins</Link>
              </Button>
            )}
            <Button asChild variant="outline" className="border-gold/60 bg-transparent text-felt-foreground hover:bg-felt-deep hover:text-felt-foreground">
              <Link to="/shop">Get more coins</Link>
            </Button>
          </div>
          <Spade aria-hidden className="pointer-events-none absolute -right-6 -top-6 h-48 w-48 text-gold/10" />
        </section>

        {connection === 'unavailable' && <div className="mt-6 flex flex-wrap items-center gap-3 text-base" role="status">
          <span>Live table activity is unavailable.</span>
          <Button variant="outline" onClick={retry}><RefreshCw size={18} /> Reconnect activity</Button>
        </div>}
        {GROUPS.map((group) => (
          <section key={group} className="mt-10">
            <h2 className="mb-4 font-serif text-2xl font-bold">{group}</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {GAME_TABLES.filter((t) => t.group === group).map((t) => (
                <TableTile key={t.id} table={t} />
              ))}
            </div>
          </section>
        ))}

        <p className="mt-10 text-center text-xs text-muted-foreground">
          For fun only. MiyTube Coins have no cash value and can't be cashed out.
        </p>
      </div>
    </Layout>
  );
};

export default GameRoom;
