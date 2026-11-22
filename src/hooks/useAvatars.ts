import { useEffect, useState, useSyncExternalStore } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  AvatarConfig,
  AvatarEquipped,
  AvatarItem,
  sanitizeAvatarConfig,
  toAvatarItem,
} from '@/lib/avatar';

/**
 * Shared, batched avatar store: the gear catalog loads once, and saved avatars
 * for any list of members (comments, header) load in one request per batch.
 */

export interface SavedAvatar {
  config: AvatarConfig;
  equipped: AvatarEquipped;
}

let catalogPromise: Promise<Map<string, AvatarItem>> | null = null;

export function loadAvatarCatalog(): Promise<Map<string, AvatarItem>> {
  if (!catalogPromise) {
    catalogPromise = (async () => {
      const { data, error } = await supabase
        .from('avatar_items')
        .select('*')
        .order('sort_order', { ascending: true });
      if (error) {
        catalogPromise = null;
        throw error;
      }
      return new Map((data ?? []).map((row) => {
        const item = toAvatarItem(row as Record<string, unknown>);
        return [item.sku, item];
      }));
    })();
  }
  return catalogPromise;
}

export function useAvatarCatalog() {
  const [catalog, setCatalog] = useState<Map<string, AvatarItem> | null>(null);
  useEffect(() => {
    let alive = true;
    loadAvatarCatalog().then((c) => alive && setCatalog(c)).catch(() => alive && setCatalog(new Map()));
    return () => {
      alive = false;
    };
  }, []);
  return catalog;
}

// ---- saved avatars by member ----
const avatarCache = new Map<string, SavedAvatar | null>();
const pending = new Set<string>();
const listeners = new Set<() => void>();
let version = 0;
let batchTimer: ReturnType<typeof setTimeout> | null = null;

const notify = () => {
  version += 1;
  listeners.forEach((l) => l());
};

function queue(userIds: string[]) {
  let added = false;
  userIds.forEach((id) => {
    if (id && !avatarCache.has(id) && !pending.has(id)) {
      pending.add(id);
      added = true;
    }
  });
  if (!added || batchTimer) return;
  batchTimer = setTimeout(async () => {
    batchTimer = null;
    const ids = Array.from(pending);
    pending.clear();
    const { data } = await supabase.from('user_avatars').select('user_id, config, equipped').in('user_id', ids);
    ids.forEach((id) => avatarCache.set(id, null));
    (data ?? []).forEach((row) => {
      avatarCache.set(row.user_id, {
        config: sanitizeAvatarConfig(row.config),
        equipped: (row.equipped ?? {}) as AvatarEquipped,
      });
    });
    notify();
  }, 20);
}

/** Update the shared cache right after a member saves, so every bubble refreshes. */
export function setCachedAvatar(userId: string, avatar: SavedAvatar | null) {
  avatarCache.set(userId, avatar);
  notify();
}

export function useSavedAvatars(userIds: string[]): Record<string, SavedAvatar | null | undefined> {
  useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => version,
  );
  const key = userIds.join(',');
  useEffect(() => {
    queue(userIds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  const result: Record<string, SavedAvatar | null | undefined> = {};
  userIds.forEach((id) => {
    result[id] = avatarCache.get(id);
  });
  return result;
}
