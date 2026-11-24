import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ArrowDownToLine, Coins, Gamepad2, RefreshCw, Trophy, Users, Wallet } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  GAMING_PERIODS, GAMING_TABLE_NAMES, gamingAnalyticsSchema, gamingDateRange,
  playerWinRate, popularCoinTable, type GamingPeriod,
} from '@/lib/gamingAnalytics';

const PERIOD_LABELS: Record<GamingPeriod, string> = {
  today: 'Today', '7d': 'Last 7 days', '30d': 'Last 30 days', all: 'All time',
};

export function GamingAnalyticsSection() {
  const { user, isAdmin } = useAuth();
  const [period, setPeriod] = useState<GamingPeriod>('30d');
  const { data, isPending, isFetching, isError, refetch } = useQuery({
    queryKey: ['gaming-analytics', user?.id, period],
    enabled: isAdmin,
    queryFn: async () => {
      const { data: totals, error } = await supabase.rpc('get_gaming_analytics', gamingDateRange(period));
      if (error) throw error;
      return gamingAnalyticsSchema.parse(totals);
    },
    staleTime: 30_000,
    refetchInterval: 60_000,
    retry: 1,
  });

  if (!isAdmin) return null;

  const popular = data ? popularCoinTable(data) : null;
  const metrics = data ? [
    { label: 'Rounds played', value: data.rounds, icon: Gamepad2 },
    { label: 'Unique players', value: data.players, icon: Users },
    { label: 'Coins wagered', value: data.wagered, icon: Coins },
    { label: 'Coins returned', value: data.returned, icon: ArrowDownToLine },
    { label: 'Net coins retained', value: data.net_retained, icon: Wallet },
    { label: 'Unfinished rounds', value: data.unsettled, icon: Gamepad2 },
  ] : [];

  return (
    <section aria-labelledby="gaming-analytics-title" className="min-w-0 space-y-5 border-t border-border pt-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h3 id="gaming-analytics-title" className="flex items-center gap-2 text-lg font-semibold">
            <Gamepad2 className="h-5 w-5 shrink-0 text-primary" /> Gaming Room
          </h3>
          {data && (
            <p className="mt-1 text-sm text-muted-foreground">
              {data.page_views.toLocaleString()} page views · {data.lobby_views.toLocaleString()} lobby views
            </p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Select value={period} onValueChange={value => {
            const selected = GAMING_PERIODS.find(item => item === value);
            if (selected) setPeriod(selected);
          }}>
            <SelectTrigger aria-label="Gaming analytics period" className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {GAMING_PERIODS.map(value => <SelectItem key={value} value={value}>{PERIOD_LABELS[value]}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" title="Refresh gaming statistics" aria-label="Refresh gaming statistics" disabled={isFetching} onClick={() => refetch()}>
            <RefreshCw className={`h-4 w-4 ${isFetching ? 'motion-safe:animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {isPending ? (
        <div role="status" className="flex min-h-40 items-center justify-center gap-2 text-sm text-muted-foreground">
          <RefreshCw className="h-4 w-4 motion-safe:animate-spin" /> Loading gaming statistics…
        </div>
      ) : isError ? (
        <div role="alert" className="flex flex-wrap items-center justify-between gap-3 border-l-2 border-destructive py-4 pl-4">
          <p className="text-sm text-destructive">Gaming statistics could not be loaded.</p>
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}><RefreshCw className="mr-2 h-4 w-4" /> Retry</Button>
        </div>
      ) : data ? (
        <>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-5 lg:grid-cols-3">
            {metrics.map(metric => (
              <div key={metric.label} className="min-w-0 border-l-2 border-primary/25 pl-3">
                <dt className="flex items-start gap-2 text-sm text-muted-foreground">
                  <metric.icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {metric.label}
                </dt>
                <dd className="mt-1 break-words text-2xl font-semibold tabular-nums">{metric.value.toLocaleString()}</dd>
              </div>
            ))}
          </dl>

          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-4">
            <h4 className="font-medium">Table activity</h4>
            {popular && <p className="flex items-center gap-1.5 text-sm text-muted-foreground"><Trophy className="h-4 w-4 text-primary" /> Most played: {GAMING_TABLE_NAMES[popular.game]}</p>}
          </div>
          {data.rounds === 0 && <p className="text-sm text-muted-foreground">No coin-game rounds started in this period.</p>}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-sm">
              <caption className="sr-only">Gaming table activity for {PERIOD_LABELS[period]}</caption>
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th scope="col" className="py-3 pr-4 text-left font-medium">Table</th>
                  <th scope="col" className="px-3 py-3 text-right font-medium">Views</th>
                  <th scope="col" className="px-3 py-3 text-right font-medium">Rounds</th>
                  <th scope="col" className="px-3 py-3 text-right font-medium">Players</th>
                  <th scope="col" className="px-3 py-3 text-right font-medium">Completed</th>
                  <th scope="col" className="py-3 pl-3 text-right font-medium">Player win rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.games.map(game => {
                  const free = game.game === 'mahjong';
                  const winRate = playerWinRate(game);
                  return (
                    <tr key={game.game}>
                      <th scope="row" className="py-3 pr-4 text-left font-medium">
                        {GAMING_TABLE_NAMES[game.game]}
                        {free && <span className="block text-xs font-normal text-muted-foreground">Free play · visits only</span>}
                      </th>
                      <td className="px-3 py-3 text-right tabular-nums">{game.page_views.toLocaleString()}</td>
                      <td className="px-3 py-3 text-right tabular-nums">{free ? '—' : game.rounds.toLocaleString()}</td>
                      <td className="px-3 py-3 text-right tabular-nums">{free ? '—' : game.players.toLocaleString()}</td>
                      <td className="px-3 py-3 text-right tabular-nums">{free ? '—' : game.settled.toLocaleString()}</td>
                      <td className="py-3 pl-3 text-right tabular-nums">{free || winRate === null ? '—' : `${winRate.toFixed(1)}%`}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Rounds are grouped by start date; splits count as one round. Win rate is the share of completed rounds with a positive total return after bets.
            {' '}Coin totals use activity in the selected period, including split and double bets and returned stakes; net coins retained is wagers minus returns, not cash revenue.
          </p>
        </>
      ) : null}
    </section>
  );
}