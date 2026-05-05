import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { runStaleCacheCleanup } from './utils/staleCacheCleanup';
import { installAdsenseOverlayBlocker } from './utils/adsenseOverlayBlocker';

// Render immediately — never block the UI on cache cleanup.
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Run cleanup in the background after first paint.
if (typeof window !== 'undefined') {
  const schedule = (cb: () => void) =>
    'requestIdleCallback' in window
      ? (window as Window & { requestIdleCallback: (cb: () => void) => void }).requestIdleCallback(cb)
      : setTimeout(cb, 1500);
  schedule(() => {
    runStaleCacheCleanup();
  });
}
