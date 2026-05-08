/**
 * Stale cache cleanup (background, non-blocking)
 *
 * Runs once per browser per APP_DATA_VERSION. Does NOT touch service workers
 * or the Cache Storage API (we don't ship a service worker, and clearing it
 * mid-load was causing a visible flash/blink on every reload).
 *
 * It only removes legacy IndexedDB databases that we know are obsolete, so
 * the live app's own DBs are left alone.
 */

const APP_DATA_VERSION = "2026-05-08-artist-news-purge-v1";
const VERSION_KEY = "miytube_app_data_version";

// Legacy DBs we no longer use. Add to this list if we ever rename.
const LEGACY_DB_NAMES: string[] = [
  "miytube_videos_db", // purge once to drop locally cached videos with stale categories (e.g. Prince/D4vd in music-artists-news)
];

export async function runStaleCacheCleanup(): Promise<void> {
  try {
    if (localStorage.getItem(VERSION_KEY) === APP_DATA_VERSION) return;

    if (LEGACY_DB_NAMES.length && typeof indexedDB !== "undefined") {
      await Promise.all(
        LEGACY_DB_NAMES.map(
          (name) =>
            new Promise<void>((resolve) => {
              const req = indexedDB.deleteDatabase(name);
              req.onsuccess = req.onerror = req.onblocked = () => resolve();
            }),
        ),
      );
    }

    localStorage.setItem(VERSION_KEY, APP_DATA_VERSION);
  } catch {
    // non-fatal
  }
}
