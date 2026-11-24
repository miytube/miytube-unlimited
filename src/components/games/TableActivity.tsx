import { useLocation } from 'react-router-dom';
import { Radio, RefreshCw, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useGamingPresence } from '@/context/GamingPresenceContext';
import { gamingTableForPath, otherGamingVisitors } from '@/lib/gamingPresence';

export function LobbyTableActivity({ tableId }: { tableId: string }) {
  const { visitors, waiting, connection } = useGamingPresence();
  const count = visitors[tableId]?.length ?? 0;
  return <span className="inline-flex min-h-7 items-center gap-2 text-base font-semibold text-felt-foreground" data-testid={`lobby-activity-${tableId}`}>
    <Users size={18} aria-hidden className="shrink-0 text-gold" />
    {connection === 'live' ? `${count} ${count === 1 ? 'visitor' : 'visitors'} here · ${waiting[tableId]?.length ?? 0} waiting` : connection === 'connecting' ? 'Connecting…' : 'Activity unavailable'}
  </span>;
}

export function TableActivity() {
  const { pathname } = useLocation();
  const tableId = gamingTableForPath(pathname);
  const { visitors, waiting, isWaiting, setWaiting, ownVisitorId, connection, retry } = useGamingPresence();
  if (!tableId) return null;
  const others = otherGamingVisitors(visitors[tableId] ?? [], ownVisitorId);
  const othersWaiting = otherGamingVisitors(waiting[tableId] ?? [], ownVisitorId);
  return <aside aria-label="Live table visitors" className="mb-4 flex min-h-16 flex-wrap items-center justify-between gap-3 border-y border-border py-3" data-testid="table-activity">
    <div className="flex min-w-0 items-center gap-3">
      <Users size={24} aria-hidden className="shrink-0 text-gold" />
      <p className="text-lg font-semibold leading-snug" role="status">
        {connection === 'live' ? others.length ? `${others.length} other ${others.length === 1 ? 'visitor' : 'visitors'} here` : 'No other visitors here yet' : connection === 'connecting' ? 'Connecting to table activity…' : 'Table activity unavailable'}
        {connection === 'live' && <span className="block text-base font-semibold text-muted-foreground" data-testid="table-waiting">{othersWaiting.length} {othersWaiting.length === 1 ? 'other visitor' : 'other visitors'} waiting to play</span>}
      </p>
    </div>
    <div className="flex flex-wrap items-center gap-x-4 gap-y-3 text-base font-semibold">
      <label className="flex cursor-pointer items-center gap-2">
        <Switch aria-label="Waiting to play" checked={isWaiting} onCheckedChange={setWaiting} disabled={connection !== 'live'} />
        <span>Waiting to play</span>
      </label>
      {connection === 'live' ? <><Radio size={18} className="text-jade" aria-hidden /><span>Live</span></> : connection === 'unavailable' ? <Button variant="outline" size="sm" onClick={retry} aria-label="Reconnect table activity"><RefreshCw size={18} /> Reconnect</Button> : null}
    </div>
  </aside>;
}