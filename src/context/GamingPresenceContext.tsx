import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { GAMING_PRESENCE_TOPIC, GamingPresenceSnapshot, gamingTableForPath, gamingVisitorsByTable, getGamingVisitorId, isGamingPath } from '@/lib/gamingPresence';

type Connection = 'connecting' | 'live' | 'unavailable';
interface GamingPresenceValue {
  visitors: Record<string, string[]>;
  waiting: Record<string, string[]>;
  isWaiting: boolean;
  setWaiting: (value: boolean) => void;
  ownVisitorId: string | null;
  connection: Connection;
  retry: () => void;
}
const GamingPresenceContext = createContext<GamingPresenceValue | null>(null);

export function GamingPresenceProvider({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const enabled = isGamingPath(pathname);
  const tableId = gamingTableForPath(pathname);
  const [ownVisitorId] = useState(getGamingVisitorId);
  const [visitors, setVisitors] = useState<Record<string, string[]>>({});
  const [waiting, setWaitingVisitors] = useState<Record<string, string[]>>({});
  const [waitingTable, setWaitingTable] = useState<string | null>(null);
  const isWaiting = tableId !== null && waitingTable === tableId;
  const waitingRef = useRef(isWaiting);
  waitingRef.current = isWaiting;
  const setWaiting = useCallback((value: boolean) => setWaitingTable(value ? tableId : null), [tableId]);
  const [connection, setConnection] = useState<Connection>('connecting');
  const [attempt, setAttempt] = useState(0);
  const retry = useCallback(() => setAttempt(value => value + 1), []);
  const tableRef = useRef(tableId);
  tableRef.current = tableId;
  const publishRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!enabled) return;
    let disposed = false;
    let subscribed = false;
    let syncTimer: ReturnType<typeof setTimeout> | undefined;
    let publishTimer: ReturnType<typeof setTimeout> | undefined;
    let publishing = false;
    let dirty = false;
    let lastPublishedAt = 0;
    const snapshot = new GamingPresenceSnapshot();
    setConnection('connecting');
    setVisitors({});
    setWaitingVisitors({});
    // Presence is public but contains only random visitor IDs and a game ID.
    // Every tab has its own transport key; visitor IDs deduplicate browser tabs.
    const channel = supabase.channel(GAMING_PRESENCE_TOPIC, {
      config: { presence: { key: crypto.randomUUID() }, broadcast: { self: false } },
    });
    const publish = () => {
      if (!subscribed || disposed) return;
      dirty = true;
      if (publishing || publishTimer !== undefined) return;
      // A single event-driven update, coalesced to the latest choice. Presence
      // has a strict per-client rate limit; never untrack/track in a rapid pair.
      publishTimer = setTimeout(async () => {
        publishTimer = undefined;
        if (disposed || !subscribed) return;
        dirty = false;
        publishing = true;
        lastPublishedAt = Date.now();
        try {
          const currentTable = tableRef.current;
          const result = currentTable
            ? await channel.track({ visitor_id: ownVisitorId, table_id: currentTable, waiting: waitingRef.current })
            : await channel.untrack(); // Lobby only observes activity.
          if (!disposed && result !== 'ok') setConnection('unavailable');
        } catch {
          if (!disposed) setConnection('unavailable');
        } finally {
          publishing = false;
          if (dirty) publish();
        }
      }, Math.max(0, 2500 - (Date.now() - lastPublishedAt)));
    };
    publishRef.current = publish;
    const sync = () => {
      clearTimeout(syncTimer);
      syncTimer = setTimeout(() => {
        if (disposed || !subscribed) return;
        setVisitors(gamingVisitorsByTable(snapshot.state()));
        setWaitingVisitors(gamingVisitorsByTable(snapshot.state(), true));
        setConnection('live');
      }, 120);
    };
    channel
      .on('presence', { event: 'join' }, ({ key, newPresences }) => snapshot.join(key, newPresences))
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => snapshot.leave(key, leftPresences))
      .on('presence', { event: 'sync' }, sync).subscribe(status => {
      if (disposed) return;
      subscribed = status === 'SUBSCRIBED';
      if (subscribed) {
        snapshot.clear();
        // Rejoins fetch a fresh full Presence snapshot, not stale cached counts.
        publish();
        sync();
      } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
        clearTimeout(syncTimer);
        clearTimeout(publishTimer);
        publishTimer = undefined;
        setConnection('unavailable');
        setVisitors({});
        setWaitingVisitors({});
        snapshot.clear();
      }
    });
    return () => {
      disposed = true;
      subscribed = false;
      clearTimeout(syncTimer);
      clearTimeout(publishTimer);
      publishRef.current = null;
      void supabase.removeChannel(channel);
    };
  }, [enabled, ownVisitorId, attempt]);

  useEffect(() => { setWaitingTable(null); }, [tableId]);
  useEffect(() => { publishRef.current?.(); }, [tableId, isWaiting]);

  return <GamingPresenceContext.Provider value={{ visitors, waiting, isWaiting, setWaiting, ownVisitorId, connection, retry }}>{children}</GamingPresenceContext.Provider>;
}

export function useGamingPresence() {
  const value = useContext(GamingPresenceContext);
  if (!value) throw new Error('Gaming activity needs GamingPresenceProvider');
  return value;
}