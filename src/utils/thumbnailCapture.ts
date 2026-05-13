/**
 * Robust video thumbnail capture.
 * Fixes black-thumbnail bug by:
 *  - waiting for loadedmetadata before seeking
 *  - seeking past common black intros (10% in, min 2s)
 *  - waiting for the frame to actually decode (requestVideoFrameCallback when available)
 *  - detecting all-black/near-black frames and retrying at later offsets
 */
export interface CaptureOptions {
  /** Candidate seek offsets in seconds (in order). Falls back to fractions of duration. */
  candidates?: number[];
  /** JPEG quality 0..1 */
  quality?: number;
  /** Max width for output (preserves aspect ratio) */
  maxWidth?: number;
}

const isFrameBlack = (ctx: CanvasRenderingContext2D, w: number, h: number): boolean => {
  try {
    // Sample a small grid for speed
    const sw = Math.min(64, w);
    const sh = Math.min(64, h);
    const tmp = document.createElement('canvas');
    tmp.width = sw;
    tmp.height = sh;
    const tctx = tmp.getContext('2d');
    if (!tctx) return false;
    tctx.drawImage(ctx.canvas, 0, 0, sw, sh);
    const { data } = tctx.getImageData(0, 0, sw, sh);
    let total = 0;
    let count = 0;
    for (let i = 0; i < data.length; i += 4) {
      total += data[i] + data[i + 1] + data[i + 2];
      count += 3;
    }
    const avg = total / count; // 0..255
    return avg < 8; // very dark / black
  } catch {
    return false;
  }
};

const waitForFrame = (video: HTMLVideoElement): Promise<void> =>
  new Promise((resolve) => {
    // @ts-ignore - not in older lib.dom
    if (typeof video.requestVideoFrameCallback === 'function') {
      // @ts-ignore
      video.requestVideoFrameCallback(() => resolve());
      // safety timeout
      setTimeout(resolve, 400);
    } else {
      setTimeout(resolve, 200);
    }
  });

export const captureVideoThumbnail = (
  file: File,
  opts: CaptureOptions = {}
): Promise<Blob | null> => {
  const { quality = 0.85, maxWidth = 1280 } = opts;

  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.preload = 'auto';
    video.muted = true;
    video.playsInline = true;
    (video as any).crossOrigin = 'anonymous';
    const url = URL.createObjectURL(file);
    video.src = url;

    let settled = false;
    const cleanup = () => {
      try { URL.revokeObjectURL(url); } catch {}
      video.removeAttribute('src');
      try { video.load(); } catch {}
    };
    const finish = (blob: Blob | null) => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve(blob);
    };

    const failTimer = setTimeout(() => finish(null), 20000);

    video.onerror = () => { clearTimeout(failTimer); finish(null); };

    video.onloadedmetadata = async () => {
      const duration = isFinite(video.duration) && video.duration > 0 ? video.duration : 0;
      const candidates = (opts.candidates && opts.candidates.length > 0)
        ? opts.candidates
        : duration > 0
          ? [
              Math.max(2, duration * 0.1),
              Math.max(3, duration * 0.25),
              Math.max(5, duration * 0.5),
              Math.max(1, duration * 0.05),
              0.5,
            ]
          : [2, 5, 10, 0.5];

      // Compute output size
      const vw = video.videoWidth || 640;
      const vh = video.videoHeight || 360;
      const scale = vw > maxWidth ? maxWidth / vw : 1;
      const ow = Math.max(2, Math.round(vw * scale));
      const oh = Math.max(2, Math.round(vh * scale));
      const canvas = document.createElement('canvas');
      canvas.width = ow;
      canvas.height = oh;
      const ctx = canvas.getContext('2d');
      if (!ctx) { clearTimeout(failTimer); finish(null); return; }

      const trySeek = (t: number) => new Promise<Blob | null>((res) => {
        const onSeeked = async () => {
          video.removeEventListener('seeked', onSeeked);
          await waitForFrame(video);
          try {
            ctx.drawImage(video, 0, 0, ow, oh);
          } catch {
            res(null);
            return;
          }
          if (isFrameBlack(ctx, ow, oh)) {
            res(null);
            return;
          }
          canvas.toBlob((b) => res(b), 'image/jpeg', quality);
        };
        video.addEventListener('seeked', onSeeked);
        try {
          video.currentTime = Math.min(t, Math.max(0, (duration || t) - 0.05));
        } catch {
          video.removeEventListener('seeked', onSeeked);
          res(null);
        }
      });

      for (const t of candidates) {
        const blob = await trySeek(t);
        if (blob) { clearTimeout(failTimer); finish(blob); return; }
      }
      clearTimeout(failTimer);
      finish(null);
    };
  });
};
