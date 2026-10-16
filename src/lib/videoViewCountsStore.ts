export type ViewCountRow = { video_id: string; views: number | string };

// A single store batches all mounted video displays and keeps them in sync.
export function createVideoViewCountsStore(fetchCounts: (ids: string[]) => Promise<ViewCountRow[]>) {
  const counts = new Map<string, number>();
  const listeners = new Map<string, Set<() => void>>();
  let timer: ReturnType<typeof setTimeout> | undefined;
  let polling: ReturnType<typeof setInterval> | undefined;
  let inFlight = false;
  let rerun = false;

  async function refresh() {
    if (inFlight) { rerun = true; return; }
    const ids = [...listeners.keys()];
    if (!ids.length) return;
    inFlight = true;
    try {
      const rows = await fetchCounts(ids);
      for (const row of rows) {
        const value = Number(row.views);
        if (!Number.isFinite(value) || value < 0 || counts.get(row.video_id) === value) continue;
        counts.set(row.video_id, value);
        listeners.get(row.video_id)?.forEach(listener => listener());
      }
    } catch (error) {
      console.warn('Video view counts could not refresh', error);
    } finally {
      inFlight = false;
      if (rerun) { rerun = false; schedule(); }
    }
  }

  function schedule() {
    if (timer) return;
    timer = setTimeout(() => { timer = undefined; void refresh(); }, 25);
  }

  function subscribe(ids: string[], listener: () => void) {
    for (const id of ids) {
      const group = listeners.get(id) ?? new Set();
      group.add(listener);
      listeners.set(id, group);
    }
    schedule();
    if (!polling && listeners.size) polling = setInterval(schedule, 15000);
    return () => {
      for (const id of ids) {
        const group = listeners.get(id);
        group?.delete(listener);
        if (!group?.size) listeners.delete(id);
      }
      if (!listeners.size && polling) { clearInterval(polling); polling = undefined; }
    };
  }

  return { subscribe, refresh, schedule, get: (id: string) => counts.get(id) };
}