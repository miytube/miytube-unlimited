import { useCallback, useSyncExternalStore } from 'react';
import { videoViewCounts } from '@/lib/videoViewCounts';

/** Shared, batched totals; refreshed after recorded views and every 15 seconds. */
export const useVideoViewCounts = (ids: string[]) => {
  const key = [...new Set(ids.filter(Boolean))].sort().join(',');
  const subscribe = useCallback((listener: () => void) =>
    videoViewCounts.subscribe(key ? key.split(',') : [], listener), [key]);
  const snapshot = useCallback(() =>
    (key ? key.split(',') : []).map(id => `${id}:${videoViewCounts.get(id) ?? ''}`).join('|'), [key]);
  useSyncExternalStore(subscribe, snapshot, snapshot);
  const counts: Record<string, number> = {};
  for (const id of ids) {
    const count = videoViewCounts.get(id);
    if (count !== undefined) counts[id] = count;
  }
  // Do not flash an outdated stored total while a live count is loading.
  const viewsFor = (id: string, _fallback?: string | number) =>
    counts[id] !== undefined ? String(counts[id]) : '…';
  return { counts, viewsFor };
};
