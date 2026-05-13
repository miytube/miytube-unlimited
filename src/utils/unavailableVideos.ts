/**
 * Tracks video IDs that have failed playback in the user's browser, so the
 * grid card can show a "Preview only — video unavailable" badge instead of
 * silently linking to a broken player.
 *
 * This is best-effort and per-device: marks come from the actual
 * <video> onError event in VideoPlayer.
 */
const KEY = 'miytube:unavailable-videos:v1';
const MAX = 500;

const listeners = new Set<() => void>();

const read = (): string[] => {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.filter((x) => typeof x === 'string') : [];
  } catch {
    return [];
  }
};

const write = (ids: string[]) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(ids.slice(-MAX)));
    listeners.forEach((fn) => {
      try { fn(); } catch {}
    });
  } catch {}
};

export const markVideoUnavailable = (id?: string | null) => {
  if (!id) return;
  const cur = read();
  if (cur.includes(id)) return;
  write([...cur, id]);
};

export const clearVideoUnavailable = (id?: string | null) => {
  if (!id) return;
  const cur = read();
  if (!cur.includes(id)) return;
  write(cur.filter((x) => x !== id));
};

export const isVideoUnavailable = (id?: string | null): boolean => {
  if (!id) return false;
  return read().includes(id);
};

export const subscribeUnavailable = (fn: () => void) => {
  listeners.add(fn);
  const onStorage = (e: StorageEvent) => { if (e.key === KEY) fn(); };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(fn);
    window.removeEventListener('storage', onStorage);
  };
};
