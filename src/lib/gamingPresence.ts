import { GAME_TABLES } from './gameRoom';

/** One shared, data-minimal Presence room; no cards, account IDs or profiles. */
export const GAMING_PRESENCE_TOPIC = 'gaming-room-visitors-v1';
export const LIVE_GAME_TABLES = GAME_TABLES.filter(table => table.status === 'open' && table.path);
const tableIds = new Set(LIVE_GAME_TABLES.map(table => table.id));
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export interface GamingVisitor {
  visitor_id: string;
  table_id: string;
  waiting?: boolean;
}

/** Keep only the latest transport ref for each tab. Replaced refs must not
 * survive a metadata update or remove the tab's newer waiting choice. */
export class GamingPresenceSnapshot {
  private tabs = new Map<string, Record<string, unknown>[]>();

  join(key: string, entries: Record<string, unknown>[]) {
    this.tabs.set(key, entries.map(entry => ({ ...entry })));
  }

  leave(key: string, entries: Record<string, unknown>[]) {
    const refs = new Set(entries.map(entry => entry.presence_ref));
    const remaining = (this.tabs.get(key) ?? []).filter(entry => !refs.has(entry.presence_ref));
    if (remaining.length) this.tabs.set(key, remaining);
    else this.tabs.delete(key);
  }

  state(): Record<string, unknown> {
    return Object.fromEntries(this.tabs);
  }

  clear() { this.tabs.clear(); }
}

export function gamingTableForPath(path: string): string | null {
  const normalized = path.replace(/\/+$/, '') || '/';
  return LIVE_GAME_TABLES.find(table => table.path === normalized)?.id ?? null;
}

export function isGamingPath(path: string): boolean {
  return path.replace(/\/+$/, '') === '/game-room' || gamingTableForPath(path) !== null;
}

/** A browser in several tabs is one visitor per table, not several people. */
export function gamingVisitorsByTable(state: Record<string, unknown>, waitingOnly = false): Record<string, string[]> {
  const visitors = new Map(LIVE_GAME_TABLES.map(table => [table.id, new Set<string>()]));
  for (const entries of Object.values(state)) {
    if (!Array.isArray(entries)) continue;
    for (const entry of entries) {
      if (!entry || typeof entry !== 'object') continue;
      const { visitor_id, table_id, waiting } = entry as Partial<GamingVisitor>;
      if (typeof visitor_id !== 'string' || !uuid.test(visitor_id) || typeof table_id !== 'string' || !tableIds.has(table_id)) continue;
      if (waitingOnly && waiting !== true) continue;
      visitors.get(table_id)?.add(visitor_id);
    }
  }
  return Object.fromEntries([...visitors].map(([table, ids]) => [table, [...ids].sort()]));
}

export function otherGamingVisitors(visitors: string[], ownVisitorId: string | null): string[] {
  return visitors.filter(id => id !== ownVisitorId);
}

let fallbackVisitor: string | null = null;
export function getGamingVisitorId(): string {
  // This random identifier is not an account or authentication credential.
  const key = 'miytube:gaming-visitor-v1';
  try {
    const saved = window.localStorage.getItem(key);
    if (saved && uuid.test(saved)) return saved;
    const created = crypto.randomUUID();
    window.localStorage.setItem(key, created);
    return created;
  } catch {
    fallbackVisitor ??= crypto.randomUUID();
    return fallbackVisitor;
  }
}