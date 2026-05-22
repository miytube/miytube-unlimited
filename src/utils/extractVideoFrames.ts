// Extract evenly-distributed frames from a video URL using <video> + canvas.
// Returns an array of JPEG data URLs. Used by the smart AI auto-titler so
// the model sees multiple moments (start/middle/end) instead of only frame 0.

export interface ExtractFramesOptions {
  count?: number;          // how many frames to sample (default 5)
  maxWidth?: number;       // downscale to keep payload small (default 480)
  jpegQuality?: number;    // 0-1 (default 0.72)
  timeoutMs?: number;      // bail out if the video stalls (default 25_000)
}

export async function extractVideoFrames(
  videoUrl: string,
  opts: ExtractFramesOptions = {},
): Promise<string[]> {
  const { count = 5, maxWidth = 480, jpegQuality = 0.72, timeoutMs = 25_000 } = opts;

  return new Promise<string[]>((resolve, reject) => {
    const video = document.createElement('video');
    video.crossOrigin = 'anonymous';
    video.preload = 'auto';
    video.muted = true;
    video.playsInline = true;
    video.src = videoUrl;

    const frames: string[] = [];
    let cancelled = false;
    const timer = window.setTimeout(() => {
      cancelled = true;
      cleanup();
      reject(new Error('frame extraction timeout'));
    }, timeoutMs);

    const cleanup = () => {
      window.clearTimeout(timer);
      try { video.removeAttribute('src'); video.load(); } catch { /* ignore */ }
    };

    video.onerror = () => {
      cleanup();
      reject(new Error('video failed to load'));
    };

    video.onloadedmetadata = async () => {
      try {
        const duration = isFinite(video.duration) && video.duration > 0 ? video.duration : 0;
        if (!duration) {
          cleanup();
          resolve([]);
          return;
        }

        // Sample positions across the video, skipping the very first/last frames
        // which are often black/title cards.
        const positions: number[] = [];
        for (let i = 0; i < count; i++) {
          const pct = (i + 1) / (count + 1); // 1/(n+1) .. n/(n+1)
          positions.push(pct * duration);
        }

        const vw = video.videoWidth || 640;
        const vh = video.videoHeight || 360;
        const scale = Math.min(1, maxWidth / vw);
        const cw = Math.max(1, Math.round(vw * scale));
        const ch = Math.max(1, Math.round(vh * scale));
        const canvas = document.createElement('canvas');
        canvas.width = cw;
        canvas.height = ch;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          cleanup();
          reject(new Error('canvas 2d unavailable'));
          return;
        }

        for (const t of positions) {
          if (cancelled) return;
          await seekTo(video, t);
          ctx.drawImage(video, 0, 0, cw, ch);
          try {
            frames.push(canvas.toDataURL('image/jpeg', jpegQuality));
          } catch {
            // Cross-origin taint or other draw failure — abort this video.
            cleanup();
            reject(new Error('canvas tainted (CORS)'));
            return;
          }
        }
        cleanup();
        resolve(frames);
      } catch (err) {
        cleanup();
        reject(err);
      }
    };
  });
}

function seekTo(video: HTMLVideoElement, time: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const onSeeked = () => {
      video.removeEventListener('seeked', onSeeked);
      video.removeEventListener('error', onErr);
      // Give the frame one paint tick before drawing.
      requestAnimationFrame(() => resolve());
    };
    const onErr = () => {
      video.removeEventListener('seeked', onSeeked);
      video.removeEventListener('error', onErr);
      reject(new Error('seek failed'));
    };
    video.addEventListener('seeked', onSeeked);
    video.addEventListener('error', onErr);
    try {
      video.currentTime = Math.max(0.01, Math.min(time, (video.duration || time) - 0.05));
    } catch (e) {
      reject(e as Error);
    }
  });
}
