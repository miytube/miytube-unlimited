/**
 * Stale cache cleanup
 *
 * Bumps the APP_DATA_VERSION whenever local storage shapes change in a way that
 * could conflict with older cached data. On load, if the user's stored version
 * doesn't match, we clear IndexedDB + caches + service workers so the app
 * starts from a clean slate (no more blank/blink for returning users).
 */

const APP_DATA_VERSION = "2026-05-04-cloud-only-v1";
const VERSION_KEY = "miytube_app_data_version";

export async function runStaleCacheCleanup(): Promise<void> {
  try {
    const stored = localStorage.getItem(VERSION_KEY);
    if (stored === APP_DATA_VERSION) return;

    console.info("[cache] App data version changed, clearing stale caches…");

    // 1. Unregister any old service workers
    if ("serviceWorker" in navigator) {
      try {
        const regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map((r) => r.unregister()));
      } catch (e) {
        console.warn("[cache] SW unregister failed", e);
      }
    }

    // 2. Clear cache storage
    if ("caches" in window) {
      try {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
      } catch (e) {
        console.warn("[cache] caches.delete failed", e);
      }
    }

    // 3. Wipe IndexedDB databases (preserves localStorage so the user stays logged in)
    if (indexedDB && "databases" in indexedDB) {
      try {
        // @ts-expect-error - databases() is not in older TS lib defs
        const dbs: { name?: string }[] = await indexedDB.databases();
        await Promise.all(
          dbs
            .filter((db) => db.name && !db.name.startsWith("supabase"))
            .map(
              (db) =>
                new Promise<void>((resolve) => {
                  const req = indexedDB.deleteDatabase(db.name!);
                  req.onsuccess = req.onerror = req.onblocked = () => resolve();
                }),
            ),
        );
      } catch (e) {
        console.warn("[cache] IndexedDB cleanup failed", e);
      }
    }

    localStorage.setItem(VERSION_KEY, APP_DATA_VERSION);
    console.info("[cache] Stale cache cleanup complete");
  } catch (e) {
    console.warn("[cache] Cleanup error (non-fatal)", e);
  }
}
